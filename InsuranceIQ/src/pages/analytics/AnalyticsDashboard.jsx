

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./AnalyticsDashboard.css";



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const API = "http://localhost:8000";

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState({});
  const [renewal, setRenewal] = useState({});
  const [lossRatio, setLossRatio] = useState({});
  const [topAgents, setTopAgents] = useState([]);
  const [fraudClaims, setFraudClaims] = useState([]);
  const [claimsTrend, setClaimsTrend] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [
        summaryRes,
        renewalRes,
        lossRes,
        agentsRes,
        fraudRes,
        trendRes,
      ] = await Promise.all([
        axios.get(`${API}/analytics/dashboard-summary`),
        axios.get(`${API}/analytics/renewal-rate`),
        axios.get(`${API}/analytics/loss-ratio`),
        axios.get(`${API}/analytics/top-agents`),
        axios.get(`${API}/analytics/fraud-claims`),
        axios.get(`${API}/analytics/claims-trend`),
      ]);

      setSummary(summaryRes.data);
      setRenewal(renewalRes.data);
      setLossRatio(lossRes.data);
      setTopAgents(agentsRes.data);
      setFraudClaims(fraudRes.data);
      setClaimsTrend(trendRes.data);
    } catch (error) {
      console.log(
        "Analytics backend unavailable. Using demo data."
      );

      setSummary({
        total_customers: 5280,
        total_policies: 12480,
        total_claims: 3421,
        high_risk_fraud_cases: 142,
      });

      setRenewal({
        renewal_rate: 68.2,
      });

      setLossRatio({
        loss_ratio: 54,
        total_claims_paid: 3200000,
        total_premium_collected: 5900000,
      });

      setTopAgents([
        {
          agent_name: "Rajan Arora",
          total_policies: 84,
          premium_collected: 1840000,
        },
        {
          agent_name: "Amit Sharma",
          total_policies: 72,
          premium_collected: 1510000,
        },
        {
          agent_name: "Priya Nair",
          total_policies: 65,
          premium_collected: 1340000,
        },
      ]);

      setFraudClaims([
        {
          claim_id: 847,
          fraud_probability: 78,
          risk_status: "HIGH RISK",
        },
        {
          claim_id: 421,
          fraud_probability: 64,
          risk_status: "MEDIUM RISK",
        },
      ]);

      setClaimsTrend([
        { month: "Jan", total_claims: 120 },
        { month: "Feb", total_claims: 150 },
        { month: "Mar", total_claims: 180 },
        { month: "Apr", total_claims: 145 },
        { month: "May", total_claims: 210 },
      ]);
    }
  };

  const chartData = {
    labels: claimsTrend.map((c) => c.month),
    datasets: [
      {
        label: "Claims",
        data: claimsTrend.map(
          (c) => c.total_claims
        ),
        borderColor: "#00d4b4",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="analytics-page">
      <h1>Analytics Dashboard</h1>

      <div className="analytics-cards">
        <div className="analytics-card">
          <h2>{summary.total_policies || 0}</h2>
          <p>Total Policies</p>
        </div>

        <div className="analytics-card">
          <h2>{summary.total_claims || 0}</h2>
          <p>Total Claims</p>
        </div>

        <div className="analytics-card">
          <h2>
            {summary.high_risk_fraud_cases || 0}
          </h2>
          <p>High Risk Fraud</p>
        </div>

        <div className="analytics-card">
          <h2>
            {renewal.renewal_rate || 0}%
          </h2>
          <p>Renewal Rate</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="panel">
          <h2>Claims Trend</h2>
          <Line data={chartData} />
        </div>

        <div className="panel">
          <h2>Loss Ratio</h2>

          <div className="loss-value">
            {lossRatio.loss_ratio || 0}%
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${
                  lossRatio.loss_ratio || 0
                }%`,
              }}
            />
          </div>

          <p>
            Claims Paid: ₹
            {Number(
              lossRatio.total_claims_paid || 0
            ).toLocaleString()}
          </p>

          <p>
            Premium Collected: ₹
            {Number(
              lossRatio.total_premium_collected ||
                0
            ).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="panel">
          <h2>Top Agents</h2>

          {topAgents.map((agent) => (
            <div
              key={agent.agent_name}
              className="agent-row"
            >
              <div>
                <strong>
                  {agent.agent_name}
                </strong>

                <p>
                  Policies:
                  {agent.total_policies}
                </p>
              </div>

              <div>
                ₹
                {Number(
                  agent.premium_collected
                ).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>High Risk Claims</h2>

          {fraudClaims.map((claim) => (
            <div
              key={claim.claim_id}
              className="fraud-row"
            >
              <div>
                Claim #{claim.claim_id}
              </div>

              <div>
                {claim.fraud_probability}%
              </div>

              <div className="risk-badge">
                {claim.risk_status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}