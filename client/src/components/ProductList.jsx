import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/ProductList.css';
import { IoIosSearch } from "react-icons/io";

export default function ProductList() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addedToCart, setAddedToCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const productsPerPage = 15;

  const location = useLocation();

  // 🧩 Fetch all products
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

  // 🧩 Load cart items whenever location changes (fix)
  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      setAddedToCart(savedCart.map(item => item.productId));
    };

    loadCart(); // Run immediately
  }, [location.pathname]); // 👈 Trigger every time user navigates back

  // 🧩 Filter products by category
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

  // 🧩 Filter products by search input
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

  // 🧩 Pagination
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / productsPerPage);

  // 🧩 Add to cart
  const storeItems = async (productId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login before adding to cart");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/cart/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          productId: parseInt(productId),
          quantity: 1,
        }),
      });

      const data = await response.json();
      console.log("Response data", data);

      if (response.ok && data.success) {
        console.log("✅ Added to cart successfully");

        // Update UI instantly
        setAddedToCart((prev) => [...prev, productId]);

        // Update localStorage
        const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        if (!existingCart.find(item => item.productId === productId)) {
          existingCart.push({ productId, quantity: 1 });
          localStorage.setItem("cartItems", JSON.stringify(existingCart));
        }
      } else {
        console.error("❌ Failed:", data.message);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  if (loading) return null;

  return (
    <div className="product-list">
      <div className="search-container">
        <input
          type="text"
          id="searchInput"
          name="searchInput"
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
                  onClick={() => storeItems(product.id)}
                  disabled={addedToCart.includes(product.id)}
                >
                  {addedToCart.includes(product.id) ? 'Added to Cart' : 'Add to Cart'}
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
