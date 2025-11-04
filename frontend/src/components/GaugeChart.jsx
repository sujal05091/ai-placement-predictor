// Gauge Chart Component using Plotly.js
import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';

const GaugeChart = ({ value = 0, title = 'Placement Probability' }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      console.log('📈 Gauge Chart updating with new value:', value);
      
      const data = [
        {
          type: 'indicator',
          mode: 'gauge+number+delta',
          value: value,
          title: { text: title, font: { size: 24, color: '#ffffff' } },
          delta: { reference: 50, increasing: { color: '#4caf50' } },
          gauge: {
            axis: { range: [null, 100], tickwidth: 1, tickcolor: '#ffffff' },
            bar: { color: value >= 70 ? '#4caf50' : value >= 50 ? '#ff9800' : '#f44336' },
            bgcolor: 'rgba(255,255,255,0.1)',
            borderwidth: 2,
            bordercolor: '#ffffff',
            steps: [
              { range: [0, 50], color: 'rgba(244, 67, 54, 0.3)' },
              { range: [50, 70], color: 'rgba(255, 152, 0, 0.3)' },
              { range: [70, 100], color: 'rgba(76, 175, 80, 0.3)' }
            ],
            threshold: {
              line: { color: 'red', width: 4 },
              thickness: 0.75,
              value: 90
            }
          }
        }
      ];

      const layout = {
        width: 400,
        height: 300,
        margin: { t: 50, r: 25, l: 25, b: 25 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#ffffff', family: 'Roboto, sans-serif' }
      };

      const config = {
        displayModeBar: false,
        responsive: true
      };

      Plotly.newPlot(chartRef.current, data, layout, config);
    }
  }, [value, title]);

  return <div ref={chartRef} style={{ display: 'flex', justifyContent: 'center' }} />;
};

export default GaugeChart;
