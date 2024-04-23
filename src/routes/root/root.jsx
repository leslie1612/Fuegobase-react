import React from "react";
import Card from "react-bootstrap/Card";
import "./root.css";

const Root = () => {
  const [projects, setProjects] = React.useState([]);
  React.useEffect(() => {
    api.getProjects().then((json) => {
      setProjects(json.data);
    });
  }, []);

  return (
    <div className="container">
      {projects.map((project, index) => (
        <Card>
          <Card.Body>
            <Card.Title className="navbar__title" key={project.id}>
              {project.name}
            </Card.Title>
            <Card.Link
              href={`./table?id=${project.id}&apikey=${project.apikey}`}
            >
              Go to project
            </Card.Link>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Root;
