import { Container, Link, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { css, useTheme } from "@emotion/react";
import EasyButtons from "../Common/EasyButtons";
import { PlaylistAdd } from "@mui/icons-material";
import { FILTER_TYPES } from "../helpers/consts";

const NotesPagePlaceholder = ({ statusFilter, sx, ...rest }) => {
  const theme = useTheme();
  // max-width: ${theme.breakpoints.values.sm}px;

  const styles = {
    container: css`
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      column-gap: 1.5rem;
      width: 100%;
      padding: 0 4rem;

      .MuiTypography-h6 {
        margin-bottom: 1.4rem;
      }

      & > img {
        max-width: 25%;
        transform: scale(1.2, 1.2);
      }

      ${theme.breakpoints.down("sm")} {
        column-gap: 1rem;
        padding: 0 2rem;
        & > img {
          max-width: 30%;
        }
      }
    `,
    button: css`
      padding: 0.2rem 0.7rem;
      font-size: 0.8rem;
      white-space: nowrap;
    `,
  };

  const isActiveStatus = statusFilter === FILTER_TYPES.ACTIVE;

  const getPlaceholderText = () => {
    switch (statusFilter) {
      case FILTER_TYPES.ACTIVE:
        return "Tvoj zápisník je prázdny!";
      case FILTER_TYPES.COMPLETED:
        return "Nemáš žiadne splnené úlohy.";
      case FILTER_TYPES.DELETED:
        return "Nemáš žiadne zmazané poznámky.";
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={css`
        ${styles.container};
        ${sx}
      `}
      {...rest}
    >
      {isActiveStatus && <img src="/notebook-shadow.svg" alt="Notebook" />}
      <div>
        <Typography
          component="h5"
          variant="h6"
          color={isActiveStatus ? "text.primary" : "text.disabled"}
        >
          {getPlaceholderText()}
        </Typography>
        {isActiveStatus && (
          <Link to="/create" component={RouterLink}>
            <EasyButtons.Outlined sx={styles.button} color="secondary" startIcon={<PlaylistAdd />}>
              Pridaj novú poznámku
            </EasyButtons.Outlined>
          </Link>
        )}
      </div>
    </Container>
  );
};

export default NotesPagePlaceholder;
