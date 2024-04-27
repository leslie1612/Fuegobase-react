import Header from "../Header";
import Sidebar from "../Siderbar";
import "./Layout.css";

const Layout = ({ children, className }) => {
  return (
    <>
      <div className={["layout_wrapper", className].join(" ")}>
        <Sidebar />
        <div className="main">
          <Header />
          <div className="content">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
