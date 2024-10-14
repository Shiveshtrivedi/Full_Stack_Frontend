import React from 'react';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import styled from 'styled-components';

Chart.register(ArcElement, Tooltip, Legend);

const CharContainer = styled.div`
  width: 30%;
  height: 300px;
`;

const UserDemographicsPieChart = () => {
  const users = useSelector((root: RootState) => root.dashBoard.users);

  const adminCount = users.filter((user) => user.isAdmin).length;
  const nonAdminCount = users.length - adminCount;
  const chartData = {
    labels: ['Admin', 'Non-Admin'],
    datasets: [
      {
        label: 'User Demographics',
        data: [adminCount, nonAdminCount],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <CharContainer>
      <h3>User Demographic</h3>
      <Pie data={chartData} />
    </CharContainer>
  );
};

export default UserDemographicsPieChart;
