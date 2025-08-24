import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCart, updateQuantity, removeFromCart } from '../store/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.cart);
  const { products } = useSelector(state => state.products);
  const { user } = useSelector(state => state.auth);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    } else {
      dispatch(removeFromCart(productId));
    }
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="container">
        <h2>Please login to view your cart</h2>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  const getSaleProducts = () => {
    // First 6 products are on sale (same logic as Sale page)
    return products.slice(0, 6).map(p => p._id);
  };

  const getItemPrice = (item) => {
    const saleProductIds = getSaleProducts();
    const isOnSale = saleProductIds.includes(item.productId);
    return isOnSale ? item.price * 0.5 : item.price;
  };

  const total = items.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);

  return (
    <div className="container">
      <h1>Shopping Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty. <Link to="/products">Continue Shopping</Link></p>
      ) : (
        <>
          {items.map(item => (
            <div key={item.productId} className="cart-item">
              <img src={item.image} alt={item.name} style={{ width: '80px' }} />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                {getSaleProducts().includes(item.productId) ? (
                  <div className="price-container">
                    <span className="original-price">Rs.{item.price}</span>
                    <span className="sale-price">Rs.{(item.price * 0.5).toFixed(2)}</span>
                    <span className="sale-tag-small">50% OFF</span>
                  </div>
                ) : (
                  <p>Rs.{item.price}</p>
                )}
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>
              <button 
                onClick={() => dispatch(removeFromCart(item.productId))}
                className="btn btn-secondary remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="cart-total">
            Total: Rs.{total.toFixed(2)}
          </div>
          <Link to="/checkout" className="btn btn-primary">
            Proceed to Checkout
          </Link>
        </>
      )}
    </div>
  );
};

export default Cart;