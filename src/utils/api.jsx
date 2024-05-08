const API = {
  // hostname: "https://fuegobase.store/api/v1",
  hostname: "http://localhost:8080/api/v1",
  signin(data) {
    return fetch(`${this.hostname}/user/signin`, {
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      method: "POST",
    });
  },
  signup(data) {
    return fetch(`${this.hostname}/user/signup`, {
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      method: "POST",
    });
  },
  getProjects(jwtToken) {
    return fetch(`${this.hostname}/databases/projects`, {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      }),
    }).then((response) => response.json());
  },
  getCollections(id, jwtToken) {
    return fetch(`${this.hostname}/databases/projects/${id}/collections`, {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      }),
    }).then((response) => response.json());
  },
  getDocuments(projectId, collectionId, jwtToken) {
    return fetch(
      `${this.hostname}/databases/projects/${projectId}/collections/${collectionId}/documents`,
      {
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        }),
      }
    ).then((response) => response.json());
  },
  getFields(projectId, collectionId, documentId, jwtToken) {
    return fetch(
      `${this.hostname}/databases/projects/${projectId}/collections/${collectionId}/documents/${documentId}/fields`,
      {
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        }),
      }
    ).then((response) => response.json());
  },
  addNewProject(data, jwtToken) {
    return fetch(`${this.hostname}/databases/projects`, {
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      }),
      method: "POST",
    }).then((response) => response.status);
  },
  addNewCollection(id, jwtToken, data) {
    return fetch(`${this.hostname}/databases/projects/${id}/collections`, {
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      }),
      method: "POST",
    }).then((response) => response.status);
  },
  addNewDocument(id, collectionId, jwtToken, data) {
    return fetch(
      `${this.hostname}/databases/projects/${id}/collections/${collectionId}/documents`,
      {
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        }),
        method: "POST",
      }
    ).then((response) => response.status);
  },
  addNewField(id, collectionId, documentId, jwtToken, data) {
    return fetch(
      `${this.hostname}/databases/projects/${id}/collections/${collectionId}/documents/${documentId}/fields`,
      {
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        }),
        method: "POST",
      }
    ).then((response) => response.status);
  },
  addNewFieldValue(id, collectionId, documentId, fieldId, data, jwtToken) {
    return fetch(
      `${this.hostname}/databases/projects/${id}/collections/${collectionId}/documents/${documentId}/fields/${fieldId}`,
      {
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        }),
        method: "POST",
      }
    ).then((response) => response.status);
  },
  deleteProject(id, jwtToken) {
    return fetch(`${this.hostname}/databases/projects/${id}`, {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      }),
      method: "DELETE",
    }).then((response) => response.status);
  },
  deleteCollection(id, collectionId, jwtToken) {
    return fetch(
      `${this.hostname}/databases/projects/${id}/collections/${collectionId}`,
      {
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        }),
        method: "DELETE",
      }
    ).then((response) => response.status);
  },
  deleteDocument(id, collectionId, documentId, jwtToken) {
    return fetch(
      `${this.hostname}/databases/projects/${id}/collections/${collectionId}/documents/${documentId}`,
      {
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        }),
        method: "DELETE",
      }
    ).then((response) => response.status);
  },
  deleteFieldValue(id, collectionId, documentId, fieldId, valueId, jwtToken) {
    return fetch(
      `${this.hostname}/databases/projects/${id}/collections/${collectionId}/documents/${documentId}/fields/${fieldId}?valueId=${valueId}`,
      {
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        }),
        method: "DELETE",
      }
    ).then((response) => response.status);
  },
  deleteFieldKey(id, collectionId, documentId, fieldId, jwtToken) {
    return fetch(
      `${this.hostname}/databases/projects/${id}/collections/${collectionId}/documents/${documentId}/fields/${fieldId}`,
      {
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        }),
        method: "DELETE",
      }
    ).then((response) => response.status);
  },
  renameCollection(id, collectionId, jwtToken, data) {
    return fetch(
      `${this.hostname}/databases/projects/${id}/collections/${collectionId}`,
      {
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        }),
        method: "PATCH",
      }
    ).then((response) => response.status);
  },
  renameDocument(id, collectionId, documentId, jwtToken, data) {
    return fetch(
      `${this.hostname}/databases/projects/${id}/collections/${collectionId}/documents/${documentId}`,
      {
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        }),
        method: "PATCH",
      }
    ).then((response) => response.status);
  },
  updateFieldValue(
    id,
    collectionId,
    documentId,
    fieldId,
    valueId,
    jwtToken,
    data
  ) {
    return fetch(
      `${this.hostname}/databases/projects/${id}/collections/${collectionId}/documents/${documentId}/fields/${fieldId}/value/${valueId}`,
      {
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        }),
        method: "PATCH",
      }
    ).then((response) => response.status);
  },
  getReadWriteData(id) {
    return fetch(`${this.hostname}/dashboard/count/readwrite/${id}`).then(
      (response) => response.json()
    );
  },
  getStorgae(id) {
    return fetch(`${this.hostname}/dashboard/storage/${id}`).then((response) =>
      response.json()
    );
  },
  getCollectionCount(id) {
    return fetch(`${this.hostname}/dashboard/collections/${id}`).then(
      (response) => response.json()
    );
  },
  getDocumentCount(id) {
    return fetch(`${this.hostname}/dashboard/documents/${id}`).then(
      (response) => response.json()
    );
  },
  getDomainList(id, jwtToken) {
    return fetch(`${this.hostname}/databases/whitelist/${id}`, {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      }),
    }).then((response) => response.json());
  },
  addNewDomain(id, data, jwtToken) {
    return fetch(`${this.hostname}/databases/whitelist/${id}`, {
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      }),
      method: "POST",
    }).then((response) => response.status);
  },
  deleteDomain(id, domainId, jwtToken) {
    return fetch(
      `${this.hostname}/databases/whitelist/${id}/domain/${domainId}`,
      {
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        }),
        method: "DELETE",
      }
    ).then((response) => response.status);
  },
  getDataByFilter(id, collectionId, filter, value, type, operator, jwtToken) {
    return fetch(
      `${this.hostname}/databases/projects/${id}/collections/${collectionId}?filter=${filter}&value=${value}&type=${type}&operator=${operator}`,
      {
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        }),
      }
    );
  },
  getAllAPIKey(projectId, jwtToken) {
    return fetch(`${this.hostname}/security/project/key/${projectId}`, {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      }),
    }).then((response) => response.json());
  },
  deleteAPIKey(apiKey, jwtToken) {
    return fetch(`${this.hostname}/security/project/key/${apiKey}`, {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      }),
      method: "DELETE",
    }).then((response) => response.status);
  },
  getNewAPIKey(projectId, jwtToken) {
    return fetch(
      `${this.hostname}/security/project/key/rotation/${projectId}`,
      {
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        }),
      }
    );
  },
};
export default API;
