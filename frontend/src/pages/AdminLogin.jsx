import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminLogin.css";
import axios from "axios";

const AdminLogin = () => {

  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");



  const handleLogin = async(e)=>{

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/admin/login",

        {
          email,
          password,
        }
      );


      if(res.data.success){

        localStorage.setItem(
          "token",
          res.data.token
        );

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

      <h1>Happy Haven</h1>

      <h2>Admin Login</h2>

      <p>Welcome Back Admin</p>


      <form onSubmit={handleLogin}>

      <input
      type="email"
      placeholder="Enter Email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      required
      />


      <input
      type="password"
      placeholder="Enter Password"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      required
      />



      <button>
      Login
      </button>


      </form>

      </div>

      </div>
    </div>
  );
};

export default AdminLogin;