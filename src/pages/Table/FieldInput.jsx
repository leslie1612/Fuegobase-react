import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

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
  isInfoValueNumber,
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
      <Form.Group as={Col} controlId="formGridType">
        <Form.Label>Key</Form.Label>
        <Form.Control
          readOnly={isUpdateField ? true : false}
          value={fieldName}
          onChange={(e) => handleFieldNameChange(e)}
        />
      </Form.Group>

      <Form.Group as={Col} controlId="formGridType">
        <Form.Label>Type</Form.Label>
        <Form.Select
          disabled={isUpdateField}
          value={fieldType || "none"}
          onChange={(e) => handleTypeChange(e)}
        >
          <option value="none" disabled>
            --select--
          </option>
          <option value="String">String</option>
          <option value="Number">Number</option>
          <option value="Boolean">Boolean</option>
          <option value="Array">Array</option>
          <option value="Map">Map</option>
        </Form.Select>
      </Form.Group>

      <Form.Group as={Col} controlId="formGridValue">
        <Form.Label>Value</Form.Label>
        {fieldType === "Boolean" ? (
          <Form.Select
            value={valueInfoArray[0].value || "none"}
            onChange={(e) => handleValueInfoChange(e, 0, "value")}
          >
            <option value="none" disabled>
              --select--
            </option>
            <option value="TRUE">TRUE</option>
            <option value="FALSE">FALSE</option>
          </Form.Select>
        ) : fieldType === "Array" ? (
          <>
            {valueInfoArray &&
              valueInfoArray.map((value, index) => (
                <div key={index}>
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={value.type}
                    onChange={(e) => handleValueInfoChange(e, index, "type")}
                  >
                    <option value="none" disabled>
                      --select--
                    </option>
                    <option value="String">String</option>
                    <option value="Number">Number</option>
                  </Form.Select>
                  <Form.Group as={Col} controlId="formGridValue">
                    <Form.Label>Value</Form.Label>
                    <Form.Control
                      type={isInfoValueNumber ? "number" : "text"}
                      value={value.value}
                      onChange={(e) => handleValueInfoChange(e, index, "value")}
                    />
                  </Form.Group>
                </div>
              ))}
            <button
              style={{ display: isUpdateField ? "none" : "block" }}
              onClick={() => {
                addNewValue();
              }}
            >
              +
            </button>
          </>
        ) : fieldType === "Map" ? (
          <>
            {valueInfoArray &&
              valueInfoArray.map((value, index) => (
                <div key={index}>
                  <Form.Group as={Col} controlId="formGridValue">
                    <Form.Label>Key</Form.Label>
                    <Form.Control
                      value={value.key}
                      onChange={(e) => handleValueInfoChange(e, index, "key")}
                    />
                  </Form.Group>
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={value.type}
                    onChange={(e) => handleValueInfoChange(e, index, "type")}
                  >
                    <option value="none" disabled>
                      --select--
                    </option>
                    <option value="String">String</option>
                    <option value="Number">Number</option>
                  </Form.Select>
                  <Form.Group as={Col} controlId="formGridValue">
                    <Form.Label>Value</Form.Label>
                    <Form.Control
                      type={isInfoValueNumber ? "number" : "text"}
                      value={value.value}
                      onChange={(e) => handleValueInfoChange(e, index, "value")}
                    />
                  </Form.Group>
                  <h1>{isInfoValueNumber}</h1>
                </div>
              ))}
            <button
              style={{ display: isUpdateField ? "none" : "block" }}
              onClick={() => {
                addNewValue();
              }}
            >
              +
            </button>
          </>
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
    </>
  );
};

export default FieldInput;
