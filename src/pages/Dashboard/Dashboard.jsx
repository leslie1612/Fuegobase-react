import React from "react";
import Plot from "react-plotly.js";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import SettingPage from "../SettingPage/SettingPage";
import "./Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("id");
  const [date, setDate] = React.useState([]);
  const [read, setRead] = React.useState([]);
  const [write, setWrite] = React.useState([]);
  const [storage, setStorage] = React.useState("");
  const [collectionCount, setCollectionCount] = React.useState("");
  const [documentCount, setDocumentCount] = React.useState("");

  React.useEffect(() => {
    async function fetchReadWritwData() {
      const response = await api.getReadWriteData(projectId);
      console.log(response);
      let jsonData = response.data;
      setDate(jsonData.map((i) => i.date.join(".")));
      setRead(jsonData.map((i) => i.readCount));
      setWrite(jsonData.map((i) => i.writeCount));
    }

    async function fetchStorageData() {
      const response = await api.getStorgae(projectId);
      setStorage(response.data);
    }

    async function fetchCollectionData() {
      const response = await api.getCollectionCount(projectId);
      setCollectionCount(response.data);
    }

    async function fetchDocumentData() {
      const response = await api.getDocumentCount(projectId);
      setDocumentCount(response.data);
    }

    if (projectId) {
      fetchReadWritwData();
      fetchStorageData();
      fetchCollectionData();
      fetchDocumentData();
    }
  }, []);

  return (
    <>
      <Header />

      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <div class="dashboardCard card-1">
              <h3>Total Storage : {storage} MB</h3>
            </div>
          </div>
          <div class="col-md-4">
            <div class="dashboardCard card-2">
              <h3>Total Collections: {collectionCount} </h3>
            </div>
          </div>
          <div class="col-md-4">
            <div class="dashboardCard card-3">
              <h3>Total Documents: {documentCount}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard">
        <Plot
          data={[
            {
              x: date,
              y: read,
              type: "scatter",
              name: "Read",
            },
            {
              x: date,
              y: write,
              type: "scatter",
              name: "Write",
              marker: { color: "orange" },
            },
          ]}
          layout={{
            title: "Read and Write Operations",
            xaxis: {
              title: "Operations (per day)",
            },
            // yaxis: {
            //   title: "Counts",
            // },
            width: 800,
            height: 500,
          }}
        />
      </div>
    </>
  );
};

export default Dashboard;
