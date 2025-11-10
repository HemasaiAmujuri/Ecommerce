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

  // Load cart from backend
  useEffect(() => {
    const loadCartProducts = async () => {
      try {
        const userId = localStorage.getItem("userId") ?? "";
        const response = await fetch(
          `http://localhost:4000/api/cart/getCartByUserId/${userId}`
        );
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setCartProducts(data.data);
          localStorage.setItem(
            "cartItems",
            JSON.stringify(
              data.data.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              }))
            )
          );
          window.dispatchEvent(new Event("storage"));
        }
      } catch (err) {
        console.log("Error loading cart:", err);
      }
    };

    loadCartProducts();
  }, []);

  // Recalculate total
  useEffect(() => {
    const totalPrice = cartProducts.reduce((total, product) => {
      const quantity = quantities[product.id] ?? product.quantity ?? 1;
      return total + (product.product?.price || 0) * quantity;
    }, 0);
    setTotal(totalPrice);
  }, [cartProducts, quantities]);

  // Update local storage cart
  const updateLocalStorageCart = (updatedCart) => {
    localStorage.setItem(
      "cartItems",
      JSON.stringify(
        updatedCart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      )
    );
    window.dispatchEvent(new Event("storage"));
  };

  // Increment quantity
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
    }
  };

  // Decrement quantity or confirm delete if it’s 1
  const handleDecrement = async (productId) => {
    const currentQuantity = quantities[productId] ?? 1;

    if (currentQuantity <= 1) {
      confirmDelete(productId);
      return;
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

      if (response.ok) {
        const updatedCart = cartProducts.map((p) =>
          p.id === productId ? { ...p, quantity: newQuantity } : p
        );
        setCartProducts(updatedCart);
        updateLocalStorageCart(updatedCart);
      }
    } catch (error) {
      console.error("Error decrementing cart:", error);
    }
  };

  // Confirm delete popup
  const confirmDelete = (productId) => {
    setProductToDelete(productId);
    setShowPopup(true);
  };

  // Delete confirmed
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:4000/api/cart/deleteCartProduct/${productToDelete}`,
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

  // Empty cart case
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
          const quantity = quantities[product.id] ?? product.quantity ?? 1;
          return (
            <div key={product.id} className="carts-list">
              <div
                className="cart-info"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/products/${product.productId}`)}
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
                  onClick={() => handleDecrement(product.id)}
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
        <div className="delete-popup">
          <p>Are you sure you want to delete this?</p>
          <div className="popup-buttons">
            <button className="yes" onClick={handleConfirmDelete}>
              Yes
            </button>
            <button className="no" onClick={handleCancelDelete}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCart;
