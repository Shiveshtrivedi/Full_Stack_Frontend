import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchOrdersByUserId } from '../redux/slices/orderSlice';
import styled from 'styled-components';
import { getCart } from '../redux/slices/cartSlice';
import GoBackButton from '../components/goBackButton';
import useScrollToTop from '../hooks/useScrollToTop';
import ScrollToTopButton from '../components/scrollButton';

const HistoryContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px #00000020;
  max-width: 800px;
  margin: 20px auto;
  min-height: 80vh;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    padding: 10px;
    max-width: 95%;
  }
`;

const OrderCard = styled.div`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const OrderDetails = styled.div`
  margin-bottom: 10px;
`;

const OrderDate = styled.p`
  font-size: 14px;
  color: #777;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const OrderHistoryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.order.orders);
  const userId = useSelector((state: RootState) => state.auth.user.id);
  const loading = useSelector((state: RootState) => state.order.loading);
  const error = useSelector((state: RootState) => state.order.error);

  const { isVisible, scrollToTop } = useScrollToTop(300);

  const userid = Number(userId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchOrdersByUserId(userid));
      dispatch(getCart({ userId }));
    }
  }, [userId, dispatch, userid]);

  const userOrders = orders;

  return (
    <HistoryContainer>
      <GoBackButton />
      <h1>Order History</h1>
      {loading && <p>Loading orders...</p>}
      {error && <p>Error loading orders: {error}</p>}
      {userOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        userOrders?.map((order) => (
          <OrderCard key={order.orderId}>
            <OrderDate>
              Order Date: {new Date(order.orderDate).toLocaleDateString()}
            </OrderDate>
            <OrderDetails>
              <strong>Status:</strong> {order.status}
            </OrderDetails>
            <OrderDetails>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </OrderDetails>
            <OrderDetails>
              <strong>Transaction Id: </strong>
              {order.transctionId}
            </OrderDetails>
            <OrderDetails>
              <strong>Total Amount:</strong> ${' '}
              {(order.orderDetails || [])
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2)}
            </OrderDetails>
            <OrderDetails>
              <strong>Items:</strong>
              {order.orderDetails && order.orderDetails.length > 0 ? (
                <ul>
                  {order.orderDetails.map((item) => (
                    <li key={item.productId}>
                      {`${item.productName} - $${item.price} x ${item.quantity}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No items found.</p>
              )}
            </OrderDetails>
          </OrderCard>
        ))
      )}
      <ScrollToTopButton visible={isVisible} onClick={scrollToTop} />
    </HistoryContainer>
  );
};

export default OrderHistoryPage;
