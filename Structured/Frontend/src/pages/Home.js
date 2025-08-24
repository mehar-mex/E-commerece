import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../store/productSlice';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);
  const [isPaused, setIsPaused] = React.useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featuredProducts = products.slice(0, 12);

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

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleWheel = (e) => {
      e.preventDefault();
      carousel.scrollLeft += e.deltaY;
    };

    carousel.addEventListener('wheel', handleWheel);

    return () => {
      carousel.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const autoScroll = () => {
      if (!isPaused) {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        if (carousel.scrollLeft >= maxScroll) {
          carousel.scrollLeft = 0;
        } else {
          carousel.scrollLeft += 0.5;
        }
      }
    };

    intervalRef.current = setInterval(autoScroll, 50);

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);
    const handleTouchStart = () => setIsPaused(true);
    const handleTouchEnd = () => setTimeout(() => setIsPaused(false), 2000);

    carousel.addEventListener('mouseenter', handleMouseEnter);
    carousel.addEventListener('mouseleave', handleMouseLeave);
    carousel.addEventListener('touchstart', handleTouchStart);
    carousel.addEventListener('touchend', handleTouchEnd);

    return () => {
      clearInterval(intervalRef.current);
      carousel.removeEventListener('mouseenter', handleMouseEnter);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchend', handleTouchEnd);
    };
  }, [featuredProducts, isPaused]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <section className="hero">
        <img src="/uploads/image/back3.jpg" alt="Hero Background" className="hero-bg-image" />
        <div className="container">
          <Link to="/sale" className="sale-badge">
            <span className="sale-icon"></span>
            <span className="sale-text">50% OFF</span>
            <span className="sale-subtext">FESTIVE SALE</span>
            <span className="sale-sparkle">✨</span>
          </Link>
          <h1>Elevate Your Shopping Experience Today!</h1>
          <p>Discover amazing products with up to 50% off in our festive sale</p>
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
        </div>
      </section>
      
      <div className="container">
        <section className="carousel-section">
          <div className="container">
            <h2>New Collection</h2>
          </div>
          <div className="carousel-container">
            <button className="scroll-btn left" onClick={() => {
              setIsPaused(true);
              carouselRef.current.scrollBy({left: -300, behavior: 'smooth'});
              setTimeout(() => setIsPaused(false), 2000);
            }}>
              ‹
            </button>
            <div className="product-carousel" ref={carouselRef}>
            {featuredProducts.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image-container">
                  <Link to={`/product/${product._id}`}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        console.log('Image failed to load:', product.image);
                        e.target.src = 'https://via.placeholder.com/300x400/cccccc/666666?text=No+Image';
                      }}
                    />
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
            <button className="scroll-btn right" onClick={() => {
              setIsPaused(true);
              carouselRef.current.scrollBy({left: 300, behavior: 'smooth'});
              setTimeout(() => setIsPaused(false), 2000);
            }}>
              ›
            </button>
          </div>
        </section>
        
        <section className="all-products-section">
          <h2>All Products</h2>
          <div className="product-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image-container">
                  <Link to={`/product/${product._id}`}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        console.log('Image failed to load:', product.image);
                        e.target.src = 'https://via.placeholder.com/300x400/cccccc/666666?text=No+Image';
                      }}
                    />
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
        </section>
      </div>
    </div>
  );
};

export default Home;