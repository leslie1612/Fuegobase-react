import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import Root from "./routes/root/root";
import App from "./pages/DatabasePage";
import DBTable from "./pages/Table/DBTable";

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
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
