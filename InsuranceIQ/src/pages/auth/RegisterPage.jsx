import { useState } from "react";
import { registerUser } from "../../services/authService";

import { Link } from "react-router-dom";
import "../../styles/auth.css";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
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
      const data = await registerUser(formData);

      alert(data.message);

      console.log(data);
    } catch (error) {
      console.error(error);
      alert("Registration Failed");
    }
  };

  return (
  <div className="auth-container">
    <div className="auth-card">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />

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

        <select
          name="role"
          onChange={handleChange}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="AGENT">Agent</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit">
          Register
        </button>
      </form>

      <p>
        Already have an account?
        <Link to="/login">Login</Link>
      </p>
    </div>
  </div>
);
}

export default RegisterPage;