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
      setDate(jsonData.map((i) => i.date.join(".")));
      setRead(jsonData.map((i) => i.readCount));
      setWrite(jsonData.map((i) => i.writeCount));
    }

    async function fetchStorageData() {
      const response = await API.getStorgae(projectId);
      setStorage(response.data);
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
      <Layout>
        <h1 className="dashboard_title">Usage</h1>
        <div class="dashboard__container">
          {/* <div class="row align-items-stretch"> */}
          <div class="c-dashboardInfo col-lg-4 col-md-6">
            <div class="wrap">
              <h4 class="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
                Total Storage
                {/* <svg
                  class="MuiSvgIcon-root-19"
                  focusable="false"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  role="presentation"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                </svg> */}
              </h4>
              <span class="hind-font caption-12 c-dashboardInfo__count">
                {storage} MB
              </span>
            </div>
          </div>

          <div class="c-dashboardInfo col-lg-4 col-md-6">
            <div class="wrap">
              <h4 class="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
                Total Collections
                {/* <svg
                  class="MuiSvgIcon-root-19"
                  focusable="false"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  role="presentation"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                </svg> */}
              </h4>
              <span class="hind-font caption-12 c-dashboardInfo__count">
                {collectionCount}
              </span>
            </div>
          </div>

          <div class="c-dashboardInfo col-lg-4 col-md-6">
            <div class="wrap">
              <h4 class="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
                Total Documents
                {/* <svg
                  class="MuiSvgIcon-root-19"
                  focusable="false"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  role="presentation"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                </svg> */}
              </h4>
              <span class="hind-font caption-12 c-dashboardInfo__count">
                {documentCount}
              </span>
            </div>
          </div>

          {/* <div class="col-md-4">
              <div class="dashboardCard card-1">
                <h3 class="dashboard_info">Total Storage : {storage} MB</h3>
              </div>
            </div>
            <div class="col-md-4">
              <div class="dashboardCard card-2">
                <h3 class="dashboard_info">
                  Total Collections : {collectionCount}{" "}
                </h3>
              </div>
            </div>
            <div class="col-md-4">
              <div class="dashboardCard card-3">
                <h3 class="dashboard_info">
                  Total Documents : {documentCount}
                </h3>
              </div>
            </div> */}
          {/* </div> */}
        </div>

        <div className="plot-container">
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
      </Layout>
    </>
  );
};

export default Dashboard;
