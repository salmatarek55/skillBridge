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
import ProviderOrders from "./pages/provider/ProviderOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProviderRoute from './Routes/ProviderRoute';
import AdminRoute from "./Routes/AdminRoute";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import Profile from './pages/Profile/Profile';
import PendingProviders from "./pages/admin/PendingProviders";
import PendingServices from './pages/admin/PendingServices';
import IncomingRequests from './pages/provider/IncomingRequests';
import AccountPending from './pages/provider/AccountPending';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./pages/provider/Dashboard";
import AllUsers from './pages/admin/AllUsers';


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
      { path: "/services/:serviceId", element: <ServiceDetails /> },
      
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
          { path: "/my-services", element: <MyServices /> },
          { path: "/orders", element: <ProviderOrders  /> },
          { path: "/incoming-requests", element: <IncomingRequests /> },
          { path: "/account-pending", element : <AccountPending /> },
          { path: "/dashboard", element : <Dashboard /> },

        ],
      },
      // admin routes
      {
        element: <AdminRoute />,
        children: [
          { path: "/admin/dashboard", element: <AdminDashboard /> },
           { path: "/admin/pending-providers", element: <PendingProviders /> },
            { path: "/admin/pending-services", element: <PendingServices /> },
            { path: "/admin/all-users", element: <AllUsers /> },
            
        ],
      },
      { path: "*", element: <Notfound /> },
    ],
  },
]);

export default function App() {
  const queryClient =new  QueryClient();
  return (
    <>
    <QueryClientProvider client={ queryClient}>
             <AuthContextProvider>
        <RouterProvider router={routes}></RouterProvider>
        <Toaster position="top-right" />
      </AuthContextProvider>
    </QueryClientProvider>

    </>
  );
}
