import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Layout from "../../components/Layout";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import "./query.css";

const QueryIndex = () => {
  const { token } = useContext(AuthContext);
  const { projectId } = useParams();
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [fieldKeyInputValue, setFieldKeyInputValue] = useState("");
  const [valueInputValue, setValueInputValue] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [documentData, setDocumentData] = useState([]);
  const [opened, setOpened] = useState(false);
  const [queryPath, setQueryPath] = useState("");

  React.useEffect(() => {
    if (projectId) {
      api.getCollections(projectId, token).then((json) => {
        setCollections(json.data);
      });
    }
  }, [projectId]);

  const handleCollectionChange = (value) => {
    setSelectedCollection(value);
  };

  const clearInput = () => {
    setFieldKeyInputValue("");
    setValueInputValue("");
    setFieldType("none");
    setSelectedCollection("");
    setDocumentData([]);
  };

  const handleFieldKeyChange = (value) => {
    setFieldKeyInputValue(value);
  };

  const handleValueInputChange = (value) => {
    setValueInputValue(value);
  };

  const handleTypeChange = (value) => {
    setFieldType(value);
  };

  const queryData = () => {
    if (
      selectedCollection == "" ||
      fieldKeyInputValue == "" ||
      valueInputValue == "" ||
      fieldType == "none"
    ) {
      alert("Every field must be required.");
    } else {
      api
        .getDataByFilter(
          projectId,
          selectedCollection,
          fieldKeyInputValue,
          valueInputValue,
          fieldType,
          token
        )
        .then((json) => {
          if (json.data.length > 0) {
            console.log(JSON.stringify(json.data));
            setDocumentData(json.data);
            setOpened(true);
            setQueryPath(
              `http://localhost:8080/api/v1/databases/projects/${projectId}/collections/${selectedCollection}?filter=${fieldKeyInputValue}&value=${valueInputValue}&type=${fieldType}`
            );
          } else {
            setDocumentData([-1]);
          }
        });
    }
    clearInput();
  };

  const handleFieldValue = (field) => {
    let result;
    switch (field.type) {
      case "String":
      case "Number":
      case "Boolean":
        console.log("single");
        return field.valueInfo[0].value;
      case "Array":
        console.log("Array");
        result = field.valueInfo.map((value) => value.value);
        return `[ ${result.join(", ")} ]`;
      case "Map":
        result = field.valueInfo.map((value) => `${value.key}: ${value.value}`);
        return `{ ${result.join(", ")} }`;
    }
  };

  return (
    <>
      <Layout>
        <Container>
          {opened && (
            <Row>
              <Col>Query Path : </Col>
              <Col>{queryPath}</Col>
            </Row>
          )}

          <Row>
            <Col>Collection: </Col>
            <Col>
              <Form.Select
                aria-label="Select number"
                value={selectedCollection || "none"}
                onChange={(e) => {
                  handleCollectionChange(e.target.value);
                }}
              >
                <option value="none" disabled defaultValue>
                  choose a collection name
                </option>
                {collections &&
                  collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col sm></Col>
            <Col sm>Field key : </Col>
            <Col sm></Col>
            <Col sm>Value</Col>
            <Col sm>Type</Col>
          </Row>
          <Row>
            <Col sm>WHERE</Col>
            <Col sm>
              <input
                type="text"
                value={fieldKeyInputValue}
                onChange={(e) => {
                  handleFieldKeyChange(e.target.value);
                }}
              />
            </Col>
            <Col sm>==</Col>
            <Col sm>
              <input
                type="text"
                value={valueInputValue}
                onChange={(e) => {
                  handleValueInputChange(e.target.value);
                }}
              />
            </Col>
            <Col sm>
              <Form.Select
                value={fieldType || "none"}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="none" disabled>
                  --select--
                </option>
                <option value="String">String</option>
                <option value="Number">Number</option>
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col sm={5}></Col>
            <Col sm={4}></Col>
            <Col sm={1}>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  clearInput();
                }}
              >
                Clear
              </Button>
            </Col>
            <Col sm={1}>
              <Button
                variant="outline-primary"
                onClick={() => {
                  queryData();
                }}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Container>

        <div>
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th scope="col">Document ID </th>
                <th scope="col">Document Name</th>
                <th scope="col">Field Value</th>
              </tr>
            </thead>
            <tbody>
              {documentData[0] === -1 ? (
                <tr>
                  <td colSpan="3">No data</td>
                </tr>
              ) : (
                documentData &&
                documentData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>
                      {item.fields.map((field) => (
                        <div key={field.id}>
                          <span>
                            <strong>{field.name}: </strong>
                            <span>{handleFieldValue(field)}</span>
                          </span>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Layout>
    </>
  );
};

export default QueryIndex;
