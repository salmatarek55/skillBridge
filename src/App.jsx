import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ServiceDetails from "./pages/ServiceDetails/ServiceDetails";
import Services from "./pages/ServicesPage/Services";
import Notfound from "./components/Notfound/Notfound";
import { AuthContextProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Messages from "./pages/Messages/Messages";
import MyRequests from  "./pages/client/MyRequests"
import MyServices from "./pages/provider/MyServices";
import Dashboard from "./pages/provider/Dashboard";
import ProviderOrders from "./pages/provider/ProviderOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProviderRoute from './Routes/ProviderRoute';
import AdminRoute from "./Routes/AdminRoute";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import Profile from './pages/Profile/Profile';
import PendingProviders from "./pages/admin/PendingProviders";
import PendingServices from './pages/admin/PendingServices';



const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // public 
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/services", element: <Services /> },
      { path: "/services/:id", element: <ServiceDetails /> },
      
      // protected routes
      {element:<ProtectedRoutes />,children:[
          { path: "/messages", element: <Messages /> },
          { path: "/my-requests", element: <MyRequests /> },
          { path: "/profile", element: <Profile /> },
      ]},
      // provider routes
      {
        element: <ProviderRoute />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/my-services", element: <MyServices /> },
          { path: "/orders", element: <ProviderOrders  /> },
        ],
      },
      // admin routes
      {
        element: <AdminRoute />,
        children: [
          { path: "/admin/dashboard", element: <AdminDashboard /> },
           { path: "/admin/pending-providers", element: <PendingProviders /> },
            { path: "/admin/pending-services", element: <PendingServices /> },
            
        ],
      },
      { path: "*", element: <Notfound /> },
    ],
  },
]);

export default function App() {
  return (
    <>
      <AuthContextProvider>
        <RouterProvider router={routes}></RouterProvider>
        <Toaster position="top-right" />
      </AuthContextProvider>
    </>
  );
}
