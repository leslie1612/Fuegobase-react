import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Layout from "../../components/Layout";
import Button from "react-bootstrap/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Sidebar from "../../components/Siderbar";
import API from "../../utils/api";
import "./projects.css";

const Projects = () => {
  const { token } = useContext(AuthContext);
  const [opened, setOpened] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [reloadProjects, setReloadProjects] = useState(false);

  React.useEffect(() => {
    API.getProjects(token).then((json) => {
      setProjects(json.data);
    });
  }, [reloadProjects]);

  const addNewProject = () => {
    console.log(projectName);
    if (projectName === "") {
      alert("Project name can't be empty.");
    }
    const data = {
      name: projectName,
    };
    API.addNewProject(data, token).then((status) => {
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
      API.deleteProject(project.id, token).then((status) => {
        if (status === 204) {
          setReloadProjects(!reloadProjects);
        }
      });
    }
  };

  return (
    <>
      <Layout>
        <div className="project__layout">
          <div className="project_container">
            <div className="project_add_area">
              <div className="ag-courses_item ">
                <div
                  className="ag-courses-item_link"
                  onClick={() => setOpened(!opened)}
                >
                  <div
                    className="ag-courses-item_bg"
                    style={{ backgroundColor: "#EB5E28" }}
                  ></div>
                  <div className="ag-courses-item_title">+ Add Project</div>
                  <div className="ag-courses-item_date-box">
                    <span className="ag-courses-item_date">
                      <br />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {opened && (
              <div className="project_input_container">
                <Box
                  sx={{
                    width: 600,
                    maxWidth: "100%",
                  }}
                >
                  <TextField
                    fullWidth
                    label="Project Name"
                    id="fullWidth"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </Box>
                <Button
                  onClick={() => addNewProject()}
                  className="project_add_btn project_submit"
                >
                  Submit
                </Button>
                <Button
                  onClick={() => cancel()}
                  className="project_add_btn project_cancel"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          <div className="project_container">
            {projects &&
              projects.map((project) => (
                <>
                  <div className="project_componen_container">
                    <Button
                      className="project_delete_btn"
                      variant="danger"
                      onClick={() => deleteProject(project)}
                    >
                      X
                    </Button>
                    <div class="ag-courses_item">
                      <Link
                        to={`/table/${project.id}`}
                        class="ag-courses-item_link"
                      >
                        <div class="ag-courses-item_bg"></div>
                        <div class="ag-courses-item_title">{project.name}</div>
                        <div class="ag-courses-item_date-box">
                          Project ID :
                          <span class="ag-courses-item_date">
                            {" "}
                            {project.id}
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </>
              ))}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Projects;
