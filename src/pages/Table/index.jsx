import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Layout from "../../components/Layout";
import FieldInput from "./FieldInput";
import Button from "react-bootstrap/Button";
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

  React.useEffect(() => {
    console.log(token);
    if (projectId) {
      API.getCollections(projectId, token).then((json) => {
        setCollections(json.data);
      });
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

  const handleCollectionClick = (collectionId) => {
    if (expandedCollectionId === collectionId) {
      setExpandedCollectionId(null);
      setExpandedDocumentId(null);
      setSelectedFieldId(null);
    } else {
      setExpandedCollectionId(collectionId);
      setExpandedDocumentId(null);
      API.getDocuments(projectId, collectionId, token).then((json) => {
        setDocuments({ ...documents, [collectionId]: json.data });
      });
    }
  };

  const handleDocumentClick = (collectionId, documentId) => {
    if (expandedDocumentId === documentId) {
      setExpandedDocumentId(null);
      setSelectedFieldId(null);
    } else {
      setExpandedDocumentId(documentId);
      API.getFields(projectId, collectionId, documentId, token).then((json) => {
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
    if (field.type === "Array" || field.type === "Map") {
      return (
        <>
          {field.valueInfo &&
            field.valueInfo.map((info) => (
              <div className="field_value_info_container" key={info.valueId}>
                <div className="field__value__info__name">
                  {fieldInfo(field, info)}
                </div>
                <div className="field_value_info_buttons">
                  <Button
                    className="database__edit__btn"
                    onClick={() => {
                      editFieldValue(field.id, info);
                    }}
                  >
                    edit
                  </Button>
                  <Button
                    className="database__delete__btn"
                    onClick={() => {
                      deleteFieldValue(field.id, info.valueId);
                    }}
                  >
                    X
                  </Button>
                </div>
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
              <Button
                className="database__edit__btn"
                onClick={() => {
                  editFieldValue(field.id, info);
                }}
              >
                edit
              </Button>
            </div>
          </div>
        ))
      );
    }
  };

  const fieldInfo = (field, info) => {
    if (field.type === "Map") {
      return (
        <li className="field_value_info">
          {info.key} : {info.value} ({info.type})
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
    setInfoType(info.type);
    setEditingFieldValueId(info.valueId);
  };

  const handleEditingFieldValueChange = (e) => {
    setEditingFieldValue(e.target.value);
  };

  const updateFieldValue = () => {
    setFieldValueEditing(!fieldValueEditing);
    setInfoType("");
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
    });
  };

  const cancelUpdateFieldValue = () => {
    setFieldValueEditing(!fieldValueEditing);
    setInfoType("");
    setEditingFieldValue("");
  };

  const addFieldValue = (field) => {
    setFieldEditing(!fieldEditing);
    setFieldName(field.name);
    setFieldType(field.type);
    setIsUpdateField(true);
    setEditingFieldId(field.id);
  };

  const addNewField = () => {
    setFieldEditing(!fieldEditing);

    if (isUpdateField) {
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
      });
    } else {
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
        }
      });
    }

    setFieldName("");
    setFieldType("none");
    setValueInfoArray([{ key: "", type: "none", value: "" }]);
  };

  const addCollection = () => {
    setCollectionEditing(!collectionEditing);
  };

  const addNewCollection = async (myData) => {
    setCollectionEditing(!collectionEditing);

    const data = {
      name: myData.collectionInputValue,
    };
    await API.addNewCollection(projectId, token, data).then((status) => {
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
    await API.addNewDocument(projectId, expandedCollectionId, token, data).then(
      (status) => {
        if (status == 201) {
          setDocumentInputValue("");
          setReloadDocument(!reloadDocument);
        }
      }
    );
  };

  const addField = () => {
    setFieldEditing(!fieldEditing);
    setIsUpdateField(false);
  };

  const cancelFieldEditing = () => {
    setFieldEditing(!fieldEditing);
    setFieldName("");
    setFieldType("none");
    setValueInfoArray([{ key: "", type: "none", value: "" }]);
  };

  const handleCollectionRename = (collection) => {
    setRenameCollectionEditing(!renameCollectionEditing);
    setRenameCollectionInputValue(collection.name);
    console.log(expandedCollectionId);
  };

  const renameCollection = () => {
    console.log(expandedCollectionId);
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
      }
    );
  };

  const cancelRenameCollection = () => {
    setRenameCollectionEditing(!renameCollectionEditing);
    setRenameCollectionInputValue("");
  };

  const handleDocumentRename = (document) => {
    setRenameDocumentEditing(!renameDocumentEditing);
    setRenameDocumentInputValue(document.name);
  };

  const renameDocument = () => {
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
        setRenameDocumentEditing(false);
        setExpandedDocumentId(null);
      }
    });
  };

  const cancelRenameDocument = () => {
    setRenameDocumentEditing(!renameDocumentEditing);
    setRenameDocumentInputValue("");
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
  const deleteDocument = () => {
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
  };
  const deleteFieldValue = (fieldId, valueId) => {
    API.deleteFieldValue(
      projectId,
      expandedCollectionId,
      expandedDocumentId,
      fieldId,
      valueId,
      token
    ).then((status) => {
      if (status == 204) {
        console.log("success");
        setReloadField(!reloadField);
      }
    });
  };

  const deleteFieldKey = (fieldId) => {
    API.deleteFieldKey(
      projectId,
      expandedCollectionId,
      expandedDocumentId,
      fieldId,
      token
    ).then((status) => {
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
    setIsInfoValueNumber(false);
  };

  const handleValueInfoChange = (event, index, field) => {
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
      <Layout>
        <div className="container">
          <div className="row">
            <div className="table__path">
              Path : https://fuegobase.store/api/v1/databases/projects/
              {projectId}
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
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h2>Collections</h2>
              <div className="database__add">
                <span
                  className="database__add__title"
                  onClick={() => addCollection()}
                >
                  + add
                </span>
                <div
                  className={`database__add__group ${
                    collectionEditing ? "popup" : ""
                  }`}
                  style={{ display: collectionEditing ? "block" : "none" }}
                >
                  <h3>New collection name : </h3>
                  <input
                    className="database__add__input"
                    type="text"
                    value={collectionInputValue}
                    onChange={(e) => setCollectionInputValue(e.target.value)}
                  />
                  <Button
                    className="database__submit__btn"
                    onClick={() => addNewCollection({ collectionInputValue })}
                  >
                    Submit
                  </Button>
                  <Button
                    className="database__delete__btn"
                    onClick={() => addCollection()}
                  >
                    cancel
                  </Button>
                </div>
              </div>

              <div className="database__add">
                <div
                  className={`database__add__group ${
                    renameCollectionEditing ? "popup" : ""
                  }`}
                  style={{
                    display: renameCollectionEditing ? "block" : "none",
                  }}

                  // className="database__add__group"
                  // style={{
                  //   display: renameCollectionEditing ? "block" : "none",
                  // }}
                >
                  <h3>Rename collection : </h3>
                  <input
                    className="database__add__input"
                    type="text"
                    value={renameCollectionInputValue}
                    onChange={(e) =>
                      setRenameCollectionInputValue(e.target.value)
                    }
                  />
                  <Button
                    className="database__submit__btn"
                    onClick={() => renameCollection()}
                  >
                    submit
                  </Button>
                  <Button
                    className="database__delete__btn"
                    onClick={() => cancelRenameCollection()}
                  >
                    cancel
                  </Button>
                </div>
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
                          <Button
                            className="database__edit__btn"
                            onClick={() => {
                              handleCollectionRename(collection);
                            }}
                          >
                            edit
                          </Button>
                          <Button
                            className="database__delete__btn"
                            onClick={() => {
                              deleteCollection(collection);
                            }}
                          >
                            X
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                ))}
            </div>

            <div className="col">
              <h2>Documents</h2>
              <div className="database__add">
                <span
                  onClick={() => addDocument()}
                  className="database__add__title"
                >
                  + add
                </span>
                <div
                  className={`database__add__group ${
                    documentEditing ? "popup" : ""
                  }`}
                  style={{ display: documentEditing ? "block" : "none" }}
                >
                  <h2>New Document Name : </h2>
                  <input
                    className="database__add__input"
                    type="text"
                    value={documentInputValue}
                    onChange={(e) => setDocumentInputValue(e.target.value)}
                  />
                  <Button
                    className="database__submit__btn"
                    onClick={() => addNewDocument({ documentInputValue })}
                  >
                    submit
                  </Button>
                  <Button
                    className="database__delete__btn"
                    onClick={() => addDocument()}
                  >
                    cancel
                  </Button>
                </div>
              </div>
              <div className="database__add">
                <div
                  className={`database__add__group ${
                    renameDocumentEditing ? "popup" : ""
                  }`}
                  style={{
                    display: renameDocumentEditing ? "block" : "none",
                  }}
                  // className="database__add__group"
                  // style={{
                  //   display: renameDocumentEditing ? "block" : "none",
                  // }}
                >
                  <h3>Rename document : </h3>
                  <input
                    className="database__add__input"
                    type="text"
                    value={renameDocumentInputValue}
                    onChange={(e) =>
                      setRenameDocumentInputValue(e.target.value)
                    }
                  />
                  <Button
                    className="database__submit__btn"
                    onClick={() => renameDocument()}
                  >
                    submit
                  </Button>
                  <Button
                    className="database__delete__btn"
                    onClick={() => cancelRenameDocument()}
                  >
                    cancel
                  </Button>
                </div>
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
                              <Button
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
                              </Button>
                            </>
                          )}
                        </div>
                      </>
                    ))}
                  </div>
                ))}
            </div>

            <div className="col">
              <h2>Fields</h2>
              <div className="database__add">
                <span
                  onClick={() => addField()}
                  className="database__add__title"
                >
                  + add
                </span>

                <div
                  className="database__field__add__group"
                  style={{ display: fieldValueEditing ? "block" : "none" }}
                >
                  {infoType == "Boolean" ? (
                    <select
                      value={editingFieldValue}
                      onChange={(e) => handleEditingFieldValueChange(e)}
                    >
                      <option value="none" disabled>
                        --select--
                      </option>
                      <option value="TRUE">TRUE</option>
                      <option value="FALSE">FALSE</option>
                    </select>
                  ) : infoType == "Number" ? (
                    <input
                      className="database__add__input"
                      type="number"
                      value={editingFieldValue}
                      onChange={(e) => handleEditingFieldValueChange(e)}
                    />
                  ) : (
                    <input
                      className="database__add__input"
                      type="text"
                      value={editingFieldValue}
                      onChange={(e) => handleEditingFieldValueChange(e)}
                    />
                  )}
                  <Button
                    className="database__submit__btn"
                    onClick={() => updateFieldValue({ editingFieldValue })}
                  >
                    submit
                  </Button>
                  <Button
                    className="database__delete__btn"
                    onClick={() => cancelUpdateFieldValue()}
                  >
                    cancel
                  </Button>
                </div>
                <div
                  className={`database__field__add__group ${
                    fieldEditing ? "popup" : ""
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
                      className="project_submit value__add__btn"
                      variant="primary"
                      onClick={addNewField}
                    >
                      Submit
                    </Button>
                    <Button
                      className="project_cancel value__add__btn"
                      variant="secondary"
                      onClick={() => cancelFieldEditing()}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
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
                                      <Button
                                        className="database__submit__btn"
                                        onClick={() => {
                                          addFieldValue(field);
                                        }}
                                      >
                                        +
                                      </Button>
                                    )}
                                    <Button
                                      className="database__delete__btn field__delete__btn"
                                      onClick={() => {
                                        deleteFieldKey(field.id);
                                      }}
                                    >
                                      X
                                    </Button>
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
