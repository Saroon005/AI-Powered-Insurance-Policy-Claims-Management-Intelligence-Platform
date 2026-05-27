import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ClaimsAssessment.css";

const API_URL = "http://localhost:8080/api";

const dummyClaims = [
  {
    id: 421,
    customerName: "Anita Mehta",
    claimType: "HEALTH_HOSPITALIZATION",
    claimAmount: 38400,
    fraudScore: 22,
    status: "IN_REVIEW",
    incidentDate: "2026-04-12",
  },
  {
    id: 847,
    customerName: "Suresh Kumar",
    claimType: "MOTOR_ACCIDENT",
    claimAmount: 95000,
    fraudScore: 78,
    status: "ESCALATED",
    incidentDate: "2026-05-10",
  },
  {
    id: 612,
    customerName: "Divya Pillai",
    claimType: "PROPERTY_DAMAGE",
    claimAmount: 140000,
    fraudScore: 45,
    status: "IN_REVIEW",
    incidentDate: "2026-05-18",
  },
];

export default function ClaimsAssessment() {
  const navigate = useNavigate();

  const [claims, setClaims] = useState(dummyClaims);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await axios.get(`${API_URL}/claims`);

      if (response.data?.length) {
        setClaims(response.data);
      }
    } catch (error) {
      console.log("Backend unavailable. Using dummy claims.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/claims/${id}/status?status=${status}`
      );

      setClaims((prev) =>
        prev.map((claim) =>
          claim.id === id ? { ...claim, status } : claim
        )
      );
    } catch {
      setClaims((prev) =>
        prev.map((claim) =>
          claim.id === id ? { ...claim, status } : claim
        )
      );
    }
  };

  const getRisk = (score) => {
    if (score >= 70) return "HIGH";
    if (score >= 40) return "MEDIUM";
    return "LOW";
  };

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.id.toString().includes(search);

    const matchesType =
      typeFilter === "ALL" ||
      claim.claimType === typeFilter;

    return matchesSearch && matchesType;
  });

  const totalAmount = claims.reduce(
    (sum, c) => sum + Number(c.claimAmount || 0),
    0
  );

  const inReviewCount = claims.filter(
    (c) => c.status === "IN_REVIEW"
  ).length;

  const fraudFlaggedCount = claims.filter(
    (c) => c.fraudScore >= 70
  ).length;

  const settledCount = claims.filter(
    (c) => c.status === "SETTLED"
  ).length;

  return (
    <div className="claims-page">
      <h1>Claims Assessment & Workflow</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>{inReviewCount}</h2>
          <p>In Review</p>
        </div>

        <div className="stat-card">
          <h2>{fraudFlaggedCount}</h2>
          <p>Fraud Flagged</p>
        </div>

        <div className="stat-card">
          <h2>{settledCount}</h2>
          <p>Settled</p>
        </div>

        <div className="stat-card">
          <h2>₹{totalAmount.toLocaleString()}</h2>
          <p>Total Claims Value</p>
        </div>
      </div>

      <div className="toolbar">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">All Types</option>
          <option value="MOTOR_ACCIDENT">
            Motor Accident
          </option>
          <option value="HEALTH_HOSPITALIZATION">
            Health
          </option>
          <option value="PROPERTY_DAMAGE">
            Property
          </option>
          <option value="LIFE_INSURANCE">
            Life
          </option>
        </select>

        <input
          placeholder="Search Claim ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Fraud Score</th>
              <th>Risk</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredClaims.map((claim) => (
              <tr key={claim.id}>
                <td>CLM-{claim.id}</td>

                <td>{claim.customerName}</td>

                <td>{claim.claimType}</td>

                <td>
                  ₹{Number(
                    claim.claimAmount
                  ).toLocaleString()}
                </td>

                <td>{claim.fraudScore}%</td>

                <td
                  className={
                    getRisk(claim.fraudScore) === "HIGH"
                      ? "risk-high"
                      : getRisk(claim.fraudScore) === "MEDIUM"
                      ? "risk-medium"
                      : "risk-low"
                  }
                >
                  {getRisk(claim.fraudScore)}
                </td>

                <td>{claim.status}</td>

                <td className="actions">
                  <button
                    className="approve"
                    onClick={() =>
                      updateStatus(
                        claim.id,
                        "APPROVED"
                      )
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="reject"
                    onClick={() =>
                      updateStatus(
                        claim.id,
                        "REJECTED"
                      )
                    }
                  >
                    Reject
                  </button>

                  <button
                    className="escalate"
                    onClick={() =>
                      updateStatus(
                        claim.id,
                        "ESCALATED"
                      )
                    }
                  >
                    Escalate
                  </button>

                  <button
                    className="fraud"
                    onClick={() =>
                      navigate(`/fraud/${claim.id}`)
                    }
                  >
                    Fraud Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}