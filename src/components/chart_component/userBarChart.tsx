import React from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJs,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';

ChartJs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChartDimension = styled.div`
  width: 70%;
  height: 'auto';
`;

const UserBarChart = () => {
  const users = useSelector((state: RootState) => state.dashBoard.users);

  const userCount = users.reduce(
    (acc: { admin: number; nonAdmin: number }, user) => {
      if (user.isAdmin) {
        acc.admin += 1;
      } else {
        acc.nonAdmin += 1;
      }
      return acc;
    },
    { admin: 0, nonAdmin: 0 }
  );

  const data = {
    labels: ['Admin', 'Non-Admin'],
    datasets: [
      {
        label: 'Total Users',
        data: [userCount.admin, userCount.nonAdmin],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
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
        text: 'Admin vs Non-Admin Users',
      },
    },
  };

  return (
    <BarChartDimension>
      <h3>User Demographic</h3>
      <Bar data={data} options={options} />
    </BarChartDimension>
  );
};

export default UserBarChart;
