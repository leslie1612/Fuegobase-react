const Landing = ({ children, className }) => {
  return (
    <>
      <div className={["layout_wrapper", className].join(" ")}>
        <h1>This is landing page</h1>
        <div className="main">
          <div className="content">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Landing;
