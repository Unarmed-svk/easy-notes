import { css } from "@emotion/react";
import { AddCircleOutlineOutlined, SubjectOutlined } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
import sk from "date-fns/locale/sk";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Logo from "./Logo";
import UserButton from "./AccountButton";

const drawerWidth = 240;
const menuItems = [
  {
    text: "Moje Poznámky",
    linkTo: "/",
    icon: <SubjectOutlined color="primary" />,
  },
  {
    text: "Vytvoriť Poznámku",
    linkTo: "/create",
    icon: <AddCircleOutlineOutlined color="primary" />,
  },
];

const Layout = ({ theme, user }) => {
  const styles = {
    root: css`
      display: flex;
      min-height: 100vh;
    `,
    page: css`
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: ${theme.spacing(3)} 0;
      background-color: #f9f9f9;
    `,
    drawer: css`
      display: block;
      width: ${drawerWidth}px;
      & .MuiPaper-root {
        width: ${drawerWidth}px;
      }
      ${theme.breakpoints.down("md")} {
        display: none;
      }
    `,
    logoWrapper: css`
      padding: ${theme.spacing(2)};
    `,
    activeButton: css`
      background-color: #f4f4f4;
    `,
    appbar: css`
      width: calc(100% - ${drawerWidth}px);
      ${theme.breakpoints.down("md")} {
        width: 100%;
      }
    `,
    toolbar: css`
      & .MuiTypography-root {
        font-size: ${theme.typography.h6.fontSize};
        color: ${theme.palette.grey[700]};
      }
      & .toolbar-left {
        flex-grow: 1;
      }
      & .user-name {
        margin-right: ${theme.spacing(2)};
      }
    `,
  };

  const Offset = styled("div")(() => theme.mixins.toolbar);
  const navigate = useNavigate();
  const location = useLocation();
  // const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const getUserName = () => {
    const { firstname, lastname, email } = user.data;
    if (firstname || lastname) return `${firstname || ""} ${lastname || ""}`;
    else return email;
  };

  return (
    <div css={styles.root}>
      <AppBar sx={styles.appbar} color={"background"} position="fixed" elevation={0}>
        <Toolbar sx={styles.toolbar}>
          <Typography className="toolbar-left">
            Dnes je {format(new Date(), "do MMMM Y", { locale: sk })}
          </Typography>
          <Typography className="user-name">{getUserName()}</Typography>
          <UserButton user={user} theme={theme} />
        </Toolbar>
      </AppBar>

      <Drawer sx={styles.drawer} anchor="left" variant="permanent">
        <div css={styles.logoWrapper}>
          <Logo variant={"h5"} />
        </div>
        <List>
          {menuItems.map(({ text, linkTo, icon }) => (
            <ListItemButton
              key={text}
              onClick={() => navigate(linkTo)}
              sx={location.pathname === linkTo ? styles.activeButton : undefined}
            >
              <ListItemIcon children={icon} />
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <div css={styles.page}>
        <Offset />
        <Box sx={{ flex: "1 1 auto" }}>
          <Outlet />
        </Box>
      </div>
    </div>
  );
};

export default Layout;
