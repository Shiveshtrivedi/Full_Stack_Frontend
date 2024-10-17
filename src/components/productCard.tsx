import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { IProduct } from '../utils/type/types';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import Star from './star';

const ProductCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  width: 27%;
  margin: 10px;
  height: 425px;

  @media (min-width: 481px) and (max-width: 768px) {
    width: 42%;
    padding: 15px;
    margin: 5px 1%;
  }

  @media (max-width: 480px) {
    width: 77%;
    padding: 15px;
    margin: 5px 1%;
  }
`;

const Image = styled.img<{ viewMode: string }>`
  aspect-ratio: 3/2;
  mix-blend-mode: color-burn;
  width: ${(props) => (props.viewMode === 'grid' ? '250px' : '900px')};
  height: 150px;
  object-fit: contain;
`;

const ProductNameContainer = styled.div`
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Price = styled.p`
  font-size: 16px;
  color: #666666;
  margin: 0 80px 10px 0;
`;

const Button = styled.button<{ viewMode: string }>`
  background-color: #4caf50;
  color: #ffffff;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  height: 40px;
  width: ${(props) => (props.viewMode === 'grid' ? '100%' : '100px')};
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;

  &:hover {
    background-color: #45a049;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

const WishlistButton = styled.div<{ isInWishlist: boolean }>`
  color: ${(props) => (props.isInWishlist ? '#e64a19' : '#ff5722')};
  cursor: pointer;
  font-size: 20px;
  position: absolute;
  right: 7px;
  top: 10px;
`;

interface ProductCardProps {
  product: IProduct;
  viewMode: string;
  isAdmin: boolean;
  wishlistStatus: Record<number, boolean>;
  onAddToCart: (product: IProduct) => void;
  onAddToWishlist: (product: IProduct) => void;
  onDelete: (productId: number) => void;
  averageRating: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  isAdmin,
  wishlistStatus,
  onAddToCart,
  onAddToWishlist,
  onDelete,
  averageRating,
}) => {
  return (
    <ProductCardContainer>
      <Link
        to={`/products/${product.productId}`}
        title={product.productDescription}
      >
        <Image
          src={product.image}
          alt={product.productDescription}
          viewMode={viewMode}
        />
      </Link>
      <WishlistButton
        isInWishlist={wishlistStatus[product.productId] || false}
        onClick={() => onAddToWishlist(product)}
      >
        {wishlistStatus[product.productId] ? (
          <AiFillHeart />
        ) : (
          <AiOutlineHeart />
        )}
      </WishlistButton>

      <Link
        to={`/products/${product.productId}`}
        title={product.productDescription}
      >
        <ProductNameContainer>{product.productName}</ProductNameContainer>
      </Link>

      <Price>{product.price.toFixed(2)} &#8377;</Price>
      <Star reviews={averageRating} />

      <Button onClick={() => onAddToCart(product)} viewMode={viewMode}>
        Add to Cart
      </Button>

      {isAdmin && (
        <DeleteButton
          onClick={() => onDelete(product.productId)}
          viewMode={viewMode}
        >
          Delete
        </DeleteButton>
      )}
    </ProductCardContainer>
  );
};

export default ProductCard;
