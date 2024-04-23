import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import Header from "../../components/Header";
import { useLocation } from "react-router-dom";
import "./query.css";

const QueryIndex = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("id");
  const apiKey = searchParams.get("apikey");
  const [collections, setCollections] = useState([]);

  React.useEffect(() => {
    if (projectId) {
      api.getCollections(projectId, apiKey).then((json) => {
        setCollections(json.data);
      });
    }
  }, [projectId]);
  return (
    <>
      <Header />
      <Container>
        <Row>
          <Col>Collection: </Col>
          <Col>
            <Form.Select aria-label="Select number">
              <option selected="true" disabled hidden>
                choose a collection name
              </option>
              {collections.map((collection, index) => (
                <option key={collection.id}>{collection.name}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Row>
          <Col sm>WHERE</Col>
          <Col sm>Field key </Col>
          <Col sm>==</Col>
          <Col sm>value</Col>
        </Row>
      </Container>
      {/* <table class="table">
        <thead class="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </table> 
                  // <Form.Select aria-label="Select number">
            //   {collections.map((collection, index) => (
            //     <option key={collection.id}>{collection.name}</option>
            //   ))}
            // </Form.Select>*/}
    </>
  );
};

export default QueryIndex;
