import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import {
  fetchProducts,
  updateProduct,
  deleteProduct,
} from '../redux/slices/productSlice';
import { IProduct } from '../utils/type/types';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #343a40;
  margin-bottom: 20px;
  font-size: 32px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ced4da;
  border-radius: 5px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  margin: 0 5px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  margin-top: 1px;

  &:hover {
    background-color: #c82333;
  }
`;

const ProductManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((root: RootState) => root.products.products);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [productData, setProductData] = useState<IProduct>({
    productId: 0,
    productName: '',
    price: 0,
    image: '',
    productDescription: '',
    category: '',
    stock: 0,
    rating: { rate: 0, count: 0 },
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEditClick = (product: IProduct) => {
    setEditingProduct(product);
    setProductData(product);
  };

  const handleSaveClick = () => {
    if (editingProduct) {
      dispatch(
        updateProduct({
          productId: editingProduct.productId,
          updatedProduct: productData,
        })
      );
      setEditingProduct(null);
    }
  };

  const handleDeleteClick = (productId: number) => {
    dispatch(deleteProduct(productId));
  };

  return (
    <Container>
      <Title>Product Management</Title>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId}>
              <td>{product.productId}</td>
              <td>
                {editingProduct?.productId === product.productId ? (
                  <Input
                    value={productData.productName}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        productName: e.target.value,
                      })
                    }
                  />
                ) : (
                  product.productName
                )}
              </td>
              <td>
                {editingProduct?.productId === product.productId ? (
                  <Input
                    type="number"
                    value={productData.price}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                ) : (
                  product.price
                )}
              </td>
              <td>
                {editingProduct?.productId === product.productId ? (
                  <Input
                    value={productData.category}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        category: e.target.value,
                      })
                    }
                  />
                ) : (
                  product.category
                )}
              </td>
              <td>
                {editingProduct?.productId === product.productId ? (
                  <Input
                    type="number"
                    value={productData.stock}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        stock: parseInt(e.target.value, 10),
                      })
                    }
                  />
                ) : (
                  product.stock
                )}
              </td>
              <td>
                {editingProduct?.productId === product.productId ? (
                  <Button onClick={handleSaveClick}>Save</Button>
                ) : (
                  <Button onClick={() => handleEditClick(product)}>Edit</Button>
                )}
                <DeleteButton
                  onClick={() => handleDeleteClick(product.productId)}
                >
                  Delete
                </DeleteButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};

export default ProductManagement;
