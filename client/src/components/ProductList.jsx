import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/ProductList.css';
import { IoIosSearch } from "react-icons/io";

export default function ProductList() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addedIds, setAddedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const productsPerPage = 15;

  const location = useLocation();


  useEffect(() => {
  setLoading(true);

  fetch('http://localhost:4000/api/products/all-products')
    .then(res => res.json())
    .then(data => {
      console.log("Fetched data:", data);

      if (data.success && Array.isArray(data.data)) {
        setAllProducts(data.data);
        setProducts(data.data);
      } else {
        console.error("Unexpected API response format:", data);
        setAllProducts([]);
        setProducts([]);
      }

      setLoading(false);
    })
    .catch(err => {
      console.error("Fetch error:", err);
      setLoading(false);
    });
}, []);


  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const ids = cart.map(item => item.id);
    setAddedIds(ids);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cartItems') {
        const cart = JSON.parse(e.newValue) || [];
        const ids = cart.map(item => item.id);
        setAddedIds(ids);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setAddedIds(cart.map(item => item.id));
  }, [location]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');

    if (category) {
      const filtered = allProducts.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
      setProducts(filtered);
      setCurrentPage(1);
    } else {
      setProducts(allProducts);
    }
  }, [location.search, allProducts]);

  useEffect(() => {
    if (searchInput.trim().length === 0) {
      setProducts(allProducts);
    } else if (searchInput.trim().length >= 3) {
      const filtered = allProducts.filter(p =>
        p.title.toLowerCase().includes(searchInput.toLowerCase())
      );
      setProducts(filtered);
      setCurrentPage(1);
    }
  }, [searchInput, allProducts]);

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const storeItems = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemIndex = existingCart.findIndex(item => item.id === product.id);

    if (itemIndex >= 0) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push({ id: product.id, quantity: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(existingCart));
    setAddedIds(prev => [...new Set([...prev, product.id])]);
  };

  if (loading) return null;

  return (
    <div className="product-list">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        <span className='search-icon'><IoIosSearch /></span>
      </div>

      {products.length === 0 ? (
        <h2 className="no-products">No products found.</h2>
      ) : (
        <>
          <div className="product-grid">
            {currentProducts.map(product => (
              <div key={product.id} className="product-card">
                <Link to={`/products/${product.id}`} className="product-link">
                  <div className="product-image-container">
                    <img
                      src={product.thumbnail || product.img?.[0]}
                      alt={product.title}
                    />
                  </div>
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">&#8377;{product.price}</p>
                </Link>
                <button
                  className="add-btn"
                  onClick={() => storeItems(product)}
                  disabled={addedIds.includes(product.id)}
                >
                  {addedIds.includes(product.id) ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
