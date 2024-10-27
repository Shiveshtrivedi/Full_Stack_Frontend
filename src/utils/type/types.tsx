export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  idAdmin?: boolean;
  isAdmin?: boolean;
  token?: string;
}
export interface IUserForAdmin {
  userId: number;
  userName: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  profileImage?: string;
  token?: string;
}

export interface IUserManagementState {
  users: IUserForAdmin[];
  loading: boolean;
  error: string;
}

export interface IAuthState {
  isAuthenticated: boolean;
  user: IUser;
  token: string;
  error: string;
  isAdmin: boolean;
  userEmail: string;
}

export interface IAuthResponse {
  token: string;
  user: IUser;
}

export interface ISignupResponse {
  userName: string;
  email: string;
  isAdmin: boolean;
  token?: string;
}

export interface ICredentials {
  name?: string;
  email: string;
  password: string;
}

export interface ICartItem {
  userId: number;
  cartId: number;
  totalPrice: number;
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    imageUrl: string;
    price: number;
  }>;
  quantity: number;
}

export interface ICartState {
  items: ICartItem[];
  totalAmount: number;

  userId: number;
  totalItems: number;
  loading?: boolean;
  error?: string;
}

export interface IProduct {
  productId: number;
  productName: string;
  price: number;
  image: string;
  productDescription: string;
  category: string;
  stock: number;
  rating?: {
    rate: number;
    count: number;
  };
}
export interface IProductWithoutId {
  productName: string;
  price: number;
  image: string;
  productDescription?: string;
  category: string;
  stock: number;
  costPrice: number;
  sellingPrice: number;
  rating?: {
    rate: number;
    count: number;
  };
}

export interface IProductState {
  products: IProduct[];
  adminProductsHistory: IProduct[];
  filterProducts: IProduct[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string;
  productId: number;
}

export interface IReview {
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
}

export interface IReviewsState {
  reviews: Record<number, IReview[]>;
  averageRatings: Record<number, number>;
  error: string;
}

export interface IWishListItem {
  userId: number;
  wishlistId: number;
  product: IProduct;
}

export interface IWishListState {
  items: IWishListItem[];

  loading: boolean;
  error: string;
}

export interface IAdminRouteProps {
  element: React.ReactElement;
}
export interface IPrivateRouteProps {
  element: React.ReactElement;
}

export interface IStarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}

export interface IOrderDetail {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  orderId: number;
  status: string;
  orderDate: string;
  paymentMethod: string;
  orderDetails: IOrderDetail[];
  razorpayOrderId: string;
  transctionId?: string;
  userName: string;
}

export interface ICreateOrderRequest {
  userId: number;
  paymentMethod: string;
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
}

export interface IUpdateOrderArgs {
  orderId: number;
  orderData: {
    status?: string;
    paymentMethod?: string;
    transctionId?: string;
  };
}

export interface IOrderState {
  orders: IOrder[];
  orderView: IOrder | null;
  userId: number;
  loading: boolean;
  error: string;
}

export interface IReviewFormProps {
  productId: number;
  userId: number;
}

export interface ISearchState {
  searchTerm: string;
  searchResults: IProduct[];
}

export interface IReviewsState {
  reviews: Record<number, IReview[]>;
  averageRatings: Record<number, number>;
  error: string;
}

export interface ICookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export interface IAddressDetails {
  name: string;
  pincode: string;
  phoneNumber: string;
  city: string;
  state: string;
}

export type TRatingFilter =
  | 'all'
  | '1-star'
  | '2-star'
  | '3-star'
  | '4-star'
  | '5-star';

export type TPriceFilter = 'all' | 'low' | 'medium' | 'high';

export type TCategoryFilter =
  | 'all'
  | 'electronics'
  | 'mens clothing'
  | 'womens clothing';

export enum EStatus {
  Idle = 'idle',
  Loading = 'loading',
  Succeeded = 'succeeded',
  Failed = 'failed',
}
export interface IAddress {
  shippingAddressID?: 1;
  userId: number;
  addressLine1: string;
  addressLine2?: string;
  state: string;
  city: string;
  zipCode: number;
  country: string;
  phoneNumber: number;
}

export interface IAddressState {
  address: IAddress[] | null;
  loading: boolean;
  error: string;
}

export interface ISale {
  saleId: number;
  orderId: number;
  saleDate: string;
  endDate: string;
  totalAmount: number;
  userName: string;
  totalProductsSold: number;
  costPrice: number;
  sellingPrice: number;
  totalProfit: number;
}

export interface IAdminHistory {
  historyId: number;
  actionType: string;
  details: string;
  userId: number;
  userName: string;
  productId: number;
  actionDate: Date;
  productName: string;
  productImage: string;
  price: number;
}

export interface IAdminHistoryState {
  histories: IAdminHistory[];
  loading: boolean;
  error: string;
}

export interface IFormData {
  name: string;
  email: string;
  password: string;
}

export interface IErrors {
  email?: string;
  password?: string;
}

export interface ISale {
  saleId: number;
  orderId: number;
  totalAmount: number;
  startDate: string;
  endDate: string;
}

export interface IUpdateProductStockPayload {
  ProductId: number;
  StockAvailable: number;
  StockSold: number;
}

export interface User {
  userId: number;
  userName: string;
  email: string;
  isAdmin: boolean;
}

export interface Product {
  productId: number;
  productName: string;
  stock: number;
  price: number;
  category: string;
}

export interface Revenue {
  date: string;
  totalRevenue: number;
}

export interface DashboardState {
  users: User[];
  products: Product[];
  sales: ISale[];
  orders: IOrder[];
  revenue: Revenue[];
  loading: boolean;
  error: string;
}

export interface DashboardData {
  users: User[];
  products: Product[];
  sales: ISale[];
  revenue: Revenue[];
  orders: IOrder[];
}

export interface InventoryItem {
  productId: number;
  productName: string;
  stockAvailable: number;
  stockSold: number;
}

export interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  error: string;
}

export interface UpdateStockItem {
  productId: number;
  quantitySold: number;
}

export interface UpdateStockRequest {
  products: UpdateStockItem[];
}

export interface ISearchBarProps {
  categoryFilter: TCategoryFilter;
  priceFilter: TPriceFilter;
  ratingFilter: TRatingFilter;
  handleCategoryFilterChange: (category: TCategoryFilter) => void;
  handlePriceFilterChange: (filter: TPriceFilter) => void;
  handleRatingFilterChange: (filter: TRatingFilter) => void;
  handleResetFilters: () => void;
  viewMode: 'grid' | 'list';
  handleToggleViewMode: () => void;
}

export interface IScrollButtonProps {
  visible: boolean;
  onClick: () => void;
}
