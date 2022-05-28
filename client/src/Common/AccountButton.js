import { useTheme } from "@emotion/react";
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import EasyButtons from "./EasyButtons";
import { Box } from "@mui/system";

const menuItems = [
  { name: "Profile", linkTo: "/profile" },
  { name: "Log out", linkTo: "/signout" },
];

const styles = {
  avatar: { bgcolor: "primary.main", textTransform: "uppercase" },
  dialogTitle: { display: "flex", flexDirection: "row", columnGap: "1.2rem", alignItems: "center" },
  dialog: css`
    .MuiDialogTitle-root {
      padding: 0.6rem 1.2rem;
    }

    .MuiDialogTitle-root .DialogTitle-username {
      display: block;
      font-size: 1.4rem;
      line-height: 1;
    }
  `,
};

export default function AccountButton({ user }) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const onAccountClick = (e) => setMenuAnchor(e.currentTarget);
  const onAccountClose = () => setMenuAnchor(null);
  const getAvatarAlt = () => {
    const { firstname, lastname, email } = user.data;
    if (firstname || lastname) return `${firstname || ""} ${lastname || ""}`;
    else return email;
  };
  const onItemClick = (item) => {
    setMenuAnchor(null);
    navigate(item.linkTo);
  };

  const renderDialogTitle = () => (
    <Box sx={styles.dialogTitle}>
      <Avatar src="/dave.png" alt={getAvatarAlt()} sx={styles.avatar} />
      <span className="DialogTitle-username">{getAvatarAlt()}</span>
    </Box>
  );

  const renderMenuItems = (sx) =>
    menuItems.map((item) => (
      <MenuItem key={item.linkTo} sx={sx} onClick={() => onItemClick(item)}>
        {item.name}
      </MenuItem>
    ));

  return (
    <div>
      <ReusableDialog
        isOpen={isSmallScreen && Boolean(menuAnchor)}
        title={renderDialogTitle()}
        sx={styles.dialog}
        onClose={onAccountClose}
      >
        <List sx={{ py: 1.5 }}>
          {renderMenuItems({
            px: 2.5,
            py: 1.4,
            fontSize: "1.1rem",
            fontWeight: "lite",
            textAlign: "center",
            textTransform: "uppercase",
          })}
        </List>
      </ReusableDialog>
      <IconButton
        size="large"
        aria-label="current-user-account"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={onAccountClick}
      >
        <Avatar src="/dave.png" alt={getAvatarAlt()} sx={styles.avatar} />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={menuAnchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={!isSmallScreen && Boolean(menuAnchor)}
        onClose={onAccountClose}
      >
        {renderMenuItems({ px: 4, py: 1.2 })}
      </Menu>
    </div>
  );
}

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

const ReusableDialog = ({
  children,
  isOpen,
  title,
  closeBtnText,
  confirmBtnText,
  sx,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={css`
        ${dialogStyle};
        ${sx};
      `}
    >
      <DialogTitle>{title}</DialogTitle>
      {children}

      <DialogActions style={{ display: closeBtnText || confirmBtnText ? "flex" : "none" }}>
        {closeBtnText && (
          <EasyButtons.Text color="warning" onClick={onClose}>
            {closeBtnText}
          </EasyButtons.Text>
        )}
        {confirmBtnText && (
          <EasyButtons.Text color="success" onClick={onConfirm}>
            {confirmBtnText}
          </EasyButtons.Text>
        )}
      </DialogActions>
    </Dialog>
  );
};
