import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProviderRoute() {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "provider"){
    return <Navigate to="/" replace />;
  }
if( !user.approved){
  return <Navigate to="/account-pending" replace />;
}
  return <Outlet />;
}
