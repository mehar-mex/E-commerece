import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchProducts } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, products, loading } = useSelector(state => state.products);
  const { user } = useSelector(state => state.auth);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  const [selectedSize, setSelectedSize] = useState('');
  const [showCartModal, setShowCartModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const sizeChartData = [
    { brandSize: '6', labelSize: '6', bust: '33.2', waist: '30.5', hip: '49.2' },
    { brandSize: '8', labelSize: '8', bust: '36', waist: '33', hip: '52' },
    { brandSize: '10', labelSize: '10', bust: '38.2', waist: '35.5', hip: '53.8' },
    { brandSize: '12', labelSize: '12', bust: '40', waist: '37.5', hip: '55.2' },
    { brandSize: '14', labelSize: '14', bust: '41.5', waist: '39.5', hip: '57' },
    { brandSize: '16', labelSize: '16', bust: '43', waist: '41.5', hip: '59' },
    { brandSize: '18', labelSize: '18', bust: '48', waist: '46', hip: '64' }
  ];

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchProducts());
  }, [dispatch, id]);

  // Get related products - if no category match, show random products
  const relatedProducts = products.filter(product => product._id !== id).slice(0, 6);

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

  const handleAddToCart = () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    setShowCartModal(true);
  };

  const confirmAddToCart = () => {
    dispatch(addToCart({
      productId: currentProduct._id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.image,
      quantity: quantity
    }));
    setShowCartModal(false);
    setQuantity(1);
    setSelectedSize('');
  };

  if (loading) return <div>Loading...</div>;
  if (!currentProduct) return <div>Product not found</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', gap: '2rem', padding: '2rem 0' }}>
        <img 
          src={currentProduct.image} 
          alt={currentProduct.name}
          style={{ width: '400px', height: '400px', objectFit: 'cover' }}
        />
        <div>
          <h1>{currentProduct.name}</h1>
          <p style={{ fontSize: '1.5rem', color: '#007bff', margin: '1rem 0' }}>
            Rs.{currentProduct.price}
          </p>
          <p>{currentProduct.description}</p>
          <p>Stock: {currentProduct.stock}</p>
          
          <div style={{ margin: '1rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <label style={{ fontWeight: '500' }}>
                Select Size:
              </label>
              <button 
                onClick={() => setShowSizeChart(true)}
                className="size-chart-btn"
              >
                Size Chart
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {currentProduct.sizes?.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: selectedSize === size ? '2px solid #007bff' : '1px solid #ddd',
                    background: selectedSize === size ? '#007bff' : 'white',
                    color: selectedSize === size ? 'white' : '#333',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    minWidth: '50px'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
            disabled={!selectedSize}
          >
            Add to Cart
          </button>
        </div>
      </div>
      
      {relatedProducts.length > 0 && currentProduct && (
        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Related Products</h3>
          <div className="product-grid">
            {relatedProducts.map(product => (
              <div key={product._id} className="product-card">
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
                  <p>Rs.{product.price}</p>
                  <Link to={`/product/${product._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showCartModal && (
        <div className="modal-overlay">
          <div className="cart-modal">
            <h3>Add to Cart</h3>
            <div className="modal-product-info">
              <img src={currentProduct.image} alt={currentProduct.name} style={{width: '80px', height: '80px', objectFit: 'cover'}} />
              <div>
                <h4>{currentProduct.name}</h4>
                <p>${currentProduct.price}</p>
              </div>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label>Size:</label>
                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} required>
                  <option value="">Select Size</option>
                  {currentProduct.sizes?.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity:</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={() => setShowCartModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={confirmAddToCart} className="btn btn-primary" disabled={!selectedSize}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showSizeChart && (
        <div className="modal-overlay">
          <div className="size-chart-modal">
            <div className="modal-header">
              <h3>W - Women Size Chart</h3>
              <button onClick={() => setShowSizeChart(false)} className="close-btn">×</button>
            </div>
            <div className="size-chart-content">
              <h4>IN Regular</h4>
              <table className="size-chart-table">
                <thead>
                  <tr>
                    <th>Brand Size</th>
                    <th>Label Size</th>
                    <th>Bust (in)</th>
                    <th>Waist (in)</th>
                    <th>Hip (in)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChartData.map((size, index) => (
                    <tr key={index}>
                      <td>{size.brandSize}</td>
                      <td>{size.labelSize}</td>
                      <td>{size.bust}</td>
                      <td>{size.waist}</td>
                      <td>{size.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;