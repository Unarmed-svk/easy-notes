import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EasyButtons from "./EasyButtons";
import { css } from "@emotion/react";

const dialogStyle = css`
  .MuiDialog-paper {
    padding: 0.6rem;
    border-radius: 1.2rem;
  }

  .MuiDialogActions-root {
    justify-content: space-around;
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;

const EasyDialog = ({
  title,
  description,
  buttonNames,
  buttonColors,
  isOpen,
  onClose,
  onConfirm,
  ...rest
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="easy-dialog-title"
      aria-describedby="easy-dialog-description"
      sx={dialogStyle}
      {...rest}
    >
      <DialogTitle id="easy-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="easy-dialog-description">{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <EasyButtons.Text color={buttonColors ? buttonColors[0] : "warning"} onClick={onClose}>
          {buttonNames ? buttonNames[0] : "Cancel"}
        </EasyButtons.Text>
        <EasyButtons.Text
          color={buttonColors ? buttonColors[1] : "success"}
          onClick={onConfirm}
          autoFocus
        >
          {buttonNames ? buttonNames[1] : "Confirm"}
        </EasyButtons.Text>
      </DialogActions>
    </Dialog>
  );
};

export default EasyDialog;
