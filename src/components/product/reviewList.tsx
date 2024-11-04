import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchReviews,
  selectReviewsForProduct,
} from '../../redux/slices/userReviewSlice';
import { AppDispatch, RootState } from '../../redux/store';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px #00000020;
`;

const Title = styled.h3`
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ReviewListContainer = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ReviewItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
`;

const Rating = styled.div`
  font-weight: bold;
  color: #f39c12;
  font-size: 22.5px;
  margin-bottom: 5px;
`;

const Comment = styled.p`
  font-size: 20px;
  color: #333;
  margin-bottom: 5px;
`;

const Timestamp = styled.small`
  font-size: 18.75px;
  color: #666;
`;

const NoReviews = styled.div`
  font-size: 20px;
  color: #999;
`;

const UserName = styled.div`
  font-style: italic;
  color: #0000ff;
`;

const ReviewList = ({ productId }: { productId: number }) => {
  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector((state: RootState) =>
    selectReviewsForProduct(state.reviews, productId)
  );
  const error = useSelector((state: RootState) => state.reviews.error);

  useEffect(() => {
    dispatch(fetchReviews(productId));
  }, [dispatch, productId]);

  if (error) return <div>Error: {error}</div>;

  return (
    <Container>
      <Title>Reviews</Title>
      {reviews.length === 0 ? (
        <NoReviews>No reviews yet</NoReviews>
      ) : (
        <ReviewListContainer>
          {reviews.map((review, index) => (
            <ReviewItem key={index}>
              <Rating>{review.rating} / 5</Rating>
              <UserName>user:{review.userName}</UserName>
              <Comment>{review.comment}</Comment>
              <Timestamp></Timestamp>
            </ReviewItem>
          ))}
        </ReviewListContainer>
      )}
    </Container>
  );
};

export default ReviewList;
