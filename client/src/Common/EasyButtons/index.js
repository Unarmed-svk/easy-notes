import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { css } from "@emotion/react";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { isCSSColor } from "../../helpers/optimisations";

const baseStyles = css`
  padding: 0.45rem 2rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: bold;
`;

const Contained = ({ children, sx, ...rest }) => {
  return (
    <Button
      variant="contained"
      sx={css`
        ${baseStyles};
        ${sx};
      `}
      {...rest}
    >
      {children}
    </Button>
  );
};

const Outlined = ({ children, sx, ...rest }) => {
  const defaultStyle = css`
    ${baseStyles};
    border-width: 2px;

    &:hover {
      border-width: 2px;
    }
  `;

  return (
    <Button
      variant="outlined"
      sx={css`
        ${defaultStyle};
        ${sx};
      `}
      {...rest}
    >
      {children}
    </Button>
  );
};

const Text = ({ children, sx, ...rest }) => {
  return (
    <Button
      variant="text"
      sx={css`
        ${baseStyles}
        ${sx}
      `}
      {...rest}
    >
      {children}
    </Button>
  );
};

const Loading = ({ children, sx, ...rest }) => {
  return (
    <LoadingButton
      variant="contained"
      sx={css`
        ${baseStyles};
        ${sx};
      `}
      {...rest}
    >
      {children}
    </LoadingButton>
  );
};

const IconButton = ({ children, color, ...rest }) => {
  const theme = useTheme();
  const [cssColor, setCssColor] = useState("#333");
  const styles = css`
    padding: 0.5rem;
    border-radius: 999px;
    color: ${cssColor};
  `;

  useEffect(() => {
    const isCssColor = isCSSColor(color);
    setCssColor(isCssColor ? color : theme.palette[color].main);

    console.log(`Color is: ${cssColor}`);
  }, [color]);

  return (
    <Box sx={styles} {...rest}>
      {children}
    </Box>
  );
};

const Sharp = React.forwardRef(function Sharp({ children, color, sx, ...rest }, ref) {
  const theme = useTheme();

  const sharpStyle = css`
    padding: 0.45rem 2rem;
    border-radius: 0;
    font-size: 1rem;
    font-weight: light;
    transition: color 250ms ${theme.transitions.easing.easeOut};
    &:hover {
      background-color: ${theme.palette[color || "primary"].light};
      color: ${theme.palette.background.default};
    }
  `;

  return (
    <Button
      variant="text"
      color={color || "primary"}
      sx={css`
        ${sharpStyle}
        ${sx}
      `}
      ref={ref}
      {...rest}
    >
      {children}
    </Button>
  );
});

const EasyButtons = { Contained, Outlined, Loading, Text, Sharp };

export default EasyButtons;
