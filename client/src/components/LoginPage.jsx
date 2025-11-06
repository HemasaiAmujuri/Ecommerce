import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        localStorage.setItem('userId', data.data.id)
        // alert("Login successful!");
        navigate("/products");
      } else {
        alert(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="hero">
      <div className="login-page">
        <div className="login-box">
          <h2>Welcome 👋</h2>
          <p className="subtitle">Login to your account</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                // minLength="8"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <span className="signUp">
            Don't have an account? <Link to="/signUp">Sign up</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;


