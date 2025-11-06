import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/ShippingDetails.css";

function ShippingDetails() {
  const [cartItems, setCartItems] = useState([]);
  const [confirmed, setConfirmed] = useState(false);


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    
    window.scrollTo(0, 0);

    const storedItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (storedItems.length === 0) return;

    const fetchProducts = async () => {
      const productsData = await Promise.all(
        storedItems.map(async (item) => {
          try {
            const res = await fetch(`https://dummyjson.com/products/${item.id}`);
            const data = await res.json();
            return {
              ...data,
              quantity: item.quantity || 1,
            };
          } catch (err) {
            console.error(err);
            return null;
          }
        })
      );

      const validProducts = productsData.filter((p) => p !== null);
      setCartItems(validProducts);
    };

    fetchProducts();
  }, []);

  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => Math.ceil(total + (item.price || 0) * (item.quantity || 1)),
      0
    );
  };

 const handleConfirmOrder = () => {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  if (!cartItems.length) {
    alert("Please add items to your cart");
    return;
  }

  if (!name || !email || !address) {
    alert("Please fill all the shipping information");
    return;
  }

fetch('http://localhost:4000/api/shipping/add-shippingInfo', {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name,
    email,
    address
  })
})
  .then((res) => {
    if(!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
  
    return res.json()
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err.message);
  });
  localStorage.removeItem("cartItems");
  setCartItems([]);
  setConfirmed(true);
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
          <h2 style={{ color: "green", fontSize: "28px", marginBottom: "20px" }}>
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
              onChange={(e) => setEmail(e.target.value)}
            />
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
  
                {cartItems.map((item) => (
                  <li key={item.id} className="summary-item">

                    <img
                      src={item.thumbnail || item.images?.[0]}
                      alt={item.title}
                      className="summary-image"
                    />
                    <span className="summary-title">{item.title}</span>
                    <span className="summary-qty">Qty: {item.quantity}</span>
                    <span className="summary-cost">
                      ₹{Math.ceil(item.price * item.quantity)}
                    </span>
                    
                  </li>
                  
                ))}
              </ul>
            )}
          </div>
          {cartItems.length > 0 && (
            <p className="summary-total">Total: ₹{getTotal()}</p>
          )}
          <button className="confirm-button" onClick={handleConfirmOrder}>
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShippingDetails;
