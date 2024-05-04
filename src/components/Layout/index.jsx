import Header from "../Header";
import Sidebar from "../Siderbar";
import "./layout.css";

const Layout = ({ children, className }) => {
  return (
    <>
      <div className={["layout_wrapper", className].join(" ")}>
        <Header />
        <Sidebar />
        <div className="main">
          <div className="content">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
