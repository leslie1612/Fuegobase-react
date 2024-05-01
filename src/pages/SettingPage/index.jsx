import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Layout from "../../components/Layout";
import API from "../../utils/api";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import "./settingPage.css";

const SettingPage = () => {
  const [apiKey, setApiKey] = useState("");
  const { projectId } = useParams();
  const [domainName, setDomainName] = useState([]);
  const [domainNameInputValue, setDomainNameInputValue] = useState("");
  const [reloadPage, setReloadPage] = useState(false);
  const [addingNewDomain, setAddingNewDomain] = useState(false);

  useEffect(() => {
    if (projectId) {
      API.getDomainWhiteList(projectId).then((json) => {
        setDomainName(json.data.domain);
        setApiKey(json.data.apiKey);
      });
    }
  }, [projectId, reloadPage]);

  useEffect(() => {
    if (projectId) {
      API.getDomainWhiteList(projectId).then((json) => {
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
  };

  const addNewDomain = () => {
    const data = {
      domainName: domainNameInputValue,
    };
    API.addNewDomain(projectId, data).then((status) => {
      if (status === 201) {
        setDomainNameInputValue("");
        setReloadPage(!reloadPage);
      }
    });
  };

  const deletetDomain = (domainId) => {
    API.deleteDomain(projectId, domainId).then((status) => {
      if (status === 204) {
        setReloadPage(!reloadPage);
      }
    });
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

  return (
    <>
      <div className="container setting_page">
        <h1 className="setting_title">Settings</h1>
        <div className="setting_key_group">
          <div className="setting_key_title">Project API Key : {apiKey}</div>

          <ContentCopyIcon
            className="setting_copy_icon"
            sx={{ fontSize: 30 }}
            onClick={() => handleCopyClick(apiKey)}
          />
        </div>

        {/* <Table striped bordered hover className="setting_table_container">
            <thead>
              <tr>
                <th className="setting_key_title">
                Project API Key : {apiKey}
                </th>
                <th>
                  <ContentCopyIcon
                    className="setting_copy_icon"
                    sx={{ fontSize: 30 }}
                    onClick={() => handleCopyClick(apiKey)}
                  />
                </th>
              </tr>
            </thead>
          </Table> */}

        {/* <input
            className="database__add__input"
            type="text"
            value={renameCollectionInputValue}
            onChange={(e) => setRenameCollectionInputValue(e.target.value)}
          /> */}

        <div
          className={`${addingNewDomain ? "popup" : ""}`}
          style={{
            display: addingNewDomain ? "block" : "none",
          }}
        >
          <input
            type="text"
            placeholder="Enter new domain"
            value={domainNameInputValue}
            onChange={(e) => {
              handleDomainNameChange(e);
            }}
          />
          <Button
            className="database__submit__btn"
            onClick={() => addNewDomain()}
          >
            submit
          </Button>
          <Button
            className="database__delete__btn"
            onClick={() => handleDomainAdding()}
          >
            cancel
          </Button>
        </div>

        <Button
          className="setting_add_new_button"
          variant="outline-primary"
          onClick={() => handleDomainAdding()}
        >
          + add new domain
        </Button>

        <Table striped bordered hover className="setting_table_container">
          <thead>
            <tr>
              <th>#</th>
              <th>Authorized domain</th>
              <th>Type</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {domainName &&
              domainName.map((domain, index) => (
                <tr key={domain.id}>
                  <td>{index + 1}</td>
                  <td>{domain.domainName}</td>
                  <td>Default</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        deletetDomain(domain.id);
                      }}
                    >
                      X
                    </Button>
                  </td>
                </tr>
              ))}
            {/* <tr>
                <td></td>
                <td>
                  <input
                    type="text"
                    placeholder="Enter new domain"
                    value={domainNameInputValue}
                    onChange={(e) => {
                      handleDomainNameChange(e);
                    }}
                  />
                </td>
                <td></td>
              </tr> */}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default SettingPage;
