import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { name: "Profile", linkTo: "/profile" },
  { name: "Log out", linkTo: "/signout" },
];

export default function AccountButton({ user }) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const navigate = useNavigate();

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

  return (
    <div>
      <IconButton
        size="large"
        aria-label="current-user-account"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={onAccountClick}
      >
        <Avatar
          src="/dave.png"
          alt={getAvatarAlt()}
          sx={{ bgcolor: "primary.main", textTransform: "uppercase" }}
        />
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
        open={Boolean(menuAnchor)}
        onClose={onAccountClose}
      >
        {menuItems.map((item) => (
          <MenuItem key={item.linkTo} sx={{ px: 4, py: 1.2 }} onClick={() => onItemClick(item)}>
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
