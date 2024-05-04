import React, { useState, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const PrivateRoute = () => {
  const { token } = useContext(AuthContext);
  if (!token) return <Navigate to="/" />;
  return <Outlet />;
};

export default PrivateRoute;
