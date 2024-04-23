import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import MyNavbar from "../../components/MyNavbar";
import "./DBTable.css";
import EditingWindow from "../DatabasePage/EditingWindow"; // 使用自己調整位置
import FieldInput from "./FieldInput";
import Button from "react-bootstrap/Button";

const DBTable = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("id");
  const apiKey = searchParams.get("apikey");
  const [collections, setCollections] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [fields, setFields] = useState([]);
  const [expandedCollectionId, setExpandedCollectionId] = useState(null);
  const [expandedDocumentId, setExpandedDocumentId] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState("");
  const [collectionEditing, setCollectionEditing] = useState("");
  const [documentEditing, setDocumentEditing] = useState("");
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

  const [editFieldId, setEditFieldId] = React.useState(null);
  const [fieldValue, setFieldValue] = useState(null);
  const [isSingleRow, setIsSingleRow] = useState(false);

  const [editingShow, setEditingShow] = useState(false);

  React.useEffect(() => {
    if (projectId && apiKey) {
      api.getCollections(projectId, apiKey).then((json) => {
        setCollections(json.data);
      });
    }
  }, [reloadCollction]);

  React.useEffect(() => {
    api.getDocuments(projectId, expandedCollectionId, apiKey).then((json) => {
      setDocuments({ ...documents, [expandedCollectionId]: json.data });
    });
  }, [reloadDocument]);

  React.useEffect(() => {
    api
      .getFields(projectId, expandedCollectionId, expandedDocumentId, apiKey)
      .then((json) => {
        setFields({ ...fields, [expandedDocumentId]: json.data });
      });
  }, [reloadField]);

  const handleCollectionClick = (collectionId) => {
    if (expandedCollectionId === collectionId) {
      setExpandedCollectionId(null);
    } else {
      setExpandedCollectionId(collectionId);
      setExpandedDocumentId("");
      api.getDocuments(projectId, collectionId, apiKey).then((json) => {
        setDocuments({ ...documents, [collectionId]: json.data });
      });
    }
  };

  const handleDocumentClick = (collectionId, documentId) => {
    if (expandedDocumentId === documentId) {
      setExpandedDocumentId(null);
    } else {
      setExpandedDocumentId(documentId);
      api
        .getFields(projectId, collectionId, documentId, apiKey)
        .then((json) => {
          setFields({ ...fields, [documentId]: json.data });
        });
    }
  };

  const handleFieldClick = (collectionId, documentId, fieldId, fiedlType) => {
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    } else {
      setSelectedFieldId(fieldId);
    }
  };

  const renderFieldValue = (field) => {
    return field.valueInfo.map((info) => (
      <div className="field_value_info_container" key={info.valueId}>
        {fieldInfo(field, info)}
        <div className="field_value_info_buttons">
          <button
            className="edit_button"
            onClick={() => {
              editFieldValue(field.id, info);
            }}
          >
            edit
          </button>
          <button
            className="delete_button"
            onClick={() => {
              deleteFieldValue(field.id, info.valueId);
            }}
          >
            delete
          </button>
        </div>
      </div>
    ));
  };

  const fieldInfo = (field, info) => {
    if (field.type === "Map") {
      return (
        <li className="field_value_info">
          {info.key}: {info.value} ({info.type})
        </li>
      );
    } else if (field.type === "Array") {
      return (
        <li className="field_value_info">
          {info.value} ({info.type})
        </li>
      );
    } else {
      return <span>{info.value}</span>;
    }
  };

  const editFieldValue = (fieldId, info) => {
    setFieldValueEditing(!fieldValueEditing);
    setEditingFieldValue(info.value);
    setEditingFieldId(fieldId);
    setEditingFieldValueId(info.valueId);
  };

  const handleEditingFieldValueChange = (e) => {
    setEditingFieldValue(e.target.value);
  };

  const updateFieldValue = () => {
    setFieldValueEditing(!fieldValueEditing);
    const data = {
      value: editingFieldValue,
    };

    api
      .updateFieldValue(
        projectId,
        expandedCollectionId,
        expandedDocumentId,
        editingFieldId,
        editingFieldValueId,
        apiKey,
        data
      )
      .then((status) => {
        if (status == 200) {
          console.log("update success");
          setReloadField(!reloadField);
        }
      });
  };

  const addCollection = () => {
    setCollectionEditing(!collectionEditing);
  };

  const addNewCollection = async (myData) => {
    setCollectionEditing(!collectionEditing);

    const data = {
      name: myData.collectionInputValue,
    };
    await api.addNewCollection(projectId, apiKey, data).then((status) => {
      if (status == 201) {
        setCollectionInputValue("");
        setReloadCollection(!reloadCollction);
      }
    });
  };

  const addDocument = () => {
    setDocumentEditing(!documentEditing);
  };
  const addNewDocument = async (name) => {
    setDocumentEditing(!documentEditing);

    const data = {
      name: name.documentInputValue,
    };
    await api
      .addNewDocument(projectId, expandedCollectionId, apiKey, data)
      .then((status) => {
        if (status == 201) {
          setDocumentInputValue("");
          setReloadDocument(!reloadDocument);
        }
      });
  };

  const addField = () => {
    setFieldEditing(!fieldEditing);
  };
  const addNewField = () => {
    setFieldEditing(!fieldEditing);

    const data = {
      type: fieldType,
      key: fieldName,
      valueInfo: valueInfoArray,
    };

    api
      .addNewField(
        projectId,
        expandedCollectionId,
        expandedDocumentId,
        apiKey,
        data
      )
      .then((status) => {
        if (status == 201) {
          setReloadField(!reloadField);
        }
      });

    setFieldName("");
    setFieldType("none");
    setValueInfoArray([{ key: "", type: "String", value: "" }]);
  };

  const deleteCollection = () => {
    api
      .deleteCollection(projectId, expandedCollectionId, apiKey)
      .then((status) => {
        if (status == 204) {
          setReloadCollection(!reloadCollction);
        }
      });
  };
  const deleteDocument = () => {
    api
      .deleteDocument(
        projectId,
        expandedCollectionId,
        expandedDocumentId,
        apiKey
      )
      .then((status) => {
        if (status == 204) {
          setReloadDocument(!reloadDocument);
        }
      });
  };
  const deleteFieldValue = (fieldId, valueId) => {
    api
      .deleteFieldValue(
        projectId,
        expandedCollectionId,
        expandedDocumentId,
        fieldId,
        valueId,
        apiKey
      )
      .then((status) => {
        if (status == 204) {
          console.log("success");
          setReloadField(!reloadField);
        }
      });
  };

  const deleteFieldKey = (fieldId) => {
    api
      .deleteFieldKey(
        projectId,
        expandedCollectionId,
        expandedDocumentId,
        fieldId,
        apiKey
      )
      .then((status) => {
        if (status == 204) {
          console.log("success");
          setReloadField(!reloadField);
        }
      });
  };

  const handleFieldNameChange = (e) => {
    const { value } = e.target;
    setFieldName(value);
  };
  const handleFieldTypeChange = (type) => {
    setFieldType(type);
  };

  const handleValueInfoChange = (event, index, field) => {
    // field: type, value
    valueInfoArray[index][field] = event.target.value; // change value
    setValueInfoArray([...valueInfoArray]); // set the change value into array
  };

  const addNewValue = () => {
    setValueInfoArray([
      ...valueInfoArray,
      { key: "", type: "String", value: "" },
    ]);
  };

  const setInitialValueInfo = () => {
    console.log("set inital");
    setValueInfoArray([{ key: "", type: "String", value: "" }]);
  };

  return (
    <>
      <MyNavbar />
      <Header />

      <h1>In Table page</h1>
      <div className="container">
        <div className="row">
          <span>
            Path : http://localhost:8080/api/v1/databases/projects/{projectId}
            /collections/
            <span>
              {expandedCollectionId && (
                <span>
                  {expandedCollectionId}/documents
                  {expandedDocumentId && `/${expandedDocumentId}/fields`}
                  {selectedFieldId && `/${selectedFieldId}`}
                </span>
              )}
            </span>
          </span>
        </div>
        <div className="row">
          <div className="col">
            <h2>Collections</h2>
            <div className="database__add">
              <span onClick={() => addCollection()}>+ add</span>
              <div style={{ display: collectionEditing ? "block" : "none" }}>
                <input
                  type="text"
                  value={collectionInputValue}
                  onChange={(e) => setCollectionInputValue(e.target.value)}
                />
                <button
                  onClick={() => addNewCollection({ collectionInputValue })}
                >
                  submit
                </button>
              </div>
            </div>

            {collections.map((collection, index) => (
              <div
                className="database__collection"
                key={collection.id}
                onClick={() => handleCollectionClick(collection.id)}
              >
                {collection.name}
                {expandedCollectionId === collection.id && (
                  <>
                    {/* <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleCollectionRename()}
                    >
                      Rename
                    </Button> */}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        deleteCollection();
                      }}
                    >
                      X
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="col">
            <h2>Documents</h2>

            <div className="database__add">
              <span onClick={() => addDocument()}>+ add</span>
              <div style={{ display: documentEditing ? "block" : "none" }}>
                <input
                  type="text"
                  value={documentInputValue}
                  onChange={(e) => setDocumentInputValue(e.target.value)}
                />
                <button onClick={() => addNewDocument({ documentInputValue })}>
                  submit
                </button>
              </div>
            </div>

            {collections.map((collection, index) => (
              <div
                className="database__documents"
                style={{
                  display:
                    expandedCollectionId === collection.id ? "block" : "none",
                }}
                key={collection.id}
              >
                {documents[collection.id]?.map((document) => (
                  <div
                    className="database__document"
                    key={document.id}
                    onClick={() =>
                      handleDocumentClick(collection.id, document.id)
                    }
                  >
                    {document.name}
                    {expandedDocumentId === document.id && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          deleteDocument();
                        }}
                      >
                        X
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="col">
            <h2>Fields</h2>
            <div className="database__add">
              <span onClick={() => addField()}>+ add</span>
              <div style={{ display: fieldValueEditing ? "block" : "none" }}>
                <input
                  type="text"
                  value={editingFieldValue}
                  onChange={(e) => handleEditingFieldValueChange(e)}
                />
                <button onClick={() => updateFieldValue({ editingFieldValue })}>
                  submit
                </button>
              </div>
              <div style={{ display: fieldEditing ? "block" : "none" }}>
                {/* <Form onSubmit={addNewField}> */}
                <FieldInput
                  fieldName={fieldName}
                  handleFieldNameChange={handleFieldNameChange}
                  fieldType={fieldType}
                  handleFieldTypeChange={handleFieldTypeChange}
                  valueInfoArray={valueInfoArray}
                  handleValueInfoChange={handleValueInfoChange}
                  addNewValue={addNewValue}
                  setInitialValueInfo={setInitialValueInfo}
                />
                <Button variant="primary" onClick={addNewField}>
                  Submit
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setFieldEditing(!fieldEditing)}
                >
                  Cancel
                </Button>
                {/* </Form> */}
              </div>
            </div>
            {collections.map((collection, index) => (
              <div
                className="database__documents"
                style={{
                  display:
                    expandedCollectionId === collection.id ? "block" : "none",
                }}
                key={collection.id}
              >
                {documents[collection.id]?.map((document) => (
                  <div
                    className="database__fields"
                    style={{
                      display:
                        expandedDocumentId === document.id ? "block" : "none",
                    }}
                    key={document.id}
                  >
                    {fields[document.id]?.map((field) => (
                      <div
                        className="database__field"
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
                        <div>
                          {field.name} <span>({field.type}) : </span>
                          <div className="field_buttons">
                            <button
                              onClick={() => {
                                deleteFieldKey(field.id);
                              }}
                            >
                              delete
                            </button>
                          </div>
                          {renderFieldValue(field)}
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
    </>
  );
};

export default DBTable;
