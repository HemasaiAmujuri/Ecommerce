import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ProductDetailsPage.css";
import Loader from "./loader";

const base_url = import.meta.env.VITE_BASE_URL;

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId") ?? "";


  useEffect(() => {
  window.scrollTo(0, 0);
  if (!userId) return;

  let timer;

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${base_url}/api/products/singleProduct/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setProduct(data?.data ?? null);
      setQuantity(data?.data?.quantity ?? 1)
      setMessage(data?.message);

      timer = setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProduct();
  return () => clearTimeout(timer);

}, [id, userId]);

  const handleIncrement = async (productId) => {
  const newQuantity = quantity + 1;
  setQuantity(newQuantity);

  setLoading(true);
  try {
    const res = await fetch(`${base_url}/api/cart/updateCartProduct/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (res.ok) {
      let localCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      localCart = localCart.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("cartItems", JSON.stringify(localCart));

      window.dispatchEvent(new Event("cartUpdated"));
    } else {
      console.error("Server error updating cart");
    }
  } catch (error) {
    console.error("Error updating cart:", error);
  } finally {
    setLoading(false);
  }
};

  const handleDecrement = async (productId) => {
    if (quantity <= 1) return;

    const newQuantity = quantity - 1;
    setQuantity(newQuantity);

    setLoading(true);
    try {
      const res = await fetch(`${base_url}/api/cart/updateCartProduct/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
       if (res.ok) {
      let localCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      localCart = localCart.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("cartItems", JSON.stringify(localCart));

      window.dispatchEvent(new Event("cartUpdated"));
    } else {
      console.error("Server error updating cart");
    }
    } catch (err) {
      console.error("Error updating cart:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-details-page">
      {loading && <Loader loading={loading} />}

      {product ? (
        <>
          <div className="image-container">
            <img src={product?.img?.[0] ?? ""} alt={product?.title ?? ""} />
          </div>

          <div className="details">
            <h1>{product?.title ?? ""}</h1>

            <p className="price">
              <strong>Price:</strong> &#8377;{product?.price ?? ""}
            </p>

            <p className="category">
              <strong>Category:</strong> {product?.category ?? ""}
            </p>

            <p className="description">
              <strong>Description:</strong> {product?.description ?? ""}
            </p>

            <div className="product-count">
              <button
                className="quantity"
                disabled={quantity === 1}
                onClick={() => handleDecrement(product.id)}
              >
                -
              </button>

              <div className="quantity-value">
                {quantity}
              </div>

              <button
                className="quantity"
                onClick={() => handleIncrement(product.id)}
              >
                +
              </button>
            </div>

            {message && <div className="message-box">{message}</div>}
          </div>
        </>
      ) : (
        !loading && <p>Product not found.</p>
      )}
    </div>
  );
}

export default ProductDetailsPage;
