import React from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import {
  TCategoryFilter,
  TPriceFilter,
  TRatingFilter,
} from '../utils/type/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { selectSearchTerm, setSearchTerm } from '../redux/slices/searchSlice';

interface SearchBarProps {
  categoryFilter: TCategoryFilter;
  priceFilter: TPriceFilter;
  ratingFilter: TRatingFilter;
  handleCategoryFilterChange: (category: TCategoryFilter) => void;
  handlePriceFilterChange: (filter: TPriceFilter) => void;
  handleRatingFilterChange: (filter: TRatingFilter) => void;
  handleResetFilters: () => void;
}

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 50px;
  padding: 10px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  background-color: #f1f1f1;
  border-radius: 50px;
  padding: 5px 10px;
  margin-right: 10px;

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 10px;
  }
`;

const FilterDropdown = styled.select`
  border: none;
  background: transparent;
  font-size: 14px;
  margin-right: 10px;
  outline: none;
  font-family: inherit;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  padding: 10px;
  font-size: 16px;
  background: transparent;
  font-family: inherit;

  &::placeholder {
    color: #aaa;
  }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 10px;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const ResetButton = styled.button`
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 25px;
  color: black;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const SearchBar: React.FC<SearchBarProps> = ({
  categoryFilter,
  handleCategoryFilterChange,
  priceFilter,
  handlePriceFilterChange,
  ratingFilter,
  handleRatingFilterChange,

  handleResetFilters,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const searchTerm = useSelector((state: RootState) => selectSearchTerm(state));

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
  };

  return (
    <SearchForm>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="I'm looking for..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <SearchButton type="submit">
          <FaSearch />
        </SearchButton>
      </SearchContainer>

      <FilterDropdown
        value={categoryFilter}
        onChange={(e) =>
          handleCategoryFilterChange(e.target.value as TCategoryFilter)
        }
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="jewelery">Jewelry</option>
        <option value="men's clothing">Men's Clothing</option>
        <option value="women's clothing">Women's Clothing</option>
      </FilterDropdown>

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

      <ResetButton type="button" onClick={handleResetFilters}>
        Reset Filters
      </ResetButton>
    </SearchForm>
  );
};

export default SearchBar;
