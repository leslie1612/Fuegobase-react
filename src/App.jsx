import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root/root";
import DBTable from "./pages/Table/DBTable";
import Dashboard from "./pages/Dashboard/Dashboard";
import SettingPage from "./pages/SettingPage/SettingPage";
// import MyNavbar from "./components/MyNavbar";
import Sidebar from "./components/sidebar/Sidebar";
import QueryIndex from "./pages/Query/Query";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
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
      {/* <MyNavbar /> */}
      <Sidebar />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
