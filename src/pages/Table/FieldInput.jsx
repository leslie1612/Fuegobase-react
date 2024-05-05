import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
const FieldInput = ({
  fieldName,
  handleFieldNameChange,
  fieldType,
  handleFieldTypeChange,
  valueInfoArray,
  handleValueInfoChange,
  addNewValue,
  setInitialValueInfo,
  isUpdateField,
}) => {
  React.useEffect(() => {
    setInitialValueInfo();
  }, []);

  const handleTypeChange = (event) => {
    setInitialValueInfo();
    handleFieldTypeChange(event.target.value);
  };

  return (
    <>
      <Row className="field__value__item">
        <Form.Group as={Col} md={4} controlId="formGridType">
          <Form.Label>Key</Form.Label>
          <Form.Control
            readOnly={isUpdateField ? true : false}
            value={fieldName || ""}
            onChange={(e) => handleFieldNameChange(e)}
          />
        </Form.Group>

        <Form.Group as={Col} md={2} controlId="formGridType">
          <Form.Label>Type</Form.Label>
          <Form.Control
            as="select"
            disabled={isUpdateField}
            value={fieldType || "none"}
            onChange={(e) => handleTypeChange(e)}
          >
            <option value="none" disabled></option>
            <option value="String">String</option>
            <option value="Number">Number</option>
            <option value="Boolean">Boolean</option>
            <option value="Array">Array</option>
            <option value="Map">Map</option>
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} md={4} controlId="formGridValue">
          <Form.Label>Value</Form.Label>
          {fieldType === "Array" ? (
            <>
              <Button
                variant="contained"
                size="small"
                className="database__submit__btn"
                style={{ display: isUpdateField ? "none" : "block" }}
                onClick={() => {
                  addNewValue();
                }}
              >
                +
              </Button>
            </>
          ) : fieldType === "Map" ? (
            <>
              <Button
                variant="contained"
                size="small"
                className="database__submit__btn"
                style={{ display: isUpdateField ? "none" : "block" }}
                onClick={() => {
                  addNewValue();
                }}
              >
                +
              </Button>
            </>
          ) : fieldType === "Boolean" ? (
            <Form.Control
              as="select"
              value={valueInfoArray[0].value || "none"}
              onChange={(e) => handleValueInfoChange(e, 0, "value")}
            >
              <option value="none" disabled>
                --select--
              </option>
              <option value="TRUE">TRUE</option>
              <option value="FALSE">FALSE</option>
            </Form.Control>
          ) : fieldType === "Number" ? (
            <Form.Control
              type="number"
              value={(valueInfoArray[0] && valueInfoArray[0].value) || ""}
              onChange={(e) => handleValueInfoChange(e, 0, "value")}
            />
          ) : (
            <Form.Control
              value={(valueInfoArray[0] && valueInfoArray[0].value) || ""}
              onChange={(e) => handleValueInfoChange(e, 0, "value")}
            />
          )}
        </Form.Group>
        <Col md={2}></Col>
      </Row>

      {valueInfoArray &&
        valueInfoArray.map((value, index) => (
          <Row
            className="field__value__item"
            key={index}
            style={{
              display:
                fieldType === "Array" || fieldType === "Map" ? "flex" : "none",
            }}
          >
            <Col md={2}></Col>
            <Form.Group
              as={Col}
              md={4}
              style={{
                visibility: fieldType === "Array" ? "hidden" : "visible",
              }}
            >
              <Form.Label>Key</Form.Label>
              <Form.Control
                value={value.key}
                onChange={(e) => handleValueInfoChange(e, index, "key")}
              />
            </Form.Group>

            <Form.Group as={Col} md={2}>
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                value={value.type}
                onChange={(e) => handleValueInfoChange(e, index, "type")}
              >
                <option value="none" disabled></option>
                <option value="String">String</option>
                <option value="Number">Number</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} md={4}>
              <Form.Label>Value</Form.Label>
              <Form.Control
                type={
                  valueInfoArray[index]["type"] === "Number" ? "number" : "text"
                }
                value={value.value}
                onChange={(e) => handleValueInfoChange(e, index, "value")}
              />
            </Form.Group>
          </Row>
        ))}
    </>
  );
};

export default FieldInput;
