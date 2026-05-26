import { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerDashboard.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api";

const dummyCustomer = {
  firstName: "Anita",
  lastName: "Mehta",
  city: "Mumbai",
  state: "Maharashtra",
};

const dummyPolicies = [
  {
    id: 1,
    productName: "Health Insurance",
    premiumAmount: 500000,
    endDate: "2026-06-12",
    status: "ACTIVE",
  },
  {
    id: 2,
    productName: "Motor Insurance",
    premiumAmount: 680000,
    endDate: "2026-09-20",
    status: "ACTIVE",
  },
];

const dummyClaims = [
  {
    id: 421,
    claimType: "HEALTH_HOSPITALIZATION",
    claimAmount: 38400,
    incidentDate: "2026-04-12",
    status: "SETTLED",
  },
  {
    id: 1184,
    claimType: "MOTOR_ACCIDENT",
    claimAmount: 72000,
    incidentDate: "2025-11-08",
    status: "IN_REVIEW",
  },
];

function CustomerDashboard() {
  const [customer, setCustomer] = useState(dummyCustomer);
  const [policies, setPolicies] = useState(dummyPolicies);
  const [claims, setClaims] = useState(dummyClaims);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, policiesRes, claimsRes] =
          await Promise.all([
            axios.get(`${API_URL}/customers`),
            axios.get(`${API_URL}/policies`),
            axios.get(`${API_URL}/claims`),
          ]);

        const customers = customersRes.data || [];
        

        if (customers.length > 0) {
          setCustomer(customers[0]);
        }

        if (policiesRes.data?.length > 0) {
          setPolicies(policiesRes.data);
        }

        if (claimsRes.data?.length > 0) {
          setClaims(claimsRes.data);
        }
      } catch (error) {
        console.log(
          "Backend unavailable. Using dummy data."
        );
      }
    };

    fetchData();
  }, []);

  return (
    <div className="customer-dashboard">

      <h1>Customer Dashboard</h1>

      <div className="dashboard-grid">

        <div className="profile-card">

          <div className="avatar">
            {customer.firstName?.charAt(0)}
            {customer.lastName?.charAt(0)}
          </div>

          <h2>
            {customer.firstName} {customer.lastName}
          </h2>

          <span className="verified">
            KYC Verified
          </span>

          <div className="customer-info">
            <p>
              <strong>City:</strong>{" "}
              {customer.city}
            </p>

            <p>
              <strong>State:</strong>{" "}
              {customer.state}
            </p>
          </div>


          <button
  className="claim-btn"
  onClick={() => navigate("/claims")}
>
  + File New Claim
</button>

        </div>

        <div className="content-section">

          <h2>My Policies</h2>

          <div className="policy-grid">

            {policies.map((policy) => (
              <div
                key={policy.id}
                className="policy-card"
              >
                <h3>{policy.productName}</h3>

                <p>
                  Coverage:
                  ₹
                  {Number(
                    policy.premiumAmount
                  ).toLocaleString()}
                </p>

                <p>
                  Renewal: {policy.endDate}
                </p>

                <span className="status active">
                  {policy.status}
                </span>
              </div>
            ))}

          </div>

          <div className="claims-card">

            <h2>Claim History</h2>

            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {claims.map((claim) => (
                  <tr key={claim.id}>
                    <td>{claim.id}</td>

                    <td>
                      {claim.claimType}
                    </td>

                    <td>
                      ₹
                      {Number(
                        claim.claimAmount
                      ).toLocaleString()}
                    </td>

                    <td>
                      {claim.incidentDate}
                    </td>

                    <td>
                      {claim.status}
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CustomerDashboard;