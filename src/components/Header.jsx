import React from "react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("id");
  return (
    <>
      <h1>This is Header</h1>
      <a href={`./dashboard?id=${projectId}`}>
        <div>Dashboard page</div>
      </a>
      <a href={`./setting?id=${projectId}`}>
        <div>Setting page</div>
      </a>
    </>
  );
};

export default Header;
