import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Loading from '../components/ui/loading';
import ReviewList from '../components/product/reviewList';
import ReviewForm from '../components/product/reviewForm';
import { fetchReviews } from '../redux/slices/userReviewSlice';
import { AppDispatch, RootState } from '../redux/store';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import Star from '../components/ui/star';
import { useAddToCart } from '../hooks/useCart';
import { useDispatch, useSelector } from 'react-redux';
import { IProduct } from '../utils/type/types';
import { getCart } from '../redux/slices/cartSlice';
import GoBackButton from '../components/navigation/goBackButton';

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  box-shadow: 0 0 10px #00000020;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  width: 300px;
  height: 300px;
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Price = styled.p`
  font-size: 20px;
  color: #666666;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #333333;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: #3e8e41;
  }
`;

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const handleAddToCart = useAddToCart();

  const [product, setProduct] = useState<IProduct>();
  const dispatch = useDispatch<AppDispatch>();
  const averageRating = useSelector((state: RootState) => {
    if (id) {
      return state.reviews.averageRatings[Number(id)] ?? 0;
    }
    return 0;
  });

  const products = useSelector((state: RootState) => state.products.products);
  const userId = useSelector((state: RootState) => state.auth.user.id);
  useEffect(() => {
    if (products.length === 0) {
      // setLoading(true);
      // dispatch(fetchProducts())
      //   .unwrap()
      //   .then(() => {
      //     setLoading(false);
      //   })
      //   .catch(() => {
      //     setError('Failed to fetch products');
      //     setLoading(false);
      //   });
    } else {
      setLoading(false);
    }
  }, [products, dispatch]);

  useEffect(() => {
    const foundProduct = products.find((p) => p.productId.toString() === id);
    if (foundProduct) {
      setProduct(foundProduct);
    } else if (!loading) {
      setError('Product not found');
    }
  }, [products, id, loading]);
  useEffect(() => {
    if (product) {
      dispatch(fetchReviews(product.productId));
      dispatch(getCart({ userId }));
    }
  }, [product, dispatch, userId]);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <GoBackButton />
      <Container>
        <Zoom>
          <Image src={product.image} alt={product.productName} />
        </Zoom>
        <Title>{product.productName}</Title>
        <Star reviews={averageRating} />
        <Price>{product.price.toFixed(2)} &#8377;</Price>
        <Description>{product.productDescription}</Description>
        <Button onClick={() => handleAddToCart(product)}>Add to Cart</Button>
        {product.productId && (
          <ReviewForm productId={product.productId} userId={userId} />
        )}
        {product.productId && <ReviewList productId={product.productId} />}
      </Container>
    </div>
  );
};

export default ProductPage;
