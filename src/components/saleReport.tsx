import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import React, { useEffect, useState } from 'react';
import { fetchSalesReport } from '../redux/slices/saleSlice';
import Loading from './loading';
import { ISale } from '../utils/type/types';
import styled from 'styled-components';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import useScrollToTop from '../hooks/useScrollToTop';
import ScrollToTopButton from './scrollButton';

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #333333;
  margin-bottom: 20px;
`;

const DateInputs = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;

  label {
    margin-right: 10px;
  }

  input {
    margin-right: 10px;
    padding: 8px;
    border: 1px solid #cccccc;
    border-radius: 4px;
    font-size: 16px;
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #4caf50;
  color: fefefe;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const SaleList = styled.ul`
  list-style-type: none;
  padding: 0;

  li {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    margin: 5px 0;
    padding: 15px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const ErrorMessage = styled.p`
  color: #ff0000;
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

const SaleReport: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sales, loading, error } = useSelector(
    (root: RootState) => root.saleReport
  );

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();
  const { isVisible, scrollToTop } = useScrollToTop();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setStartDate(today);
    setEndDate(today);
    dispatch(fetchSalesReport({ startDate: today, endDate: today }));
  }, [dispatch, today]);

  const handleFetchSales = () => {
    if (startDate > endDate) {
      alert('Start date cannot be after end date.');
      return;
    }
    dispatch(fetchSalesReport({ startDate, endDate }));
  };

  if (loading) return <Loading />;

  if (error) return <ErrorMessage>Error: {error}</ErrorMessage>;

  return (
    <Container>
      <GoBackButton
        onClick={() => {
          navigate(-1);
        }}
      />
      <Title>Sales Report</Title>
      <DateInputs>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            max={today}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            min={startDate}
            max={today}
          />
        </label>
        <Button onClick={handleFetchSales}>Fetch Sales</Button>
      </DateInputs>
      <div>
        {sales.length > 0 ? (
          <SaleList>
            {sales.map((sale: ISale) => {
              const formattedDate = new Date(sale.startDate).toLocaleDateString(
                'en-CA'
              );
              return (
                <li key={sale.saleId}>
                  Order ID: {sale.orderId}, Total Amount: {sale.totalAmount},
                  Date: {formattedDate}
                </li>
              );
            })}
          </SaleList>
        ) : (
          <p>No sales data for the selected period.</p>
        )}
      </div>
      <ScrollToTopButton visible={isVisible} onClick={scrollToTop} />
    </Container>
  );
};

export default SaleReport;
