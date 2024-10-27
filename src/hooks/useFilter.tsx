import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  IProduct,
  TRatingFilter,
  TPriceFilter,
  TCategoryFilter,
} from '../utils/type/types';
import { useLocation } from 'react-router-dom';

export const useProductFilter = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const category = query.get('category');
  const products = useSelector((state: RootState) => state.products.products);

  const averageRatings = useSelector(
    (state: RootState) => state.reviews.averageRatings
  );
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);
  const wishlist = useSelector((state: RootState) => state.wishList.items);
  const [priceFilter, setPriceFilter] = useState<TPriceFilter>('all');
  const [ratingFilter, setRatingFilter] = useState<TRatingFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<TCategoryFilter>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlistStatus, setWishlistStatus] = useState<Record<string, boolean>>(
    {}
  );
  useEffect(() => {
    const status = wishlist.reduce(
      (acc, item) => {
        acc[item.product.productId] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );
    setWishlistStatus(status);
  }, [wishlist]);
  useEffect(() => {
    if (category) {
      setCategoryFilter(category as TCategoryFilter);
    }
  }, [category]);

  const handlePriceFilterChange = (filter: TPriceFilter) =>
    setPriceFilter(filter);
  const handleRatingFilterChange = (filter: TRatingFilter) =>
    setRatingFilter(filter);
  const handleCategoryFilterChange = (category: string) =>
    setCategoryFilter(category as TCategoryFilter);
  const handleViewModeChange = () =>
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');

  const isPriceMatch = (price: number, filter: TPriceFilter): boolean => {
    switch (filter) {
      case 'low':
        return price < 1500;
      case 'medium':
        return price >= 1500 && price < 5000;
      case 'high':
        return price >= 5000;
      default:
        return true;
    }
  };

  const isRatingMatch = (rating: number, filter: TRatingFilter): boolean => {
    switch (filter) {
      case '1-star':
        return rating >= 1 && rating < 2;
      case '2-star':
        return rating >= 2 && rating < 3;
      case '3-star':
        return rating >= 3 && rating < 4;
      case '4-star':
        return rating >= 4 && rating < 5;
      case '5-star':
        return rating === 5;
      default:
        return true;
    }
  };

  const isCategoryMatch = (category: string, filter: string): boolean => {
    return filter === 'all' || category === filter;
  };

  const isSearchMatch = (title: string, searchTerm: string): boolean => {
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product: IProduct) => {
      const averageRating = averageRatings[product.productId] || 0;

      return (
        isPriceMatch(product.price, priceFilter) &&
        isRatingMatch(averageRating, ratingFilter) &&
        isCategoryMatch(product.category, categoryFilter) &&
        isSearchMatch(product.productName, searchTerm)
      );
    });
  }, [
    products,
    priceFilter,
    ratingFilter,
    categoryFilter,
    searchTerm,
    averageRatings,
  ]);
  return {
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
  };
};
