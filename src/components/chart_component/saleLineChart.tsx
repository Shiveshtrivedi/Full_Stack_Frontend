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
  width: 30%;
  height: auto;
`;

const SaleLineChart = () => {
  const sales = useSelector((root: RootState) => root.dashBoard.sales);

  const chartData = {
    labels: sales.map((sale) => new Date(sale.startDate).toLocaleDateString()),
    datasets: [
      {
        label: 'Sales Revenue',
        data: sales.map((sale) => sale.totalAmount),
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
      <h1>Total sale over period of time</h1>
      <Line data={chartData} options={options} />
    </CharContainer>
  );
};

export default SaleLineChart;
