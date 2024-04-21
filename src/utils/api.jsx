const api = {
  //   hostname: "/api/v1",
  getProjects() {
    return fetch(`http://localhost:8080/api/v1/databases/projects`).then(
      (response) => response.json()
    );
  },
  getCollections(id, apikey) {
    return fetch(
      `http://localhost:8080/api/v1/databases/projects/${id}/collections`,
      {
        headers: new Headers({
          "Content-Type": "application/json",
          "x-api-key": apikey,
        }),
      }
    ).then((response) => response.json());
  },
  getDocuments(projectId, collectionId, apikey) {
    return fetch(
      `http://localhost:8080/api/v1/databases/projects/${projectId}/collections/${collectionId}/documents`,
      {
        headers: new Headers({
          "Content-Type": "application/json",
          "x-api-key": apikey,
        }),
      }
    ).then((response) => response.json());
  },
  getFields(projectId, collectionId, documentId, apikey) {
    return fetch(
      `http://localhost:8080/api/v1/databases/projects/${projectId}/collections/${collectionId}/documents/${documentId}/fields`,
      {
        headers: new Headers({
          "Content-Type": "application/json",
          "x-api-key": apikey,
        }),
      }
    ).then((response) => response.json());
  },
  addNewCollection(id, apikey, data) {
    return fetch(
      `http://localhost:8080/api/v1/databases/projects/${id}/collections`,
      {
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json",
          "x-api-key": apikey,
        }),
        method: "POST",
      }
    ).then((response) => response.status);
  },
  addNewDocument(id, collectionId, apikey, data) {
    return fetch(
      `http://localhost:8080/api/v1/databases/projects/${id}/collections/${collectionId}/documents`,
      {
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json",
          "x-api-key": apikey,
        }),
        method: "POST",
      }
    ).then((response) => response.status);
  },
  deleteCollection(id, collectionId, apikey) {
    return fetch(
      `http://localhost:8080/api/v1/databases/projects/${id}/collections/${collectionId}`,
      {
        headers: new Headers({
          "Content-Type": "application/json",
          "x-api-key": apikey,
        }),
        method: "DELETE",
      }
    ).then((response) => response.status);
  },
  deleteDocument(id, collectionId, documentId, apikey) {
    return fetch(
      `http://localhost:8080/api/v1/databases/projects/${id}/collections/${collectionId}/documents/${documentId}`,
      {
        headers: new Headers({
          "Content-Type": "application/json",
          "x-api-key": apikey,
        }),
        method: "DELETE",
      }
    ).then((response) => response.status);
  },
  renameCollection(id, collectionId, apikey, data) {
    return fetch(
      `http://localhost:8080/api/v1/databases/projects/${id}/collections/${collectionId}`,
      {
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json",
          "x-api-key": apikey,
        }),
        method: "PATCH",
      }
    ).then((response) => response.status);
  },
};
