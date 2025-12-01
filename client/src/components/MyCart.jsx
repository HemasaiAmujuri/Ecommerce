import "../styles/MyCart.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import Loader from "./loader"

function MyCart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading ] = useState(false)
  const navigate = useNavigate();

 const base_url = import.meta.env.VITE_BASE_URL
 
  useEffect(() => {
  const loadCartProducts = async () => {
       setLoading(true)
    try {
      const userId = localStorage.getItem("userId") ?? "";
      const response = await fetch(
        `${base_url }/api/cart/getCartByUserId/${userId}`
      );
      const data = await response.json();

    if (data.success && Array.isArray(data.data)) {

  setCartProducts(data.data);
  const initialQuantities = {};
  data.data.forEach((item) => {
    initialQuantities[item.id] = item.quantity;
  });
  setQuantities(initialQuantities);

  localStorage.setItem(
    "cartItems",
    JSON.stringify(
      data.data.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }))
    )
  );
  window.dispatchEvent(new Event("storage"));
}
    } catch (err) {
      console.log("Error loading cart:", err);
    }finally {
      setLoading(false); 
    }
  };

  loadCartProducts();
}, [base_url]);


  useEffect(() => {
    const totalPrice = cartProducts.reduce((total, product) => {
      const quantity = quantities[product.id] ?? product.quantity ?? 1;
      return total + (product?.price || 0) * quantity;
    }, 0);
    setTotal(totalPrice);
  }, [cartProducts, quantities]);

  const updateLocalStorageCart = (updatedCart) => {
    localStorage.setItem(
      "cartItems",
      JSON.stringify(
        updatedCart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        }))
      )
    );
    window.dispatchEvent(new Event("storage"));
  };

  const handleIncrement = async (productId) => {
    const currentQuantity = quantities[productId] ?? 1;
    const newQuantity = currentQuantity + 1;

    setQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));

    try {
      const response = await fetch(
        `${base_url}/api/cart/updateCartProduct/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (response.ok) {
        const updatedCart = cartProducts.map((p) =>
          p.id === productId ? { ...p, quantity: newQuantity } : p
        );
        setCartProducts(updatedCart);
        updateLocalStorageCart(updatedCart);
      } else {
        console.error("Failed to update cart quantity");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }finally {
  setLoading(false);
}
  };

  const handleDecrement = async (product) => {
    const currentQuantity = quantities[product?.id] ?? product?.quantity ?? 1;
    if (currentQuantity <= 1) {
      confirmDelete(product?.id);
      return;
    }

    const newQuantity = currentQuantity - 1;
    setQuantities((prev) => ({
      ...prev,
      [product?.id]: newQuantity,
    }));

    try {
      const response = await fetch(
        `${base_url}/api/cart/updateCartProduct/${product?.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (response.ok) {
        const updatedCart = cartProducts.map((p) =>
          p.id === product?.id ? { ...p, quantity: newQuantity } : p
        );
        setCartProducts(updatedCart);
        updateLocalStorageCart(updatedCart);
      }
    } catch (error) {
      console.error("Error decrementing cart:", error);
    }
  };

  const confirmDelete = (productId) => {
    setProductToDelete(productId);
    setShowPopup(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(
        `${base_url}/api/cart/deleteCartProduct/${productToDelete}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        const updatedCart = cartProducts.filter(
          (item) => item.id !== productToDelete
        );
        setCartProducts(updatedCart);
        updateLocalStorageCart(updatedCart);
      }
    } catch (err) {
      console.error("Error deleting cart item:", err);
    }

    setShowPopup(false);
    setProductToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowPopup(false);
    setProductToDelete(null);
  };

  if (!loading && cartProducts.length === 0) {
    return ( 
      <div className="no-products">
        <b>No items found in your cart.</b>
      </div>
    );
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
          const quantity = quantities[product.id] ?? product.quantity ?? 1;
          return (
            <div key={product.id} className="carts-list">
              <div
                className="cart-info"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/products/${product?.id}`)}
              >
                <div className="product-image">
                  <img
                    src={
                      product?.img?.[0]
                    }
                    alt={product?.title}
                    height="150px"
                    width="150px"
                  />
                </div>
                <p className="title">{product?.title}</p>
              </div>

              <div className="cart-count">
                <button
                  className="quantity"
                  onClick={() => handleDecrement(product)}
                >
                  -
                </button>
                <div className="quantity-value">{quantity}</div>
                <button
                  className="quantity"
                  onClick={() => handleIncrement(product.id)}
                >
                  +
                </button>
              </div>

              <div className="price-trash-container">
                <p>&#8377;{Math.round(product?.price * quantity)}</p>
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
          <button
            className="final-buttons"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
          <button
            className="final-buttons"
            onClick={() => navigate("/shipping")}
          >
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
              onClick={handleConfirmDelete}
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
      {loading && (
        <Loader loading={loading} />
      )}
    </div>
  );
}

export default MyCart;
