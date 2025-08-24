import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../store/productSlice';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';

const Sale = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);
  const { items: wishlistItems } = useSelector(state => state.wishlist);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product._id)) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const generateRating = (productId) => {
    const seed = productId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const rating = (seed % 31 + 20) / 10;
    return Math.max(2.0, Math.round(rating * 10) / 10);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="product-rating">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="star filled">★</span>
        ))}
        {hasHalfStar && <span className="star half">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="star empty">☆</span>
        ))}
        <span className="rating-text">({rating})</span>
      </div>
    );
  };

  const getDiscountedPrice = (price) => {
    return (price * 0.5).toFixed(2); // 50% off
  };

  const saleProducts = products.slice(0, 6); // Only first 6 products on sale

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="sale-header">
        <h1>🎉 50% OFF Festive Sale</h1>
        <p>Limited time offer! Get 50% off on selected products</p>
        <p className="offer-condition">*After you place the order then only this offer will be applicable</p>
      </div>
      
      <div className="product-grid">
        {saleProducts.map(product => (
          <div key={product._id} className="product-card sale-card">
            <div className="sale-tag">50% OFF</div>
            <div className="product-image-container">
              <Link to={`/product/${product._id}`}>
                <img src={product.image} alt={product.name} />
              </Link>
              <button 
                className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
                onClick={() => handleWishlistToggle(product)}
              >
                ♥
              </button>
            </div>
            <div className="product-card-content">
              <h3>{product.name}</h3>
              {renderStars(generateRating(product._id))}
              <div className="price-container">
                <span className="original-price">Rs.{product.price}</span>
                <span className="sale-price">Rs.{getDiscountedPrice(product.price)}</span>
              </div>
              <Link to={`/product/${product._id}`} className="btn btn-primary">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sale;