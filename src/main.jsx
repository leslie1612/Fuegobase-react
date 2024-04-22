import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
// import "./index.css";
import Root from "./routes/root/root";
import App from "./pages/DatabasePage";
import DBTable from "./pages/Table/DBTable";
import Dashboard from "./pages/Dashboard/Dashboard";
import SettingPage from "./pages/SettingPage/SettingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/database",
    element: <App />,
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
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("school")).render(
  <React.StrictMode>
    <h1>SCHOOL</h1>
  </React.StrictMode>
);
