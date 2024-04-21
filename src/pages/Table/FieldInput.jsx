import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";

const FieldInput = ({
  setFieldName,
  setFieldType,
  setFieldMapName,
  setFieldSubType,
  setFieldValue,
}) => {
  const [selectedType, setSelectedType] = React.useState("");
  const [selectedSubType, setSelectedSubType] = React.useState("");
  const [isBoolean, setIsBoolean] = React.useState(false);
  const [isSubTypeBoolean, setIsSubTypeBoolean] = React.useState(false);
  const [isArray, setIsArray] = React.useState(false);
  const [isMap, setIsMap] = React.useState(false);
  // const [subType, setSubType] = React.useState("String");
  // const [subValue, setSubValue] = React.useState("");

  const handleTypeChange = (event) => {
    let type = event.target.value;
    setSelectedType(type);
    setIsBoolean(type === "Boolean");
    setIsArray(type === "Array");
    setIsMap(type === "Map");

    setFieldType(event.target.value);
  };

  const handleSubTypeChange = (event) => {
    let type = event.target.value;
    setSelectedSubType(type);
    setIsSubTypeBoolean(type === "Boolean");

    setFieldSubType(event.target.value);
  };

  return (
    <>
      <Form.Group as={Col} controlId="formGridType">
        <Form.Label>Key</Form.Label>
        <Form.Control onChange={(e) => setFieldName(e.target.value)} />
      </Form.Group>

      <Form.Group as={Col} controlId="formGridType">
        <Form.Label>Type</Form.Label>
        <Form.Select value={selectedType} onChange={handleTypeChange}>
          <option value="String">String</option>
          <option value="Number">Number</option>
          <option value="Boolean">Boolean</option>
          <option value="Array">Array</option>
          <option value="Map">Map</option>
        </Form.Select>
      </Form.Group>

      <Form.Group as={Col} controlId="formGridValue">
        <Form.Label>Value</Form.Label>
        {isBoolean ? (
          <Form.Select onChange={(e) => setFieldValue(e.target.value)}>
            <option value="TRUE">TRUE</option>
            <option value="FALSE">FALSE</option>
          </Form.Select>
        ) : isArray ? (
          <>
            <Form.Group as={Col} controlId="formGridSubType">
              <Form.Label>Type</Form.Label>
              {/* <Form.Select onChange={(e) => setFieldSubType(e.target.value)}> */}
              <Form.Select
                value={selectedSubType}
                onChange={handleSubTypeChange}
              >
                <option value="String">String</option>
                <option value="Number">Number</option>
                <option value="Boolean">Boolean</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridValue">
              <Form.Label>Value</Form.Label>
              {isSubTypeBoolean ? (
                <Form.Select onChange={(e) => setFieldValue(e.target.value)}>
                  <option value="TRUE">TRUE</option>
                  <option value="FALSE">FALSE</option>
                </Form.Select>
              ) : (
                <Form.Control onChange={(e) => setFieldValue(e.target.value)} />
              )}
            </Form.Group>
          </>
        ) : isMap ? (
          <>
            <Form.Group as={Col} controlId="formGridSubType">
              <Form.Label>Key</Form.Label>
              <Form.Control onChange={(e) => setFieldMapName(e.target.value)} />
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={selectedSubType}
                onChange={handleSubTypeChange}
              >
                <option value="String">String</option>
                <option value="Number">Number</option>
                <option value="Boolean">Boolean</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridValue">
              <Form.Label>Value</Form.Label>
              {isSubTypeBoolean ? (
                <Form.Select onChange={(e) => setFieldValue(e.target.value)}>
                  <option value="TRUE">TRUE</option>
                  <option value="FALSE">FALSE</option>
                </Form.Select>
              ) : (
                <Form.Control onChange={(e) => setFieldValue(e.target.value)} />
              )}
            </Form.Group>
          </>
        ) : (
          <Form.Control onChange={(e) => setFieldValue(e.target.value)} />
        )}
      </Form.Group>
    </>
  );
};

export default FieldInput;
