import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "./root.css";

const Root = () => {
  const { token, loading } = useContext(AuthContext);
  const [opened, setOpened] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [reloadProjects, setReloadProjects] = useState(false);

  React.useEffect(() => {
    api.getProjects(token).then((json) => {
      setProjects(json.data);
    });
  }, [reloadProjects]);

  const addNewProject = () => {
    console.log(projectName);
    if (projectName === "") {
      alert("Can't be empty");
    }
    const data = {
      userId: 1,
      name: projectName,
    };
    api.addNewProject(data).then((status) => {
      if (status === 201) {
        setReloadProjects(!reloadProjects);
        setProjectName("");
        setOpened(false);
      } else if (status === 400) {
        alert("Project name is already used.");
      }
    });
  };

  const cancel = () => {
    setOpened(false);
    setProjectName("");
  };

  const deleteProject = (project) => {
    if (confirm(`Delete project ${project.name} ?`)) {
      api.deleteProject(project.id, project.apikey).then((status) => {
        if (status === 204) {
          setReloadProjects(!reloadProjects);
        }
      });
    }
  };

  return (
    <div className="container">
      <Card onClick={() => setOpened(true)}>
        <Card.Body>
          <Card.Title>+ Add Project</Card.Title>
        </Card.Body>
      </Card>
      {opened && (
        <>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <button onClick={() => addNewProject()}>submit</button>
          <button onClick={() => cancel()}>cancel</button>
        </>
      )}

      {projects.map((project) => (
        <Card key={project.id}>
          <Card.Body>
            <Card.Link
              href={`./table?id=${project.id}&apikey=${project.apikey}`}
            >
              <Card.Title>{project.name}</Card.Title>
            </Card.Link>
          </Card.Body>
          <Button
            variant="outline-danger"
            onClick={() => deleteProject(project)}
          >
            X
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default Root;
