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
      <a className="sidebar__logo" href="./index.html"></a>
      <div className="sidebar__title">Database Table</div>
      <div className="sidebar__projects">
        <ul className="sidebar__project-list">
          {projects &&
            projects.map((project) => (
              <li key={project.id}>
                <Link to={`/table/${project.id}`} className="sidebar__project">
                  {project.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
