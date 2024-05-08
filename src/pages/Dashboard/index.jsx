import React from "react";
import Plot from "react-plotly.js";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import API from "../../utils/api";
import "./Dashboard.css";

const Dashboard = () => {
  const { projectId } = useParams();
  const [date, setDate] = React.useState([]);
  const [read, setRead] = React.useState([]);
  const [write, setWrite] = React.useState([]);
  const [storage, setStorage] = React.useState("");
  const [collectionCount, setCollectionCount] = React.useState("");
  const [documentCount, setDocumentCount] = React.useState("");

  React.useEffect(() => {
    async function fetchReadWritwData() {
      const response = await API.getReadWriteData(projectId);
      console.log(response);
      let jsonData = response.data;
      setDate(jsonData.map((i) => i.date));
      setRead(jsonData.map((i) => i.readCount));
      setWrite(jsonData.map((i) => i.writeCount));
    }

    async function fetchStorageData() {
      const response = await API.getStorgae(projectId);
      let count = parseFloat(response.data.toFixed(3));
      setStorage(count);
    }

    async function fetchCollectionData() {
      const response = await API.getCollectionCount(projectId);
      setCollectionCount(response.data);
    }

    async function fetchDocumentData() {
      const response = await API.getDocumentCount(projectId);
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
      <h1 className="dashboard_title">Usage</h1>
      <div class="dashboard__container">
        <div class="c-dashboardInfo col-lg-4 col-sm-6">
          <div class="wrap">
            <h4 class="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
              Total Storage
            </h4>
            <span class="hind-font caption-12 c-dashboardInfo__count">
              {storage} MB
            </span>
          </div>
        </div>

        <div class="c-dashboardInfo col-lg-4 col-sm-6">
          <div class="wrap">
            <h4 class="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
              Total Collections
            </h4>
            <span class="hind-font caption-12 c-dashboardInfo__count">
              {collectionCount}
            </span>
          </div>
        </div>

        <div class="c-dashboardInfo col-lg-4 col-sm-6">
          <div class="wrap">
            <h4 class="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
              Total Documents
            </h4>
            <span class="hind-font caption-12 c-dashboardInfo__count">
              {documentCount}
            </span>
          </div>
        </div>
      </div>

      <div className="plot-container">
        <Plot
          data={[
            {
              x: date,
              y: read,
              type: "scatter",
              name: "Read",
              marker: { color: "#495057" },
            },
            {
              x: date,
              y: write,
              type: "scatter",
              name: "Write",
              marker: { color: "#fca311" },
            },
          ]}
          layout={{
            title: "Read and Write Operations",
            xaxis: {
              title: "Operations (per day)",
            },

            width: 700,
            height: 400,
          }}
        />
      </div>
    </>
  );
};

export default Dashboard;
