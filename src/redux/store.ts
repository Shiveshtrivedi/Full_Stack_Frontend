import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishListReducer from './slices/wishlistSlice';
import reviewReducer from './slices/userReviewSlice';
import searchReducer from './slices/searchSlice';
import orderReducer from './slices/orderSlice';
import addressReducer from './slices/addressSlice';
import adminLayoutReducer from './slices/adminLayoutSlice';
import dashBoardReducer from './slices/dashBoardSlice';
import userManagementReducer from './slices/userManagementSlice';
import saleReportReducer from './slices/saleSlice';
import adminHistoryReducer from './slices/adminHistorySlice';
import inventoryReducer from './slices/inventorySlice';

const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
    cart: cartReducer,
    wishList: wishListReducer,
    reviews: reviewReducer,
    search: searchReducer,
    order: orderReducer,
    address: addressReducer,
    adminLayout: adminLayoutReducer,
    dashBoard: dashBoardReducer,
    userManagement: userManagementReducer,
    saleReport: saleReportReducer,
    adminHistory: adminHistoryReducer,
    inventory: inventoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
