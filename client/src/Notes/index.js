import { Collapse, Container, Fab, Stack, useMediaQuery, Zoom } from "@mui/material";
import React, { useEffect, useReducer, useState } from "react";
import { css } from "@emotion/react";
import Masonry from "react-masonry-css";
import NoteCard from "./NoteCard";
import { useDispatch, useSelector } from "react-redux";
import { deleteNote, patchNoteStatus, retrieveNote } from "../store/actions/note.actions";
import { clearNotification } from "../store/actions";
import { FILTER_TYPES } from "../helpers/consts";
import FiltersBar from "./FiltersBar";
import { FilterAlt, PlaylistAdd } from "@mui/icons-material";
import EasyButtons from "../Common/EasyButtons";
import { parseISO } from "date-fns";
import EasyDialog from "../Common/EasyDialog";
import { getPreferences, savePreferences } from "../helpers/tools";
import { useNavigate } from "react-router-dom";
import NotesPagePlaceholder from "./NotesPagePlaceholder";

const DEFAULT_FILTER_STATE = {
  sortDate: FILTER_TYPES.NEWEST,
  sortDeadline: "",
  showOnly: FILTER_TYPES.ACTIVE,
};

const getFilterState = (preferences) => {
  if (!preferences.filterState || Object.entries(preferences.filterState).length < 1)
    return DEFAULT_FILTER_STATE;
  else return preferences.filterState;
};

const timestampCompare = (a, b, order) => {
  const result = b - a;
  return order === "desc" ? result * -1 : result;
};

const deadlineCompare = (a, b, order) => {
  let result = 0;
  if (a.dlTimestamp && b.dlTimestamp)
    result = (a.dlTimestamp - b.dlTimestamp) * (order === "desc" ? -1 : 1);
  else {
    if (a.dlTimestamp) result = -1;
    else if (b.dlTimestamp) result = 1;
    else result = b.timestamp - a.timestamp;
  }
  return result;
};

const getFiltered = (filtersState, notes) => {
  return notes.filter((note) => note.status === filtersState);
};

const filterReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "sortDate": {
      const isAsc = payload === FILTER_TYPES.NEWEST;
      const sorted = getFiltered(state.showOnly, state.notes).sort((a, b) =>
        timestampCompare(a.timestamp, b.timestamp, isAsc ? "asc" : "desc")
      );
      return { ...state, sortDeadline: "", sortDate: payload, filteredNotes: sorted };
    }
    case "sortDeadline": {
      const isAsc = payload === FILTER_TYPES.CLOSEST;
      const sorted = getFiltered(state.showOnly, state.notes).sort((a, b) =>
        deadlineCompare(a, b, isAsc ? "asc" : "desc")
      );

      return { ...state, sortDate: "", sortDeadline: payload, filteredNotes: sorted };
    }
    case "showOnly": {
      // const filtered = state.filteredNotes.filter((note) => note.status === payload);
      const isAsc =
        state.sortDate === FILTER_TYPES.NEWEST || state.sortDeadline === FILTER_TYPES.CLOSEST;
      const isSortDate = state.sortDate !== "";
      const filtered = getFiltered(payload, state.notes).sort((a, b) =>
        isSortDate
          ? timestampCompare(a.timestamp, b.timestamp, isAsc ? "asc" : "desc")
          : deadlineCompare(a, b, isAsc ? "asc" : "desc")
      );

      return { ...state, showOnly: payload, filteredNotes: filtered };
    }
    case "setNotes": {
      const isAsc =
        state.sortDate === FILTER_TYPES.NEWEST || state.sortDeadline === FILTER_TYPES.CLOSEST;
      const isSortDate = state.sortDate !== "";

      const sorted = getFiltered(state.showOnly, payload).sort((a, b) =>
        isSortDate
          ? timestampCompare(a.timestamp, b.timestamp, isAsc ? "asc" : "desc")
          : deadlineCompare(a, b, isAsc ? "asc" : "desc")
      );
      return { ...state, notes: payload, filteredNotes: sorted };
    }
    default:
      throw new Error("Action type not recognised!");
  }
};

