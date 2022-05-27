import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../store/actions/user.action";
import { clearNotification } from "../store/actions";

const SignOut = ({}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notification = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(userLogout());
  }, [dispatch]);

  useEffect(() => {
    if (notification && notification.success) {
      console.log(notification.message);
      dispatch(clearNotification());
      setTimeout(() => navigate("../signin"), 500);
    } else if (notification.error) console.error(`There was an error! ${notification.message}`);
  }, [notification, navigate]);

  return (
    <Box sx={{ display: "flex", height: "65%", justifyContent: "center", alignItems: "center" }}>
      <Typography variant="h3" component="h4" sx={{ fontWeight: "bold" }}>
        Good bye!
      </Typography>
    </Box>
  );
};

export default SignOut;
