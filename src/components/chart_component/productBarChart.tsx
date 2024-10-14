import React from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';

const BarChartDimension = styled.div`
  width: 30%;
  height: 'auto';
`;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProductBarChart = () => {
  const products = useSelector((root: RootState) => root.dashBoard.products);

  const productCategories = products.reduce(
    (acc: { [key: string]: number }, product) => {
      const category = product.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {}
  );

  const data = {
    labels: Object.keys(productCategories),
    datasets: [
      {
        label: 'Total Products',
        data: Object.values(productCategories),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value: number | string) =>
            Number.isInteger(value) ? value : '',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Total Users Chart',
      },
    },
  };

  return (
    <BarChartDimension>
      <h3>Product Categories</h3>
      <Bar data={data} options={options} />
    </BarChartDimension>
  );
};

export default ProductBarChart;
