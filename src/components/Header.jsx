import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Nav from "react-bootstrap/Nav";
import { useLocation } from "react-router-dom";
const Header = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("id");
  const apikey = searchParams.get("apikey");

  return (
    <>
      <Nav variant="tabs" defaultActiveKey="/home">
        <Nav.Item>
          <Nav.Link href={`./table?id=${projectId}&apikey=${apikey}`}>
            DB table
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href={`./dashboard?id=${projectId}&apikey=${apikey}`}>
            Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href={`./setting?id=${projectId}&apikey=${apikey}`}>
            Setting Page
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href={`./query?id=${projectId}&apikey=${apikey}`}>
            Query Page
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
};

export default Header;
