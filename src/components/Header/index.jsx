import React from "react";
import Nav from "react-bootstrap/Nav";
import { NavLink, useParams, Link } from "react-router-dom";

const Header = () => {
  const { projectId } = useParams();

  return (
    <>
      <Nav variant="tabs">
        {/* <Nav.Item>
          <Nav.Link as={Link} to={`/table/${projectId}`}>
            DB table
          </Nav.Link>
        </Nav.Item> */}
        <Nav.Item>
          <Nav.Link as={Link} to={`/query/${projectId}`}>
            Query Page
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to={`/dashboard/${projectId}`}>
            Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to={`/setting/${projectId}`}>
            Setting Page
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
};

export default Header;
