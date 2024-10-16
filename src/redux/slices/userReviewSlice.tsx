import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IReview, IReviewsState } from '../../utils/type/types';

const initialState: IReviewsState = {
  reviews: {},
  averageRatings: {},
  error: '',
};

const API_URL = process.env.REACT_APP_USER_API_URL ?? '';

export const fetchAllReviews = createAsyncThunk<
  IReview[],
  void,
  { rejectValue: string }
>('reviews/fetchAllReviews', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/review/getAllReview`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || 'Failed to fetch all reviews'
    );
  }
});

export const fetchReviews = createAsyncThunk<
  IReview[],
  number,
  { rejectValue: string }
>('reviews/fetchReviews', async (productId, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${API_URL}/review/${productId}/getReviewByProductId`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch reviews');
  }
});

export const postReview = createAsyncThunk<
  IReview,
  IReview,
  { rejectValue: string }
>('reviews/postReview', async (review, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${API_URL}/review/addReview`,
      review
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to post review');
  }
});

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.error = '';
      })
      .addCase(
        fetchAllReviews.fulfilled,
        (state, action: PayloadAction<IReview[]>) => {
          state.error = '';

          action.payload.forEach((review) => {
            const productId = review.productId;

            if (!state.reviews[productId]) {
              state.reviews[productId] = [];
            }

            state.reviews[productId].push(review);

            const productReviews = state.reviews[productId];
            const totalRating = productReviews.reduce(
              (acc, review) => acc + review.rating,
              0
            );
            const averageRating = productReviews.length
              ? totalRating / productReviews.length
              : 0;
            state.averageRatings[productId] = averageRating;
          });
        }
      )

      .addCase(
        fetchReviews.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? 'Failed to fetch reviews';
        }
      )
      .addCase(postReview.pending, (state) => {
        state.error = '';
      })
      .addCase(
        postReview.fulfilled,
        (state, action: PayloadAction<IReview>) => {
          const productId = action.payload.productId;

          if (!state.reviews[productId]) {
            state.reviews[productId] = [];
          }

          state.reviews[productId].push(action.payload);

          const productReviews = state.reviews[productId];
          const totalRating = productReviews.reduce(
            (acc, review) => acc + review.rating,
            0
          );
          const averageRating = productReviews.length
            ? totalRating / productReviews.length
            : 0;
          state.averageRatings[productId] = averageRating;
        }
      )

      .addCase(
        postReview.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? 'Failed to post review';
        }
      )
      .addCase(fetchAllReviews.pending, (state) => {
        state.error = '';
      })
      .addCase(
        fetchReviews.fulfilled,
        (state, action: PayloadAction<IReview[]>) => {
          state.error = '';

          const productId = action.payload[0]?.productId;
          if (productId) {
            state.reviews[productId] = action.payload;

            const productReviews = state.reviews[productId];
            const totalRating = productReviews.reduce(
              (acc, review) => acc + review.rating,
              0
            );
            const averageRating = productReviews.length
              ? totalRating / productReviews.length
              : 0;
            state.averageRatings[productId] = averageRating;
          }
        }
      )

      .addCase(
        fetchAllReviews.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? 'Failed to fetch all reviews';
        }
      );
  },
});

export const selectReviewsForProduct = (
  state: IReviewsState,
  productId: number
) => {
  return state.reviews[productId] || [];
};

export default reviewSlice.reducer;
