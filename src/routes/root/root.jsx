import React from "react";
const Root = () => {
  const [projects, setProjects] = React.useState([]);
  React.useEffect(() => {
    api.getProjects().then((json) => {
      setProjects(json.data);
    });
  }, []);

  return (
    <>
      <div className="navbarrr">
        <a className="navbar__logo" href="./index.html"></a>
        <div className="navbar__title">PROJECTS</div>
        <div className="navbar__projects">
          {projects.map((project, index) => (
            <a
              className="navbar__project"
              key={project.id}
              href={`./table?id=${project.id}&apikey=${project.apikey}`}
            >
              <div>{project.name}</div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Root;
