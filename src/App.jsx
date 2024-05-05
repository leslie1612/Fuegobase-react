import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Projects from "./pages/Projects";
import DBTable from "./pages/Table";
import Dashboard from "./pages/Dashboard";
import QueryIndex from "./pages/Query";
import SettingPage from "./pages/SettingPage";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import PrivateRoute from "./components/PrivateRoute";

const theme = createTheme({
  // components: {
  //   MuiSvgIcon: {
  //     styleOverrides: {
  //       root: {
  //         "&:hover": {
  //           cursor: "pointer",
  //         },
  //       },
  //     },
  //   },
  // },
  palette: {
    primary: {
      light: "#ced4da",
      main: "#495057",
      dark: "#212529",
      contrastText: "#fff",
    },
    secondary: {
      light: "#adb5bd",
      main: "#6c757d",
      dark: "#343a40",
      contrastText: "#000",
    },
    cancel: {
      light: "#F8F9FA",
      main: "#E9ECEF",
      dark: "#DEE2E6",
    },
  },
  typography: {
    fontFamily: "Signika Negative",
    fontSize: 16,
    fontWeightLight: 200,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Registration />} />
            {/* <Route element={<PrivateRoute />}> */}
            <Route path="/projects" element={<Projects />} />
            <Route path="/database/:projectId" element={<DBTable />} />
            <Route path="/usage/:projectId" element={<Dashboard />} />
            <Route path="/details/:projectId" element={<SettingPage />} />
            <Route path="/query/:projectId" element={<QueryIndex />} />
            {/* </Route> */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
