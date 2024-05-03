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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
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
  const [operator, setOperator] = useState("EQUAL");

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
    setOperator("EQUAL");
    setOpened(false);
    setQueryPath("");
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

  const handleOperatorChange = (value) => {
    setOperator(value);
  };

  const queryData = () => {
    console.log(
      selectedCollection,
      fieldKeyInputValue,
      valueInputValue,
      fieldType,
      operator
    );
    if (
      selectedCollection == "" ||
      fieldKeyInputValue == "" ||
      valueInputValue == "" ||
      fieldType == "none" ||
      operator == ""
    ) {
      alert("Every field must be required.");
    } else {
      API.getDataByFilter(
        projectId,
        selectedCollection,
        fieldKeyInputValue,
        valueInputValue,
        fieldType,
        operator,
        token
      ).then((json) => {
        if (json.data.length > 0) {
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
      <Layout>
        <Container className="query_container">
          <h2 className="query_builder_title">Query Builder</h2>
          {opened && (
            <Row className="query_row">
              <Form.Group as={Col} md={2} className="query_col">
                Query Path :
              </Form.Group>
              <Form.Group as={Col} className="query_col">
                {queryPath}
              </Form.Group>
              <Form.Group>
                <ContentCopyIcon
                  className="setting_copy_icon"
                  sx={{ fontSize: 30 }}
                  onClick={() => handleCopyClick(queryPath)}
                />
              </Form.Group>
            </Row>
          )}

          <Row className="query_row ">
            <Form.Group as={Col} className="query_col statement">
              Collection:
            </Form.Group>
            <Form.Group as={Col} className="query_col">
              <Form.Control
                className="query__collection"
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

          <Row className="query_row">
            <Form.Group as={Col} className="query_col  statement"></Form.Group>
            <Form.Group as={Col} className="query_col  statement">
              Field key
            </Form.Group>
            <Form.Group as={Col} sm={1} className="query_col  statement">
              Operator
            </Form.Group>
            <Form.Group as={Col} className="query_col  statement">
              Value Type
            </Form.Group>
            <Form.Group as={Col} className="query_col  statement">
              Value
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

            <Col sm={2} className="query_col statement">
              <Form.Control
                as="select"
                value={operator || "EQUAL"}
                onChange={(e) => handleOperatorChange(e.target.value)}
              >
                <option value="EQUAL"> == </option>
                <option value="GREATER_THAN"> &gt; </option>
                <option value="LESS_THAN"> &lt; </option>
                <option value="GREATER_THAN_OR_EQUAL"> &gt;= </option>
                <option value="LESS_THAN_OR_EQUAL"> &lt;= </option>
                <option value="CONTAINS">array_contains</option>
              </Form.Control>
            </Col>

            <Col className="query_col">
              <Form.Control
                as="select"
                value={fieldType || "none"}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="none" disabled></option>
                <option value="String">String</option>
                <option value="Number">Number</option>
                <option value="Boolean">Boolean</option>
              </Form.Control>
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
        </Container>

        <Container className="query_container">
          <h2 className="query_builder_title">Query Result</h2>
          <Table bordered hover className="query_table">
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
