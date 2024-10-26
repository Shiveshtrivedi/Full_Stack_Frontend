import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { addProduct } from '../redux/slices/productSlice';
import styled from 'styled-components';
import { IProductWithoutId, TCategoryFilter } from '../utils/type/types';
import { getCart } from '../redux/slices/cartSlice';
import { addInventoryItem } from '../redux/slices/inventorySlice';
import GoBackButton from '../components/navigation/goBackButton';

const FormContainer = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px #00000050;
  max-width: 500px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
  box-sizing: border-box;
  -moz-appearance: textfield;
  appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
`;

const SubmitButton = styled.button`
  background-color: #28a745;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

const AddProductPage: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [costPrice, setCostPrice] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [stockUnit, setStockUnit] = useState<number>();
  const [image, setImage] = useState<string>('');
  const [category, setCategory] = useState<TCategoryFilter>('electronics');

  const userId = useSelector((state: RootState) => state.auth.user.id);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getCart({ userId }));
  }, [userId, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const product: IProductWithoutId = {
      productName: title,
      productDescription: description,
      price: parseFloat(price),
      image,
      category,
      stock: stockUnit ?? 0,
      costPrice: parseFloat(costPrice),
      sellingPrice: parseFloat(price),
    };

    try {
      const newProduct = await dispatch(
        addProduct({ newProduct: product, userId })
      ).unwrap();

      await dispatch(addInventoryItem(newProduct.productId));

      setTitle('');
      setDescription('');
      setPrice('');
      setCostPrice('');
      setStockUnit(0);
      setImage('');
    } catch (error) {
      console.error('Error adding product or inventory:', error);
    }
  };

  return (
    <FormContainer>
      <GoBackButton />
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Product Description</Label>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Cost Price (in &#8377;)</Label>
          <Input
            type="number"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </FormGroup>
        <FormGroup>
          <Label>Selling Price (in &#8377;)</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </FormGroup>
        <FormGroup>
          <Label>Stock</Label>
          <Input
            type="number"
            value={stockUnit}
            onChange={(e) => setStockUnit(Number(e.target.value))}
            required
            min="0"
            step="1"
          />
        </FormGroup>
        <FormGroup>
          <Label>Image URL </Label>
          <Input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Category</Label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as TCategoryFilter)}
            required
          >
            <option value="electronics">Electronics</option>
            <option value="jewelery">Jewelry</option>
            <option value="men's clothing">Mens Clothing</option>
            <option value="women's clothing">Womens Clothing</option>
          </Select>
        </FormGroup>
        <SubmitButton type="submit">Add Product</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default AddProductPage;
