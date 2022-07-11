import { Collapse, Container, Fab, Stack, useMediaQuery, Zoom } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import React, { useEffect, useReducer, useState } from "react";
import { css } from "@emotion/react";
import NoteCard from "./NoteCard";
import { useDispatch, useSelector } from "react-redux";
import { deleteNote, patchNoteStatus, retrieveNote } from "../store/actions/note.actions";
import { clearNotification, setShowIntro } from "../store/actions";
import { ACTION_TYPES, FILTER_TYPES } from "../helpers/consts";
import FiltersBar from "./FiltersBar";
import { FilterAlt, PlaylistAdd } from "@mui/icons-material";
import EasyButtons from "../Common/EasyButtons";
import { parseISO } from "date-fns";
import EasyDialog from "../Common/EasyDialog";
import { getPreferences, savePreferences } from "../helpers/tools";
import { useNavigate } from "react-router-dom";
import NotesPagePlaceholder from "./NotesPagePlaceholder";
import IntroDialogContent from "./IntroDialogContent";
import { Transition } from "react-transition-group";

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

const separateByStatus = (notes) => {
  const active = [],
    completed = [],
    deleted = [];
  notes.forEach((note) => {
    switch (note.status) {
      case "active":
        active.push(note);
        break;
      case "completed":
        completed.push(note);
        break;
      case "deleted":
        deleted.push(note);
        break;
      default:
        break;
    }
  });
  return [active, completed, deleted];
};

const filterReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "sortDate": {
      const isAsc = payload === FILTER_TYPES.NEWEST;

      return {
        ...state,
        sortDeadline: "",
        sortDate: payload,
        filteredNotes: state.filteredNotes.sort((a, b) =>
          timestampCompare(a.timestamp, b.timestamp, isAsc ? "asc" : "desc")
        ),
      };
    }
    case "sortDeadline": {
      const isAsc = payload === FILTER_TYPES.CLOSEST;

      return {
        ...state,
        sortDate: "",
        sortDeadline: payload,
        filteredNotes: state.filteredNotes.sort((a, b) =>
          deadlineCompare(a, b, isAsc ? "asc" : "desc")
        ),
      };
    }
    case "showOnly": {
      const isAsc =
        state.sortDate === FILTER_TYPES.NEWEST || state.sortDeadline === FILTER_TYPES.CLOSEST;
      const isSortDate = state.sortDate !== "";

      const newFiltered = getFiltered(payload, state.notes).sort((a, b) =>
        isSortDate
          ? timestampCompare(a.timestamp, b.timestamp, isAsc ? "asc" : "desc")
          : deadlineCompare(a, b, isAsc ? "asc" : "desc")
      );

      return {
        ...state,
        showOnly: payload,
        filteredNotes: newFiltered.filter((note) => note.action === undefined),
      };
    }
    case "setNotes": {
      const isAsc =
        state.sortDate === FILTER_TYPES.NEWEST || state.sortDeadline === FILTER_TYPES.CLOSEST;
      const isSortDate = state.sortDate !== "";

      const newFiltered = getFiltered(state.showOnly, payload).sort((a, b) =>
        isSortDate
          ? timestampCompare(a.timestamp, b.timestamp, isAsc ? "asc" : "desc")
          : deadlineCompare(a, b, isAsc ? "asc" : "desc")
      );

      return { ...state, notes: payload, filteredNotes: newFiltered };
    }
    case "clearActions": {
      return {
        ...state,
        filteredNotes: state.filteredNotes.filter((note) => note.action === undefined),
      };
    }
    default:
      throw new Error("Action type not recognised!");
  }
};

const masonryTimeout = {
  cssEnter: 150,
  enter: 150,
  exit: 200,
};

