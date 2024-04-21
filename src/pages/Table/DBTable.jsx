import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./DBTable.css";
import EditingWindow from "../DatabasePage/EditingWindow"; // 使用自己調整位置
import FieldInput from "./FieldInput";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const DBTable = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("id");
  const apiKey = searchParams.get("apikey");
  const [collections, setCollections] = React.useState([]);
  const [documents, setDocuments] = React.useState([]);
  const [fields, setFields] = React.useState([]);
  const [expandedCollectionId, setExpandedCollectionId] = React.useState(null);
  const [expandedDocumentId, setExpandedDocumentId] = React.useState(null);
  const [collectionEditing, setCollectionEditing] = React.useState("");
  const [documentEditing, setDocumentEditing] = React.useState("");
  const [fieldEditing, setFieldEditing] = React.useState("");
  const [collectionInputValue, setCollectionInputValue] = React.useState("");
  const [documentInputValue, setDocumentInputValue] = React.useState("");
  // const [fieldInputValue, setFieldInputValue] = React.useState("");
  const [refreshCollction, setRefreshCollection] = React.useState("");
  const [refreshDocument, setRefreshDocument] = React.useState("");
  const [refreshField, setRefreshField] = React.useState("");
  const [fieldName, setFieldName] = React.useState("");
  const [fieldType, setFieldType] = React.useState("String");
  // const [fieldValue, setFieldValue] = React.useState("");
  const [fieldMapName, setFieldMapName] = React.useState("");
  const [fieldSubType, setFieldSubType] = React.useState("");
  const [fieldValue, setFieldValue] = React.useState("");

  const [editingShow, setEditingShow] = useState(false);

  React.useEffect(() => {
    if (projectId && apiKey) {
      api.getCollections(projectId, apiKey).then((json) => {
        setCollections(json.data);
      });
    }
  }, [refreshCollction]);

  React.useEffect(() => {
    api.getDocuments(projectId, expandedCollectionId, apiKey).then((json) => {
      setDocuments({ ...documents, [expandedCollectionId]: json.data });
    });
  }, [refreshDocument]);

  React.useEffect(() => {
    api
      .getFields(projectId, expandedCollectionId, expandedDocumentId, apiKey)
      .then((json) => {
        setFields({ ...fields, [expandedDocumentId]: json.data });
      });
  }, [refreshField]);

  const handleCollectionClick = (collectionId) => {
    // if (expandedCollectionId === collectionId) {
    //   setExpandedCollectionId(null); // 如果點擊的集合已展開，則關閉它
    // } else {
    setExpandedCollectionId(collectionId); // 否則展開點擊的集合
    setExpandedDocumentId("");
    api.getDocuments(projectId, collectionId, apiKey).then((json) => {
      setDocuments({ ...documents, [collectionId]: json.data });
    });
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

  const addNewCollection = async (name) => {
    setCollectionEditing(!collectionEditing);

    const data = {
      name: name.collectionInputValue,
    };
    await api.addNewCollection(projectId, apiKey, data).then((status) => {
      if (status == 201) {
        setCollectionInputValue("");
        setRefreshCollection(!refreshCollction);
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
          setRefreshDocument(!refreshDocument);
        }
      });
  };

  const addField = () => {
    setFieldEditing(!fieldEditing);
  };
  const addNewField = () => {
    setFieldEditing(!fieldEditing);
    console.log("fieldName: " + fieldName);
    console.log("fieldType: " + fieldType);
    console.log("fieldMapName: " + fieldMapName);
    console.log("fieldSubType: " + fieldSubType);
    console.log("fieldValue: " + fieldValue);

    // const data = {
    //   name: name.fieldInputValue,
    // };
    // api
    //   .addNewDocument(
    //     projectId,
    //     expandedCollectionId,
    //     expandedDocumentId,
    //     apiKey,
    //     data
    //   )
    //   .then((status) => {
    //     if (status == 201) {
    //       setFieldInputValue("");
    //       setRefreshField(!refreshField);
    //     }
    //   });
  };

  const deleteCollection = () => {
    api
      .deleteCollection(projectId, expandedCollectionId, apiKey)
      .then((status) => {
        if (status == 204) {
          setRefreshCollection(!refreshCollction);
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
          setRefreshDocument(!refreshDocument);
        }
      });
  };

  return (
    <>
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
                )}
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
                  setFieldName={setFieldName}
                  setFieldType={setFieldType}
                  setFieldMapName={setFieldMapName}
                  setFieldSubType={setFieldSubType}
                  setFieldValue={setFieldValue}
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
