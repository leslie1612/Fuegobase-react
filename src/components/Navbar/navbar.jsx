import React from "react";
const navbar = () => {
  const [projects, setProjects] = React.useState([]);
  React.useEffect(() => {
    api.getProjects().then((json) => {
      setProjects(json.data);
    });
  }, []);

  return (
    <div className="navbar">
      <a className="navbar__logo" href="./index.html"></a>
      <div className="navbar__title">PROJECTS</div>
      <div className="navbar__projects">
        {projects.map((project, index) => (
          <a
            className="navbar__project"
            key={project.id}
            href={`./table.html?id=${project.id}&apikey=${project.apiKey}`}
          >
            {project.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default navbar;
