import { useEffect, useState } from "react";
import axios from "axios";
import "./AgentDashboard.css";

import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api";

const dummyAgent = {
  firstName: "Rajan",
  lastName: "Arora",
  region: "Mumbai North",
  commissionPct: 10,
};

const dummyPolicies = [
  {
    id: 1,
    customerName: "Anita Mehta",
    productName: "Health Insurance",
    premiumAmount: 22400,
    endDate: "2026-06-12",
  },
  {
    id: 2,
    customerName: "Suresh Kumar",
    productName: "Motor Insurance",
    premiumAmount: 8900,
    endDate: "2026-06-04",
  },
  {
    id: 3,
    customerName: "Divya Pillai",
    productName: "Life Insurance",
    premiumAmount: 48000,
    endDate: "2026-07-28",
  },
];

const dummyClaims = [
  {
    id: 101,
    customerName: "Anita Mehta",
    claimAmount: 50000,
    status: "IN_REVIEW",
  },
  {
    id: 102,
    customerName: "Suresh Kumar",
    claimAmount: 25000,
    status: "APPROVED",
  },
];

function AgentDashboard() {
  const [agent, setAgent] = useState(dummyAgent);
  const [policies, setPolicies] = useState(dummyPolicies);
  const [claims, setClaims] = useState(dummyClaims);
const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, policiesRes, claimsRes] =
          await Promise.all([
            axios.get(`${API_URL}/agents`),
            axios.get(`${API_URL}/policies`),
            axios.get(`${API_URL}/claims`),
          ]);

        const agents = agentsRes.data || [];

        if (agents.length > 0) {
          setAgent(agents[0]);
        }

        if (policiesRes.data?.length > 0) {
          setPolicies(policiesRes.data);
        }

        if (claimsRes.data?.length > 0) {
          setClaims(claimsRes.data);
        }
      } catch (err) {
        console.log(
          "Backend unavailable. Using dummy data."
        );
      }
    };

    fetchData();
  }, []);

  const totalPolicies = policies.length;

  const totalPremium = policies.reduce(
    (sum, policy) =>
      sum + Number(policy.premiumAmount || 0),
    0
  );

  const renewalsDue = policies.filter((policy) => {
    if (!policy.endDate) return false;

    const expiryDate = new Date(policy.endDate);
    const today = new Date();

    const diffDays =
      (expiryDate - today) /
      (1000 * 60 * 60 * 24);

    return diffDays >= 0 && diffDays <= 30;
  }).length;

  const estimatedCommission =
    totalPremium *
    ((agent.commissionPct || 0) / 100);

  return (
    <div className="agent-dashboard">

      <div className="agent-header">
        <h1>Agent Dashboard</h1>

        <p>
          {agent.firstName} {agent.lastName} •{" "}
          {agent.region}
        </p>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <h2>{totalPolicies}</h2>
          <p>Policies Issued</p>
        </div>

        <div className="stat-card">
          <h2>
            ₹{totalPremium.toLocaleString()}
          </h2>
          <p>Premium Collected</p>
        </div>

        <div className="stat-card">
          <h2>{renewalsDue}</h2>
          <p>Renewals Due</p>
        </div>

      </div>

      <div className="content-grid">

        <div className="card">
          <h2>My Customers</h2>

<button
  className="onboard-btn"
  onClick={() => navigate("/customers")}
>
  + Onboard New
</button>
          <table className="customer-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Premium</th>
                <th>Renewal Date</th>
              </tr>
            </thead>

            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id}>
                  <td>{policy.customerName}</td>
                  <td>{policy.productName}</td>
                  <td>
                    ₹
                    {Number(
                      policy.premiumAmount
                    ).toLocaleString()}
                  </td>
                  <td>{policy.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Commission Statement</h2>

          <div className="commission-item">
            <span>Commission %</span>
            <span>
              {agent.commissionPct}%
            </span>
          </div>

          <div className="commission-item">
            <span>Estimated Earnings</span>

            <span className="commission-value">
              ₹
              {estimatedCommission.toLocaleString()}
            </span>
          </div>
        </div>

      </div>

      <div className="card">
        <h2>Claims Overview</h2>

        <table className="claim-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {claims.map((claim) => (
              <tr key={claim.id}>
                <td>{claim.id}</td>
                <td>{claim.customerName}</td>
                <td>
                  ₹
                  {Number(
                    claim.claimAmount
                  ).toLocaleString()}
                </td>
                <td>{claim.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default AgentDashboard;