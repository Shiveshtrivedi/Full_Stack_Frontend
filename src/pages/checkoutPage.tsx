import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { postAddress } from '../redux/slices/addressSlice';
import { clearCart } from '../redux/slices/cartSlice';

const CheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const CheckoutTitle = styled.h1`
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
`;

const CheckoutForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px #00000020;
`;

const FormLabel = styled.label`
  margin-bottom: 8px;
  font-size: 16px;
  color: #555;
`;

const FormInput = styled.input`
  padding: 10px;
  font-size: 16px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const SubmitButton = styled.button`
  background-color: #28a745;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

const CheckoutPage: React.FC = () => {
  const [pincode, setPincode] = useState<number>();
  const [phoneNumber, setPhoneNumber] = useState<number>();
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [addressLine1, setAddressLine1] = useState<string>('');
  const [addressLine2, setAddressLine2] = useState<string>('');
  const [country, setCountry] = useState<string>('');

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user.id);

  const userid = Number(userId);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userid) {
      navigate('/login');
      return;
    }

    const addressDetails = {
      userId: userid,
      addressLine1,
      addressLine2: addressLine2 || '',
      state,
      city,
      zipCode: pincode ?? 241110,
      country,
      phoneNumber: 1234567890,
    };

    try {
      const resultAction = await dispatch(postAddress(addressDetails));
      if (postAddress.fulfilled.match(resultAction)) {
        dispatch(clearCart({ userId }));

        navigate('/checkout/payment');
      } else {
        console.error('Failed to submit address:', resultAction.error.message);
      }
    } catch (error) {
      console.error('Error submitting address:', error);
    }
  };

  return (
    <CheckoutContainer>
      <CheckoutTitle>Checkout</CheckoutTitle>
      <CheckoutForm onSubmit={handleSubmit}>
        <FormLabel htmlFor="addressLine1">Address Line 1</FormLabel>
        <FormInput
          type="text"
          id="addressLine1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          required
        />

        <FormLabel htmlFor="addressLine2">Address Line 2</FormLabel>
        <FormInput
          type="text"
          id="addressLine2"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
        />

        <FormLabel htmlFor="pincode">Pincode</FormLabel>
        <FormInput
          type="text"
          id="pincode"
          value={pincode}
          onChange={(e) => setPincode(Number(e.target.value))}
          required
        />

        <FormLabel htmlFor="city">City</FormLabel>
        <FormInput
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <FormLabel htmlFor="state">State</FormLabel>
        <FormInput
          type="text"
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />

        <FormLabel htmlFor="country">Country</FormLabel>
        <FormInput
          type="text"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        <FormLabel htmlFor="phone">Phone Number</FormLabel>
        <FormInput
          type="text"
          id="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(Number(e.target.value))}
          required
        />
        <SubmitButton type="submit">Place Order</SubmitButton>
      </CheckoutForm>
    </CheckoutContainer>
  );
};

export default CheckoutPage;
