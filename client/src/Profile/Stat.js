import { Stack, Typography } from "@mui/material";
import React from "react";
import { css } from "@emotion/react";

const style = css`
  align-items: center;

  .Stat-value {
    max-width: 100%;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .Stat-title {
    font-size: 0.8rem;
    line-height: 2.5;
    letter-spacing: 0.3px;
  }
`;

const Stat = ({ title, value, color, fontSize }) => {
  return (
    <Stack direction="column" sx={style}>
      <Typography
        variant="h6"
        component="h5"
        className="Stat-value"
        fontSize={fontSize || "1.4rem"}
      >
        {value}
      </Typography>
      <Typography
        variant="overline"
        component="h6"
        className="Stat-title"
        color={color || "secondary.dark"}
      >
        {title}
      </Typography>
    </Stack>
  );
};

export default Stat;
