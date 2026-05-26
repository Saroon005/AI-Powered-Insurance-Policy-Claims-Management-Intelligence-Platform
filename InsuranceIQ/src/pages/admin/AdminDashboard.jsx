import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";
import "./AdminDashboard.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function AdminDashboard() {
  const stats = {
    activePolicies: 12480,
    pendingClaims: 1924,
    activeAgents: 286,
    fraudFlagged: 142,
  };

  const portfolioData = {
    labels: ["Motor", "Health", "Life", "Property"],
    datasets: [
      {
        label: "Policies",
        data: [3200, 4100, 2800, 2380],
        backgroundColor: [
          "#4f46e5",
          "#06b6d4",
          "#10b981",
          "#f59e0b",
        ],
      },
    ],
  };

  const claimStatusData = {
    labels: [
      "Settled",
      "In Review",
      "Rejected",
      "Pending",
    ],
    datasets: [
      {
        data: [46, 26, 18, 10],
        backgroundColor: [
          "#22c55e",
          "#eab308",
          "#ef4444",
          "#3b82f6",
        ],
      },
    ],
  };

  const topAgents = [
    {
      name: "Rajan Arora",
      region: "Mumbai North",
      policies: 84,
      premium: "₹18.4L",
      status: "Active",
    },
    {
      name: "Preethi S.",
      region: "Bengaluru",
      policies: 76,
      premium: "₹15.9L",
      status: "Active",
    },
    {
      name: "Nikhil K.",
      region: "Delhi NCR",
      policies: 69,
      premium: "₹14.2L",
      status: "Review",
    },
  ];

  return (
    <div className="admin-dashboard">

      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>
          Company-wide portfolio overview — policies,
          claims, agents, fraud activity
        </p>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <h2>{stats.activePolicies}</h2>
          <p>Active Policies</p>
        </div>

        <div className="stat-card">
          <h2>{stats.pendingClaims}</h2>
          <p>Claims Pending</p>
        </div>

        <div className="stat-card">
          <h2>{stats.activeAgents}</h2>
          <p>Active Agents</p>
        </div>

        <div className="stat-card">
          <h2>{stats.fraudFlagged}</h2>
          <p>Fraud Flagged</p>
        </div>

      </div>

      <div className="charts-grid">

        <div className="chart-card">
          <h3>Portfolio by Product Line</h3>
          <Bar data={portfolioData} />
        </div>

        <div className="chart-card">
          <h3>Claims Status Split</h3>
          <Doughnut data={claimStatusData} />
        </div>

      </div>

      <div className="table-card">
        <h3>Top Agents This Month</h3>

        <table>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Region</th>
              <th>Policies</th>
              <th>Premium</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {topAgents.map((agent, index) => (
              <tr key={index}>
                <td>{agent.name}</td>
                <td>{agent.region}</td>
                <td>{agent.policies}</td>
                <td>{agent.premium}</td>
                <td>{agent.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default AdminDashboard;