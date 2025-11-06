import "../styles/MyCart.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

function MyCart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCartFromStorage = async () => {
      try {
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

        if (cartItems.length === 0) {
          setCartProducts([]);
          setQuantities({});
          return;
        }

        const response = await axios.get("https://dummyjson.com/products?limit=194");

        const filteredProducts = response.data.products.filter(product =>
          cartItems.some(cartItem => Number(cartItem.id) === product.id)
        );

        setCartProducts(filteredProducts);

        const quantitiesFromStorage = {};
        cartItems.forEach(item => {
          quantitiesFromStorage[item.id] = Number(item.quantity) || 1;
        });
        setQuantities(quantitiesFromStorage);
      } catch (err) {
        console.log("Error loading cart:", err);
      }
    };

    loadCartFromStorage();
  }, []);

  useEffect(() => {
    const totalPrice = cartProducts.reduce((total, product) => {
      const quantity = quantities[product.id] || 1;
      return total + product.price * quantity;
    }, 0);
    setTotal(totalPrice);
  }, [cartProducts, quantities]);

  const handleIncrement = (productId) => {
    setQuantities((prev) => {
      const newQuantity = (prev[productId] || 1) + 1;

      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const index = cartItems.findIndex(item => item.id === productId);

      if (index !== -1) {
        cartItems[index].quantity = newQuantity;
      } else {
        cartItems.push({ id: productId, quantity: newQuantity });
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      return {
        ...prev,
        [productId]: newQuantity,
      };
    });
  };

  const handleDecrement = (productId) => {
    const currentQty = quantities[productId];

    if (currentQty > 1) {
      const updatedQuantities = {
        ...quantities,
        [productId]: currentQty - 1,
      };

      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const updatedCartItems = cartItems.map(item =>
        item.id === productId ? { ...item, quantity: updatedQuantities[productId] } : item
      );

      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setQuantities(updatedQuantities);
    } else {
      setProductToDelete(productId);
      setShowPopup(true);
    }
  };


  const confirmDelete = (productId) => {
    setProductToDelete(productId);
    setShowPopup(true);
  };

  const handleConfirmeDelete = () => {
    if (!productToDelete) return;

    const productId = productToDelete;

    const updatedQuantities = { ...quantities };
    delete updatedQuantities[productId];
    setQuantities(updatedQuantities);

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCart = cartItems.filter(item => item.id !== productId);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    const updatedCartProducts = cartProducts.filter(product => product.id !== productId);
    setCartProducts(updatedCartProducts);

    setShowPopup(false);
    setProductToDelete(null);
  };
  const handleCancelDelete = () => {
    setShowPopup(false);
    setProductToDelete(null);
  };

  if (cartProducts.length === 0) {
    return <div className="no-products"><b>No items found in your cart.</b></div>;
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div className="cart">
          <p>Products</p>
          <p className="heading-qty">Qty</p>
          <p className="heading-price">Price</p>
        </div>
      </div>

      <div className="cart-body">
        {cartProducts.map((product) => {
          const quantity = quantities[product.id] || 1;
          return (
            <div key={product.id} className="carts-list">
              <div
                className="cart-info"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="product-image">
                  <img
                    src={product.thumbnail || product.images?.[0]}
                    alt={product.title}
                    height="150px"
                    width="150px"
                  />
                </div>
                <p className="title">{product.title}</p>
              </div>

              <div className="cart-count">
                <button className="quantity" onClick={() => handleDecrement(product.id)}>
                  -
                </button>
                <div className="quantity-value">{quantity}</div>
                <button className="quantity" onClick={() => handleIncrement(product.id)}>
                  +
                </button>
              </div>

              <div className="price-trash-container">
                <p>&#8377;{Math.round(product.price * quantity)}</p>
                <FaTrash
                  className="remove-icon"
                  onClick={() => confirmDelete(product.id)}
                />
              </div>
            </div>
          );
        })}

        <p className="total">Total: &#8377;{Math.round(total)}</p>

        <div className="checkout-button">
          <button className="final-buttons" onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
          <button className="final-buttons" onClick={() => navigate("/shipping")}>
            Checkout
          </button>
        </div>
      </div>
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            border: "2px solid #333",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          <p>Are you sure you want to delete this?</p>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <button
              style={{
                background: "#e74c3c",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={handleConfirmeDelete}
            >
              Yes
            </button>
            <button
              style={{
                background: "#95a5a6",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={handleCancelDelete}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCart;
