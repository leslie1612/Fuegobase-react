import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import API from "../../utils/api";
import AddIcon from "@mui/icons-material/Add";
import "./projects.css";

const Projects = () => {
  const { token } = useContext(AuthContext);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [reloadProjects, setReloadProjects] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  React.useEffect(() => {
    API.getProjects(token).then((json) => {
      setProjects(json.data);
    });
  }, [reloadProjects]);
  React.useEffect(() => {
    API.getProjects(token).then((json) => {
      setProjects(json.data);
    });
  }, []);

  const openInput = () => {
    setIsInputOpen(true);
    setShowOverlay(true);
    console.log(showOverlay);
  };

  const closeInput = () => {
    setIsInputOpen(false);
    setProjectName("");
    setShowOverlay(false);
  };

  const addNewProject = () => {
    console.log(projectName);
    if (projectName === "") {
      alert("Project name can't be empty.");
      return;
    }
    const data = {
      name: projectName,
    };
    API.addNewProject(data, token).then((status) => {
      if (status === 201) {
        setReloadProjects(!reloadProjects);
        setProjectName("");
        closeInput();
      } else if (status === 400) {
        alert("Project name is already used.");
      }
    });
  };

  return (
    <>
      {showOverlay && (
        <div className="overlay" onClick={() => closeInput()}></div>
      )}
      <div className="project__layout">
        <div className="project__header__container">
          <Link to="/projects" className="project_header_link">
            {/* <img
              className="project_logo"
              src="/public/database256.png"
              alt="database-logo"
            /> */}
            <div className="project_header_name">Fuegobase</div>
          </Link>
        </div>

        <div className="project_title">Your Fuegobase projects </div>

        <div className="project_container">
          <div
            className={`project_input_container ${
              isInputOpen ? "project__popup" : ""
            }`}
            style={{ display: isInputOpen ? "block" : "none" }}
          >
            <h3 className="project_input_title">Start a new project</h3>
            <Box
              sx={{
                width: 800,
                maxWidth: "100%",
              }}
            >
              <TextField
                fullWidth
                label="Enter your project name"
                size="small"
                id="fullWidth"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                inputProps={{
                  maxLength: 20,
                  style: {
                    padding: "10px",
                    fontSize: "20px",
                  },
                }}
              />
            </Box>
            <Button
              onClick={() => closeInput()}
              variant="contained"
              color="cancel"
              sx={{ margin: "10px 0 0 570px" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => addNewProject()}
              variant="contained"
              sx={{ margin: "10px 0 0 10px" }}
            >
              Submit
            </Button>
          </div>

          <div className="project_component_container">
            <div className="ag-courses_item ">
              <div className="ag-courses-item_link" onClick={() => openInput()}>
                <div
                  className="ag-courses-item_bg"
                  style={{ backgroundColor: "#7d7d7d" }}
                ></div>
                <div className="ag-courses-item_title project_title_add">
                  <AddIcon
                    sx={{ fontSize: 30, stroke: "black", strokeWidth: 1 }}
                  />
                  <span> Add Project</span>
                </div>
                <div className="ag-courses-item_date-box">
                  <span className="ag-courses-item_date">
                    <br />
                    <br />
                  </span>
                </div>
              </div>
            </div>
          </div>
          {projects &&
            projects.map((project) => (
              <>
                <div className="project_componen_container">
                  <div class="ag-courses_item">
                    <Link
                      to={`/projects/database/${project.hashId}`}
                      class="ag-courses-item_link"
                    >
                      <div class="ag-courses-item_bg"></div>
                      <div class="ag-courses-item_title">{project.name}</div>
                      <div class="ag-courses-item_date-box">
                        Project ID :
                        <span class="ag-courses-item_date">
                          {project.hashId}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </>
            ))}
        </div>
        <img className="project_cloud" src="/cloud.gif" />
      </div>
    </>
  );
};

export default Projects;