const Notes = ({ theme }) => {
  const breakpoints = {
    lg: 3,
    md: 2,
    sm: 1,
    xs: 1,
  };
  const spacing = {
    sm: 3,
    xs: 2,
  };

  const styles = {
    mainContainer: css`
      position: relative;
      padding-bottom: 5rem;

      & .MuiFab-root {
        position: fixed;
        right: 2rem;
        bottom: 1.8rem;
        z-index: ${theme.zIndex.speedDial};
      }

      .MuiMasonry-root {
        align-content: start;
        opacity: 0;
        transition-property: opacity;
        transition-duration: 200ms;
      }

      .MuiMasonry-root.masonry-entering {
        opacity: 1;
        transition-duration: ${masonryTimeout.cssEnter}ms;
      }
      .MuiMasonry-root.masonry-entered {
        opacity: 1;
      }
      .MuiMasonry-root.masonry-exiting {
        transition-duration: ${masonryTimeout.exit}ms;
        opacity: 0;
      }
      .MuiMasonry-root.masonry-exited {
        opacity: 0;
      }

      ${theme.breakpoints.up("md")} {
        padding-bottom: 1.5rem;

        & .MuiFab-root {
          right: 2.5rem;
          bottom: 3rem;
        }
      }
    `,
    item: css`
      opacity: 0;
      transition: opacity 200ms ease-out 500ms;

      &.item-entering {
        opacity: 1;
      }
      &.item-entered {
        opacity: 1;
      }
      &.item-exiting {
        opacity: 0;
      }
      &.item-exited {
        opacity: 0;
      }
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
    introDialog: css`
      .MuiDialogTitle-root {
        margin-bottom: 1.5rem;
        font-size: 1.8rem;
        font-weight: 700;
      }
      .MuiDialogContent-root {
        padding-left: 0;
        padding-right: 0;
      }
    `,
  };

  const user = useSelector((state) => state.user);
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const preferences = getPreferences(user.data._id);
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  const [showFilters, setShowFilters] = useState(preferences.filterOpen || false);
  const [noteDialogID, setNoteDialogID] = useState(null);
  const [filterState, dispatchFilter] = useReducer(filterReducer, {
    ...getFilterState(preferences),
    notes: user.data.notes,
    filteredNotes: [],
  });
  const [changedNotes, setChangedNotes] = useState([]);
  const [nextFilterDispatch, setNextFilterDispatch] = useState({});
  const [isExiting, setIsExiting] = useState(false);

  const addNoteChange = (note, action) => {
    setChangedNotes((changedNotes) => [...changedNotes, { ...note, action }]);
  };

  const handleFirstAction = (note) => {
    switch (note.status) {
      case "active":
        addNoteChange(note, ACTION_TYPES.COMPLETE);
        dispatch(patchNoteStatus(note._id, "completed"));
        break;
      case "completed":
        addNoteChange(note, ACTION_TYPES.RETURN);
        dispatch(patchNoteStatus(note._id, "active"));

        break;
      case "deleted":
        addNoteChange(note, ACTION_TYPES.RETRIEVE);
        dispatch(retrieveNote(note._id));
        break;
      default:
        throw new Error("Note status unrecognised");
    }
  };
  const handleSecondAction = (note) => {
    switch (note.status) {
      case "active":
        addNoteChange(note, ACTION_TYPES.DELETE);
        dispatch(patchNoteStatus(note._id, "deleted"));
        break;
      case "completed":
        alert(`Note ${note._id} second action fired!`);
        break;
      case "deleted":
        setNoteDialogID(note._id);
        break;
      default:
        throw new Error("Note status unrecognised");
    }
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteNote(noteDialogID));
    setNoteDialogID(null);
  };

  const handleAddNoteClick = () => navigate("/create");

  const closeDialog = () => setNoteDialogID(null);

  const handleFilterChange = (newData) => {
    if (newData.type === "showOnly") {
      setIsExiting(true);
      setNextFilterDispatch(newData);
      return;
    }

    dispatchFilter(newData);
  };

  const handleExitEnd = () => {
    setIsExiting(false);
    dispatchFilter(nextFilterDispatch);
  };

  useEffect(() => {
    if (notification.success) {
      dispatch(clearNotification());
    } else if (notification.error) {
      dispatch(clearNotification());
      console.error(notification.message);
    }
    return () => {
      if (notification.error || notification.success) dispatch(clearNotification());
    };
  }, [dispatch, notification]);

  useEffect(() => {
    dispatchFilter({
      type: "setNotes",
      payload: [
        ...user.data.notes.map((note) => ({
          ...note,
          timestamp: parseISO(note.createdAt).getTime(),
          dlTimestamp: parseISO(note.deadline).getTime(),
        })),
        ...changedNotes,
      ],
    });
    setChangedNotes([]);
  }, [user.data.notes]);

  useEffect(() => {
    return () => {
      const { sortDate, sortDeadline, showOnly } = filterState;
      savePreferences(user.data._id, {
        filterOpen: showFilters,
        filterState: { sortDate, sortDeadline, showOnly },
      });
    };
  }, [dispatch, filterState, showFilters]);

  return (
    <Container sx={styles.mainContainer}>
      <Stack direction="row" sx={styles.filterStack}>
        <Collapse in={showFilters && !isSmall} sx={styles.filtersWrapper}>
          {!isSmall && (
            <FiltersBar
              disabled={isExiting}
              values={filterState}
              onChange={handleFilterChange}
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
          Filtrovať
        </EasyButtons.Text>
      </Stack>

      <Transition in={!isExiting} timeout={masonryTimeout} onExited={handleExitEnd}>
        {(state) => (
          <Masonry columns={breakpoints} spacing={spacing} className={`masonry-${state}`}>
            {filterState.filteredNotes.map((note) => (
              <Transition
                key={note._id}
                in={note.action === undefined}
                timeout={{ enter: 0, exit: 1000 }}
                unmountOnExit
              >
                {(itemState) => (
                  <div key={note._id} css={styles.item} className={`item-${itemState}`}>
                    <NoteCard
                      {...note}
                      actionState={note.action}
                      disabled={note.action !== undefined}
                      onFirstAction={() => handleFirstAction(note)}
                      onSecondAction={() => handleSecondAction(note)}
                    />
                  </div>
                )}
              </Transition>
            ))}
          </Masonry>
        )}
      </Transition>

      {filterState.filteredNotes.length < 1 && (
        <NotesPagePlaceholder statusFilter={filterState.showOnly} sx={styles.placeholder} />
      )}

      <Zoom in={isMedium}>
        <Fab color="primary" size="large" aria-label="add" onClick={handleAddNoteClick}>
          <PlaylistAdd />
        </Fab>
      </Zoom>
      <EasyDialog
        isOpen={noteDialogID !== null && !user.showIntro}
        onClose={closeDialog}
        onConfirm={handleDeleteConfirm}
        title="Odstrániť poznámku navždy?"
        description="Tento krok sa už nedá vrátiť späť."
        buttonNames={["Zrušiť", "Odstrániť"]}
        buttonColors={["secondary", "error"]}
      />

      <EasyDialog
        isOpen={showFilters && isSmall && !user.showIntro}
        title="Nastaviť filtre"
        disableConfirm
        buttonNames={["Close"]}
        buttonColors={["secondary"]}
        sx={styles.filterDialog}
        onClose={() => setShowFilters(false)}
        content={
          <FiltersBar
            values={filterState}
            onChange={handleFilterChange}
            direction="row"
            flexWrap="wrap"
            spacing="4"
            justifyContent="center"
            alignItems="start"
            sx={{ px: 0.6, mt: 0.5, mb: 0.8, rowGap: "1.6rem" }}
          />
        }
      />

      <EasyDialog
        isOpen={user.showIntro}
        title="Vitajte v Easy Notes"
        disableCancel
        buttonNames={["", "Ok!"]}
        sx={styles.introDialog}
        onClose={() => dispatch(setShowIntro(false))}
        onConfirm={() => dispatch(setShowIntro(false))}
        content={<IntroDialogContent userEmail={user.data.email} />}
      />
    </Container>
  );
};

export default Notes;
