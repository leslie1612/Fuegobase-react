import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Layout from "../../components/Layout";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Table from "react-bootstrap/Table";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import { useParams } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CircularIndeterminate from "../../components/Loading";
import API from "../../utils/api";
import "./query.css";

const QueryIndex = () => {
  const { token } = useContext(AuthContext);
  const { projectId } = useParams();
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [fieldKeyInputValue, setFieldKeyInputValue] = useState("");
  const [valueInputValue, setValueInputValue] = useState("");
  const [fieldType, setFieldType] = useState("String");
  const [documentData, setDocumentData] = useState([]);
  const [opened, setOpened] = useState(false);
  const [queryPath, setQueryPath] = useState("");
  const [operator, setOperator] = useState("EQUAL");
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (projectId) {
      async function fetchData() {
        const response = await API.getCollections(projectId, token);
        const json = await response.json();
        if (response.status == 200) {
          setCollections(json.data);
        }
      }
      fetchData();
    }
  }, [projectId, token]);

  const menuItemStyle = { fontSize: 15 };

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

  const queryData = async () => {
    if (
      selectedCollection == "" ||
      fieldKeyInputValue == "" ||
      valueInputValue == "" ||
      operator == ""
    ) {
      alert("Every field must be required.");
    } else {
      setIsLoading(true);
      setOpened(false);
      setQueryPath("");

      const response = await API.getDataByFilter(
        projectId,
        selectedCollection,
        fieldKeyInputValue,
        valueInputValue,
        fieldType,
        operator,
        token
      );
      const json = await response.json();
      if (response.status == 200 && json.data.length > 0) {
        setDocumentData(json.data);
        setOpened(true);
        setQueryPath(
          `https://fuegobase.store/api/v1/databases/projects/${projectId}/collections/${selectedCollection}?filter=${fieldKeyInputValue}&value=${valueInputValue}&type=${fieldType}&operator=${operator}`
        );
        console.log("success", queryPath);
      } else {
        setDocumentData([-1]);
      }

      setIsLoading(false);
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
      <div className="query_container">
        <Container className="query_builder_container">
          <h2 className="query_builder_title">Query Builder</h2>
          {opened && (
            <Row className="query_row">
              <Col md={2} className="query_col query_statement">
                Query Path
                <IconButton
                  className="query_icon"
                  sx={{ marginLeft: 1 }}
                  onClick={() => handleCopyClick(queryPath)}
                >
                  <ContentCopyIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Col>
              <Col className="query_col query_path_outcome">{queryPath}</Col>
            </Row>
          )}

          <Row className="query_row ">
            <Col sm={2} className="query_col query_statement">
              Collection
            </Col>
            <Col sm={6} className="query_col">
              <Select
                fullWidth
                required
                value={selectedCollection || "none"}
                onChange={(e) => {
                  handleCollectionChange(e.target.value);
                }}
                displayEmpty
                size="small"
                sx={{
                  marginLeft: "auto",
                  minWidth: 200,
                  fontSize: 16,
                }}
              >
                <MenuItem value="none" disabled sx={menuItemStyle}>
                  Choose a collection name
                </MenuItem>
                {collections &&
                  collections.map((collection) => (
                    <MenuItem
                      key={collection.hashId}
                      value={collection.hashId}
                      sx={menuItemStyle}
                    >
                      {collection.name}
                    </MenuItem>
                  ))}
              </Select>
            </Col>
            {/* <Form.Group as={Col} className="query_col "></Form.Group> */}
          </Row>

          <Row className="query_row">
            <Col sm={2} className="query_col query_statement ">
              WHERE
              <Tooltip title="If you want to query the key value of a map, please use 'fieldKey.mapKey ', e.g., address.city">
                <IconButton>
                  <InfoIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </Col>

            <Col className="query_col" sm={2}>
              <TextField
                required
                fullWidth
                type="text"
                placeholder="Enter field key"
                label="field key"
                value={fieldKeyInputValue}
                onChange={(e) => {
                  handleFieldKeyChange(e.target.value);
                }}
                inputProps={{
                  style: {
                    padding: "10px",
                    fontSize: "16px",
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "16px",
                    marginTop: "-3px",
                  },
                }}
              />
            </Col>

            <Col className="query_col " sm={2}>
              <Select
                required
                value={operator || "EQUAL"}
                displayEmpty
                size="small"
                sx={{
                  marginLeft: "auto",
                  minWidth: 130,
                  width: "100%",
                  fontSize: 16,
                }}
                onChange={(e) => handleOperatorChange(e.target.value)}
              >
                <MenuItem value="EQUAL" sx={menuItemStyle}>
                  ==
                </MenuItem>
                <MenuItem value="GREATER_THAN" sx={menuItemStyle}>
                  &gt;
                </MenuItem>
                <MenuItem value="LESS_THAN" sx={menuItemStyle}>
                  &lt;
                </MenuItem>
                <MenuItem value="GREATER_THAN_OR_EQUAL" sx={menuItemStyle}>
                  &gt;=
                </MenuItem>
                <MenuItem value="LESS_THAN_OR_EQUAL" sx={menuItemStyle}>
                  &lt;=
                </MenuItem>
                <MenuItem value="CONTAINS" sx={menuItemStyle}>
                  array_contains
                </MenuItem>
              </Select>
            </Col>
            <Col className="query_col" sm={2}>
              <Select
                required
                value={fieldType || "String"}
                displayEmpty
                size="small"
                sx={{
                  minWidth: 130,
                  width: "100%",
                  fontSize: 16,
                }}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <MenuItem value="String" sx={menuItemStyle}>
                  String
                </MenuItem>
                <MenuItem value="Number" sx={menuItemStyle}>
                  Number
                </MenuItem>
                <MenuItem value="Boolean" sx={menuItemStyle}>
                  Boolean
                </MenuItem>
              </Select>
            </Col>
            <Col className="query_col" sm={4}>
              <TextField
                required
                fullWidth
                type="text"
                placeholder="Enter field value"
                label="field value"
                value={valueInputValue}
                onChange={(e) => {
                  handleValueInputChange(e.target.value);
                }}
                inputProps={{
                  style: {
                    padding: "10px",
                    fontSize: "16px",
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "16px",
                    marginTop: "-3px",
                  },
                }}
              />
            </Col>
          </Row>

          <Row className="query_row">
            <Col className="query_col query_btn_group">
              <Button
                className="project_cancel query_btn"
                size="small"
                variant="contained"
                color="cancel"
                sx={{ margin: "10px 0 0 10px" }}
                onClick={() => {
                  clearInput();
                }}
              >
                Clear
              </Button>
              {isLoading ? (
                <CircularIndeterminate size="30px" />
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  className="project_submit query_btn"
                  sx={{ margin: "10px 0 0 10px" }}
                  onClick={() => {
                    queryData();
                  }}
                >
                  Submit
                </Button>
              )}
            </Col>
          </Row>
        </Container>

        <Container className="query_container">
          <h2 className="query_builder_title">Query Result</h2>
          <Table bordered hover className="query_table">
            <thead className="thead-light">
              <tr>
                <th className="query_table_head" style={{ width: "25%" }}>
                  Document ID
                </th>
                <th className="query_table_head" style={{ width: "25%" }}>
                  Document Name
                </th>
                <th className="query_table_head" style={{ width: "50%" }}>
                  Field Value
                </th>
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
                    <td style={{ width: "25%" }}>
                      <div className="query_field_value_data"> {item.id}</div>
                    </td>
                    <td style={{ width: "25%" }}>
                      <div className="query_field_value_data">{item.name}</div>
                    </td>
                    <td style={{ width: "25%" }}>
                      {item.fields.map((field) => (
                        <div key={field.id}>
                          <div className="query_field_value_data query_value">
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
      </div>
    </>
  );
};

export default QueryIndex;
