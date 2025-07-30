import { Star1 } from "@/assets/svgs";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: [
    "5 Mar",
    "6 Mar",
    "7 Mar",
    "8 Mar",
    "9 Mar",
    "10 Mar",
    "11 Mar",
    "12 Mar",
  ],
  datasets: [
    {
      label: "Green Portion",
      data: [40, 50, 30, 20, 15, 20, 10, 8],
      backgroundColor: "#00DC35",
      borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 5, bottomRight: 5 },
      barPercentage: 0.6,
      stack: "stack1",
    },
    {
      label: "Yellow Portion",
      data: [30, 40, 50, 30, 20, 30, 15, 12],
      backgroundColor: "#FFEB69",
      borderRadius: { topLeft: 5, topRight: 5, bottomLeft: 0, bottomRight: 0 },
      barPercentage: 0.6,
      stack: "stack1",
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      },
      stacked: true,
    },
  },
};

const TimeRange = ["1H", "1D", "1W", "1M", "1Y", "All"];

const PortfolioBarChart: React.FC = () => {
  const [timeSelected, setTimeSelected] = useState(TimeRange[0]);
  return (
    <div className="bg-white p-5 rounded-2xl w-full border">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <img src={Star1} alt="" />
        My Portfolio
      </h2>
      <Bar data={data} options={options} />
      <div className="h-9 p-1 w-fit mx-auto mt-4 rounded-full flex justify-center outline outline-1 outline-offset-[-1px] outline-[#e2e8ea] items-center gap-2">
        {TimeRange.map((item, index) => (
          <button
            key={index}
            className={`w-10 rounded-xl self-stretch flex justify-center items-center gap-2.5 ${
              item === timeSelected ? "bg-green-100 text-[#07A22C]" : ""
            }`}
            onClick={() => setTimeSelected(item)}
          >
            <div className="justify-start text-[#a7acae] text-sm font-medium ">
              {item}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PortfolioBarChart;
