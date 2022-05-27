import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { css } from "@emotion/react";
import Create from "./Create";
import Notes from "./Notes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Layout from "./Common/Layout";
import SignIn from "./SignIn";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isUserAuth } from "./store/actions/user.action";
import { Alert, Box, CircularProgress, Slide, Snackbar } from "@mui/material";
import SignOut from "./SignOut";
import Profile from "./Profile";
import AuthGuard from "./Common/AuthGuard";
import PreventSignin from "./Common/PreventSignin";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import skLocale from "date-fns/locale/sk";
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#30a30d",
    },
    secondary: {
      main: "#ae9b66",
    },
    neutral: {
      main: "rgba(0, 0, 0, 0.42)",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.8)",
    },
    background: {
      default: "#fefefe",
    },
  },
  typography: {
    fontFamily: "Quicksand",
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h5: {
      fontSize: "1.7rem",
    },
  },
  filter: [
    "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
    "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))",
  ],
});

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const notification = useSelector((state) => state.notification);

  const [isLoading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState({});

  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") return;
    setToastMessage({ ...toastMessage, open: false });
  };

  const guard = (element) => <AuthGuard>{element}</AuthGuard>;

  useEffect(() => {
    dispatch(isUserAuth());
  }, [dispatch]);

  useEffect(() => {
    if (user.auth !== null) setLoading(false);
  }, [user]);

  useEffect(() => {
    if (notification.showToast) {
      setToastMessage({ ...notification, open: true });
    }
  }, [notification, dispatch]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={skLocale}>
      <ThemeProvider theme={theme}>
        {isLoading ? (
          <Loading fullScreen />
        ) : (
          <Router>
            <Routes>
              <Route path="/" element={<Layout theme={theme} user={user} />}>
                <Route index element={guard(<Notes theme={theme} />)} />
                <Route path="create" element={guard(<Create theme={theme} />)} />
                <Route path="profile" element={guard(<Profile theme={theme} />)} />
                <Route path="signout" element={<SignOut theme={theme} />} />
              </Route>
              <Route
                path="/signin"
                element={
                  <PreventSignin>
                    <SignIn theme={theme} />
                  </PreventSignin>
                }
              />
            </Routes>
          </Router>
        )}
        <EasyToast
          open={toastMessage.open}
          message={toastMessage.message}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={4000}
          severity={toastMessage.error ? "error" : "success"}
          onClose={handleToastClose}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export const Loading = ({ fullScreen, circleSX, ...rest }) => {
  const fullScreenStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
  `;

  return (
    <Box sx={fullScreen ? fullScreenStyle : {}} {...rest}>
      <CircularProgress sx={circleSX || {}} />
    </Box>
  );
};

const toastStyle = css`
  & .MuiPaper-root {
    padding: 8px 20px;
    border-radius: 1rem;
    font-size: 1.1rem;
  }
  & .MuiAlert-icon {
    margin-right: 1.3rem;
    padding: 8px 0;
    font-size: 1.6rem;
  }
  & .MuiAlert-message {
    padding: 8px 0;
  }
  & .MuiAlert-action {
    padding: 4px 0 0 28px;
  }
  & .MuiButtonBase-root {
    padding: 7px;
  }
  & .MuiButtonBase-root .MuiSvgIcon-root {
    font-size: 1.4rem;
  }
`;

const EasyToast = ({ message, severity, onClose, ...rest }) => {
  return (
    <Snackbar onClose={onClose} sx={toastStyle} TransitionComponent={Slide} {...rest}>
      <EasyAlert severity={severity} onClose={onClose}>
        {message}
      </EasyAlert>
    </Snackbar>
  );
};

const EasyAlert = React.forwardRef(function EasyAlert(props, ref) {
  return <Alert elevation={10} variant="filled" ref={ref} {...props} />;
});

export default App;
