import React from "react";
// import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";

const MyNavbar = () => {
  const [projects, setProjects] = React.useState([]);
  React.useEffect(() => {
    api.getProjects().then((json) => {
      setProjects(json.data);
    });
  }, []);
  return (
    // <Nav className="flex-column">
    //   {projects.map((project, index) => (
    //     <Nav.Link
    //       as={Link}
    //       to={`./table?id=${project.id}&apikey=${project.apikey}`}
    //       key={project.id}
    //     >
    //       {project.name}
    //     </Nav.Link>
    //   ))}
    // </Nav>
    <>
      <div className="navbarrr">
        <a className="navbarrr__logo" href="./index.html"></a>
        <div className="navbarrr__title">PROJECTS</div>
        <div className="navbarrr__projects">
          <ul>
            {projects.map((project, index) => (
              <li>
                <a
                  className="navbarrr__project"
                  key={project.id}
                  href={`./table?id=${project.id}&apikey=${project.apikey}`}
                >
                  {project.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MyNavbar;
