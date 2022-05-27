import React from "react";
import { css } from "@emotion/react";
import EasyTextField, { DebouncedTextField } from "./EasyTextField";
import { Box } from "@mui/system";

const defaultStyles = {
  box: css`
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    padding-top: 1rem;
  `,
  textField: css`
    flex: 1 0 auto;
  `,
};

const EasyIconField = ({ iconComponent, wrapperSX, sx, ...rest }) => {
  return (
    <Box
      sx={css`
        ${defaultStyles.box};
        ${wrapperSX};
      `}
    >
      {iconComponent}
      <EasyTextField
        sx={css`
          ${defaultStyles.textField};
          ${sx};
        `}
        {...rest}
      />
    </Box>
  );
};

export const DebouncedIconField = ({ iconComponent, wrapperSX, sx, ...rest }) => {
  return (
    <Box
      sx={css`
        ${defaultStyles.box};
        ${wrapperSX};
      `}
    >
      {iconComponent}
      <DebouncedTextField
        sx={css`
          ${defaultStyles.textField};
          ${sx};
        `}
        {...rest}
      />
    </Box>
  );
};

export default EasyIconField;
