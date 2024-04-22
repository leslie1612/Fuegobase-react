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
  const [collectionInputValue, setCollectionInputValue] = useState("");
  const [documentInputValue, setDocumentInputValue] = useState("");
  const [reloadCollction, setReloadCollection] = useState("");
  const [reloadDocument, setReloadDocument] = useState("");
  const [reloadField, setReloadField] = useState("");
  const [fieldName, setFieldName] = useState(null);
  const [fieldType, setFieldType] = useState(null);
  const [valueInfoArray, setValueInfoArray] = useState([]);

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

  const handleFieldClick = (collectionId, documentId, fieldId) => {
    setSelectedFieldId(fieldId);
  };

  const renderFieldValue = (field) => {
    let result;
    switch (field.type) {
      case "String":
      case "Boolean":
      case "Number":
        result = `${field.valueInfo.value} (${field.type})`;
        break;
      case "Array":
        result = `[ ${field.valueInfo
          .map((info) => `${info.value} (${info.type})`)
          .join(", ")} ]`;
        break;
      case "Map":
        result = `{ ${field.valueInfo
          .map((info) => ` ${info.key} : ${info.value} (${info.type})`)
          .join(",\n")} }`;
        break;
      default:
        result = "";
    }
    return <div>{result}</div>;
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
            Path : http://localhost:8080/projects/{projectId}/collections/
            {expandedCollectionId && (
              <span>
                {expandedCollectionId}
                {expandedDocumentId && (
                    <span>/documents/{expandedDocumentId}</span>
                  ) && <span>/fields/{selectedFieldId}</span>}
              </span>
            )}
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
                          handleFieldClick(collection.id, document.id, field.id)
                        }
                      >
                        {field.name} : {renderFieldValue(field)}
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
