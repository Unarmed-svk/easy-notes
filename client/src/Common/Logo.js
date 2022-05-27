import { css, useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
import React from "react";

const Logo = ({ variant, textAlign }) => {
  const theme = useTheme();
  const styles = {
    typography: css`
      font-family: "Rubik", "Helvetica", "Arial", sans-serif;
      font-weight: ${theme.typography.fontWeightRegular};
      text-align: ${textAlign || "left"};
      letter-spacing: -2px;
      color: ${theme.palette.grey["600"]};
      & .logo-accent {
        font-weight: ${theme.typography.fontWeightBold};
        letter-spacing: normal;
        color: ${theme.palette.primary.main};
      }
    `,
  };

  return (
    <Typography variant={variant || "h5"} sx={styles.typography}>
      <span className="logo-accent">Easy</span> Notes
    </Typography>
  );
};

export default Logo;
