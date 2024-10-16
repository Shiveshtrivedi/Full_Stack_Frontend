import React from 'react';
import {
  CategoryScale,
  Chart as ChartJs,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CharContainer = styled.div`
  width: 72%;
  height: auto;
`;

const RevenueLineChart = () => {
  const revenues = useSelector((root: RootState) => root.dashBoard.revenue);

  const chartData = {
    labels: revenues.map((revenue) =>
      new Date(revenue.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Sales Revenue',
        data: revenues.map((revenue) => revenue.totalRevenue),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    legend: {
      display: true,
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Sales Over Time',
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Sales Revenue',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <CharContainer>
      <h1>Total revenue over period of time</h1>
      <Line data={chartData} options={options} />
    </CharContainer>
  );
};

export default RevenueLineChart;
