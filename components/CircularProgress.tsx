// import React, { useEffect } from 'react';
// import { Chart } from 'chart.js/auto';

// interface CircularProgressBarProps {
//   progress: number;
// }

// const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ progress }) => {
//   useEffect(() => {
//     const ctx = document.getElementById('progressChart') as HTMLCanvasElement | null;

//     if (ctx) {
//       const data = {
//         datasets: [{
//           data: [progress,10-progress],
//           backgroundColor: ['#4CAF50', '#e0e0e0'],
//         }],
//       };
//       const options: Chart.ChartOptions = {
//         cutoutPercentage: 90,
//         rotation: Math.PI / 2,
//         circumference: Math.PI,
//         tooltips: { enabled: false },
//         hover: { mode: null as unknown as 'index' | 'dataset' | 'point' | 'nearest' | 'x' | 'y' | undefined },
//         responsive: true,
//         maintainAspectRatio: false,
//       };

//       const progressChart = new Chart(ctx, {
//         type: 'doughnut',
//         data: data,
//         options: options,
//       });

//       return () => {
//         progressChart.destroy();
//       };
//     }
//   }, [progress]);

//   return (
//     <div style={{ width: '100px', height: '100px' }}>
//       <canvas id="progressChart"></canvas>
//     </div>
//   );
// };
// export default CircularProgressBar;