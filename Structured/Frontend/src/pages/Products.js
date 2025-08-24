import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../store/productSlice';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [displayedProducts, setDisplayedProducts] = React.useState([]);
  const [hasScrolled, setHasScrolled] = React.useState(false);

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
    // Generate consistent rating based on product ID
    const seed = productId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const rating = (seed % 31 + 20) / 10; // Rating between 2.0 and 5.0
    return Math.max(2.0, Math.round(rating * 10) / 10); // Ensure minimum 2.0 stars
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

  useEffect(() => {
    dispatch(fetchProducts({ search: searchQuery }));
  }, [dispatch, searchQuery]);

  useEffect(() => {
    if (products.length > 0) {
      setDisplayedProducts(products);
      setHasScrolled(false);
    }
  }, [products]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        if (!hasScrolled && products.length > 0) {
          setDisplayedProducts(prev => [...prev, ...products]);
          setHasScrolled(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [products, hasScrolled]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>Products</h1>
      <div className="product-grid">
        {displayedProducts.map((product, index) => (
          <div key={`${product._id}-${index}`} className="product-card">
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
              <p>Rs.{product.price}</p>
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

export default Products;