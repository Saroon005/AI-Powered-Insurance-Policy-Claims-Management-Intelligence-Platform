import { useState } from "react";
import { loginUser } from "../../services/authService";
import { Link } from "react-router-dom";

import "../../styles/auth.css";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);

      alert(data.message);

      console.log(data);
    } catch (error) {
      console.error(error);
      alert("Login Failed");
    }
  };

  return (
  <div className="auth-container">
    <div className="auth-card">
      <h2>InsuranceIQ Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">
          Login
        </button>
      </form>

      <p>
        Don't have an account?
        <Link to="/register">Register</Link>
      </p>
    </div>
  </div>
);
}

export default LoginPage;