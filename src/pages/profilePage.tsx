import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import Loading from '../components/ui/loading';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { getAddresses, updateAddress } from '../redux/slices/addressSlice';
import { updateUser } from '../redux/slices/userManagementSlice';
import { IAddress, IUserForAdmin } from '../utils/type/types';
import GoBackButton from '../components/navigation/goBackButton';

const Container = styled.div`
  max-width: 800px;
  margin: 10px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px #00000020;
`;

const Heading = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const ProfileInfo = styled.div`
  margin-bottom: 20px;
`;

const InfoText = styled.p`
  font-size: 18px;
  color: #555;
  margin-bottom: 10px;
`;

const Button = styled.button`
  background-color: #007bff;
  border: none;
  color: #fff;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #43ff64d9;
  }
`;

const Input = styled.input`
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 16px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const addressValue = useSelector((state: RootState) => state.address);

  const [userData, setUserData] = useState<IUserForAdmin>({
    userId: user.id,
    userName: user.name ?? '',
    email: user.email ?? '',
    isAdmin: user.isAdmin ?? false,
  });

  const [address, setAddress] = useState<{
    addressLine1: string;
    addressLine2: string;
    phoneNumber: number;
    state: string;
    city: string;
    zipCode: number;
  }>({
    addressLine1: '',
    addressLine2: '',
    phoneNumber: 0,
    state: '',
    city: '',
    zipCode: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setLoading(true);
        try {
          await dispatch(getAddresses(user.id));
        } catch (error) {
          console.error('Failed to fetch user data', error);
          toast.error('Failed to fetch user data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user, dispatch]);

  useEffect(() => {
    if (
      addressValue &&
      Array.isArray(addressValue.address) &&
      addressValue.address.length > 0
    ) {
      const firstAddress = addressValue.address[0];
      setAddress({
        addressLine1: firstAddress.addressLine1,
        addressLine2: firstAddress.addressLine2 ?? '',
        phoneNumber: firstAddress.phoneNumber,
        state: firstAddress.state,
        city: firstAddress.city,
        zipCode: firstAddress.zipCode,
      });
    }
  }, [addressValue]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdate = async () => {
    try {
      const updatedUserData: IUserForAdmin = {
        ...userData,
      };
      await dispatch(updateUser(updatedUserData)).unwrap();
      toast.success('Profile update successful');
    } catch (error) {
      console.error('Failed to update user data', error);
      toast.error('Failed to update user data');
    }
  };

  const handleAddressUpdate = async () => {
    if (addressValue.address && user && addressValue.address.length > 0) {
      try {
        const addressToUpdate: IAddress = {
          shippingAddressID: addressValue.address[0].shippingAddressID,
          userId: user.id,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          phoneNumber: address.phoneNumber,
          state: address.state,
          city: address.city,
          zipCode: address.zipCode,
          country: 'YourCountry',
        };
        await dispatch(updateAddress(addressToUpdate)).unwrap();
        toast.success('Address updated successfully');
      } catch (error) {
        console.error('Failed to update address', error);
        toast.error('Failed to update address');
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  return (
    <Container>
      <GoBackButton />
      <Heading>Profile Page</Heading>
      {user && (
        <ProfileInfo>
          <InfoText>Name: {userData.userName}</InfoText>
          <InfoText>Email: {userData.email}</InfoText>
          <Button onClick={handleLogout}>Logout</Button>

          <FormGroup>
            <Input
              type="text"
              value={userData.userName}
              onChange={(e) =>
                setUserData({ ...userData, userName: e.target.value })
              }
              placeholder="Update name"
            />
            <Input
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              placeholder="Update email"
            />
            <Button onClick={handleUpdate}>Update Profile</Button>
          </FormGroup>

          <FormGroup>
            <Input
              type="text"
              value={address.addressLine1}
              onChange={(e) =>
                setAddress({ ...address, addressLine1: e.target.value })
              }
              placeholder="Update address line 1"
            />
            <Input
              type="text"
              value={address.addressLine2 || ''}
              onChange={(e) =>
                setAddress({ ...address, addressLine2: e.target.value })
              }
              placeholder="Update address line 2 (optional)"
            />
            <Input
              type="text"
              value={address.phoneNumber}
              onChange={(e) =>
                setAddress({ ...address, phoneNumber: +e.target.value })
              }
              placeholder="Update phone number"
            />
            <Input
              type="text"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              placeholder="Update city"
            />
            <Input
              type="text"
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
              placeholder="Update state"
            />
            <Input
              type="number"
              value={address.zipCode || ''}
              onChange={(e) =>
                setAddress({ ...address, zipCode: +e.target.value })
              }
              placeholder="Update zip code"
            />
            <Button onClick={handleAddressUpdate}>Update Address</Button>
          </FormGroup>
        </ProfileInfo>
      )}
    </Container>
  );
};

export default ProfilePage;
