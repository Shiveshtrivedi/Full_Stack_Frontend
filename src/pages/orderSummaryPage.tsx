import styled, { keyframes } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';
import { useEffect } from 'react';
import { fetchOrderByOrderId } from '../redux/slices/orderSlice';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const buttonHover = keyframes`
  0% {
    background-color: #007bff;
    transform: scale(1);
  }
  50% {
    background-color: #0056b3;
    transform: scale(1.05);
  }
  100% {
    background-color: #007bff;
    transform: scale(1);
  }
`;

const SummaryContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 20px auto;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  animation: ${fadeIn} 1s ease-out;
`;

const Info = styled.p`
  margin: 5px 0;
  color: #555;
  font-size: 18px;
  span {
    font-weight: bold;
  }
`;

const DetailsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
`;

const ListItem = styled.li`
  margin: 10px 0;
  font-size: 16px;
  color: #444;
  background-color: #fff;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.8s ease-out;
`;

const BackButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
  animation: ${fadeIn} 1s ease-out;

  &:hover {
    animation: ${buttonHover} 0.5s ease-in-out;
  }
`;

const OrderSummary: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    dispatch(fetchOrderByOrderId(Number(orderId)));
  }, [dispatch, orderId]);

  const order = useSelector((state: RootState) => state.order.orderView);

  return (
    <SummaryContainer>
      <Title>Order Summary</Title>
      <Info>
        Order ID: <span>{order?.orderId}</span>
      </Info>
      <Info>
        Status: <span>{order?.status}</span>
      </Info>
      <Info>
        Order Date:
        <span>
          {order?.orderDate
            ? new Date(order.orderDate).toLocaleString()
            : 'N/A'}
        </span>
      </Info>
      <Info>
        Payment Method: <span>{order?.paymentMethod}</span>
      </Info>

      <h3>Order Details:</h3>
      <DetailsList>
        {order?.orderDetails.map((detail) => (
          <ListItem key={detail.productId}>
            {detail.productName} - Quantity: {detail.quantity} - Price: &#8377;
            {detail.price.toFixed(2)}
          </ListItem>
        ))}
      </DetailsList>
      <BackButton onClick={() => navigate(-1)}>Go Back</BackButton>
    </SummaryContainer>
  );
};

export default OrderSummary;
