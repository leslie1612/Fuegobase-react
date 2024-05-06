import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
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
        <Form.Group as={Col} md={3} controlId="formGridType">
          <InputLabel>Key</InputLabel>
          <TextField
            size="small"
            readOnly={isUpdateField ? true : false}
            value={fieldName || ""}
            onChange={(e) => handleFieldNameChange(e)}
            inputProps={{
              maxLength: 50,
            }}
          />
        </Form.Group>

        <Form.Group as={Col} md={2} controlId="formGridType">
          <InputLabel>Type</InputLabel>
          <Select
            size="small"
            required
            disabled={isUpdateField}
            value={fieldType || "none"}
            onChange={(e) => handleTypeChange(e)}
            sx={{
              minWidth: 120,
            }}
          >
            <MenuItem value="none" disabled></MenuItem>
            <MenuItem value="String">String</MenuItem>
            <MenuItem value="Number">Number</MenuItem>
            <MenuItem value="Boolean">Boolean</MenuItem>
            <MenuItem value="Array">Array</MenuItem>
            <MenuItem value="Map">Map</MenuItem>
          </Select>
        </Form.Group>

        <Form.Group as={Col} md={4} controlId="formGridValue">
          <InputLabel>Value</InputLabel>
          {fieldType === "Array" ? (
            <>
              <IconButton
                size="small"
                style={{
                  display: isUpdateField ? "none" : "block",
                  margin: 5,
                }}
                onClick={() => {
                  addNewValue();
                }}
              >
                <AddCircleIcon
                  sx={{
                    fontSize: 30,
                  }}
                />
              </IconButton>
            </>
          ) : fieldType === "Map" ? (
            <IconButton
              size="small"
              style={{
                display: isUpdateField ? "none" : "block",
                margin: 5,
              }}
              onClick={() => {
                addNewValue();
              }}
            >
              <AddCircleIcon
                sx={{
                  fontSize: 30,
                }}
              />
            </IconButton>
          ) : fieldType === "Boolean" ? (
            <Select
              size="small"
              value={valueInfoArray[0].value || "none"}
              onChange={(e) => handleValueInfoChange(e, 0, "value")}
            >
              <MenuItem value="none" disabled>
                --select--
              </MenuItem>
              <MenuItem value="TRUE">TRUE</MenuItem>
              <MenuItem value="FALSE">FALSE</MenuItem>
            </Select>
          ) : fieldType === "Number" ? (
            <TextField
              size="small"
              type="number"
              inputProps={{
                maxLength: 50,
              }}
              value={(valueInfoArray[0] && valueInfoArray[0].value) || ""}
              onChange={(e) => handleValueInfoChange(e, 0, "value")}
            />
          ) : (
            <TextField
              fullWidth
              size="small"
              type="text"
              inputProps={{
                maxLength: 200,
              }}
              value={(valueInfoArray[0] && valueInfoArray[0].value) || ""}
              onChange={(e) => handleValueInfoChange(e, 0, "value")}
              sx={{ minWidth: 400 }}
            />
          )}
        </Form.Group>
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
              md={3}
              style={{
                visibility: fieldType === "Array" ? "hidden" : "visible",
              }}
            >
              <InputLabel>Key</InputLabel>
              <TextField
                size="small"
                fullWidth
                value={value.key}
                onChange={(e) => handleValueInfoChange(e, index, "key")}
                inputProps={{
                  maxLength: 50,
                }}
              />
            </Form.Group>

            <Form.Group as={Col} md={2}>
              <InputLabel>Type</InputLabel>
              <Select
                size="small"
                required
                value={value.type}
                onChange={(e) => handleValueInfoChange(e, index, "type")}
                sx={{
                  minWidth: 120,
                }}
              >
                <MenuItem value="none" disabled></MenuItem>
                <MenuItem value="String">String</MenuItem>
                <MenuItem value="Number">Number</MenuItem>
              </Select>
            </Form.Group>
            <Form.Group as={Col} md={3}>
              <InputLabel>Value</InputLabel>
              <TextField
                size="small"
                required
                type={
                  valueInfoArray[index]["type"] === "Number" ? "number" : "text"
                }
                value={value.value}
                onChange={(e) => handleValueInfoChange(e, index, "value")}
                inputProps={{
                  maxLength: 200,
                }}
                sx={{ minWidth: 350 }}
              />
            </Form.Group>
          </Row>
        ))}
    </>
  );
};

export default FieldInput;
