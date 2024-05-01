import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Projects from "./pages/Projects";
import DBTable from "./pages/Table";
import Dashboard from "./pages/Dashboard";
import SettingPage from "./pages/SettingPage";
import QueryIndex from "./pages/Query";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Registration from "./pages/Registration";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Registration />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/table/:projectId" element={<DBTable />} />
          <Route path="/dashboard/:projectId" element={<Dashboard />} />
          {/* <Route path="/setting/:projectId" element={<SettingPage />} /> */}
          <Route path="/query/:projectId" element={<QueryIndex />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
