import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromWishlist } from '../store/wishlistSlice';

const Wishlist = () => {
  const { items } = useSelector(state => state.wishlist);
  const dispatch = useDispatch();

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  return (
    <div className="container">
      <h1>My Wishlist</h1>
      {items.length === 0 ? (
        <p>Your wishlist is empty. <Link to="/products">Continue Shopping</Link></p>
      ) : (
        <div className="product-grid">
          {items.map(product => (
            <div key={product._id} className="product-card">
              <img 
                src={product.image} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x400/cccccc/666666?text=No+Image';
                }}
              />
              <div className="product-card-content">
                <h3>{product.name}</h3>
                <div className="product-rating">
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                  <span className="star">⭐</span>
                </div>
                <p>Rs.{product.price}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <Link to={`/product/${product._id}`} className="btn btn-primary btn-small">
                    View Details
                  </Link>
                  <button 
                    onClick={() => handleRemove(product._id)}
                    className="btn btn-secondary btn-small"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;