import React from "react";
import Nav from "react-bootstrap/Nav";
import { NavLink, useParams, Link } from "react-router-dom";
import "./header.css";

const Header = () => {
  const { projectId } = useParams();

  return (
    <>
      <Nav variant="tabs" className="header__container">
        {/* <Nav.Item>
          <Nav.Link as={Link} to={`/table/${projectId}`}>
            DB table
          </Nav.Link>
        </Nav.Item> */}
        <Nav.Item className="header__item">
          <Nav.Link
            as={Link}
            to={`/query/${projectId}`}
            className="header__link"
          >
            Query Page
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="header__item">
          <Nav.Link
            as={Link}
            to={`/dashboard/${projectId}`}
            className="header__link"
          >
            Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="header__item">
          <Nav.Link
            as={Link}
            to={`/setting/${projectId}`}
            className="header__link"
          >
            Setting Page
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
};

export default Header;
