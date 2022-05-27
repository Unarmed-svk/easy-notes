import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PreventSignin = ({ children }) => {
  const user = useSelector((state) => state.user);

  if (user.auth) {
    return <Navigate to={"/"} replace />;
  }

  return children;
};

export default PreventSignin;
