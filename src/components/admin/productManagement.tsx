import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import {
  updateProduct,
  deleteProduct,
  fetchProducts,
  updateInventoryInProduct,
  updateProductInUserManagement,
  deleteProductInProductManagement,
} from '../../redux/slices/productSlice';
import { IProduct } from '../../utils/type/types';
import styled from 'styled-components';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import useScrollToTop from '../../hooks/useScrollToTop';
import ScrollToTopButton from '../ui/scrollButton';
import mqtt from 'mqtt';
import { updateSales } from '../../redux/slices/dashBoardSlice';

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

const GoBackButton = styled(IoArrowBackOutline)`
  font-size: 25px;
  color: #000000;
  cursor: pointer;
  padding: 7px;

  &:hover {
    border-radius: 50%;
    background-color: #cbd3da;
  }
  @media (max-width: 768px) {
    font-size: 20px;
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
  const navigate = useNavigate();
  const { isVisible, scrollToTop } = useScrollToTop();

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

  const websocketUrl = process.env.REACT_APP_WEBSOCKET_URL;
  useEffect(() => {
    const client = mqtt.connect(`${websocketUrl}`);

    client.on('connect', () => {
      client.subscribe('inventory-updates', (err) => {
        if (err) {
          console.error('Subscription error for inventory/updates:', err);
        }
      });

      client.subscribe('order/update', (err) => {
        if (err) {
          console.error('Subscription error for order/update:', err);
        }
      });
      client.subscribe('product/new', (err) => {
        if (err) {
          console.error('Subscription error for product/new:', err);
        }
      });
      client.subscribe('product/update', (err) => {
        if (err) {
          console.error('Subscription error for product/update:', err);
        }
      });
      client.subscribe('product/delete', (err) => {
        console.error('Subscription error for product/delete:', err);
      });
    });

    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());

        if (topic === 'inventory-updates') {
          dispatch(updateInventoryInProduct(data));
        }
        if (topic === 'product/new') {
          dispatch(updateInventoryInProduct(data));
        }
        if (topic === 'product/update') {
          dispatch(updateProductInUserManagement(data));
        }
        if (topic === 'product/delete') {
          dispatch(deleteProductInProductManagement(data.productId));
        }

        if (topic === 'sales-updates') {
          dispatch(updateSales(data));
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    });

    return () => {
      client.end();
    };
  }, [dispatch]);

  return (
    <Container>
      <GoBackButton onClick={() => navigate(-1)} />
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
      <ScrollToTopButton visible={isVisible} onClick={scrollToTop} />
    </Container>
  );
};

export default ProductManagement;
