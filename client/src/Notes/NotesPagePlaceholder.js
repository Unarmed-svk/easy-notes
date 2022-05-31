import { Container, Link, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { css, useTheme } from "@emotion/react";
import EasyButtons from "../Common/EasyButtons";
import { PlaylistAdd } from "@mui/icons-material";

const NotesPagePlaceholder = ({ sx, ...rest }) => {
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
      max-width: 450px;
      padding: 0 4rem;

      .MuiTypography-h6 {
        margin-bottom: 1.4rem;
      }

      & > img {
        max-width: 25%;
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

  return (
    <Container
      sx={css`
        ${styles.container};
        ${sx}
      `}
      {...rest}
    >
      <img src="/notebook-detailed.svg" alt="Notebook" />
      <div>
        <Typography component="h5" variant="h6">
          Tvoj zápisník je prázdny!
        </Typography>
        <Link to="/create" component={RouterLink}>
          <EasyButtons.Outlined sx={styles.button} startIcon={<PlaylistAdd />}>
            Pridaj novú poznámku
          </EasyButtons.Outlined>
        </Link>
      </div>
    </Container>
  );
};

export default NotesPagePlaceholder;
