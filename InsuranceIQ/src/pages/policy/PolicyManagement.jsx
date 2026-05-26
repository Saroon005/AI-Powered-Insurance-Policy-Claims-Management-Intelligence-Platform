import { useEffect, useState } from "react";

import { getCustomers } from "../../services/customerService";
import { getAgents } from "../../services/agentService";
import { getProducts } from "../../services/productService";
import {
  getPolicies,
  createPolicy,
} from "../../services/policyService";

import "./PolicyManagement.css";

function PolicyManagement() {
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [products, setProducts] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [formData, setFormData] = useState({
    customerId: "",
    agentId: "",
    productId: "",
    startDate: "",
    endDate: "",
    premiumAmount: "",
    status: "ACTIVE",
  });

  const loadData = async () => {
    try {
      const customerData = await getCustomers();
      const agentData = await getAgents();
      const productData = await getProducts();
      const policyData = await getPolicies();

      setCustomers(customerData || []);
      setAgents(agentData || []);
      setProducts(productData || []);
      setPolicies(policyData || []);
    } catch (error) {
      console.log("Backend not running yet:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createPolicy({
        ...formData,
        fraudRiskScore: 0,
      });

      alert("Policy Created Successfully");

      setFormData({
        customerId: "",
        agentId: "",
        productId: "",
        startDate: "",
        endDate: "",
        premiumAmount: "",
        status: "ACTIVE",
      });

      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to create policy");
    }
  };

  return (
    <div className="policy-page">

      {/* Left Side Form */}
      <div className="policy-form-card">
        <h2>Issue New Policy</h2>

        <form onSubmit={handleSubmit}>

          {/* Customer */}
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
          >
            <option value="">Select Customer</option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.firstName} {customer.lastName}
              </option>
            ))}
          </select>

          {/* Agent */}
          <select
            name="agentId"
            value={formData.agentId}
            onChange={handleChange}
            required
          >
            <option value="">Select Agent</option>

            {agents.map((agent) => (
              <option
                key={agent.id}
                value={agent.id}
              >
                {agent.firstName} {agent.lastName}
              </option>
            ))}
          </select>

          {/* Product */}
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            required
          >
            <option value="">Select Product</option>

            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.productName}
              </option>
            ))}
          </select>

          {/* Start Date */}
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />

          {/* End Date */}
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />

          {/* Premium */}
          <input
            type="number"
            name="premiumAmount"
            placeholder="Premium Amount"
            value={formData.premiumAmount}
            onChange={handleChange}
            required
          />

          {/* Status */}
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="LAPSED">LAPSED</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="RENEWED">RENEWED</option>
          </select>

          <button type="submit">
            Issue Policy
          </button>

        </form>
      </div>

      {/* Right Side Table */}
      <div className="policy-table-card">

        <h2>Active Policies</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Agent</th>
              <th>Product</th>
              <th>Premium</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {policies.length > 0 ? (
              policies.map((policy) => (
                <tr key={policy.id}>
                  <td>{policy.id}</td>
                  <td>{policy.customerName}</td>
                  <td>{policy.agentName}</td>
                  <td>{policy.productName}</td>
                  <td>{policy.premiumAmount}</td>
                  <td>{policy.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  No Policies Found
                </td>
              </tr>
            )}

          </tbody>
        </table>

      </div>

    </div>
  );
}

export default PolicyManagement;