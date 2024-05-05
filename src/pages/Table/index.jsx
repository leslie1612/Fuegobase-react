import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Layout from "../../components/Layout";
import FieldInput from "./FieldInput";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CircularIndeterminate from "../../components/Loading";
import API from "../../utils/api";
import "./DBTable.css";

const DBTable = () => {
  const { token } = useContext(AuthContext);
  const { projectId } = useParams();
  const [collections, setCollections] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [fields, setFields] = useState([]);
  const [expandedCollectionId, setExpandedCollectionId] = useState(null);
  const [expandedDocumentId, setExpandedDocumentId] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState("");
  const [collectionEditing, setCollectionEditing] = useState("");
  const [renameCollectionEditing, setRenameCollectionEditing] = useState(false);
  const [renameCollectionInputValue, setRenameCollectionInputValue] =
    useState("");
  const [documentEditing, setDocumentEditing] = useState("");
  const [renameDocumentEditing, setRenameDocumentEditing] = useState(false);
  const [renameDocumentInputValue, setRenameDocumentInputValue] = useState("");
  const [fieldEditing, setFieldEditing] = useState("");
  const [fieldValueEditing, setFieldValueEditing] = useState(false);
  const [editingFieldValue, setEditingFieldValue] = useState("");
  const [editingFieldId, setEditingFieldId] = useState("");
  const [editingFieldValueId, setEditingFieldValueId] = useState("");
  const [collectionInputValue, setCollectionInputValue] = useState("");
  const [documentInputValue, setDocumentInputValue] = useState("");
  const [reloadCollction, setReloadCollection] = useState("");
  const [reloadDocument, setReloadDocument] = useState("");
  const [reloadField, setReloadField] = useState("");
  const [fieldName, setFieldName] = useState(null);
  const [fieldType, setFieldType] = useState(null);
  const [valueInfoArray, setValueInfoArray] = useState([]);
  const [isUpdateField, setIsUpdateField] = useState(false);
  const [infoType, setInfoType] = useState("");
  const [isInfoValueNumber, setIsInfoValueNumber] = useState(false);
  const [path, setPath] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    console.log(token);
    if (projectId) {
      API.getCollections(projectId, token).then((json) => {
        setCollections(json.data);
      });
      setPathValue(projectId, null, null, null);
    }
  }, [reloadCollction, projectId]);

  React.useEffect(() => {
    API.getDocuments(projectId, expandedCollectionId, token).then((json) => {
      setDocuments({ ...documents, [expandedCollectionId]: json.data });
    });
  }, [reloadDocument]);

  React.useEffect(() => {
    API.getFields(
      projectId,
      expandedCollectionId,
      expandedDocumentId,
      token
    ).then((json) => {
      setFields({ ...fields, [expandedDocumentId]: json.data });
    });
  }, [reloadField]);

  const setPathValue = (
    projectId,
    expandedCollectionId,
    expandedDocumentId,
    selectedFieldId
  ) => {
    let pathValue = `https://fuegobase.store/api/v1/databases/projects/${projectId}/collections`;
    if (expandedCollectionId) {
      pathValue += `/${expandedCollectionId}/documents`;
      if (expandedDocumentId) {
        pathValue += `/${expandedDocumentId}/fields`;
        if (selectedFieldId) {
          pathValue += `/${selectedFieldId}`;
        }
      }
    }
    setPath(pathValue);
  };

  const handleCopyClick = async (path) => {
    try {
      await navigator.clipboard.writeText(path);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Unable to copy to clipboard.", err);
      alert("Copy to clipboard failed.");
    }
  };

  const handleCollectionClick = (collectionId) => {
    if (expandedCollectionId === collectionId) {
      setExpandedCollectionId(null);
      setExpandedDocumentId(null);
      setSelectedFieldId(null);
      setPathValue(projectId, null, null, null);
    } else {
      setExpandedCollectionId(collectionId);
      setExpandedDocumentId(null);
      setPathValue(projectId, collectionId, null, null);
      setIsLoading(true);
      API.getDocuments(projectId, collectionId, token).then((json) => {
        setIsLoading(false);
        setDocuments({ ...documents, [collectionId]: json.data });
      });
    }
  };

  const handleDocumentClick = (collectionId, documentId) => {
    if (expandedDocumentId === documentId) {
      setExpandedDocumentId(null);
      setSelectedFieldId(null);
      setPathValue(projectId, collectionId, null, null);
    } else {
      setExpandedDocumentId(documentId);
      setPathValue(projectId, collectionId, documentId, null);
      setIsLoading(true);
      API.getFields(projectId, collectionId, documentId, token).then((json) => {
        setIsLoading(false);
        setFields({ ...fields, [documentId]: json.data });
      });
    }
  };

  const handleFieldClick = (collectionId, documentId, fieldId, fiedlType) => {
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
      setPathValue(projectId, collectionId, documentId, null);
    } else {
      setSelectedFieldId(fieldId);
      setPathValue(projectId, collectionId, documentId, fieldId);
    }
  };

  const renderFieldValue = (field) => {
    if (field.type === "Array" || field.type === "Map") {
      return (
        <>
          {field.valueInfo &&
            field.valueInfo.map((info) => (
              <div className="field_value_info_container" key={info.valueId}>
                <div className="field__value__info__name">
                  {fieldInfo(field, info)}
                  <div className="field_value_info_buttons">
                    <IconButton
                      color="secondary"
                      sx={{
                        fontSize: 20,
                        padding: 0,
                        margin: 0.5,
                        "&:hover": {
                          color: "primary.dark",
                        },
                      }}
                      onClick={() => {
                        editFieldValue(field.id, info);
                      }}
                    >
                      <EditIcon
                        sx={{
                          fontSize: 20,
                        }}
                      />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      sx={{
                        padding: "0",
                        margin: 0.5,
                        "&:hover": {
                          color: "primary.dark",
                        },
                      }}
                      onClick={() => {
                        deleteFieldValue(field.id, info);
                      }}
                    >
                      <DeleteIcon
                        sx={{
                          fontSize: 20,
                        }}
                      />
                    </IconButton>
                  </div>
                </div>
                {/* <div className="field_value_info_buttons"></div> */}
              </div>
            ))}
        </>
      );
    } else {
      return (
        field.valueInfo &&
        field.valueInfo.map((info) => (
          <div className="field_value_info_container" key={info.valueId}>
            <div className="field__value__info__name">
              {fieldInfo(field, info)}
            </div>
            <div className="field_value_info_buttons">
              <IconButton
                color="secondary"
                sx={{
                  fontSize: 20,
                  padding: 0,
                  margin: 0.5,
                  "&:hover": {
                    color: "primary.dark",
                  },
                }}
                onClick={() => {
                  editFieldValue(field.id, info);
                }}
              >
                <EditIcon
                  sx={{
                    fontSize: 20,
                  }}
                />
              </IconButton>
            </div>
          </div>
        ))
      );
    }
  };

  const fieldInfo = (field, info) => {
    if (field.type === "Map") {
      return (
        <>
          <div>
            {info.key} : {info.value}
          </div>
          <div className="field__value__info__type">({info.type})</div>
        </>
      );
    } else if (field.type === "Array") {
      return (
        <>
          <div>{info.value}</div>
          <div className="field__value__info__type">({info.type})</div>
        </>
      );
    } else {
      return <span>{info.value}</span>;
    }
  };

  const editFieldValue = (fieldId, info) => {
    setFieldValueEditing(!fieldValueEditing);
    setEditingFieldValue(info.value);
    setEditingFieldId(fieldId);
    setInfoType(info.type);
    setEditingFieldValueId(info.valueId);
    setShowOverlay(!showOverlay);
  };

  const handleEditingFieldValueChange = (e) => {
    setEditingFieldValue(e.target.value);
  };

  const updateFieldValue = () => {
    if (editingFieldValue === "" || editingFieldValue == null) {
      alert("Can't be empty");
      return;
    }
    setFieldValueEditing(!fieldValueEditing);
    setShowOverlay(false);
    setInfoType("");
    setIsLoading(true);
    const data = {
      value: editingFieldValue,
    };

    API.updateFieldValue(
      projectId,
      expandedCollectionId,
      expandedDocumentId,
      editingFieldId,
      editingFieldValueId,
      token,
      data
    ).then((status) => {
      if (status == 200) {
        console.log("update success");
        setReloadField(!reloadField);
      }
      setIsLoading(false);
    });
  };

  const cancelUpdateFieldValue = () => {
    setFieldValueEditing(!fieldValueEditing);
    setInfoType("");
    setEditingFieldValue("");
    setShowOverlay(false);
  };

  const addFieldValue = (field) => {
    setFieldEditing(!fieldEditing);
    setShowOverlay(true);
    setFieldName(field.name);
    setFieldType(field.type);
    setIsUpdateField(true);
    setEditingFieldId(field.id);
  };

  const addNewField = () => {
    setFieldEditing(!fieldEditing);
    setShowOverlay(false);

    if (isUpdateField) {
      if (valueInfoArray[0].value === "" || valueInfoArray[0].value == null) {
        alert("Can't be empty");
        return;
      }
      setIsLoading(true);
      const data = {
        key: valueInfoArray[0].key,
        value: valueInfoArray[0].value,
        type: valueInfoArray[0].type,
      };

      API.addNewFieldValue(
        projectId,
        expandedCollectionId,
        expandedDocumentId,
        editingFieldId,
        data,
        token
      ).then((status) => {
        if (status == 200) {
          setReloadField(!reloadField);
        }
        setIsLoading(false);
      });
    } else {
      if (fieldName === "" || fieldName == null) {
        alert("Can't be empty");
        return;
      }
      setIsLoading(true);
      const data = {
        type: fieldType,
        key: fieldName,
        valueInfo: valueInfoArray,
      };

      API.addNewField(
        projectId,
        expandedCollectionId,
        expandedDocumentId,
        token,
        data
      ).then((status) => {
        if (status == 201) {
          setReloadField(!reloadField);
        } else if (status == 400) {
          alert("name repeat!");
        }
        setIsLoading(false);
      });
    }

    setFieldName("");
    setFieldType("none");
    setValueInfoArray([{ key: null, type: "none", value: "" }]);
  };

  const addCollection = () => {
    setCollectionEditing(!collectionEditing);
    setShowOverlay(!showOverlay);
  };

  const addNewCollection = async (myData) => {
    if (
      myData.collectionInputValue === "" ||
      myData.collectionInputValue === null
    ) {
      alert("Can't be empty");
      return;
    }
    setCollectionEditing(!collectionEditing);
    setShowOverlay(!showOverlay);
    setIsLoading(true);
    const data = {
      name: myData.collectionInputValue,
    };
    await API.addNewCollection(projectId, token, data).then((status) => {
      if (status == 201) {
        setCollectionInputValue("");
        setReloadCollection(!reloadCollction);
      }
      setIsLoading(false);
    });
  };

  const addDocument = () => {
    setShowOverlay(!showOverlay);
    setDocumentEditing(!documentEditing);
  };

  const addNewDocument = async (name) => {
    if (name.documentInputValue === "" || name.documentInputValue === null) {
      alert("Can't be empty");
      return;
    }
    setIsLoading(true);
    setDocumentEditing(!documentEditing);
    setShowOverlay(false);

    const data = {
      name: name.documentInputValue,
    };
    await API.addNewDocument(projectId, expandedCollectionId, token, data).then(
      (status) => {
        if (status == 201) {
          setDocumentInputValue("");
          setReloadDocument(!reloadDocument);
        }
        setIsLoading(false);
      }
    );
  };

  const addField = () => {
    setFieldEditing(!fieldEditing);
    setIsUpdateField(false);
    setShowOverlay(true);
  };

  const cancelFieldEditing = () => {
    setFieldEditing(!fieldEditing);
    setFieldName("");
    setFieldType("none");
    setValueInfoArray([{ key: null, type: "none", value: "" }]);
    setShowOverlay(false);
  };

  const handleCollectionRename = (collection) => {
    setRenameCollectionEditing(!renameCollectionEditing);
    setRenameCollectionInputValue(collection.name);
    setShowOverlay(true);
  };

  const renameCollection = () => {
    if (
      renameCollectionInputValue === "" ||
      renameCollectionInputValue === null
    ) {
      alert("Can't be empty");
      return;
    }
    setRenameCollectionEditing(false);
    setShowOverlay(false);
    setIsLoading(true);
    const data = {
      name: renameCollectionInputValue,
    };
    API.renameCollection(projectId, expandedCollectionId, token, data).then(
      (status) => {
        if (status === 200) {
          setReloadCollection(!reloadCollction);
          setRenameCollectionInputValue("");
          setRenameCollectionEditing(false);
          setExpandedCollectionId(null);
        }
        setIsLoading(false);
      }
    );
  };

  const cancelRenameCollection = () => {
    setRenameCollectionEditing(!renameCollectionEditing);
    setRenameCollectionInputValue("");
    setShowOverlay(false);
  };

  const handleDocumentRename = (document) => {
    setRenameDocumentEditing(!renameDocumentEditing);
    setRenameDocumentInputValue(document.name);
    setShowOverlay(true);
  };

  const renameDocument = () => {
    if (renameDocumentInputValue === "" || renameDocumentInputValue === null) {
      alert("Can't be empty");
      return;
    }
    setShowOverlay(false);
    setRenameDocumentEditing(false);
    setIsLoading(true);
    const data = {
      name: renameDocumentInputValue,
    };
    API.renameDocument(
      projectId,
      expandedCollectionId,
      expandedDocumentId,
      token,
      data
    ).then((status) => {
      if (status === 200) {
        setReloadDocument(!reloadDocument);
        setRenameDocumentInputValue("");
        setExpandedDocumentId(null);
      }
      setIsLoading(false);
    });
  };

  const cancelRenameDocument = () => {
    setRenameDocumentEditing(!renameDocumentEditing);
    setRenameDocumentInputValue("");
    setShowOverlay(false);
  };

  const deleteCollection = (collection) => {
    if (confirm(`Delete collection ${collection.name} ?`)) {
      API.deleteCollection(projectId, expandedCollectionId, token).then(
        (status) => {
          if (status == 204) {
            setReloadCollection(!reloadCollction);
          }
        }
      );
    }
  };
  const deleteDocument = (document) => {
    if (confirm(`Delete document ${document.name} ?`)) {
      API.deleteDocument(
        projectId,
        expandedCollectionId,
        expandedDocumentId,
        token
      ).then((status) => {
        if (status == 204) {
          setReloadDocument(!reloadDocument);
        }
      });
    }
  };

  const deleteFieldValue = (fieldId, info) => {
    if (confirm(`Delete field value ?`)) {
      API.deleteFieldValue(
        projectId,
        expandedCollectionId,
        expandedDocumentId,
        fieldId,
        info.valueId,
        token
      ).then((status) => {
        if (status == 204) {
          console.log("success");
          setReloadField(!reloadField);
        }
      });
    }
  };

  const deleteFieldKey = (field) => {
    if (confirm(`Delete field ${field.name} ?`)) {
      API.deleteFieldKey(
        projectId,
        expandedCollectionId,
        expandedDocumentId,
        field.id,
        token
      ).then((status) => {
        if (status == 204) {
          console.log("success");
          setReloadField(!reloadField);
        }
      });
    }
  };

  const handleFieldNameChange = (e) => {
    const { value } = e.target;
    setFieldName(value);
  };
  const handleFieldTypeChange = (type) => {
    setFieldType(type);
    setIsInfoValueNumber(false);
  };

  const handleValueInfoChange = (event, index, field) => {
    valueInfoArray[index][field] = event.target.value; // change value
    setValueInfoArray([...valueInfoArray]); // set the change value into array
  };

  const addNewValue = () => {
    setValueInfoArray([
      ...valueInfoArray,
      { key: null, type: "String", value: "" },
    ]);
  };

  const setInitialValueInfo = () => {
    console.log("set inital");
    setValueInfoArray([{ key: null, type: "String", value: "" }]);
  };

  return (
    <>
      {showOverlay && (
        <div className="overlay" onClick={() => closeInput()}></div>
      )}
      {isLoading && (
        <>
          <div className="overlay"></div>
          <div className="database_loading">
            <CircularIndeterminate size="60px" color="cancel" />
          </div>
        </>
      )}
      <Layout>
        <div className="database_container">
          <h1 className="database_title">Database</h1>
          <div className="row">
            {/* <div className="table__path">
              Path : https://fuegobase.store/api/v1/databases/projects/
              {projectId}
              /collections
              <span>
                {expandedCollectionId && (
                  <span>
                    /{expandedCollectionId}/documents
                    {expandedDocumentId && `/${expandedDocumentId}/fields`}
                    {selectedFieldId && `/${selectedFieldId}`}
                  </span>
                )}
              </span>
              <ContentCopyIcon
                className="query_icon"
                sx={{ fontSize: 20, marginLeft: 1 }}
                onClick={() => handleCopyClick(queryPath)}
              />
            </div> */}

            <div className="table__path">
              Path : {path}
              <IconButton
                className="query_icon"
                onClick={() => handleCopyClick(path)}
              >
                <ContentCopyIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </div>
          </div>
          <div className="row">
            <div className="col database_col">
              <h2 className="database__table__title">Collections</h2>
              <div className="database__add">
                <div
                  className={`database__add__group ${
                    collectionEditing ? "database__popup" : ""
                  }`}
                  style={{ display: collectionEditing ? "block" : "none" }}
                >
                  <h3 style={{ fontSize: "20px", margin: "10px 0 20px 0" }}>
                    New collection name :
                  </h3>
                  <Box
                    sx={{
                      width: 500,
                      maxWidth: "100%",
                    }}
                  >
                    <TextField
                      required
                      fullWidth
                      type="text"
                      value={collectionInputValue}
                      onChange={(e) => setCollectionInputValue(e.target.value)}
                      inputProps={{
                        maxLength: 50,
                        style: {
                          padding: "10px",
                          fontSize: "15px",
                        },
                      }}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    color="cancel"
                    size="small"
                    sx={{ margin: "10px 0 0 300px" }}
                    onClick={() => addCollection()}
                  >
                    cancel
                  </Button>

                  <Button
                    onClick={() => addNewCollection({ collectionInputValue })}
                    variant="contained"
                    size="small"
                    sx={{ margin: "10px 0 0 10px" }}
                  >
                    Submit
                  </Button>
                </div>
              </div>

              <div className="database__add">
                <div
                  className={`database__add__group ${
                    renameCollectionEditing ? "database__popup" : ""
                  }`}
                  style={{
                    display: renameCollectionEditing ? "block" : "none",
                  }}
                >
                  <h3 style={{ fontSize: "20px", margin: "10px 0 20px 0" }}>
                    Rename collection :
                  </h3>
                  <Box
                    sx={{
                      width: 500,
                      maxWidth: "100%",
                    }}
                  >
                    <TextField
                      required
                      fullWidth
                      type="text"
                      value={renameCollectionInputValue}
                      onChange={(e) =>
                        setRenameCollectionInputValue(e.target.value)
                      }
                      inputProps={{
                        maxLength: 50,
                        style: {
                          padding: "10px",
                          fontSize: "15px",
                        },
                      }}
                    />
                    {/* <input
                      className="database__add__input"
                      type="text"
                      value={renameCollectionInputValue}
                      onChange={(e) =>
                        setRenameCollectionInputValue(e.target.value)
                      }
                    /> */}
                  </Box>

                  <Button
                    variant="contained"
                    color="cancel"
                    size="small"
                    sx={{ margin: "10px 0 0 300px" }}
                    onClick={() => cancelRenameCollection()}
                  >
                    cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ margin: "10px 0 0 10px" }}
                    onClick={() => renameCollection()}
                  >
                    submit
                  </Button>
                </div>
              </div>

              <div
                className="database__table__item database__add__item"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => addCollection()}
              >
                + add
              </div>

              {collections &&
                collections.map((collection, index) => (
                  <>
                    <div className="database__table__item">
                      <div
                        className={`database__collection ${
                          expandedCollectionId === collection.id
                            ? "db__collection__selected"
                            : ""
                        }`}
                        key={collection.id}
                        onClick={() => handleCollectionClick(collection.id)}
                      >
                        {collection.name}
                      </div>

                      {expandedCollectionId === collection.id && (
                        <>
                          <div className="database_item_icon">
                            <IconButton
                              color="secondary"
                              sx={{
                                fontSize: 20,
                                padding: 0,
                                margin: 0.5,
                                "&:hover": {
                                  color: "primary.dark",
                                },
                              }}
                              onClick={() => {
                                handleCollectionRename(collection);
                              }}
                            >
                              <EditIcon
                                sx={{
                                  fontSize: 20,
                                }}
                              />
                            </IconButton>
                            <IconButton
                              color="secondary"
                              sx={{
                                padding: "0",
                                margin: 0.5,
                                "&:hover": {
                                  color: "primary.dark",
                                },
                              }}
                              onClick={() => {
                                deleteCollection(collection);
                              }}
                            >
                              <DeleteIcon
                                sx={{
                                  fontSize: 20,
                                }}
                              />
                            </IconButton>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ))}
            </div>

            <div className="col database_col">
              <h2 className="database__table__title">Documents</h2>
              <div className="database__add">
                <div
                  className={`database__add__group ${
                    documentEditing ? "database__popup" : ""
                  }`}
                  style={{ display: documentEditing ? "block" : "none" }}
                >
                  <h3 style={{ fontSize: "20px", margin: "10px 0 20px 0" }}>
                    New Document Name :
                  </h3>
                  <Box
                    sx={{
                      width: 500,
                      maxWidth: "100%",
                    }}
                  >
                    <TextField
                      required
                      fullWidth
                      type="text"
                      value={documentInputValue}
                      onChange={(e) => setDocumentInputValue(e.target.value)}
                      inputProps={{
                        maxLength: 50,
                        style: {
                          padding: "10px",
                          fontSize: "15px",
                        },
                      }}
                    />
                    {/* <input
                      className="database__add__input"
                      type="text"
                      value={documentInputValue}
                      onChange={(e) => setDocumentInputValue(e.target.value)}
                    /> */}
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ margin: "10px 0 0 300px" }}
                    color="cancel"
                    onClick={() => addDocument()}
                  >
                    cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ margin: "10px 0 0 10px" }}
                    onClick={() => addNewDocument({ documentInputValue })}
                  >
                    submit
                  </Button>
                </div>
              </div>
              <div className="database__add">
                <div
                  className={`database__add__group ${
                    renameDocumentEditing ? "database__popup" : ""
                  }`}
                  style={{
                    display: renameDocumentEditing ? "block" : "none",
                  }}
                >
                  <h3 style={{ fontSize: "20px", margin: "10px 0 20px 0" }}>
                    Rename document :
                  </h3>
                  <Box
                    sx={{
                      width: 500,
                      maxWidth: "100%",
                    }}
                  >
                    <TextField
                      required
                      fullWidth
                      type="text"
                      value={renameDocumentInputValue}
                      onChange={(e) =>
                        setRenameDocumentInputValue(e.target.value)
                      }
                      inputProps={{
                        maxLength: 50,
                        style: {
                          padding: "10px",
                          fontSize: "15px",
                        },
                      }}
                    />
                    {/* <input
                      className="database__add__input"
                      type="text"
                      value={renameDocumentInputValue}
                      onChange={(e) =>
                        setRenameDocumentInputValue(e.target.value)
                      }
                    /> */}
                  </Box>
                  <Button
                    variant="contained"
                    color="cancel"
                    size="small"
                    sx={{ margin: "10px 0 0 300px" }}
                    onClick={() => cancelRenameDocument()}
                  >
                    cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ margin: "10px 0 0 10px" }}
                    onClick={() => renameDocument()}
                  >
                    submit
                  </Button>
                </div>
              </div>

              <div
                className="database__table__item database__add__item"
                style={{
                  visibility: expandedCollectionId ? "visible" : "hidden",
                  cursor: "pointer",
                }}
                onClick={() => addDocument()}
              >
                + add
              </div>

              {collections &&
                collections.map((collection, index) => (
                  <div
                    style={{
                      display:
                        expandedCollectionId === collection.id
                          ? "block"
                          : "none",
                    }}
                    key={collection.id}
                  >
                    {documents[collection.id]?.map((document) => (
                      <>
                        <div className="database__table__item">
                          <div
                            className={`database__document ${
                              expandedDocumentId === document.id
                                ? "db__collection__selected"
                                : ""
                            }`}
                            key={document.id}
                            onClick={() =>
                              handleDocumentClick(collection.id, document.id)
                            }
                          >
                            {document.name}
                          </div>

                          {expandedDocumentId === document.id && (
                            <>
                              <div className="database_item_icon">
                                <IconButton
                                  color="secondary"
                                  sx={{
                                    fontSize: 20,
                                    padding: 0,
                                    margin: 0.5,
                                    "&:hover": {
                                      color: "primary.dark",
                                    },
                                  }}
                                  onClick={() => {
                                    handleDocumentRename(document);
                                  }}
                                >
                                  <EditIcon
                                    sx={{
                                      fontSize: 20,
                                    }}
                                  />
                                </IconButton>
                                <IconButton
                                  color="secondary"
                                  sx={{
                                    padding: "0",
                                    margin: 0.5,
                                    "&:hover": {
                                      color: "primary.dark",
                                    },
                                  }}
                                  onClick={() => {
                                    deleteDocument(document);
                                  }}
                                >
                                  <DeleteIcon
                                    sx={{
                                      fontSize: 20,
                                    }}
                                  />
                                </IconButton>
                                {/* <Button
                                className="database__edit__btn"
                                onClick={() => {
                                  handleDocumentRename(document);
                                }}
                              >
                                edit
                              </Button>
                              <Button
                                className="database__delete__btn"
                                onClick={() => {
                                  deleteDocument(document);
                                }}
                              >
                                X
                              </Button> */}
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    ))}
                  </div>
                ))}
            </div>

            <div className="col database_col">
              <h2 className="database__table__title">Fields</h2>
              <div className="database__add">
                <div
                  className={`database__field__add__group ${
                    fieldValueEditing ? "database__popup" : ""
                  }`}
                  style={{ display: fieldValueEditing ? "block" : "none" }}
                >
                  <h3 style={{ fontSize: "20px", margin: "10px 0 20px 0" }}>
                    Update value :
                  </h3>
                  <Box
                    sx={{
                      width: 500,
                      maxWidth: "100%",
                    }}
                  >
                    {infoType == "Boolean" ? (
                      <Select
                        value={editingFieldValue}
                        displayEmpty
                        size="small"
                        sx={{
                          margin: "10px 0",
                          minWidth: 200,
                          display: "block",
                          backgroundColor: "#F8F9FA",
                        }}
                        onChange={(e) => handleEditingFieldValueChange(e)}
                      >
                        <MenuItem value="none" disabled></MenuItem>
                        <MenuItem value="TRUE">TRUE</MenuItem>
                        <MenuItem value="FALSE">FALSE</MenuItem>
                      </Select>
                    ) : // <select
                    //   value={editingFieldValue}
                    //   onChange={(e) => handleEditingFieldValueChange(e)}
                    // >
                    //   <option value="none" disabled>
                    //     --select--
                    //   </option>
                    //   <option value="TRUE">TRUE</option>
                    //   <option value="FALSE">FALSE</option>
                    // </select>
                    infoType == "Number" ? (
                      <TextField
                        required
                        fullWidth
                        type="number"
                        value={editingFieldValue}
                        onChange={(e) => handleEditingFieldValueChange(e)}
                        inputProps={{
                          maxLength: 200,
                          style: {
                            padding: "10px",
                            fontSize: "15px",
                          },
                        }}
                      />
                    ) : (
                      // <input
                      //   className="database__add__input"
                      //   type="number"
                      //   value={editingFieldValue}
                      //   onChange={(e) => handleEditingFieldValueChange(e)}
                      // />
                      <TextField
                        required
                        fullWidth
                        type="text"
                        value={editingFieldValue}
                        onChange={(e) => handleEditingFieldValueChange(e)}
                        inputProps={{
                          maxLength: 200,
                          style: {
                            padding: "10px",
                            fontSize: "15px",
                          },
                        }}
                      />
                      // <input
                      //   className="database__add__input"
                      //   type="text"
                      //   value={editingFieldValue}
                      //   onChange={(e) => handleEditingFieldValueChange(e)}
                      // />
                    )}
                  </Box>

                  <Button
                    variant="contained"
                    size="small"
                    sx={{ margin: "10px 0 0 300px" }}
                    color="cancel"
                    onClick={() => cancelUpdateFieldValue()}
                  >
                    cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ margin: "10px 0 0 10px" }}
                    onClick={() => updateFieldValue({ editingFieldValue })}
                  >
                    submit
                  </Button>
                </div>

                <div
                  className={`database__field__add__group ${
                    fieldEditing ? "database__input__popup" : ""
                  }`}
                  style={{ display: fieldEditing ? "block" : "none" }}
                >
                  <FieldInput
                    fieldName={fieldName}
                    handleFieldNameChange={handleFieldNameChange}
                    fieldType={fieldType}
                    handleFieldTypeChange={handleFieldTypeChange}
                    valueInfoArray={valueInfoArray}
                    handleValueInfoChange={handleValueInfoChange}
                    addNewValue={addNewValue}
                    setInitialValueInfo={setInitialValueInfo}
                    isUpdateField={isUpdateField}
                    isInfoValueNumber={isInfoValueNumber}
                  />
                  <div className="field__value__btn__group">
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ margin: "10px 0 0 600px" }}
                      color="cancel"
                      onClick={() => cancelFieldEditing()}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ margin: "10px 0 0 10px" }}
                      onClick={addNewField}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>

              <div
                className="database__table__item database__add__item"
                style={{
                  visibility: expandedDocumentId ? "visible" : "hidden",
                  cursor: "pointer",
                }}
                onClick={() => addField()}
              >
                + add
              </div>

              {collections &&
                collections.map((collection, index) => (
                  <div
                    className="database__documents"
                    style={{
                      display:
                        expandedCollectionId === collection.id
                          ? "block"
                          : "none",
                    }}
                    key={collection.id}
                  >
                    {documents[collection.id]?.map((document) => (
                      <div
                        className="database__fields"
                        style={{
                          display:
                            expandedDocumentId === document.id
                              ? "block"
                              : "none",
                        }}
                        key={document.id}
                      >
                        {fields[document.id]?.map((field) => (
                          <div className="database__table__item">
                            <div
                              // className="database__field"
                              className={`database__field ${
                                selectedFieldId === field.id
                                  ? "db__collection__selected"
                                  : ""
                              }`}
                              key={field.id}
                              onClick={() =>
                                handleFieldClick(
                                  collection.id,
                                  document.id,
                                  field.id,
                                  field.type
                                )
                              }
                            >
                              <div className="database__table__item">
                                <div className="database__field__name">
                                  {field.name} :
                                </div>
                                <div className="database__field__type">
                                  ({field.type})
                                </div>

                                {selectedFieldId === field.id && (
                                  <>
                                    {(field.type === "Array" ||
                                      field.type === "Map") && (
                                      <IconButton
                                        color="secondary"
                                        sx={{
                                          padding: "0",
                                          margin: 0.5,
                                          "&:hover": {
                                            color: "primary.dark",
                                          },
                                        }}
                                        onClick={() => {
                                          addFieldValue(field);
                                        }}
                                      >
                                        <AddIcon
                                          sx={{
                                            fontSize: 20,
                                          }}
                                        />
                                      </IconButton>
                                    )}

                                    <IconButton
                                      color="secondary"
                                      sx={{
                                        padding: "0",
                                        margin: 0.5,
                                        "&:hover": {
                                          color: "primary.dark",
                                        },
                                      }}
                                      onClick={() => {
                                        deleteFieldKey(field);
                                      }}
                                    >
                                      <DeleteIcon
                                        sx={{
                                          fontSize: 20,
                                        }}
                                      />
                                    </IconButton>
                                  </>
                                )}
                              </div>
                              <div>{renderFieldValue(field)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default DBTable;
