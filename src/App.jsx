import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root/root";
import DBTable from "./pages/Table/DBTable";
import Dashboard from "./pages/Dashboard/Dashboard";
import SettingPage from "./pages/SettingPage/SettingPage";
// import MyNavbar from "./components/MyNavbar";
import Sidebar from "./components/sidebar/Sidebar";
import QueryIndex from "./pages/Query/Query";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
    },
    {
      path: "/signup",
      element: <Registration />,
    },
    {
      path: "/signin",
      element: <Login />,
    },
    {
      path: "/table",
      element: <DBTable />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/setting",
      element: <SettingPage />,
    },
    {
      path: "/query",
      element: <QueryIndex />,
    },
  ]);
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
