import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Table from "react-bootstrap/Table";
import API from "../../utils/api";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import Layout from "../../components/Layout";
import "./settingPage.css";

const SettingPage = () => {
  const { token } = useContext(AuthContext);
  const [apiKey, setApiKey] = useState("");
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState("");
  const [domainName, setDomainName] = useState([]);
  const [domainNameInputValue, setDomainNameInputValue] = useState("");
  const [reloadPage, setReloadPage] = useState(false);
  const [addingNewDomain, setAddingNewDomain] = useState(false);
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (projectId) {
      API.getDomainWhiteList(projectId).then((json) => {
        setProjectName(json.data.projectName);
        setDomainName(json.data.domain);
        setApiKey(json.data.apiKey);
      });
    }
  }, [projectId, reloadPage]);

  useEffect(() => {
    if (projectId) {
      API.getDomainWhiteList(projectId).then((json) => {
        setProjectName(json.data.projectName);
        setDomainName(json.data.domain);
        setApiKey(json.data.apiKey);
      });
    }
  }, []);

  const handleDomainNameChange = (e) => {
    setDomainNameInputValue(e.target.value);
  };

  const handleDomainAdding = () => {
    setDomainNameInputValue("");
    setAddingNewDomain(!addingNewDomain);
    setShowOverlay(true);
  };

  const addNewDomain = () => {
    if (domainNameInputValue === "") {
      alert("Domain can't be empty.");
      return;
    }
    const data = {
      domainName: domainNameInputValue,
    };
    API.addNewDomain(projectId, data).then((status) => {
      if (status === 201) {
        setDomainNameInputValue("");
        setAddingNewDomain(!addingNewDomain);
        setShowOverlay(false);
        setReloadPage(!reloadPage);
      }
    });
  };

  const deletetDomain = (domain) => {
    if (confirm(`Delete domain ${domain.domainName} ?`)) {
      API.deleteDomain(projectId, domain.id).then((status) => {
        if (status === 204) {
          setReloadPage(!reloadPage);
        }
      });
    }
  };

  const handleCopyClick = async (apiKey) => {
    try {
      await navigator.clipboard.writeText(apiKey);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Unable to copy to clipboard.", err);
      alert("Copy to clipboard failed.");
    }
  };

  const deleteProject = (project) => {
    if (confirm(`Delete project ${projectName} ?`)) {
      API.deleteProject(projectId, token).then((status) => {
        if (status === 204) {
          navigate("/projects");
        } else {
          alert("Fail to delete project, please try again");
        }
      });
    }
  };

  const closeInput = () => {
    setDomainNameInputValue("");
    setAddingNewDomain(!addingNewDomain);
    setShowOverlay(false);
  };

  return (
    <>
      {showOverlay && (
        <div className="overlay" onClick={() => closeInput()}></div>
      )}
      <Layout>
        <div className="setting_page_container">
          <h1 className="setting_title">Project Details</h1>
          <div className="setting_details_group">
            <Table>
              <tbody>
                <tr>
                  <td className="setting_details_item_title">Project name </td>
                  <td className="setting_details_item_value">{projectName}</td>
                  <td style={{ textAlign: "right" }}>
                    <IconButton
                      color="secondary"
                      sx={{
                        fontSize: 20,
                        padding: "0 8px",
                        "&:hover": {
                          color: "primary.dark",
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      sx={{
                        fontSize: 20,
                        padding: "0 8px",
                        "&:hover": {
                          color: "primary.dark",
                        },
                      }}
                      onClick={() => deleteProject()}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
                <tr>
                  <td className="setting_details_item_title">Project ID </td>
                  <td className="setting_details_item_value">{projectId}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="setting_details_item_title">API Key </td>
                  <td className="setting_details_item_value">
                    {apiKey}
                    <IconButton
                      color="secondary"
                      className="setting_copy_icon"
                      sx={{
                        padding: "0 8px",
                        "&:hover": {
                          color: "primary.dark",
                        },
                      }}
                      onClick={() => handleCopyClick(apiKey)}
                    >
                      <ContentCopyIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <IconButton
                      color="secondary"
                      sx={{
                        fontSize: 20,
                        padding: "0 8px",
                        "&:hover": {
                          color: "primary.dark",
                        },
                      }}
                    >
                      <AutorenewIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      sx={{
                        fontSize: 20,
                        padding: "0px 8px",
                        "&:hover": {
                          color: "primary.dark",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          <h1 className="setting_title">Authorized domain</h1>
          {/* <div style={{ textAlign: "right" }}> */}
          <div>
            <Button
              size="small"
              variant="contained"
              onClick={() => handleDomainAdding()}
              color="primary"
              sx={{ margin: "0px 0px 20px 0" }}
            >
              <AddIcon /> add domain
            </Button>
          </div>

          <Table striped hover bordered className="setting_table_container">
            <thead>
              <tr>
                <th className="setting_details_item_title">#</th>
                <th className="setting_details_item_title">
                  Authorized domain
                </th>
                <th className="setting_details_item_title">Type</th>
                <th className="setting_details_item_title"></th>
              </tr>
            </thead>
            <tbody>
              {domainName &&
                domainName.map((domain, index) => (
                  <tr key={domain.id}>
                    <td className="setting_details_domain_value">
                      {index + 1}
                    </td>
                    <td className="setting_details_domain_value">
                      {domain.domainName}
                    </td>
                    <td className="setting_details_domain_value">
                      {domain.type}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <IconButton
                        color="secondary"
                        sx={{
                          fontSize: 20,
                          padding: "0 8px",
                          "&:hover": {
                            color: "primary.dark",
                          },
                        }}
                        onClick={() => {
                          deletetDomain(domain);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>

          <div
            className={`${addingNewDomain ? "setting_popup " : ""}`}
            style={{
              display: addingNewDomain ? "block" : "none",
            }}
          >
            <h3 className="project_input_title">Add a new domain</h3>
            <Box
              sx={{
                width: 800,
                maxWidth: "100%",
              }}
            >
              <TextField
                fullWidth
                label="Domain"
                size="small"
                id="fullWidth"
                value={domainNameInputValue}
                onChange={(e) => {
                  handleDomainNameChange(e);
                }}
                inputProps={{
                  maxLength: 100,
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
              onClick={() => addNewDomain()}
              variant="contained"
              sx={{ margin: "10px 0 0 10px" }}
            >
              Submit
            </Button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SettingPage;
