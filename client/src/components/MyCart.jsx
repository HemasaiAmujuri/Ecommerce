import "../styles/MyCart.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

function MyCart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCartProducts = async () => {
      try {
        const userId = localStorage.getItem("userId") ?? "";
        const response = await fetch(
          `http://localhost:4000/api/cart/getCartByUserId/${userId}`
        );
        const data = await response.json();
        setCartProducts(data.data);
      } catch (err) {
        console.log("Error loading cart:", err);
      }
    };

    loadCartProducts();
  }, []);

  useEffect(() => {
    const totalPrice = cartProducts.reduce((total, product) => {
      const quantity = quantities[product.id] || 1;
      return total + product.product?.price * quantity;
    }, 0);
    setTotal(totalPrice);
  }, [cartProducts, quantities]);

  const handleIncrement = async (productId) => {
    const currentQuantity = quantities[productId] ?? 1;
    const newQuantity = currentQuantity + 1;
    setQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));

    try {
      const response = await fetch(
        `http://localhost:4000/api/cart/updateCartProduct/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        console.error("Server error:", data?.message || response.statusText);
        return;
      }

      console.log("Cart updated successfully:", data);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleDecrement = async (productId) => {
    console.log(productId, "productId");
    const currentQuantity = quantities[productId] ?? 1;

    if (currentQuantity <= 1){
      return confirmDelete(productId);
    }

    const newQuantity = currentQuantity - 1;

    setQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));

    try {
      const response = await fetch(
        `http://localhost:4000/api/cart/updateCartProduct/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        console.error("Server error:", data?.message || response.statusText);
        return;
      }

      console.log("Cart decremented successfully:", data);
    } catch (error) {
      console.error("Error decrementing cart:", error);
    }
  };

  const confirmDelete = (productId) => {
    setProductToDelete(productId);
    setShowPopup(true);
  };

  const handleConfirmeDelete = async () => {
    if (!productToDelete) return;

    const productId = productToDelete;

    const response = await fetch(
      `http://localhost:4000/api/cart/deleteCartProduct/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.json();
    console.log(data, "data");

    setCartProducts((prev) => prev.filter((item) => item.id !== productId));

    setShowPopup(false);
    setProductToDelete(null);
  };
  const handleCancelDelete = () => {
    setShowPopup(false);
    setProductToDelete(null);
  };

  if (cartProducts.length === 0) {
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
                    src={
                      product?.product?.thumbnail || product?.product?.img?.[0]
                    }
                    alt={product?.product?.title}
                    height="150px"
                    width="150px"
                  />
                </div>
                <p className="title">{product?.product?.title}</p>
              </div>

              <div className="cart-count">
                <button
                  className="quantity"
                  onClick={() => {
  handleDecrement(product?.id);
}}

                >
                  -
                </button>
                <div className="quantity-value">
                  {" "}
                  {quantities[product.id] ?? product.quantity}
                </div>
                <button
                  className="quantity"
                  onClick={() => handleIncrement(product?.id)}
                >
                  +
                </button>
              </div>

              <div className="price-trash-container">
                <p>&#8377;{Math.round(product?.product?.price * quantity)}</p>
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
