import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  if (!user.auth) {
    return <Navigate to={"/signin"} state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
