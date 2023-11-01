import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute({ element, path }) {
  const tokenExpired = useSelector((state) => state.auth.tokenExpired);
  return tokenExpired ? element : <Navigate to="/login" />;
}

export default PrivateRoute;
