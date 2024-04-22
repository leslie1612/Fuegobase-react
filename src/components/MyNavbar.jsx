import React from "react";

const MyNavbar = () => {
  const [projects, setProjects] = React.useState([]);
  React.useEffect(() => {
    api.getProjects().then((json) => {
      setProjects(json.data);
    });
  }, []);
  return (
    <>
      <h1>This is Navbar</h1>
      <div className="navbarrr">
        <a className="navbarrr__logo" href="./index.html"></a>
        <div className="navbarrr__title">PROJECTS</div>
        <div className="navbarrr__projects">
          {projects.map((project, index) => (
            <a
              className="navbarrr__project"
              key={project.id}
              href={`./table?id=${project.id}&apikey=${project.apikey}`}
            >
              {project.name}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyNavbar;
