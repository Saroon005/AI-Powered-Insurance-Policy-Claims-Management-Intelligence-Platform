import { useEffect, useState } from "react";

import {
  getClaims,
  createClaim,
} from "../../services/claimService";

import "./ClaimSubmission.css";

function ClaimSubmission() {
  const [claims, setClaims] = useState([]);

  const [formData, setFormData] = useState({
    policyId: "",
    claimType: "MOTOR_ACCIDENT",
    incidentDate: "",
    claimAmount: "",
    surveyorId: "",
  });

  const loadClaims = async () => {
    try {
      const data = await getClaims();
      setClaims(data || []);
    } catch (error) {
      console.log("Backend not connected yet");
    }
  };

  useEffect(() => {
    loadClaims();
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
      await createClaim(formData);

      alert("Claim Submitted Successfully");

      setFormData({
        policyId: "",
        claimType: "MOTOR_ACCIDENT",
        incidentDate: "",
        claimAmount: "",
        surveyorId: "",
      });

      loadClaims();
    } catch (error) {
      console.error(error);
      alert("Failed to submit claim");
    }
  };

  return (
    <div className="claim-page">

      <div className="claim-form-card">

        <h2>Claims Submission</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="number"
            name="policyId"
            placeholder="Policy ID"
            value={formData.policyId}
            onChange={handleChange}
            required
          />

          <select
            name="claimType"
            value={formData.claimType}
            onChange={handleChange}
          >
            <option value="MOTOR_ACCIDENT">
              Motor Accident
            </option>

            <option value="HEALTH_HOSPITALIZATION">
              Health Hospitalization
            </option>

            <option value="PROPERTY_DAMAGE">
              Property Damage
            </option>

            <option value="LIFE_INSURANCE">
              Life Insurance
            </option>
          </select>

          <input
            type="date"
            name="incidentDate"
            value={formData.incidentDate}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="claimAmount"
            placeholder="Claim Amount"
            value={formData.claimAmount}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="surveyorId"
            placeholder="Surveyor ID"
            value={formData.surveyorId}
            onChange={handleChange}
          />

          <button type="submit">
            Submit Claim
          </button>

        </form>

      </div>

      <div className="claim-table-card">

        <h2>Submitted Claims</h2>

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Policy</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {claims.length > 0 ? (
              claims.map((claim) => (
                <tr key={claim.id}>
                  <td>{claim.id}</td>
                  <td>{claim.customerName}</td>
                  <td>{claim.policyId}</td>
                  <td>{claim.claimType}</td>
                  <td>{claim.claimAmount}</td>
                  <td>{claim.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  No Claims Found
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ClaimSubmission;