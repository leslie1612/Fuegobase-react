import React, { useContext } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Nav from "react-bootstrap/Nav";
import API from "../../utils/api";
import "./sidebar.css";

const Sidebar = () => {
  const { token } = useContext(AuthContext);
  const { projectId } = useParams();
  const [projects, setProjects] = React.useState([]);
  const [selectedProjectId, setSelectedProjectId] = React.useState("");

  React.useEffect(() => {
    API.getProjects(token).then((json) => {
      setProjects(json.data);
    });
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__title">Fuegobase</div>
      <Link to="/projects">
        <div className="sidebar__logo"></div>
      </Link>

      <div style={{ display: projectId ? "block" : "none" }}>
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
      </div>

      <div className="sidebar__project__title">Projects</div>
      <div className="sidebar__projects">
        <ul className="sidebar__project-list">
          {projects &&
            projects.map((project) => (
              <>
                <li
                  key={project.id}
                  className={
                    project.id == projectId ? "sidebar_project_selected" : ""
                  }
                >
                  <Link
                    to={`/table/${project.id}`}
                    className="sidebar__project__link"
                  >
                    <div className="sidebar__project"> {project.name}</div>
                  </Link>
                </li>
              </>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
