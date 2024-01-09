import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';

interface LineChartProps {
  chartData: any;
}

const LineChart: React.FC<LineChartProps> = ({ chartData }) => {
  const [chartOptions, setChartOptions] = useState<any>({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
            display:false,
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
      responsive: true,
    };
    

    setChartOptions(options);
  }, []);

  return (
    <div className="card">
      <Chart className='h-[22rem]' type="line" data={chartData} options={chartOptions} />
    </div>
  );
};

export default LineChart;
