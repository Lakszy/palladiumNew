import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

interface DoughnutChartProps {
  data: { value: number; color: string; image?: string; label: string }[];
  labels: string[];
}

const DoughnutChartDemo: React.FC<DoughnutChartProps> = ({ data, labels }) => {
  const [chartData, setChartData] = useState<any>({});
  const [chartOptions, setChartOptions] = useState<any>({});

  useEffect(() => {
    const newData = {
      labels: labels,
      datasets: [
        {
          data: data.map((item) => item.value),
          backgroundColor: data.map((item) => item.color),
          hoverBackgroundColor: data.map((item) => item.color),
        },
      ],
    };

    const options = {
      cutout: '75%',
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        xAxis: [
          {
            display: false, // Hide X-axis labels
          },
        ],
        yAxis: [
          {
            display: false, 
          },
        ],
      },
    };

    setChartData(newData);
    setChartOptions(options);
  }, [data, labels]);

  return (
    <div className="">
      <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
    </div>
  );
};

export default DoughnutChartDemo;
