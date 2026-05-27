import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./FraudDetection.css";

const SPRING_API = "http://localhost:8080/api";
const PYTHON_API = "http://localhost:8000";

const dummyClaim = {
  id: 421,
  customerName: "Anita Mehta",
  claimType: "HEALTH_HOSPITALIZATION",
  claimAmount: 38400,
  incidentDate: "2026-04-12",
  status: "IN_REVIEW",
};

const dummyFraud = {
  fraud_probability: 78,
  risk_status: "HIGH RISK",
  recommendation:
    "Request additional documents and manual investigation.",
  ml_probability: 82,
  rule_score: 74,
};

export default function FraudDetection() {
  const { claimId } = useParams();
  const navigate = useNavigate();

  const [claim, setClaim] = useState(dummyClaim);
  const [fraud, setFraud] = useState(dummyFraud);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [claimRes, fraudRes] = await Promise.all([
        axios.get(
          `${SPRING_API}/claims/${claimId}`
        ),

        axios.post(
          `${PYTHON_API}/fraud/predict/${claimId}`
        ),
      ]);

      if (claimRes.data) {
        setClaim(claimRes.data);
      }

      if (fraudRes.data) {
        setFraud(fraudRes.data);
      }
    } catch (error) {
      console.log(
        "Backend unavailable. Using dummy fraud data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    try {
      await axios.put(
        `${SPRING_API}/claims/${claim.id}/status`,
        null,
        {
          params: {
            status: "ESCALATED",
          },
        }
      );

      setClaim((prev) => ({
        ...prev,
        status: "ESCALATED",
      }));

      alert(
        "Claim escalated successfully"
      );
    } catch (error) {
      alert(
        "Unable to escalate claim"
      );
    }
  };

  const handleMarkSafe = async () => {
    try {
      await axios.put(
        `${SPRING_API}/claims/${claim.id}/status`,
        null,
        {
          params: {
            status: "APPROVED",
          },
        }
      );

      setClaim((prev) => ({
        ...prev,
        status: "APPROVED",
      }));

      alert("Claim approved");
    } catch (error) {
      alert(
        "Unable to update claim"
      );
    }
  };

  if (loading) {
    return (
      <div className="loading">
        Loading Fraud Analysis...
      </div>
    );
  }

  return (
    <div className="fraud-page">

      <div className="fraud-header">
        <h1>
          Fraud Detection & Risk Analysis
        </h1>

        <button
          className="back-btn"
          onClick={() =>
            navigate(
              "/claims-assessment"
            )
          }
        >
          Back to Claims
        </button>
      </div>

      <div className="fraud-grid">

        <div className="card">
          <h2>Claim Details</h2>

          <p>
            <strong>Claim ID:</strong>{" "}
            {claim.id}
          </p>

          <p>
            <strong>Customer:</strong>{" "}
            {claim.customerName}
          </p>

          <p>
            <strong>Type:</strong>{" "}
            {claim.claimType}
          </p>

          <p>
            <strong>Amount:</strong> ₹
            {Number(
              claim.claimAmount
            ).toLocaleString()}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {claim.incidentDate}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {claim.status}
          </p>
        </div>

        <div className="card">
          <h2>Fraud Analysis</h2>

          <div className="metric">
            <span>
              Fraud Probability
            </span>

            <span>
              {
                fraud.fraud_probability
              }
              %
            </span>
          </div>

          <div className="metric">
            <span>
              ML Probability
            </span>

            <span>
              {fraud.ml_probability}%
            </span>
          </div>

          <div className="metric">
            <span>
              Rule Score
            </span>

            <span>
              {fraud.rule_score}
            </span>
          </div>

          <div className="metric">
            <span>
              Risk Status
            </span>

            <span
              className={
                fraud.risk_status ===
                "HIGH RISK"
                  ? "risk-high"
                  : fraud.risk_status ===
                    "MEDIUM RISK"
                  ? "risk-medium"
                  : "risk-low"
              }
            >
              {
                fraud.risk_status
              }
            </span>
          </div>
        </div>

      </div>

      <div className="card recommendation-card">
        <h2>
          Investigation Recommendation
        </h2>

        <p>
          {
            fraud.recommendation
          }
        </p>

        <div className="action-buttons">

          <button
            className="escalate-btn"
            onClick={
              handleEscalate
            }
          >
            Escalate Investigation
          </button>

          <button
            className="safe-btn"
            onClick={
              handleMarkSafe
            }
          >
            Mark Safe
          </button>

        </div>

      </div>

    </div>
  );
}