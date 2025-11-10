import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/LoginPage.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

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
      console.log("Login response:", data); // ✅ Inspect structure

      if (response.ok && data.success) {
        // ✅ Extract userId safely no matter backend structure
        const userId = data?.data?.id || data?.user?.id || data?.id;

        if (userId) {
          localStorage.setItem("userId", userId);
          console.log("Saved userId:", userId);
        } else {
          console.warn("⚠️ userId missing in response", data);
        }

        setMessage("Login successful");
        setTimeout(() => {
          navigate("/products");
        }, 1500);
      } else {
        setMessage(data.message ?? "Login failed, please try again later");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Login failed, please try again later");
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
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  // minLength="8"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="password"
                  required
                />
                <span
                  className="toggle-on"
                  onClick={() => {
                    setShowPassword(!showPassword)
                  }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <span className="signUp">
            Don't have an account? <Link to="/signUp">Sign up</Link>
          </span>
          {message && <div className="message-box">{message}</div>}
        </div>
      </div>
    </div>
  );
}
export default LoginPage;


