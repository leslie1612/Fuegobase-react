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
}) => {
  const [isBoolean, setIsBoolean] = React.useState(false);
  const [isArray, setIsArray] = React.useState(false);
  const [isMap, setIsMap] = React.useState(false);

  const [arrayValues, setArrayValues] = React.useState([]);
  const [mapValues, setMapValues] = React.useState([]);

  // -----------------change here

  // React.useEffect(() => {
  //   console.log("******* in Effect for isArray", isArray);
  //   // if field type is array, set a empty array for array input
  //   if (isArray) {
  //     setArrayValues([{ type: "String", value: "" }]);
  //   }
  // }, [isArray]);

  // React.useEffect(() => {
  //   console.log("******* in Effect for isMap", isMap);
  //   // if field type is map, set a empty array for map input
  //   if (isMap) {
  //     setMapValues([{ key: "", type: "String", value: "" }]);
  //   }
  // }, [isMap]);

  React.useEffect(() => {
    console.log("*** in new Effect");
    setInitialValueInfo();
  }, []);

  // ----------------------------

  const handleTypeChange = (event) => {
    setInitialValueInfo();
    // when field type change
    let type = event.target.value;
    setIsBoolean(type === "Boolean");
    // console.log("******** Before", isArray); // false
    setIsArray(type === "Array");
    // console.log("******** After", isArray); // false

    setIsMap(type === "Map");

    handleFieldTypeChange(type);
  };

  // -----------------change here

  // const handleArrayValueChange = (event, index, field) => {
  //   // when value.type or value.value change, call this function and set input data into array
  //   console.log("in handleArrayValueChange ", event.target.value);

  //   // field: type, value
  //   arrayValues[index][field] = event.target.value; // change value
  //   setArrayValues([...arrayValues]); // set the change value into array
  // };

  // const handleMapValueChange = (event, index, field) => {
  //   // field: key, type, value
  //   mapValues[index][field] = event.target.value;
  //   setMapValues([...mapValues]);
  // };

  // const handleValueInfoChange = (event, index, field) => {
  //   // when value.type or value.value change, call this function and set input data into array
  //   console.log("in handleValueChange ", event.target.value);

  //   // field: type, value
  //   valueInfoArray[index][field] = event.target.value; // change value
  //   setValueInfoArray([...valueInfoArray]); // set the change value into array
  // };

  // -----------------------------------

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
            value={valueInfoArray[0].value || "none"}
            onChange={(e) => handleValueInfoChange(e, 0, "value")}
          >
            <option value="none" disabled>
              --select--
            </option>
            <option value="TRUE">TRUE</option>
            <option value="FALSE">FALSE</option>
          </Form.Select>
        ) : isArray ? (
          <>
            {valueInfoArray.map((value, index) => (
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
                  {/* <option value="Boolean">Boolean</option> */}
                </Form.Select>
                <Form.Group as={Col} controlId="formGridValue">
                  <Form.Label>Value</Form.Label>
                  <Form.Control
                    value={value.value}
                    onChange={(e) => handleValueInfoChange(e, index, "value")}
                  />
                </Form.Group>
              </div>
            ))}
            <button
              onClick={() => {
                console.log("&&&&&&&&& on click", valueInfoArray);
                // when click add btn, set a new object for new input
                addNewValue();
              }}
            >
              +
            </button>
          </>
        ) : // <>
        //   {arrayValues.map((value, index) => (
        //     <div key={index}>
        //       <Form.Label>Type</Form.Label>
        //       <Form.Select
        //         value={value.type}
        //         onChange={(e) => handleArrayValueChange(e, index, "type")}
        //       >
        //         <option value="none" disabled>
        //           --select--
        //         </option>
        //         <option value="String">String</option>
        //         <option value="Number">Number</option>
        //         {/* <option value="Boolean">Boolean</option> */}
        //       </Form.Select>
        //       <Form.Group as={Col} controlId="formGridValue">
        //         <Form.Label>Value</Form.Label>
        //         <Form.Control
        //           value={value.value}
        //           onChange={(e) => handleArrayValueChange(e, index, "value")}
        //         />
        //       </Form.Group>
        //     </div>
        //   ))}
        //   <button
        //     onClick={() => {
        //       console.log("&&&&&&&&& on click", arrayValues);
        //       // when click add btn, set a new object for new input
        //       setArrayValues([...arrayValues, { type: "String", value: "" }]);
        //     }}
        //   >
        //     +
        //   </button>
        // </>
        isMap ? (
          <>
            {valueInfoArray.map((value, index) => (
              <div key={index}>
                <Form.Group as={Col} controlId="formGridValue">
                  <Form.Label>Key</Form.Label>
                  <Form.Control
                    value={value.key}
                    onChange={(e) => handleValueInfoChange(e, index, "key")}
                  />
                </Form.Group>
                <Form.Label>Type</Form.Label>
                {/* <Form.Select onChange={(e) => setFieldSubType(e.target.value)}> */}
                <Form.Select
                  value={value.type}
                  onChange={(e) => handleValueInfoChange(e, index, "type")}
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
                    onChange={(e) => handleValueInfoChange(e, index, "value")}
                  />
                </Form.Group>
              </div>
            ))}
            <button
              onClick={() => {
                console.log("&&&&&&&&&", valueInfoArray);
                addNewValue();
              }}
            >
              +
            </button>
          </>
        ) : (
          <Form.Control
            onChange={(e) => handleValueInfoChange(e, 0, "value")}
          />
        )}
      </Form.Group>
    </>
  );
};

export default FieldInput;
