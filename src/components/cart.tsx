import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import {
  updateCartItem,
  clearCart,
  getCart,
  setCartItem,
} from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { ICreateOrderRequest } from '../utils/type/types';
import { createOrder } from '../redux/slices/orderSlice';

const CartContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 4px 8px #00000050;
  max-width: 600px;
  min-height: 600px;
  margin: 0 auto;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    padding: 10px;
    max-width: 95%;
    height: auto;
  }
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    padding: 8px;
    margin-bottom: 8px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 6px;
    margin-bottom: 6px;
  }
`;

const ItemImage = styled.img`
  width: 75px;
  height: 100px;
  object-fit: contain;
  border-radius: 4px;
  margin-right: 15px;

  @media (max-width: 768px) {
    width: 60px;
    height: 80px;
    margin-right: 10px;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 70px;
    margin-right: 5px;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ItemName = styled.span`
  font-weight: bold;
  margin-right: 10px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ItemPrice = styled.span`
  color: #555;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const QuantityButton = styled.button`
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 3px 6px;
    font-size: 12px;
  }
`;

const QuantitySpan = styled.span`
  font-size: 20px;
  margin: 0 10px;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const ClearCartButton = styled.button`
  background-color: #dc3545;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const TotalAmount = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const ItemNameLink = styled(Link)`
  text-decoration: none;
  color: #333;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
  font-size: 16px;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 6px;
    font-size: 12px;
  }
`;

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userId = useSelector((state: RootState) => state.auth.user.id);
  useEffect(() => {
    const fetchCartItems = async () => {
      const savedCart = localStorage.getItem(`cart_${userId}`);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch(setCartItem(parsedCart));
      }
      if (userId) {
        try {
          setIsLoading(true);
          await dispatch(getCart({ userId })).unwrap();
          toast.success('Cart loaded successfully!');
        } catch (error: any) {
          toast.error('Failed to load cart items.', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCartItems();
    return () => {};
  }, [dispatch, userId]);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const itemsForOrder = items.flatMap((cartItem) =>
        cartItem.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity ?? 0,
          price: item.price,
        }))
      );
      const newOrder: ICreateOrderRequest = {
        userId: userId,
        paymentMethod: 'Credit Card',
        items: itemsForOrder,
      };
      await dispatch(createOrder(newOrder)).unwrap();
      dispatch(clearCart({ userId }));
      toast.success('Checkout successful!');
      navigate('/checkout');
    } catch (error: any) {
      toast.error('Checkout failed. Please try again.', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = (existingItem: any, newQuantity: number) => {
    if (newQuantity < 0) return;

    const updatedItems = [
      {
        productId: existingItem.productId,
        quantity: newQuantity,
      },
    ];

    dispatch(updateCartItem({ userId, items: updatedItems }));
  };

  if (!Array.isArray(items)) {
    return <div>No items in the cart</div>;
  }


  return (
    <CartContainer>
      {items?.length === 0 ||
      items.every((cartItem) => cartItem.items.length === 0) ? (
        <h1>Cart is empty</h1>
      ) : (
        <>
          {items?.map((cartItem) => (
            <div key={cartItem.cartId}>
              {cartItem?.items?.map((item) => (
                <CartItem key={item.productId}>
                  <Link
                    to={`/products/${item.productId}`}
                    title={item.productName}
                  >
                    <ItemImage src={item.imageUrl} alt={item.productName} />
                  </Link>
                  <ItemDetails>
                    <ItemNameLink
                      to={`/products/${item.productId}`}
                      title={item.productName}
                    >
                      <ItemName>{item.productName}</ItemName>
                    </ItemNameLink>
                    <ItemPrice>{item.price.toFixed(2)} &#8377;</ItemPrice>
                  </ItemDetails>
                  <QuantityButton
                    onClick={() =>
                      handleUpdateQuantity(item, (item.quantity ?? 0) - 1)
                    }
                  >
                    -
                  </QuantityButton>
                  <QuantitySpan>{item.quantity}</QuantitySpan>
                  <QuantityButton
                    onClick={() =>
                      handleUpdateQuantity(item, (item.quantity ?? 0) + 1)
                    }
                  >
                    +
                  </QuantityButton>
                </CartItem>
              ))}
            </div>
          ))}
          <TotalAmount>Total: {totalAmount.toFixed(2)} &#8377;</TotalAmount>
          <ClearCartButton
            onClick={() => {
              dispatch(clearCart({ userId }));
              toast.error('Cart cleared');
            }}
          >
            Clear Cart
          </ClearCartButton>
          <CheckoutButton onClick={handleCheckout} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Checkout'}
          </CheckoutButton>
        </>
      )}
    </CartContainer>
  );
};

export default Cart;
