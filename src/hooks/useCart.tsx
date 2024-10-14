import { addToCart } from '../redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { IProduct } from '../utils/type/types';
import { AppDispatch, RootState } from '../redux/store';

export const useAddToCart = () => {
  const userId: number = useSelector((root: RootState) => root.auth.user.id);

  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = (product: IProduct) => {
    if (!product || !userId) return;

    dispatch(
      addToCart({
        userId,
        productId: product.productId,
        quantity: 1,
      })
    ).unwrap();
  };

  return handleAddToCart;
};
