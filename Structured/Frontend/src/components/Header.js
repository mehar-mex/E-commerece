import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { fetchProducts } from '../store/productSlice';

const Header = () => {
  const { user } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/products');
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?search=${encodeURIComponent(category)}`);
    setShowCategories(false);
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/">
            <h1>Memu Store</h1>
          </Link>
          <ul>
            <li className="dropdown">
              <button 
                onClick={() => setShowCategories(!showCategories)}
                className="dropdown-btn"
              >
                Categories
              </button>
              {showCategories && (
                <div className="dropdown-menu">
                  <div onClick={() => handleCategoryClick('Skirt')}>Skirts</div>
                  <div onClick={() => handleCategoryClick('Kurti')}>Kurtis</div>
                  <div onClick={() => handleCategoryClick('Top')}>Tops</div>
                  <div onClick={() => handleCategoryClick('Jacket')}>Jackets</div>
                </div>
              )}
            </li>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/orders">Orders</Link></li>
          </ul>
          <div className="nav-icons">
            <div className="search-container">
              <button 
                type="button"
                className="search-icon-btn"
                onClick={() => setShowSearch(!showSearch)}
              >
                <i className="fa-solid fa-magnifying-glass" style={{color: '#333'}}></i>
              </button>
              {showSearch && (
                <form onSubmit={handleSearch} className="search-form">
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </form>
              )}
            </div>
            <Link to="/cart" className="cart-link">
              <i className="fa-solid fa-cart-shopping" style={{color: '#333'}}></i> ({items.length})
            </Link>
            <Link to="/wishlist" className="wishlist-link">
              <i className="fa-solid fa-heart" style={{color: '#333'}}></i>
            </Link>
            {user ? (
              <>
                <span>{user.name}</span>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="login-link">
                  <i className="fa-solid fa-user" style={{color: '#000000'}}></i>
                </Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;