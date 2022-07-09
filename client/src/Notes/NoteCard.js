import {
  CheckRounded,
  DeleteForeverOutlined,
  DeleteOutlined,
  Restore,
  TimerOutlined,
  Undo,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import { css } from "@emotion/react";
import { useTheme } from "@mui/system";
import { blue, green, orange, red } from "@mui/material/colors";
import { differenceInCalendarDays, format, startOfToday } from "date-fns";
import skLocale from "date-fns/locale/sk";
import { dateToReadableString } from "../helpers/optimisations";
import { ACTION_TYPES } from "../helpers/consts";

const NoteCard = ({
  _id,
  title,
  description,
  dlTimestamp,
  category,
  status,
  createdAt,
  actionState,
  disabled,
  onFirstAction,
  onSecondAction,
}) => {
  const theme = useTheme();
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 1:
        return orange[600];
      case 2:
        return green[500];
      case 3:
        return red[500];
      default:
        return blue[500];
    }
  };
  const styles = {
    cardContainer: css`
      border-radius: 8px;
    `,
    card: css`
      position: relative;
      border-radius: 1.4rem;
      box-shadow: ${theme.softShadow[1]};
      transition-property: opacity;
      transition-timing-function: ease-in-out
      z-index: 1;

      .MuiCardHeader-content > .MuiCardHeader-subheader {
        display: flex;
        column-gap: 1ch;
      }

      .MuiCardContent-root:last-child {
        padding-bottom: 18px;
      }

      .MuiCardContent-root .NoteCard-statuses {
        padding-right: 0.6rem;
        margin-top: 1rem;
      }

      .MuiCardContent-root .NoteCard-statuses .MuiChip-root {
        min-width: 5ch;
      }

      .MuiCardContent-root .NoteCard-statuses .MuiIconButton-root {
        margin-left: 0.9rem;
      }

      .MuiCardContent-root .separator {
        flex: 1 1 auto;
      }

      .Card-overlay {
        display: flex;
        align-items: end;
        justify-content: center;
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        border-radius: inherit;
        background-color: transparent;
        pointer-events: none;
        z-index: 500;
        transition: background-color 300ms ${theme.transitions.easing.easeOut};
      }

      .Card-overlay .MuiBox-root {
        transform: translate(0, 100%);
        transition: transform 500ms ${theme.transitions.easing.easeOut};
        pointer-events: none;
      }

      &.action-complete .Card-overlay{
        background-color: ${green[500]};
      }

      &.action-delete .Card-overlay{
        background-color: ${red[500]};
      }

      &.action-return .Card-overlay{
        background-color: ${theme.palette.warning.main};
      }

      &.action-retrieve .Card-overlay{
        background-color: ${green[500]};
      }

      &.action-discard .Card-overlay{
        background-color: ${red[500]};
      }

      &:not(.action-none) .Card-overlay .MuiBox-root {
        transform: translate(0, -10%);
      }

      &:not(.note-active) .MuiAvatar-root:after {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: inherit;
        background-color: rgba(255, 255, 255, 0.5);
      }

      &:not(.note-active) .MuiCardContent-root {
        color: ${theme.palette.text.disabled};
      }
    `,
    avatar: css`
      text-transform: uppercase;
      background-color: ${getCategoryColor(category)};
    `,
    buttonsContainer: css`
      position: relative;
      display: flex;
      align-items: center;
      column-gap: 1rem;
      padding: 0 2rem 10px 2rem;
    `,
    button: css`
      padding: 0.45rem 1.4rem 0.4rem;
    `,
    tooltip: css`
      background-color: ${theme.palette.common.white};
      pointer-events: none !important;
      &.MuiTooltip-tooltip {
        pointer-events: none !important;
      }
    `,
  };

  const getCategoryName = (cat) => {
    switch (cat) {
      case 1:
        return "Pripomienky";
      case 2:
        return "Financie";
      case 3:
        return "Práca";
      default:
        return "Úlohy";
    }
  };

  const renderSubheader = () => (
    <>
      <Typography component="h4" variant="body2">
        {getCategoryName(category)}
      </Typography>
      <Typography component="span" variant="body2" color="GrayText">
        &bull;&nbsp; {dateToReadableString(new Date(createdAt))}
      </Typography>
    </>
  );

  const renderNoteStatus = () => {
    const statusIcon = status === "completed" ? <CheckRounded /> : <DeleteOutlined />;
    return (
      <Chip
        color={status === "completed" ? "success" : "error"}
        icon={statusIcon}
        label={status}
        size="small"
        sx={{ textTransform: "capitalize" }}
      />
    );
  };

  const renderNoteDeadline = () => {
    if (!dlTimestamp) return null;
    const theDate = new Date(dlTimestamp);
    const daysDiff = differenceInCalendarDays(theDate, startOfToday());
    let dateString = "";
    let bgColor = "neutral";

    if (daysDiff >= 0) {
      if (daysDiff === 0) {
        dateString = "Dnes";
        bgColor = "warning";
      } else if (daysDiff === 1) {
        dateString = "Zajtra";
        bgColor = "warning";
      } else dateString = format(theDate, "d. MMM RR", { locale: skLocale });
    } else {
      if (daysDiff === -1) {
        dateString = "Včera";
        bgColor = "error";
      } else {
        dateString = format(theDate, "d. MMM RR", { locale: skLocale });
        bgColor = "error";
      }
    }
    if (status !== "active") bgColor = "neutral";

    return <Chip color={bgColor} size="small" icon={<TimerOutlined />} label={dateString} />;
  };

  const getTooltipText = (isFirst) => {
    if (disabled) return "";
    if (isFirst) {
      switch (status) {
        case "active":
          return "Mark as completed";
        case "completed":
          return "Mark as active";
        case "deleted":
          return "Restore note";
      }
    } else {
      switch (status) {
        case "active":
          return "Delete note";
        case "completed":
          return "";
        case "deleted":
          return "Delete permanently";
      }
    }
  };

  const renderButtonIcon = (isFirst) => {
    if (isFirst) {
      return status === "active" ? (
        <CheckRounded />
      ) : status === "completed" ? (
        <Undo />
      ) : (
        <Restore />
      );
    } else {
      return status === "active" ? <DeleteOutlined /> : <DeleteForeverOutlined />;
    }
  };

  const renderAnimationIcon = () => {
    switch (actionState) {
      case ACTION_TYPES.COMPLETE:
        return <CheckRounded />;
      case ACTION_TYPES.DELETE:
        return <DeleteOutlined />;
      case ACTION_TYPES.RETURN:
        return <Undo />;
      case ACTION_TYPES.RETRIEVE:
        return <Restore />;
      case ACTION_TYPES.DISCARD:
        return <DeleteForeverOutlined />;
      default:
        return null;
    }
  };

  return (
    <div css={styles.cardContainer} className="NoteCard-container">
      <Card sx={styles.card} className={`note-${status || ""} action-${actionState || "none"}`}>
        <CardHeader
          avatar={<Avatar sx={styles.avatar}>{getCategoryName(category)[0]}</Avatar>}
          title={title}
          titleTypographyProps={{ variant: "body1" }}
          subheader={renderSubheader()}
        />
        <CardContent sx={styles.content}>
          <Typography variant="body2">{description}</Typography>
          <Stack
            direction="row"
            spacing={1.5}
            justifyContent="start"
            alignItems="center"
            className="NoteCard-statuses"
          >
            {status !== "active" && renderNoteStatus()}
            {renderNoteDeadline()}
            <div className="separator" />
            <EasyTooltip title={getTooltipText(true)} placement="top">
              <IconButton
                color={status === "completed" ? "warning" : "success"}
                aria-label="delete"
                disabled={disabled}
                onClick={() => onFirstAction(_id, status)}
              >
                {renderButtonIcon(true)}
              </IconButton>
            </EasyTooltip>
            {status !== "completed" && (
              <EasyTooltip title={getTooltipText(false)} placement="top">
                <IconButton
                  color="error"
                  aria-label="delete"
                  disabled={disabled}
                  onClick={() => onSecondAction(_id, status)}
                >
                  {renderButtonIcon(false)}
                </IconButton>
              </EasyTooltip>
            )}
          </Stack>
        </CardContent>
        <div className="Card-overlay">
          <Box
            sx={{
              padding: 2,
              borderRadius: 999,
              backgroundColor: "action.selected",
              color: "white",
              ".MuiSvgIcon-root": {
                fontSize: 64,
              },
            }}
          >
            {renderAnimationIcon()}
          </Box>
        </div>
      </Card>
    </div>
  );
};

const EasyTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  ["&"]: {
    pointerEvents: "none !important",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    pointerEvents: "none !important",
  },
}));

export default NoteCard;
