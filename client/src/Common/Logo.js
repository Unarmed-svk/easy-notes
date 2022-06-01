import { css, useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
import React from "react";

const Logo = ({ variant, component, sx, forwardedRef, ...rest }) => {
  const theme = useTheme();
  const styles = {
    typography: css`
      font-family: "Rubik", "Helvetica", "Arial", sans-serif;
      font-weight: ${theme.typography.fontWeightRegular};
      text-align: left;
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
    <Typography
      variant={variant || "h5"}
      component={component || "h4"}
      sx={css`
        ${styles.typography};
        ${sx};
      `}
      ref={forwardedRef}
      {...rest}
    >
      <span className="logo-accent">Easy</span> Notes
    </Typography>
  );
};

export default Logo;
