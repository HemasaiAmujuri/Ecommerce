import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/signUp.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import  Loader  from "./loader"

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmpassword, setShowConfirmpassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  const base_url = import.meta.env.VITE_BASE_URL

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords does not match")
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setLoading(true)
      const response = await fetch(`${base_url}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          mobile,
          password,
        }),
      });

      const data = await response.json();
      setLoading(false)
      if (response.ok) {
        localStorage.setItem("userId", data.data.id);
        setMessage("registration successful");
        setTimeout(() => {
          navigate("/products");
        }, 1500);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage( data?.message ?? "registration failed, please try again later");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="hero">
      <div className="signup-page">
        <div className="signup-box">
          <h2>Welcome 👋</h2>
          <p className="subtitle">Signup to your account</p>

          <form onSubmit={handleSignUp}>
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="input-group">
              <label>Mobile</label>
              <input
                type="tel"
                placeholder="Enter your mobile"
                pattern="[0-9]{10}"
                title="Enter a valid 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                autoComplete="tel"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  minLength="8"
                  value={password}
                  className="password"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <span
                  className="toggle-on"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmpassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  minLength="8"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <span
                  className="toggle-on"
                  onClick={() => {
                    setShowConfirmpassword(!showConfirmpassword);
                  }}
                >
                  {showConfirmpassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="signup-btn">
              Sign Up
            </button>
          </form>

          <span className="login">
            Already have an account? <Link to="/login">Login</Link>
          </span>
          {message && <div className="message-box">{message}</div>}
        </div>
      </div>
      {loading && (
        <Loader loading={loading}/>
      )}
    </div>
  );
}
export default SignUpPage;


