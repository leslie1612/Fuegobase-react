import React, { useContext } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Nav from "react-bootstrap/Nav";
import API from "../../utils/api";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import InfoIcon from "@mui/icons-material/Info";
import AssessmentIcon from "@mui/icons-material/Assessment";
import "./sidebar.css";

const Sidebar = () => {
  const { token } = useContext(AuthContext);
  const { projectId } = useParams();
  const [projects, setProjects] = React.useState([]);
  const [selectedProjectId, setSelectedProjectId] = React.useState("");
  const location = useLocation();
  const path = location.pathname;
  const pathParts = path.split("/");
  const currentRoute = pathParts[1];

  React.useEffect(() => {
    API.getProjects(token).then((json) => {
      setProjects(json.data);
    });
  }, []);

  React.useEffect(() => {
    setSelectedProjectId(projectId);
  }, [projectId]);

  return (
    <div className="sidebar">
      <Link to="/projects">
        <img
          className="sidebar_logo"
          src="/database256.png"
          alt="database-logo"
        />
      </Link>
      <div className="sidebar__project__title">Projects</div>
      <div className="sidebar__projects">
        <FormControl
          sx={{ minWidth: 250, display: "flex", justifyContent: "center" }}
        >
          <Select
            value={projectId}
            displayEmpty
            size="small"
            sx={{
              margin: "10px 25px",
              minWidth: 200,
              display: "block",
              backgroundColor: "#F8F9FA",
            }}
          >
            <MenuItem value="" disabled>
              Select project
            </MenuItem>
            {projects &&
              projects.map((project) => (
                <MenuItem
                  value={project.id}
                  key={project.id}
                  className={
                    project.id == projectId ? "sidebar_project_selected" : ""
                  }
                >
                  <Link
                    to={`/${currentRoute}/${project.id}`}
                    className="sidebar__project__link"
                  >
                    <div className="sidebar__project"> {project.name}</div>
                  </Link>
                </MenuItem>
              ))}
          </Select>
          {/* <FormHelperText>Without label</FormHelperText> */}
        </FormControl>

        <hr class="sidebar_divider" />

        <div style={{ display: projectId ? "block" : "none" }}>
          <Nav.Item className="header__item">
            <Nav.Link
              as={Link}
              to={`/database/${projectId}`}
              className="header__link"
            >
              <StorageRoundedIcon sx={{ fontSize: 30, margin: "5px auto" }} />
              <span className="header_item_name">Database</span>
            </Nav.Link>
          </Nav.Item>

          <Nav.Item className="header__item">
            <Nav.Link
              as={Link}
              to={`/query/${projectId}`}
              className="header__link"
            >
              <FindInPageIcon sx={{ fontSize: 30, margin: "5px auto" }} />
              <span className="header_item_name">Query</span>
            </Nav.Link>
          </Nav.Item>

          <Nav.Item className="header__item">
            <Nav.Link
              as={Link}
              to={`/details/${projectId}`}
              className="header__link"
            >
              <InfoIcon sx={{ fontSize: 30, margin: "5px auto" }} />
              <span className="header_item_name">Details</span>
            </Nav.Link>
          </Nav.Item>

          <Nav.Item className="header__item">
            <Nav.Link
              as={Link}
              to={`/usage/${projectId}`}
              className="header__link"
            >
              <AssessmentIcon sx={{ fontSize: 30, margin: "5px auto" }} />
              <span className="header_item_name">Usage</span>
            </Nav.Link>
          </Nav.Item>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
