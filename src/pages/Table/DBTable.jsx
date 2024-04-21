import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "./DBTable.css";
import EditingWindow from "../DatabasePage/EditingWindow"; // 使用自己調整位置

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
  const [collectionInputValue, setCollectionInputValue] = React.useState("");
  const [documentInputValue, setDocumentInputValue] = React.useState("");
  const [refreshCollction, setRefreshCollection] = React.useState("");
  const [refreshDocument, setRefreshDocument] = React.useState("");
  const [documentEditing, setDocumentEditing] = React.useState("");

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

  return (
    <>
      <h1>In Table page</h1>
      <div className="container">
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
                collection name: {collection.name}
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
                    document name: {document.name}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="col">
            <h2>Fields</h2>
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
// {
//   expandedDocumentId === document.id &&
//     fields[document.id]?.map((field) => (
//       <tr className="database__field" key={field.id}>
//         <td
//           onClick={() => handleFieldClick(collection.id, document.id, field.id)}
//         >
//           {field.name} : {renderFieldValue(field)}
//         </td>
//       </tr>
//     ));
// }
