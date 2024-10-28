import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import mqtt from 'mqtt';
import {
  updateInventory,
  updateProductList,
} from '../../redux/slices/dashBoardSlice';

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

const SaleLineChart = () => {
  const sales = useSelector((root: RootState) => root.dashBoard.sales);

  const [labels] = useState(() =>
    sales.map((sale) => new Date(sale.saleDate).toLocaleDateString())
  );

  const dispatch = useDispatch();

  const websocketUrl = process.env.REACT_APP_WEBSOCKET_URL;

  useEffect(() => {
    const client = mqtt.connect('ws://localhost:9001');

    client.on('connect', () => {
      client.subscribe('inventory-updates', (err) => {
        if (err) {
          console.error('Subscription error for inventory/updates:', err);
        }
      });
      client.subscribe('sales-updates', (err) => {
        if (err) {
          console.error('Subscription error for sales-updates:', err);
        }
      });
      client.subscribe('order/update', (err) => {
        if (err) {
          console.error('Subscription error for order/update:', err);
        }
      });
      client.subscribe('product/new', (err) => {
        if (err) {
          console.error('Subscription error for order/update:', err);
        }
      });
    });
    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());

        if (topic === 'inventory-updates') {
          dispatch(updateInventory(data));
        }

        if (topic === 'product/new') {
          dispatch(updateProductList(data));
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    });

    return () => {
      client.end();
    };
  }, [dispatch, websocketUrl]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Total Product Sale',
        data: sales.map((sale) => sale.totalProductsSold),
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
          text: 'Total Product Sales',
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
