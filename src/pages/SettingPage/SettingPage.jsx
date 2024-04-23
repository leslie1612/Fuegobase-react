import React, { useState, useEffect } from "react";
import MyNavbar from "../../components/MyNavbar";
import { useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Header from "../../components/Header";

const SettingPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("id");
  const apiKey = searchParams.get("apikey");
  const [domainName, setDomainName] = useState([]);
  const [domainNameInputValue, setDomainNameInputValue] = useState("");
  const [reloadPage, setReloadPage] = useState(false);

  useEffect(() => {
    if (projectId) {
      api.getDomainWhiteList(projectId).then((json) => {
        setDomainName(json.data);
      });
    }
  }, [projectId, reloadPage]);

  const handleDomainNameChange = (e) => {
    setDomainNameInputValue(e.target.value);
  };

  const addNewDomain = () => {
    const data = {
      domainName: domainNameInputValue,
    };
    api.addNewDomain(projectId, data).then((status) => {
      if (status === 201) {
        setDomainNameInputValue("");
        setReloadPage(!reloadPage);
      }
    });
  };

  const deletetDomain = (domainId) => {
    api.deleteDomain(projectId, domainId).then((status) => {
      if (status === 204) {
        setReloadPage(!reloadPage);
      }
    });
  };

  return (
    <>
      <Header />
      <div className="container setting-page">
        <Table striped className="table-container">
          <thead>
            <tr>
              <th>Project API Key : {apiKey}</th>
              <th></th>
            </tr>
          </thead>
        </Table>

        <Table striped className="table-container">
          <thead>
            <tr>
              <th>#</th>
              <th>Authorized domain</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {domainName.map((domain, index) => (
              <tr key={domain.id}>
                <td>{index + 1}</td>
                <td>{domain.domainName}</td>
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
            <tr>
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
              <td>
                <Button
                  variant="outline-primary"
                  onClick={() => addNewDomain()}
                >
                  add new domain
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default SettingPage;