const Notes = ({ theme }) => {
  const breakpoints = {
    default: 3,
    [theme.breakpoints.values.lg]: 2,
    [theme.breakpoints.values.md]: 1,
  };
  const styles = {
    mainContainer: css`
      padding-bottom: 5rem;

      & .MuiFab-root {
        position: fixed;
        right: 2rem;
        bottom: 1.8rem;
        z-index: ${theme.zIndex.speedDial};
      }

      ${theme.breakpoints.up("md")} {
        padding-bottom: 1.5rem;

        & .MuiFab-root {
          right: 2.5rem;
          bottom: 3rem;
        }
      }
    `,
    grid: css`
      display: flex;
      width: auto;

      & .notes-grid_column {
        background-clip: padding-box;
      }

      ${theme.breakpoints.up("md")} {
        margin-left: -30px;
        & .notes-grid_column {
          padding-left: 30px;
        }
      }
    `,
    item: css`
      margin-bottom: 20px;
    `,
    filterStack: css`
      align-items: center;
      padding-left: 0.8rem;
    `,
    filtersBar: css`
      padding-top: 0.3rem;
      margin: 0.8rem 0 1.8rem;
    `,
    filterButton: css`
      margin-bottom: 0.6rem;
      color: ${theme.palette.secondary.main};
    `,
    filtersWrapper: css`
      flex: 1 1 auto;
      & .note-filters {
        justify-content: center;
      }
    `,
    placeholder: css`
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
    `,
    filterDialog: css`
      .MuiDialogContent-root {
        padding-left: 0;
        padding-right: 0;
      }
    `,
  };

  const user = useSelector((state) => state.user);
  // const filterPreference = useSelector((state) => state.preferences);
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const preferences = getPreferences(user.data._id);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [showFilters, setShowFilters] = useState(preferences.filterOpen || false);
  const [noteDialogID, setNoteDialogID] = useState(null);
  const [filterState, dispatchFilter] = useReducer(filterReducer, {
    ...getFilterState(preferences),
    notes: user.data.notes,
    filteredNotes: [],
  });

  const isPortrait = useMediaQuery(theme.breakpoints.down("md"));

  const handleFirstAction = (id, status) => {
    switch (status) {
      case "active":
        dispatch(patchNoteStatus(id, "completed"));
        break;
      case "completed":
        dispatch(patchNoteStatus(id, "active"));
        break;
      case "deleted":
        dispatch(retrieveNote(id));
        break;
      default:
        throw new Error("Note status unrecognised");
    }
  };
  const handleSecondAction = (id, status) => {
    switch (status) {
      case "active":
        dispatch(patchNoteStatus(id, "deleted"));
        break;
      case "completed":
        alert(`Note ${id} second action fired!`);
        break;
      case "deleted":
        setNoteDialogID(id);
        break;
      default:
        throw new Error("Note status unrecognised");
    }
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteNote(noteDialogID));
    setNoteDialogID(null);
  };

  const handleFilterDialogConfirm = () => {
    setShowFilters(false);
  };

  const handleAddNoteClick = () => navigate("/create");

  const closeDialog = () => setNoteDialogID(null);

  useEffect(() => {
    if (notification.success) {
      dispatch(clearNotification());
    } else if (notification.error) {
      dispatch(clearNotification());
      console.error(`OUCH: ${notification.message}`);
    }
    return () => {
      if (notification.error || notification.success) dispatch(clearNotification());
    };
  }, [dispatch, notification]);

  useEffect(() => {
    dispatchFilter({
      type: "setNotes",
      payload: user.data.notes.map((note) => ({
        ...note,
        timestamp: parseISO(note.createdAt).getTime(),
        dlTimestamp: parseISO(note.deadline).getTime(),
      })),
    });
  }, [user.data.notes]);

  useEffect(() => {
    return () => {
      // console.log(`DISPATCH FILTER`, filterState);
      const { sortDate, sortDeadline, showOnly } = filterState;
      savePreferences(user.data._id, {
        filterOpen: showFilters,
        filterState: { sortDate, sortDeadline, showOnly },
      });
      // dispatch(updateFilterPreference(filterState, showFilters));
    };
  }, [dispatch, filterState, showFilters]);

  return (
    <Container sx={styles.mainContainer}>
      <Stack direction="row" sx={styles.filterStack}>
        <Collapse in={showFilters && !isMobile} sx={styles.filtersWrapper}>
          {!isMobile && (
            <FiltersBar
              values={filterState}
              onChange={(data) => dispatchFilter(data)}
              spacing={{ md: 5 }}
              justifyContent="center"
              alignItems="center"
              sx={{ pt: "0.3rem", margin: "0.8rem 0 1.8rem" }}
            />
          )}
        </Collapse>

        <EasyButtons.Text
          size="small"
          sx={styles.filterButton}
          startIcon={<FilterAlt />}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filter
        </EasyButtons.Text>
      </Stack>
      <Masonry
        breakpointCols={breakpoints}
        css={styles.grid}
        className="notes-grid"
        columnClassName="notes-grid_column"
      >
        {filterState.filteredNotes.map((note) => (
          <div key={note._id} css={styles.item}>
            <NoteCard
              {...note}
              onFirstAction={handleFirstAction}
              onSecondAction={handleSecondAction}
            />
          </div>
        ))}
      </Masonry>

      {filterState.filteredNotes.length < 1 && (
        <NotesPagePlaceholder statusFilter={filterState.showOnly} sx={styles.placeholder} />
      )}

      <Zoom in={isPortrait}>
        <Fab color="primary" size="large" aria-label="add" onClick={handleAddNoteClick}>
          <PlaylistAdd />
        </Fab>
      </Zoom>
      <EasyDialog
        isOpen={noteDialogID !== null}
        onClose={closeDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete the note permanently?"
        description="This action cannot be reverted."
        buttonNames={["Cancel", "Delete"]}
        buttonColors={["secondary", "error"]}
      />

      <EasyDialog
        isOpen={showFilters && isMobile}
        title="Set filters"
        disableConfirm
        buttonNames={["Close"]}
        buttonColors={["secondary"]}
        sx={styles.filterDialog}
        onClose={() => setShowFilters(false)}
        content={
          <FiltersBar
            values={filterState}
            onChange={(data) => dispatchFilter(data)}
            direction="row"
            flexWrap="wrap"
            spacing="4"
            justifyContent="center"
            alignItems="start"
            sx={{ px: 0.6, mt: 0.5, mb: 0.8, rowGap: "1.6rem" }}
          />
        }
      />
    </Container>
  );
};

export default Notes;
