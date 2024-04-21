import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import EditingWindow from "./EditingWindow"; // 使用自己調整位置

const App = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("id");
  const apiKey = searchParams.get("apikey");
  const [collections, setCollections] = React.useState([]);
  const [documents, setDocuments] = React.useState([]);
  const [fields, setFields] = React.useState([]);
  const [expandedCollectionId, setExpandedCollectionId] = React.useState(null);
  const [expandedDocumentId, setExpandedDocumentId] = React.useState(null);
  const [editing, setEditing] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");
  const [refresh, setRefresh] = React.useState("");

  const [editingShow, setEditingShow] = useState(false);

  React.useEffect(() => {
    if (projectId && apiKey) {
      api.getCollections(projectId, apiKey).then((json) => {
        setCollections(json.data);
      });
    }
  }, [refresh]);

  const handleCollectionClick = (collectionId) => {
    // if (expandedCollectionId === collectionId) {
    //   setExpandedCollectionId(null); // 如果點擊的集合已展開，則關閉它
    // } else {
    setExpandedCollectionId(collectionId); // 否則展開點擊的集合
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

  const add = () => {
    setEditing(!editing);
  };

  const addNewCollection = async (name) => {
    setEditing(!editing);

    const data = {
      name: name.inputValue,
    };
    await api.addNewCollection(projectId, apiKey, data).then((status) => {
      if (status == 201) {
        setInputValue("");
        setRefresh("True");
      }
    });
  };

  return (
    <>
      <h1>In database page</h1>
      <div className="database__collections">
        <ul>
          <li className="database__add">
            <p onClick={() => add()}>+ add</p>
            {/* <Button
              variant="outline-success"
              onClick={() => setEditingShow(true)}
            >
              edit
            </Button>
            <Button variant="outline-danger">delete</Button>
            {editingShow && (
              <EditingWindow
                show={editingShow}
                onHide={() => setEditingShow(false)}
                state=""
              />
            )} */}
            <div style={{ display: editing ? "block" : "none" }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button onClick={() => addNewCollection({ inputValue })}>
                submit
              </button>
            </div>
          </li>
          {collections.map((collection, index) => (
            <li
              className="database__collection"
              key={collection.id}
              onClick={() => handleCollectionClick(collection.id)}
            >
              collection name : {collection.name}
              <div
                className="database__documents"
                style={{
                  display:
                    expandedCollectionId === collection.id ? "block" : "none",
                }}
              >
                <ul>
                  {documents[collection.id]?.map((document) => (
                    <li
                      className="database__document"
                      key={document.id}
                      onClick={() =>
                        handleDocumentClick(collection.id, document.id)
                      }
                    >
                      document name : {document.name}
                      <div
                        className="database__fields"
                        style={{
                          display:
                            expandedDocumentId === document.id
                              ? "block"
                              : "none",
                        }}
                      >
                        <ul>
                          {fields[document.id]?.map((field) => (
                            <li
                              className="database__field"
                              key={field.id}
                              onClick={() =>
                                handleFieldClick(
                                  collection.id,
                                  document.id,
                                  field.id
                                )
                              }
                            >
                              {field.name} : {renderFieldValue(field)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default App;
