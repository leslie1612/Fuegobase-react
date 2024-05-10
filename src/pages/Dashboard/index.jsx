import React, { useState } from "react";
import Plot from "react-plotly.js";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, registerables } from "chart.js";
import CountUp from "react-countup";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(7, "day").toDate(),
    dayjs().subtract(1, "day").toDate(),
  ]);
  const [startDate, endDate] = dateRange;

  React.useEffect(() => {
    async function fetchReadWritwData() {
      const response = await API.getReadWriteData(
        projectId,
        dayjs().subtract(7, "day").format("YYYY-MM-DD"),
        dayjs().subtract(1, "day").format("YYYY-MM-DD")
      );
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

  Chart.register(...registerables);

  const data = {
    labels: date,
    datasets: [
      {
        label: "Reads",
        data: read,
        borderColor: "#495057",
        backgroundColor: "RGB(73,80,87,0.8)",
      },
      {
        label: "Writes",
        data: write,
        borderColor: "#fca311",
        backgroundColor: "RGB(252,163,17,0.8)",
      },
    ],
  };

  const handleDateChange = async (update) => {
    setDateRange(update);
    console.log("date tange", dateRange);
    const formattedStartDate = dayjs(update[0]).format("YYYY-MM-DD");
    const formattedEndDate = dayjs(update[1]).format("YYYY-MM-DD");

    if (
      formattedStartDate !== "Invalid Date" &&
      formattedEndDate !== "Invalid Date"
    ) {
      console.log(formattedStartDate, formattedEndDate);

      const response = await API.getReadWriteData(
        projectId,
        formattedStartDate,
        formattedEndDate
      );
      let jsonData = response.data;
      setDate(jsonData.map((i) => i.date));
      setRead(jsonData.map((i) => i.readCount));
      setWrite(jsonData.map((i) => i.writeCount));
    }
  };

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
              <CountUp
                class="hind-font caption-12 c-dashboardInfo__count"
                start={0}
                end={storage}
                decimals={3}
                duration={2}
                suffix=" MB"
              ></CountUp>
            </span>
          </div>
        </div>

        <div class="c-dashboardInfo col-lg-4 col-sm-6">
          <div class="wrap">
            <h4 class="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
              Total Collections
            </h4>
            <span class="hind-font caption-12 c-dashboardInfo__count">
              <CountUp
                class="hind-font caption-12 c-dashboardInfo__count"
                end={collectionCount}
                duration={3}
              />
            </span>
          </div>
        </div>

        <div class="c-dashboardInfo col-lg-4 col-sm-6">
          <div class="wrap">
            <h4 class="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
              Total Documents
            </h4>
            <span class="hind-font caption-12 c-dashboardInfo__count">
              <CountUp
                class="hind-font caption-12 c-dashboardInfo__count"
                end={documentCount}
                duration={3}
              />
            </span>
          </div>
        </div>
      </div>

      <DatePicker
        className="customDatePickerWidth"
        showIcon
        dateFormat="yyyy/MM/dd"
        onChange={(update) => handleDateChange(update)}
        startDate={startDate}
        endDate={endDate}
        selectsRange={true}
        placeholderText="Click to select a date"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 48 48"
          >
            <mask id="ipSApplication0">
              <g
                fill="none"
                stroke="#fff"
                strokeLinejoin="round"
                strokeWidth="4"
              >
                <path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
                <path
                  fill="#fff"
                  d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                ></path>
              </g>
            </mask>
            <path
              fill="currentColor"
              d="M0 0h48v48H0z"
              mask="url(#ipSApplication0)"
            ></path>
          </svg>
        }
      />

      <div className="plot-container">
        <div>
          <Line
            data={data}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Read and Write Operations",
                  font: {
                    size: 20,
                  },
                },
                legend: {
                  display: true,
                  position: "bottom",
                },
              },
            }}
            width={800}
            height={400}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
