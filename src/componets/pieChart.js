import React from 'react';
import { useSelector } from 'react-redux';
import { Chart } from 'react-google-charts';

function PieChart() {
  const state = useSelector((state) => state.auth.language);
  const chartData = [
    ["Language", "Attempts", { role: "tooltip", p: { html: true } }],
    ...Object.entries(state).map(([language, stats]) => {
      const successRate = stats.attempt > 0 
        ? ((stats.correct / stats.attempt) * 100).toFixed(2) 
        : 0;
      return [
        language,
        stats.attempt,
        `<div style="padding: 10px; font-size: 14px;">
          <strong>${language}</strong><br/>
          <span style="color: gray;">Attempts:</span> ${stats.attempt}<br/>
          <span style="color: gray;">Correct:</span> ${stats.correct}<br/>
          <span style="color: gray;">Success Rate:</span> ${successRate}%
         </div>`,
      ];
    }),
  ];

  const chartOptions = {
    title: "Language Attempts",
    is3D: true,
    pieHole: 0.4,
    tooltip: { isHtml: true },
  };

  return (
    <div>
      <Chart
        chartType="PieChart"
        data={chartData}
        options={chartOptions}
        width="100%"
        height="400px"
      />
    </div>
  );
}

export default PieChart;
