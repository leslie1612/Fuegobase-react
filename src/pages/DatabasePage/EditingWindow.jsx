import React from "react";
import { Button, Modal } from "react-bootstrap";
const EditingWindow = ({ onHide, show, state }) => (
  <Modal
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    {...{ onHide, show }}
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        {state === "editing" ? "你正在編輯文章" : "你正在新增文章"}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <h4>New project</h4>
      <label htmlFor="projectName">project name :</label>
      <input type="text" />
    </Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" onClick={onHide}>
        Close
      </Button>
      <Button variant="outline-primary" onClick={() => console.log("submit")}>
        {" "}
        Submit
      </Button>
    </Modal.Footer>
  </Modal>
);

export default EditingWindow;
