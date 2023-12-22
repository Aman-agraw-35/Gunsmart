"use client"
import React, { useState, useEffect } from 'react';
import Product from './product';
import Cart from './cart';
import Data from '../mainpage/Data';
const Home = () => {
  const [cart, setCart] = useState([]);
  const [products] = useState(Data);
  console.log(products);
  

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div>
      <h1>Next.js Shopping Cart</h1>
      <div>
        <h2>Products</h2>
        {products.map((product) => (
          <Product key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
      <div>
        <Cart cart={cart} />
      </div>
    </div>
  );
};

export default Home;
