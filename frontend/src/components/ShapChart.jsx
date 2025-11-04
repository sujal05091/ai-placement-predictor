// SHAP Values Chart Component using Plotly.js
import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';

const ShapChart = ({ data = {}, title = 'Key Decision Factors' }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && Object.keys(data).length > 0) {
      console.log('📊 SHAP Chart updating with new data:', data);
      
      // Convert data object to arrays
      const labels = Object.keys(data);
      const values = Object.values(data);

      // Sort by absolute value for better visualization
      const sortedIndices = values
        .map((val, idx) => ({ val, idx }))
        .sort((a, b) => Math.abs(b.val) - Math.abs(a.val))
        .map(item => item.idx);

      const sortedLabels = sortedIndices.map(idx => labels[idx]);
      const sortedValues = sortedIndices.map(idx => values[idx]);

      const plotData = [
        {
          type: 'bar',
          x: sortedValues,
          y: sortedLabels,
          orientation: 'h',
          marker: {
            color: sortedValues.map(val => val >= 0 ? '#4caf50' : '#f44336'),
            line: {
              color: '#ffffff',
              width: 1
            }
          },
          text: sortedValues.map(val => val.toFixed(3)),
          textposition: 'auto',
          hovertemplate: '<b>%{y}</b><br>Impact: %{x:.3f}<extra></extra>'
        }
      ];

      const layout = {
        title: {
          text: title,
          font: { size: 20, color: '#ffffff', family: 'Roboto, sans-serif' }
        },
        xaxis: {
          title: 'Impact on Prediction',
          color: '#ffffff',
          gridcolor: 'rgba(255,255,255,0.2)',
          zeroline: true,
          zerolinecolor: 'rgba(255,255,255,0.5)',
          zerolinewidth: 2
        },
        yaxis: {
          color: '#ffffff',
          automargin: true
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0.3)',
        font: { color: '#ffffff', family: 'Roboto, sans-serif' },
        margin: { l: 150, r: 50, t: 50, b: 50 },
        height: 400
      };

      const config = {
        displayModeBar: false,
        responsive: true
      };

      Plotly.newPlot(chartRef.current, plotData, layout, config);
    }
  }, [data, title]);

  return <div ref={chartRef} style={{ width: '100%' }} />;
};

export default ShapChart;
