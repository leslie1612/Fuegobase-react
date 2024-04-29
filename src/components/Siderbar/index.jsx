import React, { useContext } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../utils/api";
import "./sidebar.css";

const Sidebar = () => {
  const { token } = useContext(AuthContext);
  const [projects, setProjects] = React.useState([]);
  React.useEffect(() => {
    API.getProjects(token).then((json) => {
      setProjects(json.data);
    });
  }, []);
  return (
    <div className="sidebar">
      <div className="sidebar__title">Fuegobase</div>
      <a href="/projects">
        <div className="sidebar__logo"></div>
      </a>
      <div className="sidebar__project__title">Database Table</div>
      <div className="sidebar__projects">
        <ul className="sidebar__project-list">
          {projects &&
            projects.map((project) => (
              <li key={project.id}>
                <Link
                  to={`/table/${project.id}`}
                  className="sidebar__project__link"
                >
                  <div className="sidebar__project"> {project.name}</div>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
