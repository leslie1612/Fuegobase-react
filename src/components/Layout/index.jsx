import { Outlet } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Siderbar";
import "./Layout.css";

const Layout = ({ children, className }) => {
  return (
    <>
      <div className={["layout_wrapper", className].join(" ")}>
        <Header />
        <Sidebar />
        <div className="main">
          <div className="content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
