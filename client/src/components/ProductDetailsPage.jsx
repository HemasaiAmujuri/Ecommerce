import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ProductDetailsPage.css";
import CustomDropdown from "../components/CustomDropdown"

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
  
    window.scrollTo(0, 0);

  
    fetch(`http://localhost:4000/api/products/singleProduct/${id}`)
      .then((res) => 
        res.json())
      .then((data) => {
        console.log("Fetched product data:", data)
      setProduct(data.data)
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


  const handleAddToCart = () => {

    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];


    const existingItemIndex = existingCart.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex >= 0) {
 
      existingCart[existingItemIndex].quantity = quantity;
    } else {
     
      existingCart.push({ id: product.id, quantity });
    }

   
    localStorage.setItem("cartItems", JSON.stringify(existingCart));

   
    alert(`Added ${quantity} ${product.title}(s) to cart!`);
  };




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
  quantity={quantity}
  onQuantityChange={(newQty) => setQuantity(newQty)}
/>

          </label>

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
