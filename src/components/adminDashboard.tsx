import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import React, { useEffect } from 'react';
import {
  fetchDashboardData,
  updateProductList,
  updateSales,
} from '../redux/slices/dashBoardSlice';
import Loading from './loading';
import ProductBarChart from './chart_component/productBarChart';
import UserBarChart from './chart_component/userBarChart';
import SaleLineChart from './chart_component/saleLineChart';
import CategoryPieChart from './chart_component/categoryPieChart';
import UserDemographicsPieChart from './chart_component/userDemographicsPieChart';
import styled from 'styled-components';
// import mqtt from 'mqtt';
import RevenueLineChart from './chart_component/revenueLineChart';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import useScrollToTop from '../hooks/useScrollToTop';
import ScrollToTopButton from './scrollButton';
import { updateInventory } from '../redux/slices/dashBoardSlice';
import { useMQTT } from '../hooks/useMQTT';
// import mqtt from 'mqtt';

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

const ViewButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: #fefefe;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }

  &:active {
    background-color: #004085;
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;
const GoBackButton = styled(IoArrowBackOutline)`
  font-size: 25px;
  color: #000000;
  cursor: pointer;
  padding: 7px;

  &:hover {
    border-radius: 50%;
    background-color: #cbd3da;
  }
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const AdminDashboard = () => {
  const { users, products, sales, orders, loading, error } = useSelector(
    (state: RootState) => state.dashBoard
  );

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isVisible, scrollToTop } = useScrollToTop(300);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // useEffect(() => {
  //   const client = mqtt.connect('ws://localhost:9001');

  //   client.on('connect', () => {
  //     client.subscribe('inventory-updates', (err) => {
  //       if (err) {
  //         console.error('Subscription error for inventory/updates:', err);
  //       }
  //     });
  //     client.subscribe('sales-updates', (err) => {
  //       if (err) {
  //         console.error('Subscription error for sales-updates:', err);
  //       }
  //     });
  //     client.subscribe('order/update', (err) => {
  //       if (err) {
  //         console.error('Subscription error for order/update:', err);
  //       }
  //     });
  //     client.subscribe('product/new', (err) => {
  //       if (err) {
  //         console.error('Subscription error for order/update:', err);
  //       }
  //     });
  //   });

  //   client.on('message', (topic, message) => {
  //     try {
  //       const data = JSON.parse(message.toString());

  //       if (topic === 'inventory-updates') {
  //         dispatch(updateInventory(data));
  //       }

  //       if (topic === 'product/new') {
  //         dispatch(updateProductList(data));
  //       }

  //       if (topic === 'sales-updates') {
  //         dispatch(updateSales(data));
  //       }
  //     } catch (error) {
  //       console.error('Failed to parse message:', error);
  //     }
  //   });

  //   return () => {
  //     client.end();
  //   };
  // }, [dispatch]);

  useMQTT([
    {
      topic: 'inventory-updates',
      onMessage: (message) => {
        const data = JSON.parse(message);
        dispatch(updateInventory(data));
      },
    },
    {
      topic: 'sales-updates',
      onMessage: (message) => {
        const data = JSON.parse(message);
        dispatch(updateSales(data));
      },
    },
    {
      topic: 'product/new',
      onMessage: (message) => {
        const data = JSON.parse(message);
        dispatch(updateProductList(data));
      },
    },
  ]);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  const handleView = (orderId: number) => {
    navigate(`/adminLayout/orderSummary/${orderId}`);
  };

  return (
    <Container>
      <GoBackButton onClick={() => navigate(-1)} />
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
        <RevenueLineChart />
      </Section>
      <div>
        <Section>
          <CategoryPieChart />
        </Section>
        <Section>
          <UserDemographicsPieChart />
        </Section>
      </div>
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
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Product sold</th>
              <th>Profit(in &#8377;)</th>
              <th>Profit %</th>
              <th>Sale Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => {
              const formattedDate = new Date(sale.saleDate).toLocaleDateString(
                'en-CA'
              );
              const profitPercentage =
                ((sale.sellingPrice - sale.costPrice) / sale.costPrice) * 100;
              return (
                <tr key={`${sale.orderId}-${sale.saleDate}-${index}`}>
                  <td>{sale.costPrice}</td>
                  <td>{sale.sellingPrice}</td>
                  <td>{sale.totalProductsSold}</td>
                  <td>{sale.totalProfit}</td>
                  <td>{profitPercentage.toFixed(2)}</td>
                  <td>{formattedDate}</td>
                </tr>
              );
            })}
          </tbody>
        </StyledTable>
      </Section>
      <Section>
        <h2>Total Order: {orders.length}</h2>
        <StyledTable>
          <thead>
            <tr>
              <th>Id</th>
              <th>Customer Name</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Order Detail</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const formattedDate = new Date(
                order.orderDate
              ).toLocaleDateString('en-CA');
              return (
                <tr key={`${order.orderId}-${order.orderDate}-${index}`}>
                  <td>{order.orderId}</td>
                  <td>{order.userName}</td>
                  <td>{formattedDate}</td>
                  <td>{order.status}</td>
                  <td>
                    <ViewButton onClick={() => handleView(order.orderId ?? 0)}>
                      view
                    </ViewButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </StyledTable>
      </Section>
      <ScrollToTopButton visible={isVisible} onClick={scrollToTop} />
    </Container>
  );
};

export default AdminDashboard;
