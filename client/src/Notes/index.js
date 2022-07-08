import { Collapse, Container, Fab, Stack, useMediaQuery, Zoom } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import React, { useEffect, useReducer, useState } from "react";
import { css } from "@emotion/react";
import NoteCard from "./NoteCard";
import { useDispatch, useSelector } from "react-redux";
import { deleteNote, patchNoteStatus, retrieveNote } from "../store/actions/note.actions";
import { clearNotification, setShowIntro } from "../store/actions";
import { FILTER_TYPES } from "../helpers/consts";
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

const animationDurations = {
  enter: 0,
  exit: 200,
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
        active: state.active.sort((a, b) =>
          timestampCompare(a.timestamp, b.timestamp, isAsc ? "asc" : "desc")
        ),
        completed: state.completed.sort((a, b) =>
          timestampCompare(a.timestamp, b.timestamp, isAsc ? "asc" : "desc")
        ),
        deleted: state.deleted.sort((a, b) =>
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
        active: state.active.sort((a, b) => deadlineCompare(a, b, isAsc ? "asc" : "desc")),
        completed: state.completed.sort((a, b) => deadlineCompare(a, b, isAsc ? "asc" : "desc")),
        deleted: state.deleted.sort((a, b) => deadlineCompare(a, b, isAsc ? "asc" : "desc")),
      };
    }
    case "showOnly": {
      return {
        ...state,
        showOnly: payload,
      };
    }
    case "setNotes": {
      const isAsc =
        state.sortDate === FILTER_TYPES.NEWEST || state.sortDeadline === FILTER_TYPES.CLOSEST;
      const isSortDate = state.sortDate !== "";

      const [active, completed, deleted] = separateByStatus(payload);
      if (isSortDate) {
        active.sort((a, b) => timestampCompare(a.timestamp, b.timestamp, isAsc ? "asc" : "desc"));
        completed.sort((a, b) =>
          timestampCompare(a.timestamp, b.timestamp, isAsc ? "asc" : "desc")
        );
        deleted.sort((a, b) => timestampCompare(a.timestamp, b.timestamp, isAsc ? "asc" : "desc"));
      } else {
        active.sort((a, b) => deadlineCompare(a, b, isAsc ? "asc" : "desc"));
        completed.sort((a, b) => deadlineCompare(a, b, isAsc ? "asc" : "desc"));
        deleted.sort((a, b) => deadlineCompare(a, b, isAsc ? "asc" : "desc"));
      }

      return { ...state, notes: payload, active, completed, deleted };
    }
    default:
      throw new Error("Action type not recognised!");
  }
};

const Notes = ({ theme }) => {
  const breakpoints = {
    xl: 3,
    lg: 2,
    md: 1,
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
        transition-duration: 300ms;
      }

      .MuiMasonry-root.masonry-entering {
        opacity: 0;
      }
      .MuiMasonry-root.masonry-entered {
        opacity: 1;
        transition-duration: 200ms;
      }
      .MuiMasonry-root.masonry-exiting {
        transition-duration: 200ms;
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
    // filteredNotes: [],
    active: [],
    completed: [],
    deleted: [],
  });
  const [isExiting, setIsExiting] = useState(false);

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

  const handleAddNoteClick = () => navigate("/create");

  const closeDialog = () => setNoteDialogID(null);

  const handleFilterChange = (newData) => {
    if (newData.type === "showOnly") {
      setIsExiting(true);
    }

    dispatchFilter(newData);
  };

  // const handleExitStart = () => setIsExiting(true);
  const handleExitEnd = () => setIsExiting(false);

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
              // disabled={isExiting}
              values={filterState}
              onChange={handleFilterChange}
              // onChange={(data) => dispatchFilter(data)}
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

      <Transition
        in={filterState.showOnly === FILTER_TYPES.ACTIVE && !isExiting}
        timeout={animationDurations}
        unmountOnExit
        onExited={handleExitEnd}
      >
        {(state) => (
          <Masonry columns={breakpoints} spacing={3} className={`masonry-${state}`}>
            {filterState.active.map((note) => (
              <div key={note._id} css={styles.item}>
                <NoteCard
                  {...note}
                  presenceState={"none"}
                  onFirstAction={handleFirstAction}
                  onSecondAction={handleSecondAction}
                />
              </div>
            ))}
          </Masonry>
        )}
      </Transition>

      <Transition
        in={filterState.showOnly === FILTER_TYPES.COMPLETED && !isExiting}
        timeout={animationDurations}
        unmountOnExit
        onExited={handleExitEnd}
      >
        {(state) => (
          <Masonry columns={breakpoints} spacing={3} className={`masonry-${state}`}>
            {filterState.completed.map((note) => (
              <div key={note._id} css={styles.item}>
                <NoteCard
                  {...note}
                  presenceState={"none"}
                  onFirstAction={handleFirstAction}
                  onSecondAction={handleSecondAction}
                />
              </div>
            ))}
          </Masonry>
        )}
      </Transition>

      <Transition
        in={filterState.showOnly === FILTER_TYPES.DELETED && !isExiting}
        timeout={animationDurations}
        unmountOnExit
        onExited={handleExitEnd}
      >
        {(state) => (
          <Masonry columns={breakpoints} spacing={3} className={`masonry-${state}`}>
            {filterState.deleted.map((note) => (
              <div key={note._id} css={styles.item}>
                <NoteCard
                  {...note}
                  presenceState={"none"}
                  onFirstAction={handleFirstAction}
                  onSecondAction={handleSecondAction}
                />
              </div>
            ))}
          </Masonry>
        )}
      </Transition>

      {filterState[filterState.showOnly].length < 1 && (
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
        title="Delete the note permanently?"
        description="This action cannot be reverted."
        buttonNames={["Cancel", "Delete"]}
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
