import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import styled from 'styled-components';

Chart.register(ArcElement, Tooltip, Legend);

const CharContainer = styled.div`
  width: 30%;
  height: 300px;
`;

const CategoryPieChart = () => {
  const products = useSelector((root: RootState) => root.dashBoard.products);

  const categoryCounts = products.reduce(
    (acc: Record<string, number>, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    },
    {}
  );

  const chartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: 'Product Categories',
        data: Object.values(categoryCounts),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <CharContainer>
      <h3>Inventory</h3>
      <Pie data={chartData} />
    </CharContainer>
  );
};

export default CategoryPieChart;
