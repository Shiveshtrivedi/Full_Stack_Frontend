import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import {
  deleteProduct,
  fetchProducts,
  resetFilter,
} from '../redux/slices/productSlice';
import { Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from '../redux/slices/wishlistSlice';
import { toast } from 'react-toastify';
import { fetchAllReviews } from '../redux/slices/userReviewSlice';
import { IProduct, EStatus } from '../utils/type/types';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import NoProductFound from './noProductFound';
import Star from './star';
import { useAddToCart } from '../hooks/useCart';
import { useProductFilter } from '../hooks/useFilter';
import Loading from './loading';
import NetworkErrorPage from './networkError';
import { getCart } from '../redux/slices/cartSlice';
import SearchBar from './searchBar';
import useScrollToTop from '../hooks/useScrollToTop';
import ScrollToTopButton from './scrollButton';

const Container = styled.div`
  display: flex;
  max-width: 100%;
  flex-direction: column;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ProductBox = styled.div<{ viewMode: string }>`
  width: '100%';
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  flex-direction: ${(props) => (props.viewMode === 'grid' ? 'row' : 'column')};
  transition:
    width 0.3s ease,
    flex-direction 0.5s ease;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Image = styled.img<{ viewMode: string }>`
  aspect-ratio: 3/2;
  mix-blend-mode: color-burn;
  width: ${(props) => (props.viewMode === 'grid' ? '250px' : '900px')};
  height: 150px;
  background: none;
  object-fit: contain;
  margin: ${(props) =>
    props.viewMode === 'grid' ? '0 13px;' : '0 10px 0 70px'};

  @media (max-width: 768px) {
    width: 100px;
    height: 130px;
  }
`;

const Price = styled.p`
  font-size: 16px;
  color: #666666;
  margin: 0 0 10px 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
const Button = styled.button<{ viewMode: string }>`
  flex-direction: ${(props) => (props.viewMode === 'grid' ? 'row' : 'column')};
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
  box-shadow: 0 4px 6px #00000020;
  margin-top: 10px;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
    box-shadow: 0 6px 12px #00000030;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 12px;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  &:hover {
    background-color: #c82333;
    transform: scale(1.05);
    box-shadow: 0 6px 12px #00000030;
  }
`;
const ProductNameContainer = styled.div`
  position: relative;
  display: inline-block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 768px) {
    max-width: 150px;
  }
`;

const ProductGridItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ddd;
  width: 27%;
  margin: 10px;
  border-radius: 10px;
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

const ProductListItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ddd;
  width: 95%;
  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 0 0 10px #00000010;

  @media (min-width: 481px) and (max-width: 768px) {
    padding: 15px;
    margin-bottom: 10px;
    width: 93%;

    img {
      width: 80px;
      height: 100px;
      margin-bottom: 15px;
      margin-left: auto;
      margin-right: auto;
    }

    div {
      flex: 1;
      margin-bottom: 10px;
    }
  }
  @media (max-width: 481px) {
    padding: 15px;
    margin-bottom: 10px;
    width: 85%;

    img {
      width: 60px;
      height: 80px;
      margin-bottom: 12px;
      margin-left: auto;
      margin-right: auto;
    }

    div {
      flex: 1;
      margin-bottom: 8px;
    }
  }
`;

const ImageHeartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 10px;
  position: relative;
`;

const WishlistButton = styled.div<{ viewMode: string; isInWishlist: boolean }>`
  color: ${(props) => (props.isInWishlist ? '#e64a19' : '#ff5722')};
  padding: 8px 1px 8px 1px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 0 130px -20px;
  font-size: 20px;
  font-weight: bold;
  position:absolute;
  right:7px;
  top:10px
  width: ${(props) => (props.viewMode === 'list' ? '90px' : '50px')};

  transition:
    background-color 0.3s ease,
    transform 0.3s ease;

  @media (max-width: 768px) {
    padding: 6px;
    font-size: 14px;
    margin-left: 2px;
    right:5px;
    top:5px;
  }
`;

const ActionButton = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  gap: 10%;
  width: 100%;
`;

