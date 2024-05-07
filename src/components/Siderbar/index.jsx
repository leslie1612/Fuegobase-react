import React, { useContext } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Nav from "react-bootstrap/Nav";
import API from "../../utils/api";
import MenuItem from "@mui/material/MenuItem";
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
  const [selectedRoute, setSelectedRoute] = React.useState("");
  const location = useLocation();
  const path = location.pathname;
  const pathParts = path.split("/");
  const currentRoute = pathParts[1];

  React.useEffect(() => {
    API.getProjects(token).then((json) => {
      setProjects(json.data);
      setSelectedRoute(currentRoute);
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
          sx={{
            minWidth: 250,
          }}
        >
          <Select
            value={projectId}
            displayEmpty
            size="small"
            sx={{
              margin: "10px 10px",
              maxWidth: 230,
              display: "block",
              backgroundColor: "#F8F9FA",
              textOverflow: "ellipsis",
              fontSize: 15,
            }}
          >
            <MenuItem
              sx={{
                fontSize: 15,
              }}
              value=""
              disabled
            >
              Select project
            </MenuItem>
            {projects &&
              projects.map((project) => (
                <MenuItem
                  sx={{
                    fontSize: 15,
                    whiteSpace: "unset",
                    wordBreak: "break-all",
                  }}
                  value={project.hashId}
                  key={project.hashId}
                  className={
                    project.hashId == projectId
                      ? "sidebar_project_selected"
                      : ""
                  }
                >
                  <Link
                    to={`/${currentRoute}/${project.hashId}`}
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

        <Nav.Item
          className={`header__item ${
            selectedRoute == "database" ? "sidebar_selected " : ""
          }`}
        >
          <Nav.Link
            as={Link}
            to={`/database/${projectId}`}
            className="header__link"
          >
            <StorageRoundedIcon sx={{ fontSize: 30, margin: "5px auto" }} />
            <span className="header_item_name">Database</span>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item
          className={`header__item ${
            selectedRoute == "query" ? "sidebar_selected " : ""
          }`}
        >
          <Nav.Link
            as={Link}
            to={`/query/${projectId}`}
            className="header__link"
          >
            <FindInPageIcon sx={{ fontSize: 30, margin: "5px auto" }} />
            <span className="header_item_name">Query</span>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item
          className={`header__item ${
            selectedRoute == "details" ? "sidebar_selected " : ""
          }`}
        >
          <Nav.Link
            as={Link}
            to={`/details/${projectId}`}
            className="header__link"
          >
            <InfoIcon sx={{ fontSize: 30, margin: "5px auto" }} />
            <span className="header_item_name">Details</span>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item
          className={`header__item ${
            selectedRoute == "usage" ? "sidebar_selected " : ""
          }`}
        >
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
  );
};

export default Sidebar;
