import { css, useTheme } from "@emotion/react";
import { AccountCircle, Logout } from "@mui/icons-material";
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EasyButtons from "./EasyButtons";

const menuItems = [
  { name: "Profile", linkTo: "/profile", icon: <AccountCircle fontSize="small" /> },
  { name: "Log out", linkTo: "/signout", icon: <Logout fontSize="small" /> },
];

const stringToColor = (string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

export default function AccountButton({ user }) {
  const getAvatarAlt = (initOnly) => {
    const { firstname, lastname, email } = user.data;
    let result = "";
    if (firstname || lastname) result = `${firstname || ""} ${lastname || ""}`;
    else result = email;
    if (initOnly) {
      const strings = result.split(" ");
      result = "";
      for (let i = 0; i < Math.min(strings.length, 2); i++) result += strings[i][0];
      return result;
    }
    return result;
  };

  const theme = useTheme();
  const styles = {
    avatar: {
      width: "42px",
      height: "42px",
      boxSizing: "border-box",
      border: `solid 2px rgba(0, 0, 0, 0.14)`,
      bgcolor: stringToColor(getAvatarAlt()),
      textTransform: "uppercase",
      letterSpacing: "-0.4rem",
      fontSize: "2.45rem",
      fontWeight: "bold",
      justifyContent: "center",
      alignItems: "center",
      "& span": {
        ml: 0.2,
      },
    },
    dialogTitle: {
      display: "flex",
      flexDirection: "row",
      columnGap: "1.2rem",
      alignItems: "center",
    },
    dialog: css`
      .MuiPaper-root {
        padding-left: 0;
        padding-right: 0;
      }

      .MuiDialogTitle-root {
        padding: 0.6rem 1.8rem 1rem 1.8rem;
        border-bottom: 1px solid ${theme.palette.divider};
      }

      .MuiDialogTitle-root .DialogTitle-username {
        display: block;
        flex-shrink: 0;
        max-width: 85%;
        font-size: 1.4rem;
        line-height: 1.3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .MuiList-root .MuiListItemText-root .MuiTypography-root {
        font-size: inherit !important;
        font-weight: inherit !important;
      }
    `,
  };

  const [menuAnchor, setMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const isTabletWide = useMediaQuery(theme.breakpoints.down("lg"));
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const onAccountClick = (e) => setMenuAnchor(e.currentTarget);
  const onAccountClose = () => setMenuAnchor(null);

  const onItemClick = (item) => {
    setMenuAnchor(null);
    navigate(item.linkTo);
  };

  // TODO: Change the static profile picture
  const renderDialogTitle = () => (
    <Box sx={styles.dialogTitle}>
      <Avatar children={<span>{getAvatarAlt(true)}</span>} sx={styles.avatar} />
      <span className="DialogTitle-username">{getAvatarAlt()}</span>
    </Box>
  );

  const renderMenuItems = (sx) =>
    menuItems.map((item) => (
      <MenuItem key={item.linkTo} sx={sx} onClick={() => onItemClick(item)}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText>{item.name}</ListItemText>
      </MenuItem>
    ));

  return (
    <div>
      <ReusableDialog
        isOpen={isTabletWide && Boolean(menuAnchor)}
        title={renderDialogTitle()}
        sx={styles.dialog}
        onClose={onAccountClose}
      >
        {/* TODO: Maybe make the dialog fullscreen when the user is on a mobile device */}
        <List sx={{ py: 1.5, px: 1.2 }}>
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
        <Avatar children={<span>{getAvatarAlt(true)}</span>} sx={styles.avatar} />
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
        open={!isTabletWide && Boolean(menuAnchor)}
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
  ...rest
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={css`
        ${dialogStyle};
        ${sx};
      `}
      {...rest}
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
