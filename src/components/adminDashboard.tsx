import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import React, { useEffect } from 'react';
import {
  fetchDashboardData,
  updateInventory,
  updateSales,
} from '../redux/slices/dashBoardSlice';
import Loading from './loading';
import ProductBarChart from './chart_component/productBarChart';
import UserBarChart from './chart_component/userBarChart';
import SaleLineChart from './chart_component/saleLineChart';
import CategoryPieChart from './chart_component/categoryPieChart';
import UserDemographicsPieChart from './chart_component/userDemographicsPieChart';
import styled from 'styled-components';
import mqtt from 'mqtt';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #343a40;
  margin-bottom: 20px;
  font-size: 32px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Section = styled.section`
  margin-top: 50px;

  h2 {
    color: #495057;
    margin-bottom: 10px;
    font-size: 24px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  thead {
    background-color: #343a40;
    color: #ffffff;
  }

  th,
  td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
    font-size: 16px;

    @media (max-width: 768px) {
      padding: 10px;
      font-size: 14px;
    }
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #e9ecef;
  }
`;

const AdminDashboard = () => {
  const { users, products, sales, loading, error } = useSelector(
    (state: RootState) => state.dashBoard
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

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
    });

    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());

        if (topic === 'inventory-updates') {
          dispatch(updateInventory(data));
        }

        if (topic === 'sales-updates') {
          dispatch(updateSales(data));
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    });

    return () => {
      client.end();
    };
  }, [dispatch]);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <Title>Admin Dashboard</Title>
      <Section>
        <ProductBarChart />
      </Section>
      <Section>
        <UserBarChart />
      </Section>
      <Section>
        <SaleLineChart />
      </Section>
      <Section>
        <CategoryPieChart />
      </Section>
      <Section>
        <UserDemographicsPieChart />
      </Section>
      <Section>
        <h2>Total Users: {users.length}</h2>
        <StyledTable>
          <thead>
            <tr>
              <th>User Id</th>
              <th>User Name</th>
              <th>User Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.userName}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </Section>
      <Section>
        <h2>Total Products: {products.length}</h2>
        <StyledTable>
          <thead>
            <tr>
              <th>Product Id</th>
              <th>Product Name</th>
              <th>Product Category</th>
              <th>Product Price</th>
              <th>Product Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>{product.productName}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </Section>
      <Section>
        <h2>Total Sales: {sales.length}</h2>
        <StyledTable>
          <thead>
            <tr>
              <th>Order Id</th>
              <th>Total Amount</th>
              <th>Sale Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={`${sale.orderId}-${sale.startDate}-${index}`}>
                <td>{sale.orderId}</td>
                <td>{sale.totalAmount}</td>
                <td>{sale.startDate}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </Section>
    </Container>
  );
};

export default AdminDashboard;
