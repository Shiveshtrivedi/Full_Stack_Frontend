import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { AppDispatch, RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { IOrder } from '../utils/type/types';
import { updateStock } from '../redux/slices/inventorySlice';
import { updateOrder } from '../redux/slices/orderSlice';

const loadRazorpayScript = (src: string) => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
};

const Container = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px #00000020;
`;

const OrderSummary = styled.div`
  margin-bottom: 20px;
`;

const OrderTitle = styled.h2`
  margin-bottom: 15px;
  color: #333;
`;

const OrderDetail = styled.p`
  margin-bottom: 8px;
  color: #555;
  font-size: 16px;
`;

const OrderItems = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const OrderItem = styled.li`
  margin-bottom: 5px;
  color: #555;
  font-size: 16px;
`;

const PayButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const LoadingMessage = styled.p`
  color: #777;
  font-size: 18px;
  text-align: center;
`;

const PaymentPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.order.orders);
  const orderId = orders[orders.length - 1]?.razorpayOrderId;
  const [latestOrder, setLatestOrder] = useState<IOrder>();
  const navigate = useNavigate();

  const paymentMethod = useRef(null);

  useEffect(() => {
    loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      setLatestOrder(orders[orders.length - 1]);
    }
  }, [orders]);

  const handlePayment = () => {
    if (!latestOrder) return;

    const totalAmount = latestOrder.orderDetails?.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const options = {
      key: process.env.REACT_APP_RAZORPAY_CLIENT_ID,
      amount: totalAmount * 100,
      currency: 'INR',
      name: 'ITT',
      order_id: orderId,
      description: 'Test Transaction',
      handler: async (response: any) => {
        const paymentId = response.razorpay_payment_id;

        paymentMethod.current = response.method || 'UPI';

        alert(`Payment ID: ${paymentId}`);

        const orderId = orders[orders.length - 1]?.orderId;
        if (orderId) {
          const orderData = {
            status: 'Delivered',
            paymentMethod: paymentMethod.current ?? 'Unknown',
            transctionId: paymentId,
          };

          try {
            await dispatch(updateOrder({ orderId, orderData }));

            const productsToUpdate = latestOrder.orderDetails.map((item) => ({
              productId: item.productId,
              quantitySold: item.quantity,
            }));

            await dispatch(updateStock({ products: productsToUpdate }));

            navigate('/checkout/success');
          } catch (error) {
            console.error('Error updating order or inventory:', error);
          }
        }
      },
      prefill: {
        name: 'shivesh trivedi',
        email: 'shiveshtrivedi@gmail.com',
        contact: '9999999999',
      },
      modal: {
        ondismiss: () => {},
      },
    };

    const rzp = new (window as any).Razorpay(options);

    rzp.on('payment.failed', (response: any) => {
      console.error('Payment failed:', response.error.description);
    });

    rzp.open();
  };

  return (
    <Container>
      {latestOrder ? (
        <OrderSummary>
          <OrderTitle>Order Summary</OrderTitle>
          <OrderDetail>
            <strong>Order Date:</strong>{' '}
            {new Date(latestOrder.orderDate).toLocaleDateString()}
          </OrderDetail>
          <OrderDetail>
            <strong>Total Amount:</strong> $
            {latestOrder.orderDetails
              ?.reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2)}
          </OrderDetail>
          <OrderDetail>
            <strong>Items:</strong>
          </OrderDetail>
          <OrderItems>
            {latestOrder.orderDetails?.length === 0 ? (
              <OrderItem>No items found.</OrderItem>
            ) : (
              latestOrder.orderDetails?.map((item) => (
                <OrderItem key={item.productId}>
                  {item.productName} - ${item.price} x {item.quantity}
                </OrderItem>
              ))
            )}
          </OrderItems>

          <PayButton onClick={handlePayment}>Pay Now</PayButton>
        </OrderSummary>
      ) : (
        <LoadingMessage>Loading order summary...</LoadingMessage>
      )}
    </Container>
  );
};

export default PaymentPage;