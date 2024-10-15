import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import {
  deleteProduct,
  fetchProducts,
  resetFilter,
} from '../redux/slices/productSlice';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from '../redux/slices/wishlistSlice';
import { toast } from 'react-toastify';
import { fetchAllReviews } from '../redux/slices/userReviewSlice';
import {
  IProduct,
  TPriceFilter,
  TRatingFilter,
  EStatus,
} from '../utils/type/types';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import NoProductFound from './noProductFound';
import Star from './star';
import { useAddToCart } from '../hooks/useCart';
import { useProductFilter } from '../hooks/useFilter';
import Loading from './loading';
import NetworkErrorPage from './networkError';
import { FiMenu } from 'react-icons/fi';
import { getCart } from '../redux/slices/cartSlice';
import SearchBar from './searchBar';

const Container = styled.div`
  display: flex;
  max-width: 100%;
  flex-direction: column;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterBox = styled.div`
  width: 15%;
  padding: 20px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  box-shadow: 0 0 10px #00000020;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 768px) {
    width: 90%;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }
`;

const ProductBox = styled.div<{ viewMode: string; isFilterVisible: boolean }>`
  width: ${(props) => (props.isFilterVisible ? '85%' : '100%')};
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

const FilterDropdown = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  @media (max-width: 768px) {
    margin-bottom: 10px;
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
  margin: 0 80px 10px 0;

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
  margin-right: 80px;
  @media (max-width: 768px) {
    max-width: 150px;
  }
`;

const FilterButton = styled.button`
  color: #4caf50;
  background-color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 0 10px #00000060;
  transition: background-color 0.2s ease-in-out;
  margin: 20px 20px;

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
    margin: 10px 10px;
  }
`;

const ToggleButton = styled.button`
  background-color: #4caf50;
  color: #ffffff;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px 10px 10px 5px;
  box-shadow: 0 0 10px #00000040;
  transition: background-color 0.3s ease-in-out;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
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

  @media (max-width: 768px) {
    width: 100%;
    padding: 15px;
    margin: 5px 0;
  }
`;

const ProductListItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ddd;
  width: 100%;
  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 0 0 10px #00000010;

  @media (max-width: 768px) {
    padding: 15px;
    margin-bottom: 10px;

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
`;

const ImageHeartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
`;

// const ImageHeartContainerList = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   margin-bottom: 10px;
// `;

const WishlistButton = styled.div<{ viewMode: string; isInWishlist: boolean }>`
  color: ${(props) => (props.isInWishlist ? '#e64a19' : '#ff5722')};
  padding: 8px 1px 8px 1px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 0 130px 0;
  font-size: 20px;
  font-weight: bold;
  width: ${(props) => (props.viewMode === 'list' ? '90px' : '50px')};

  transition:
    background-color 0.3s ease,
    transform 0.3s ease;

  @media (max-width: 768px) {
    padding: 6px;
    font-size: 14px;
    margin-left: 2px;
  }
`;

// const ButtonList = styled.div`
//  display: flex,
//  justifyContent: center,
//  margin: 0 auto,
//  gap: 10%,
//  width: 100%,
// `;

const ActionButton = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  gap: 10%;
  width: 100%;
`;
const Hamburger = styled(FiMenu)<{ isFilterVisible: boolean }>`
  cursor: pointer;
  margin: 5px 5px;
  font-size: 150%;
  position: absolute;
  top: 23%;
  color: ${(props) => (props.isFilterVisible ? '#fefefe' : '#000000')};
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

const ProductList: React.FC = () => {
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.products);
  const status = useSelector((state: RootState) => state.products.status);
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  const userId = useSelector((state: RootState) => state.auth.user.id);

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
  }, [dispatch, status, products, userId]);

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
      toast.error(`${product.productName} removed from wishlist`);
    } else {
      dispatch(addToWishlist({ userId, product }));
      toast.success(`Added to wishlist`);
    }
  };

  const handleToDelete = (id: number) => {
    dispatch(deleteProduct(id));
    toast.error('Item deleted');
  };

  const handleResetFilter = () => {
    dispatch(resetFilter());

    handlePriceFilterChange('all');
    handleRatingFilterChange('all');
    handleCategoryFilterChange('all');
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prev) => !prev);
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
      />
      <Hamburger
        onClick={toggleFilterVisibility}
        isFilterVisible={isFilterVisible}
      />
      {isFilterVisible && (
        <FilterBox>
          <FilterDropdown
            value={priceFilter}
            onChange={(e) =>
              handlePriceFilterChange(e.target.value as TPriceFilter)
            }
          >
            <option value="all">All Prices</option>
            <option value="low">Low ($50)</option>
            <option value="medium">Medium ($50 - $100)</option>
            <option value="high">High (≥ $100)</option>
          </FilterDropdown>

          <FilterDropdown
            value={ratingFilter}
            onChange={(e) =>
              handleRatingFilterChange(e.target.value as TRatingFilter)
            }
          >
            <option value="all">All Ratings</option>
            <option value="1-star">1 Star</option>
            <option value="2-star">2 Stars</option>
            <option value="3-star">3 Stars</option>
            <option value="4-star">4 Stars</option>
            <option value="5-star">5 Stars</option>
          </FilterDropdown>

          <FilterDropdown
            value={categoryFilter}
            onChange={(e) => handleCategoryFilterChange(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="jewelery">Jewelry</option>
            <option value="men's clothing">Mens Clothing</option>
            <option value="women's clothing">Womens Clothing</option>
          </FilterDropdown>

          <FilterButton onClick={handleResetFilter}>Reset Filters</FilterButton>
          <ToggleButton onClick={handleViewModeChange}>
            {viewMode === 'grid' ? 'List' : 'Grid'} View
          </ToggleButton>
        </FilterBox>
      )}

      {filteredProducts.length === 0 ? (
        <NoProductFound />
      ) : (
        <ProductBox viewMode={viewMode} isFilterVisible={isFilterVisible}>
          {filteredProducts.map((product: IProduct) =>
            viewMode === 'grid' ? (
              <ProductGridItem key={product.productId}>
                {product.stock < 10 && (
                  <LowStockAlert>
                    Only {product.stock}! product reamaining
                  </LowStockAlert>
                )}
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
                      <AiFillHeart style={{ color: 'red', fontSize: '150%' }} />
                    ) : (
                      <AiOutlineHeart
                        style={{ color: 'black', fontSize: '125%' }}
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

                <Price>Rs {product.price * 90} </Price>

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
                      <AiFillHeart style={{ color: 'red', fontSize: '150%' }} />
                    ) : (
                      <AiOutlineHeart
                        style={{ color: 'red', fontSize: '150%' }}
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

                <Price>${product.price}</Price>

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
