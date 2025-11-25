import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ProductDetailsPage.css";
import CustomDropdown from "../components/CustomDropdown";
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

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${base_url}/api/products/singleProduct/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setProduct(data?.data ?? null);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, userId]);


  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const item = cartItems.find((item) => String(item.productId) === String(id));
    if (item) setQuantity(item.quantity);
  }, [id]);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${base_url}/api/cart/addOrUpdateCartItem`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: id, quantity }),
      });
      const data = await response.json();
      setMessage(data?.message ?? "Product added/updated in cart");
      setTimeout(() => setMessage(""), 1500);

      const existingCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const existingItem = existingCart.find((item) => String(item.productId) === String(id));

      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        existingCart.push({ productId: id, quantity });
      }

      localStorage.setItem("cartItems", JSON.stringify(existingCart));
    } catch (err) {
      console.error("Error adding to cart:", err);
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

            <div className="purchase">
              <label>
                Quantity:
                <CustomDropdown
                  quantity={quantity}
                  onQuantityChange={(newQty) => setQuantity(newQty)}
                />
              </label>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
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

