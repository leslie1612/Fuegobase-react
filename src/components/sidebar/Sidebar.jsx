import React from "react";
import "./sidebar.css";

const Sidebar = () => {
  const [projects, setProjects] = React.useState([]);
  React.useEffect(() => {
    api.getProjects().then((json) => {
      setProjects(json.data);
    });
  }, []);
  return (
    <div className="sidebar">
      <a className="sidebar__logo" href="./index.html"></a>
      <div className="sidebar__title">PROJECTS</div>
      <div className="sidebar__projects">
        <ul className="sidebar__project-list">
          {projects.map((project, index) => (
            <li key={project.id}>
              <a
                className="sidebar__project"
                href={`./table?id=${project.id}&apikey=${project.apikey}`}
              >
                {project.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
