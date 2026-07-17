import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminLogin.css";
// 💡 Purane axios import ko hatakar humari custom API file se adminLogin ko import kiya
import { adminLogin } from "../service/api"; 

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 🎯 Ab ye bina kisi dikkat ke live Render wale URL par request bhejega
      const res = await adminLogin({ email, password });

      // 💡 Agar aapka backend direct res.data me token bhejta hai ya res.data.success check karta hai:
      if (res.data.success || res.data.token) {
        localStorage.setItem("token", res.data.token);

        alert("Login Successful");
        navigate("/admin-dashboard", { replace: true });
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-container">
        <div className="login-card">
          <h1>Valley Medows</h1>
          <h2>Admin Login</h2>
          <p>Welcome Back Admin</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;