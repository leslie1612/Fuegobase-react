import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root";
import DBTable from "./pages/Table";
import Dashboard from "./pages/Dashboard";
import SettingPage from "./pages/SettingPage/SettingPage";
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
      path: "/table/:projectId",
      element: <DBTable />,
    },
    {
      path: "/dashboard/:projectId",
      element: <Dashboard />,
    },
    {
      path: "/setting/:projectId",
      element: <SettingPage />,
    },
    {
      path: "/query/:projectId",
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
