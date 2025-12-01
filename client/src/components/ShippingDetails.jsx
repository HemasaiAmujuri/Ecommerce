import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/ShippingDetails.css";
import Loader from "./loader";

function ShippingDetails() {
  const [cartItems, setCartItems] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [address, setAddress] = useState("");

  const userId = localStorage.getItem("userId") ?? "";

  const base_url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${base_url}/api/cart/getCartByUserId/${userId}`
        );
        const data = await response.json();
        console.log("Fetched data:", data);
        setCartItems(data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userId, base_url]);

  const getTotal = () => {
    return cartItems.reduce(
      (total, product) =>
        Math.ceil(total + (product?.price || 0) * (product?.quantity || 1)),
      0
    );
  };


  const handleConfirmOrder = async () => {
  if (emailError) {
    setMessage("Please enter a valid email address");
    setTimeout(() => setMessage(""), 1500);
    return;
  }

  if (!cartItems.length) {
    setMessage("Please add items to your cart");
    setTimeout(() => setMessage(""), 1500);
    return;
  }

  if (!name || !email || !address || !userId) {
    setMessage("Please fill all the shipping information");
    setTimeout(() => setMessage(""), 1500);
    return;
  }

  setLoading(true);

  try {
    const shippingRes = await fetch(
      `${base_url}/api/shipping/add-shippingInfo`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, address, userId }),
      }
    );

    if (!shippingRes.ok)
      throw new Error(`Shipping API error! status: ${shippingRes.status}`);
    const shippingData = await shippingRes.json();
    console.log("Shipping info saved:", shippingData);

    setCartItems([]);
    localStorage.removeItem("cartItems");

    const cartRes = await fetch(
      `${base_url}/api/cart/deleteCartItemsByuserId/${userId}`,
      {
        method: "DELETE",
      }
    );

    if (!cartRes.ok)
      throw new Error(`Delete cart API error! status: ${cartRes.status}`);
    const cartData = await cartRes.json();
    console.log("Cart deleted:", cartData);

    setConfirmed(true);
  } catch (err) {
    console.error("Order confirmation error:", err.message);
    setMessage("Something went wrong. Please try again.");
    setTimeout(() => setMessage(""), 2000);
  } finally {
    setLoading(false);
  }
};




  if (confirmed) {
    return (
      <div className="shipping-container">
        <div
          className="shipping-body"
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <h2
            style={{ color: "green", fontSize: "28px", marginBottom: "20px" }}
          >
            Thank you! Your order is confirmed.
          </h2>
          <Link
            to="/products"
            style={{
              textDecoration: "none",
              color: "white",
              backgroundColor: "orange",
              padding: "10px 20px",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      setEmailError(
        "Please enter a valid email address (e.g., example@gmail.com)"
      );
    } else {
      setEmailError("");
    }
  };

  return (
    <div className="shipping-container">
      <div className="shipping-body">
        <div className="shipping-left">
          <h2>Shipping Information</h2>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError && <small style={{ color: "red" }}>{emailError}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Shipping Address</label>
            <textarea
              id="address"
              rows="5"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="shipping-right">
          <h2>Order Summary</h2>
          <div className="summary-box">
            {cartItems.length === 0 ? (
              <p>No items in cart</p>
            ) : (
              <ul className="summary-list">
                {cartItems.map((product) => (
                  <li key={product.id} className="summary-item">
                    <img
                      src={product?.thumbnail || product?.img?.[0]}
                      alt={product?.title}
                      className="summary-image"
                    />
                    <span className="summary-title">{product?.title}</span>
                    <span className="summary-qty">
                      Qty: {product?.quantity}
                    </span>
                    <span className="summary-cost">
                      ₹{Math.ceil(product?.price * product?.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {cartItems.length > 0 && (
            <p className="summary-total">Total: ₹{getTotal()}</p>
          )}
          <button className="confirm-button" disabled={loading} onClick={handleConfirmOrder}>
             {loading ? "Processing..." : "Confirm Order"}
          </button>
          {message && <div className="message-box">{message}</div>}
        </div>
      </div>
      {loading && <Loader loading={loading} />}
    </div>
  );
}

export default ShippingDetails;
