import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

const FieldInput = ({
  fieldName,
  handleFieldNameChange,
  fieldType,
  handleFieldTypeChange,
  fieldMapName,
  handleFieldMapNameChange,
  fieldSubType,
  handleFieldSubTypeChange,
  fieldValue,
  handleFieldValueChange,
}) => {
  const [selectedType, setSelectedType] = React.useState("");
  const [selectedSubType, setSelectedSubType] = React.useState("");
  const [isBoolean, setIsBoolean] = React.useState(false);
  const [isSubTypeBoolean, setIsSubTypeBoolean] = React.useState(false);
  const [isArray, setIsArray] = React.useState(false);
  const [isMap, setIsMap] = React.useState(false);

  const [arrayValues, setArrayValues] = React.useState([]);
  const [mapValues, setMapValues] = React.useState([]);

  React.useEffect(() => {
    console.log("******* in Effect for isArray", isArray);
    if (isArray) {
      setArrayValues([{ type: "String", value: "" }]);
    }
  }, [isArray]);

  React.useEffect(() => {
    console.log("******* in Effect for isMap", isMap);
    if (isMap) {
      setMapValues([{ key: "", type: "String", value: "" }]);
    }
  }, [isMap]);

  const handleTypeChange = (event) => {
    let type = event.target.value;
    // setSelectedType(type);
    setIsBoolean(type === "Boolean");
    console.log("******** Before", isArray); // false
    setIsArray(type === "Array");
    console.log("******** After", isArray); // false

    setIsMap(type === "Map");

    handleFieldTypeChange(type);
  };

  const handleArrayValueChange = (event, index, field) => {
    // field: type, value
    arrayValues[index][field] = event.target.value;
    setArrayValues([...arrayValues]);
  };

  const handleMapValueChange = (event, index, field) => {
    // field: key, type, value
    mapValues[index][field] = event.target.value;
    setMapValues([...mapValues]);
  };

  const [queryParams, setQueryParams] = useState([]);

  return (
    <>
      <Form.Group as={Col} controlId="formGridType">
        <Form.Label>Key</Form.Label>
        <Form.Control
          value={fieldName}
          onChange={(e) => handleFieldNameChange(e)}
        />
      </Form.Group>

      <Form.Group as={Col} controlId="formGridType">
        <Form.Label>Type</Form.Label>
        <Form.Select
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
        {isBoolean ? (
          <Form.Select
            value={fieldValue}
            onChange={(e) => handleFieldValueChange(e)}
          >
            <option value="TRUE">TRUE</option>
            <option value="FALSE">FALSE</option>
          </Form.Select>
        ) : isArray ? (
          <>
            {arrayValues.map((value, index) => (
              <div key={index}>
                <Form.Label>Type</Form.Label>
                {/* <Form.Select onChange={(e) => setFieldSubType(e.target.value)}> */}
                <Form.Select
                  value={value.type}
                  onChange={(e) => handleArrayValueChange(e, index, "type")}
                >
                  <option value="none" disabled>
                    --select--
                  </option>
                  <option value="String">String</option>
                  <option value="Number">Number</option>
                  {/* <option value="Boolean">Boolean</option> */}
                </Form.Select>
                <Form.Group as={Col} controlId="formGridValue">
                  <Form.Label>Value</Form.Label>
                  <Form.Control
                    value={value.value}
                    onChange={(e) => handleArrayValueChange(e, index, "value")}
                  />
                </Form.Group>
              </div>
            ))}
            <button
              onClick={() => {
                console.log("&&&&&&&&&", arrayValues);
                setArrayValues([...arrayValues, { type: "String", value: "" }]);
              }}
            >
              +
            </button>
          </>
        ) : isMap ? (
          <>
            {mapValues.map((value, index) => (
              <div key={index}>
                <Form.Group as={Col} controlId="formGridValue">
                  <Form.Label>Key</Form.Label>
                  <Form.Control
                    value={value.key}
                    onChange={(e) => handleMapValueChange(e, index, "key")}
                  />
                </Form.Group>
                <Form.Label>Type</Form.Label>
                {/* <Form.Select onChange={(e) => setFieldSubType(e.target.value)}> */}
                <Form.Select
                  value={value.type}
                  onChange={(e) => handleMapValueChange(e, index, "type")}
                >
                  <option value="none" disabled>
                    --select--
                  </option>
                  <option value="String">String</option>
                  <option value="Number">Number</option>
                  {/* <option value="Boolean">Boolean</option> */}
                </Form.Select>
                <Form.Group as={Col} controlId="formGridValue">
                  <Form.Label>Value</Form.Label>
                  <Form.Control
                    value={value.value}
                    onChange={(e) => handleMapValueChange(e, index, "value")}
                  />
                </Form.Group>
              </div>
            ))}
            <button
              onClick={() => {
                console.log("&&&&&&&&&", mapValues);
                setMapValues([
                  ...mapValues,
                  { key: "", type: "String", value: "" },
                ]);
              }}
            >
              +
            </button>
          </>
        ) : (
          <Form.Control
            value={fieldValue}
            onChange={(e) => handleFieldValueChange(e)}
          />
        )}
      </Form.Group>
    </>
  );
};

export default FieldInput;
