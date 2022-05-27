import { Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import React from "react";
import { css, useTheme } from "@emotion/react";
import { ArrowBack } from "@mui/icons-material";

const PageTitle = ({ title, linkTo, linkIcon }) => {
  const theme = useTheme();
  const styles = css`
    align-items: center;
    column-gap: 1.2rem;
    margin-top: 12px;
    margin-bottom: 25px;

    & .MuiLink-root {
      display: block;
      line-height: 1;
    }
    & .MuiSvgIcon-root {
      display: block;
      line-height: 1;
      font-size: inherit;
    }
    & .MuiTypography-root:not(.MuiLink-root) {
      color: ${theme.palette.grey[800]};
      font-weight: ${theme.typography.fontWeightBold};
    }
  `;

  return (
    <Stack sx={styles} direction="row">
      <Link variant="h4" color="secondary" underline="none" to={linkTo} component={RouterLink}>
        {linkIcon ? linkIcon : <ArrowBack />}
      </Link>
      <Typography variant="h4" component="h3">
        {title}
      </Typography>
    </Stack>
  );
};

export default PageTitle;
