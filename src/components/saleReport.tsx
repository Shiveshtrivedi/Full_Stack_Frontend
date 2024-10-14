import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import React, { useEffect, useState } from 'react';
import { fetchSalesReport } from '../redux/slices/saleSlice';
import Loading from './loading';
import { ISale } from '../utils/type/types';

const SaleReport: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sales, loading, error } = useSelector(
    (root: RootState) => root.saleReport
  );

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
    dispatch(fetchSalesReport({ startDate: today, endDate: today }));
  }, [dispatch]);

  const handleFetchSales = () => {
    if (startDate && endDate) {
      dispatch(fetchSalesReport({ startDate, endDate }));
    }
  };

  if (loading) return <Loading />;

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Sales Report</h1>
      <div>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={handleFetchSales}>Fetch Sales</button>
      </div>
      <div>
        {sales.length > 0 ? (
          <ul>
            {sales.map((sale: ISale) => (
              <li key={sale.saleId}>
                Sale ID: {sale.saleId}, Total Amount: {sale.totalAmount}, Date:{' '}
                {sale.startDate}
              </li>
            ))}
          </ul>
        ) : (
          <p>No sales data for the selected period.</p>
        )}
      </div>
    </div>
  );
};

export default SaleReport;
