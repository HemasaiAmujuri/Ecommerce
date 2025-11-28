import React from "react";
import "../styles/Footer.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaCcVisa, FaCcMastercard, FaCcPaypal } from "react-icons/fa";
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer id="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>Cartify</h2>
          <p>Your trusted shopping partner for everything you love.</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/products">Home </Link></li>
            <li><Link to="/products">Shop</Link></li>
            <li><Link to="#">About Us</Link></li>
            <li><Link to="#">Contact</Link></li>
          </ul>
        </div>


        <div className="footer-links">
          <h3>Customer Service</h3>
          <ul>
            <li><Link to="#">FAQs</Link></li>
            <li><Link to="#">Returns</Link></li>
            <li><Link to="#">Shipping Info</Link></li>
            <li><Link to="#">Help Center</Link></li>
          </ul>
        </div>
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <Link to="#"><FaFacebookF /></Link>
            <Link to="#"><FaInstagram /></Link>
            <Link to="#"><FaTwitter /></Link>
          </div>
          <h3>We Accept</h3>
          <div className="payment-icons">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcPaypal />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>@ 2025 Cartify. All rights reserved.</p>
      </div>
    </footer>
  );
}


