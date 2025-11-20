import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ProductDetailsPage.css";
import CustomDropdown from "../components/CustomDropdown"

const base_url = import.meta.env.VITE_BASE_URL

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("")

  useEffect(() => {
  
    window.scrollTo(0, 0);

  
    fetch(`${base_url }/api/products/singleProduct/${id}`)
      .then((res) => 
        res.json())
      .then((data) => {
        console.log("Fetched product data:", data)
        const parsedData = data.data.map(product => ({
        ...product,
        img: JSON.parse(product.img), // convert string to array
      }));
      setProduct(parsedData)
  })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect( () => {
      const cartItemsStr = localStorage.getItem('cartItems');
    const cartItems = cartItemsStr ? JSON.parse(cartItemsStr) : [];
    const numericId = Number(id);
    const productIndex = cartItems.findIndex(item => item.id === numericId);
    if (productIndex !== -1) {
      setQuantity(cartItems[productIndex].quantity)
    }
  }, [id]);

  if (!product) return <p>Loading...</p>;

    const userId = localStorage.getItem("userId") ?? ""
  const handleAddToCart = async() => {
       const response = await fetch(`${base_url}/api/cart/addOrUpdateCartItem`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        productId : id,
        quantity: quantity }),
    });

    const data = await response.json();
    setMessage(data?.message ?? "Product added and updated to cart")
    setTimeout(()=>{
      setMessage("")
    },1500)
const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];


const existingItem = existingCart.find(item => String(item.productId) === String(id));

if (existingItem) {
  existingItem.quantity = quantity;
} else {
  existingCart.push({ productId: id, quantity: 1 });
}

localStorage.setItem("cartItems", JSON.stringify(existingCart));
  }




  return (
    <div className="product-details-page">
      <div className="image-container">
        <img
          src={
            product.img && product.img.length > 0
              ? product.img[0]
              : ""
          }
          alt={product.title}
        />
      </div>

      <div className="details">
        <h1>{product.title}</h1>
        <p className="price">
          <strong>Price:</strong> &#8377;{product.price}
        </p>
        <p className="category">
          <strong>Category:</strong> {product.category}
        </p>
        <p className="description">
          <strong>Description:</strong> {product.description}
        </p>

        <div className="purchase">
          <label>
            Quantity:
           <CustomDropdown
  quantity={product?.quantity ?? quantity}
  onQuantityChange={(newQty) => setQuantity(newQty)}
/>

          </label>

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
        {message && <div className="message-box">{message}</div>}
      </div>
    </div>
  );
}

export default ProductDetailsPage;
