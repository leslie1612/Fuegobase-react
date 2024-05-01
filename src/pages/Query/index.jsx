import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Layout from "../../components/Layout";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useParams } from "react-router-dom";
import API from "../../utils/api";
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
      API.getCollections(projectId, token).then((json) => {
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
      API.getDataByFilter(
        projectId,
        selectedCollection,
        fieldKeyInputValue,
        valueInputValue,
        fieldType,
        token
      ).then((json) => {
        if (json.data.length > 0) {
          console.log(JSON.stringify(json.data));
          setDocumentData(json.data);
          setOpened(true);
          setQueryPath(
            `https://fuegobase.store/api/v1/databases/projects/${projectId}/collections/${selectedCollection}?filter=${fieldKeyInputValue}&value=${valueInputValue}&type=${fieldType}`
          );
          console.log("success", queryPath);
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
        return `"${field.valueInfo[0].value}"`;
      case "Number":
      case "Boolean":
        return field.valueInfo[0].value;
      case "Array":
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
        <Container className="query_container">
          {opened && (
            <Row className="query_row">
              <Form.Group as={Col} md={2} className="query_col">
                Query Path :
              </Form.Group>
              <Form.Group as={Col} className="query_col">
                {queryPath}
              </Form.Group>
            </Row>
          )}

          <Row className="query_row ">
            <Form.Group as={Col} className="query_col statement">
              Collection:
            </Form.Group>
            <Form.Group as={Col} className="query_col">
              <Form.Control
                as="select"
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
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} sm={1} className="query_col"></Form.Group>
            <Form.Group as={Col} className="query_col"></Form.Group>
            <Form.Group as={Col} className="query_col"></Form.Group>
          </Row>

          {/* <Row className="query_row">
            <Form.Group as={Col} className="query_col">
              <Form.Label></Form.Label>
              <Form.Label>WHERE</Form.Label>
            </Form.Group>

            <Form.Group as={Col} className="query_col">
              <Form.Label>Field key</Form.Label>
              <Form.Control
                type="text"
                value={fieldKeyInputValue}
                onChange={(e) => {
                  handleFieldKeyChange(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group as={Col} className="query_col">
              <Form.Label></Form.Label>
              <Form.Label>==</Form.Label>
            </Form.Group>

            <Form.Group as={Col} className="query_col">
              <Form.Label> Value</Form.Label>
              <Form.Control
                type="text"
                value={valueInputValue}
                onChange={(e) => {
                  handleValueInputChange(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group as={Col} className="query_col">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                value={fieldType || "none"}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="none" disabled>
                  --select--
                </option>
                <option value="String">String</option>
                <option value="Number">Number</option>
              </Form.Control>
            </Form.Group>
          </Row> */}

          <Row className="query_row">
            <Form.Group as={Col} className="query_col  statement"></Form.Group>
            <Form.Group as={Col} className="query_col  statement">
              Field key
            </Form.Group>
            <Form.Group
              as={Col}
              sm={1}
              className="query_col  statement"
            ></Form.Group>
            <Form.Group as={Col} className="query_col  statement">
              Value
            </Form.Group>
            <Form.Group as={Col} className="query_col  statement">
              Type
            </Form.Group>
          </Row>

          <Row className="query_row">
            <Col className="query_col statement">WHERE</Col>
            <Col className="query_col">
              <Form.Control
                type="text"
                value={fieldKeyInputValue}
                onChange={(e) => {
                  handleFieldKeyChange(e.target.value);
                }}
              />
            </Col>
            <Col sm={1} className="query_col statement">
              ==
            </Col>
            <Col className="query_col">
              <Form.Control
                type="text"
                value={valueInputValue}
                onChange={(e) => {
                  handleValueInputChange(e.target.value);
                }}
              />
            </Col>
            <Col className="query_col">
              <Form.Control
                as="select"
                value={fieldType || "none"}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="none" disabled>
                  --select--
                </option>
                <option value="String">String</option>
                <option value="Number">Number</option>
              </Form.Control>
            </Col>
          </Row>

          <Row className="query_row">
            <Col className="query_col query_btn_group">
              <Button
                className="project_submit query_btn"
                onClick={() => {
                  queryData();
                }}
              >
                Submit
              </Button>

              <Button
                className="project_cancel query_btn"
                onClick={() => {
                  clearInput();
                }}
              >
                Clear
              </Button>
            </Col>
          </Row>

          <Table bordered hover className="table">
            <thead className="thead-light">
              <tr>
                <th className="query_table_head">Document ID </th>
                <th className="query_table_head">Document Name</th>
                <th className="query_table_head">Field Value</th>
              </tr>
            </thead>
            <tbody>
              {documentData[0] === -1 ? (
                <tr>
                  <td colSpan="3" className="query_no_data">
                    No data
                  </td>
                </tr>
              ) : (
                documentData &&
                documentData.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="query_field_value_data"> {item.id}</div>
                    </td>
                    <td>
                      <div className="query_field_value_data">{item.name}</div>
                    </td>
                    <td>
                      {item.fields.map((field) => (
                        <div key={field.id}>
                          <div className="query_field_value_data">
                            <span>{field.name} : </span>
                            <span>{handleFieldValue(field)}</span>
                          </div>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Container>
      </Layout>
    </>
  );
};

export default QueryIndex;
