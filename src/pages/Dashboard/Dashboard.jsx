import React from "react";
import Plot from "react-plotly.js";
import { useLocation } from "react-router-dom";

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
      <h1>This is Dashboard</h1>
      <h2>Total Storage : {storage} MB</h2>
      <h2>Total Collections : {collectionCount} </h2>
      <h2>Total Documents : {documentCount}</h2>
      <div
        className="App"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
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