const LowStockAlert = styled.div`
  color: #dc3545;
  padding: 5px;
  border-radius: 4px;
  font-weight: bold;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const TopRatedText = styled.div<{ isVisible: boolean }>`
  color: #ffcc00;
  margin-bottom: 3px;
  font-size: 15px;
  font-style: italic;
  animation: ${({ isVisible }) =>
    isVisible
      ? css`
          ${fadeIn} 0.5s ease-in-out
        `
      : 'none'};
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
`;

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.products.status);
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  const userId = useSelector((state: RootState) => state.auth.user.id);

  const { isVisible, scrollToTop } = useScrollToTop();

  const handleAddToCart = useAddToCart();
  const {
    filteredProducts,
    priceFilter,
    ratingFilter,
    categoryFilter,
    viewMode,
    wishlistStatus,
    handlePriceFilterChange,
    handleRatingFilterChange,
    handleCategoryFilterChange,
    handleViewModeChange,
  } = useProductFilter();
  const averageRatings = useSelector(
    (state: RootState) => state.reviews.averageRatings
  );

  useEffect(() => {
    if (status === EStatus.Idle) {
      dispatch(fetchProducts());
      dispatch(getWishlist(userId));
      dispatch(fetchAllReviews());
      dispatch(getCart({ userId }));
    }
  }, [dispatch, status, userId]);

  if (status === EStatus.Loading) {
    return <Loading />;
  }

  if (status === EStatus.Failed) {
    return (
      <div>
        <NetworkErrorPage />
      </div>
    );
  }

  const handleAddToWishlist = (product: IProduct) => {
    if (wishlistStatus[product.productId]) {
      dispatch(removeFromWishlist({ userId, productId: product.productId }));
    } else {
      dispatch(addToWishlist({ userId, product }));
    }
  };

  const handleToDelete = async (id: number) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete item. Please try again.');
    }
  };
  const handleResetFilter = () => {
    dispatch(resetFilter());

    handlePriceFilterChange('all');
    handleRatingFilterChange('all');
    handleCategoryFilterChange('all');
  };

  return (
    <Container>
      <SearchBar
        categoryFilter={categoryFilter}
        handleCategoryFilterChange={handleCategoryFilterChange}
        priceFilter={priceFilter}
        handlePriceFilterChange={handlePriceFilterChange}
        ratingFilter={ratingFilter}
        handleRatingFilterChange={handleRatingFilterChange}
        handleResetFilters={handleResetFilter}
        viewMode={viewMode}
        handleToggleViewMode={handleViewModeChange}
      />

      {filteredProducts.length === 0 ? (
        <NoProductFound />
      ) : (
        <ProductBox viewMode={viewMode}>
          {filteredProducts.map((product: IProduct) =>
            viewMode === 'grid' ? (
              <ProductGridItem key={product.productId}>
                {product.stock < 10 && (
                  <LowStockAlert>
                    Only {product.stock}! product remaining
                  </LowStockAlert>
                )}
                <TopRatedText
                  isVisible={averageRatings[product.productId] === 5}
                >
                  {averageRatings[product.productId] === 5 ? 'Top Rated' : ''}
                </TopRatedText>
                <ImageHeartContainer>
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
                    viewMode={viewMode}
                    isInWishlist={wishlistStatus[product.productId] || false}
                    onClick={() => handleAddToWishlist(product)}
                  >
                    {wishlistStatus[product.productId] ? (
                      <AiFillHeart
                        style={{ color: '#FF0000', fontSize: '150%' }}
                      />
                    ) : (
                      <AiOutlineHeart
                        style={{ color: '#000', fontSize: '125%' }}
                      />
                    )}
                  </WishlistButton>
                </ImageHeartContainer>

                <Link
                  to={`/products/${product.productId}`}
                  title={product.productDescription}
                >
                  <ProductNameContainer data-title={product.productDescription}>
                    {product.productName}
                    {product.productDescription}
                  </ProductNameContainer>
                </Link>

                <Price> {product.price.toFixed(2)} &#8377; </Price>

                <Star reviews={averageRatings[product.productId] || 0} />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Button
                    onClick={() => handleAddToCart(product)}
                    viewMode={viewMode}
                  >
                    Add to Cart
                  </Button>
                </div>

                {isAdmin && (
                  <DeleteButton
                    onClick={() => handleToDelete(product.productId)}
                    viewMode={viewMode}
                  >
                    Delete
                  </DeleteButton>
                )}
                <ScrollToTopButton visible={isVisible} onClick={scrollToTop} />
              </ProductGridItem>
            ) : (
              <ProductListItem key={product.productId}>
                <ImageHeartContainer>
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
                    viewMode={viewMode}
                    isInWishlist={wishlistStatus[product.productId] || false}
                    onClick={() => handleAddToWishlist(product)}
                  >
                    {wishlistStatus[product.productId] ? (
                      <AiFillHeart
                        style={{ color: '#FF0000', fontSize: '150%' }}
                      />
                    ) : (
                      <AiOutlineHeart
                        style={{ color: '#000', fontSize: '125%' }}
                      />
                    )}
                  </WishlistButton>
                </ImageHeartContainer>

                <Link
                  to={`/products/${product.productId}`}
                  title={product.productDescription}
                >
                  <ProductNameContainer data-title={product.productDescription}>
                    {product.productDescription}
                  </ProductNameContainer>
                </Link>

                <Price>{product.price} &#8377;</Price>

                <Star reviews={averageRatings[product.productId] || 0} />

                <ActionButton>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    viewMode={viewMode}
                  >
                    Add to Cart
                  </Button>

                  {isAdmin && (
                    <DeleteButton
                      onClick={() => handleToDelete(product.productId)}
                      viewMode={viewMode}
                    >
                      Delete
                    </DeleteButton>
                  )}
                </ActionButton>
              </ProductListItem>
            )
          )}
        </ProductBox>
      )}
    </Container>
  );
};

export default ProductList;
