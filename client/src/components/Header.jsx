import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import { AiOutlineLogout } from "react-icons/ai";
import { FaUser } from 'react-icons/fa'
import cartLogo from '../data/shopping-cart.png';
import Logo from '../data/logo.png'


  const base_url = import.meta.env.VITE_BASE_URL


export default function Header() {
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();


const capitalize = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
  fetch(`${base_url}/api/products/all-products`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data.data)) {
        const uniqueCategories = [
          ...new Set(data.data.map(product => product.category))
        ];
        setCategories(uniqueCategories);
      } else {
        setCategories([]);
      }
    })
    .catch(err => {
      console.error('Error fetching categories:', err);
      setCategories([]);
    });
}, []);


  const goToProducts = () => {
    navigate('/products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const location = useLocation();
  const isCartPage = location.pathname === "/cart";
  const isProductPage = location.pathname === "/products";


  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];

    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(totalCount);
  };

  useEffect(() => {
    updateCartCount();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cartItems') {
        updateCartCount();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(updateCartCount, 1000); // Cart is updated every second
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <div className="header-hero">
        <div className="header-left" onClick={goToProducts}>
          <img src={Logo} alt="logo" className="logo-img" />
          <h1 className="brand-name">Cartify</h1>
        </div>

        <div className="header-right">
          <nav className="nav-links">
            {!isProductPage && (<span onClick={goToProducts}>Products</span>)}
            <div
              className="dropdown"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <span className="dropdown-title">Categories ▾</span>
              {showDropdown && Array.isArray(categories) && categories.length > 0 && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" onClick={goToProducts}>
                    All Products
                  </div>
                  {categories.map((cat, idx) => (
                    <div
                      key={idx}
                      className="dropdown-item"
                      onClick={() => {
                        const categoryParam = (cat).toLowerCase().replace(/\s+/g, '-');
                        navigate(`/products?category=${encodeURIComponent(categoryParam)}`);
                        setShowDropdown(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {capitalize(cat)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {!isCartPage && (
            <Link to="/cart" className="cart-container">
              <img src={cartLogo} alt="cartlogo" className="icon-img" />
              <span className="cart-label">Cart({cartCount})</span>
            </Link>
          )}

          <div className='profile-icon'> <FaUser /> </div>

          <div className='logout-container'>
            <span className="logout-icon">
              <Link to="/login"> <AiOutlineLogout color="#333" /> </Link>
            </span>
            <Link to="/login" className="logout">Logout</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
