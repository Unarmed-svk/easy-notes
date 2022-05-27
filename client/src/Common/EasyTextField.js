import React, { useCallback, useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import { TextField } from "@mui/material";
import { debounce } from "../helpers/optimisations";

const baseStyles = css`
  box-sizing: border-box;
  & .MuiOutlinedInput-root {
    border-radius: 1rem;
    background-color: #efefef;
    padding: 0;
  }
  & .MuiOutlinedInput-input {
    padding: 14.5px 22px;
  }
  & textarea.MuiOutlinedInput-input {
    padding: 18.5px 22px;
  }

  & .MuiOutlinedInput-notchedOutline {
    padding: 0 22px;
    border-width: 2px;
    top: 0px;
  }
  & .MuiOutlinedInput-root:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline {
    border-color: rgba(0, 0, 0, 0.4);
  }
  & .MuiOutlinedInput-notchedOutline legend {
    display: none;
  }
  & .MuiInputLabel-root {
    left: unset;
    color: rgba(0, 0, 0, 0.5);
    transform: translate(22px, 14px) scale(1);
  }
  & .MuiInputLabel-root.Mui-focused {
    transform: translate(18px, -20px) scale(0.75);
  }
  & .MuiInputLabel-root.MuiFormLabel-filled {
    transform: translate(18px, -20px) scale(0.75);
  }
`;

const EasyTextField = ({ sx, ...rest }) => {
  return (
    <TextField
      variant="outlined"
      sx={css`
        ${baseStyles};
        ${sx}
      `}
      {...rest}
    />
  );
};

export const DebouncedTextField = ({ sx, onChange, error, helperText, ...rest }) => {
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);

  const debounceOnChange = useCallback(debounce(onChange, 700), [debounce]);
  const handleBlur = () => setTouched(true);

  const showError = error && touched;

  useEffect(() => {
    const currentRef = inputRef.current;
    currentRef.addEventListener("input", debounceOnChange);

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("input", debounceOnChange);
      }
    };
  }, [inputRef, debounceOnChange]);

  return (
    <TextField
      ref={inputRef}
      variant="outlined"
      sx={css`
        ${baseStyles};
        ${sx}
      `}
      onBlur={handleBlur}
      error={showError}
      helperText={showError && helperText}
      {...rest}
    />
  );
};

export default EasyTextField;
