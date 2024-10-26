import {
  IAuthState,
  ICartItem,
  ICreateOrderRequest,
  IOrder,
  IProduct,
  IProductWithoutId,
  ISignupResponse,
  IUser,
} from '../../utils/type/types';

export const mockUser: IUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  isAdmin: false,
};

export const initialAuthState: IAuthState = {
  isAuthenticated: false,
  user: { name: '', email: '', password: '', id: 0 },
  token: '',
  error: '',
  isAdmin: false,
  userEmail: '',
};

export const initialAuthStateWithUser: IAuthState = {
  isAuthenticated: true,
  user: mockUser,
  token: 'mockToken123',
  error: '',
  isAdmin: false,
  userEmail: mockUser.email,
};

export const mockSignupResponse: ISignupResponse = {
  userName: 'John Doe',
  email: 'john.doe@example.com',
  isAdmin: false,
  token: 'mockToken123',
};

export const mockProduct: IProduct = {
  productId: 1,
  productName: 'Test Product',
  productDescription: 'This is a test product.',
  price: 100,
  stock: 10,
  category: 'Test Category',
  image: 'image',
};

export const newProduct: IProductWithoutId = {
  productName: 'New Product',
  productDescription: 'This is a new product.',
  price: 200,
  stock: 20,
  category: 'New Category',
  image: 'image',
  costPrice: 100,
  sellingPrice: 150,
};

export const mockProductsArray: IProduct[] = [
  {
    productId: 1,
    productName: 'Product 1',
    productDescription: 'Description 1',
    price: 50,
    stock: 5,
    image: 'image',
    category: 'Category 1',
  },
  {
    productId: 2,
    productName: 'Product 2',
    productDescription: 'Description 2',
    price: 150,
    stock: 10,
    image: 'image',
    category: 'Category 2',
  },
];

export const mockCartItem: ICartItem = {
  userId: 1,
  cartId: 101,
  totalPrice: 200,
  quantity: 2,
  items: [
    {
      productId: 1,
      productName: 'Test Product',
      quantity: 2,
      imageUrl: 'http://example.com',
      price: 100,
    },
    {
      productId: 2,
      productName: 'Another Product',
      quantity: 1,
      imageUrl: 'http://example.com',
      price: 150,
    },
  ],
};

export const mockCartItemsArray: ICartItem[] = [
  {
    userId: 1,
    cartId: 101,
    totalPrice: 200,
    quantity: 2,
    items: [
      {
        productId: 1,
        productName: 'Test Product',
        quantity: 2,
        imageUrl: 'http:image/example',
        price: 100,
      },
    ],
  },
];

export const initialCartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  userId: 0,
  loading: false,
};

export const mockOrders: IOrder[] = [
  {
    orderId: 1,
    status: 'Pending',
    orderDate: new Date().toISOString(),
    paymentMethod: 'Credit Card',
    orderDetails: [
      {
        productId: 101,
        productName: 'Product A',
        quantity: 2,
        price: 50.0,
      },
    ],
    razorpayOrderId: 'razorpay_1',
    userName: 'John Doe',
  },
  {
    orderId: 2,
    status: 'Completed',
    orderDate: new Date().toISOString(),
    paymentMethod: 'PayPal',
    orderDetails: [
      {
        productId: 102,
        productName: 'Product B',
        quantity: 1,
        price: 100.0,
      },
    ],
    razorpayOrderId: 'razorpay_2',
    transctionId: 'txn_123456',
    userName: 'Jane Smith',
  },
];

export const mockCreateOrderRequest: ICreateOrderRequest = {
    userId: 1,
    paymentMethod: 'Credit Card',
    items: [
      {
        productId: 101,
        quantity: 2,
        price: 50.0,
      },
    ],
  };