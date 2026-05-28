import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { StatCard, Card, Badge, Table, Loader, SectionTitle } from '../components/UI';
import { getClaims, getPolicies, getAgents, getFraudSummary, getKPIs } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [claims, setClaims] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getClaims(), getPolicies(), getAgents(), getKPIs().catch(() => null)])
      .then(([claimsRes, policiesRes, agentsRes, kpiRes]) => {
        setClaims(claimsRes.data.slice(0, 5));
        setAgents(agentsRes.data.slice(0, 5));
        const policies = policiesRes.data;
        const activePolicies = policies.filter(p => p.status === 'ACTIVE').length;
        const pendingClaims = claimsRes.data.filter(c => c.status === 'SUBMITTED' || c.status === 'IN_REVIEW').length;
        const fraudFlagged = claimsRes.data.filter(c => c.fraudScore >= 70).length;
        setStats({ activePolicies, pendingClaims, activeAgents: agentsRes.data.length, fraudFlagged, kpi: kpiRes?.data });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Claims status distribution
  const claimsAll = claims;
  const statusCounts = { SUBMITTED: 0, IN_REVIEW: 0, APPROVED: 0, REJECTED: 0, SETTLED: 0 };

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <SectionTitle sub="MODULE 1 · ADMIN VIEW — Company-wide portfolio overview">Admin Dashboard</SectionTitle>

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatCard label="Active Policies" value={(stats?.activePolicies || 0).toLocaleString()} sub={`↑ ${stats?.kpi?.total_policies || 0} total`} accent="#d4a843" />
        <StatCard label="Claims Pending" value={(stats?.pendingClaims || 0).toLocaleString()} sub="In review queue" accent="#60a5fa" subColor="#fbbf24" />
        <StatCard label="Active Agents" value={(stats?.activeAgents || 0).toLocaleString()} sub="Across all regions" accent="#8b5cf6" subColor="#94a3b8" />
        <StatCard label="Fraud Flagged" value={(stats?.fraudFlagged || 0).toLocaleString()} sub="↑ High risk claims" accent="#ef4444" subColor="#ef4444" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* KPI Summary from Python */}
        {stats?.kpi && (
          <Card>
            <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 20px' }}>Platform KPIs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Total Customers', value: stats.kpi.total_customers },
                { label: 'Total Policies', value: stats.kpi.total_policies },
                { label: 'Total Claims', value: stats.kpi.total_claims },
                { label: 'Approved Claims', value: stats.kpi.approved_claims },
                { label: 'Rejected Claims', value: stats.kpi.rejected_claims },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '10px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontFamily: "'DM Mono', monospace", letterSpacing: '1px' }}>{item.label}</span>
                  <span style={{ color: '#fff', fontFamily: "'DM Mono', monospace", fontSize: '14px', fontWeight: 700 }}>{(item.value || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Claims */}
        <Card>
          <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 20px' }}>Recent Claims</h3>
          <Table
            columns={[
              { key: 'id', label: 'ID', render: v => <span style={{ color: '#d4a843' }}>CLM-{v}</span> },
              { key: 'customerName', label: 'Customer' },
              { key: 'claimAmount', label: 'Amount', render: v => `₹${Number(v).toLocaleString()}` },
              { key: 'status', label: 'Status', render: v => <Badge status={v} /> },
            ]}
            data={claims}
          />
        </Card>
      </div>

      {/* Top Agents Table */}
      <Card>
        <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 20px' }}>Agent Directory</h3>
        <Table
          columns={[
            { key: 'id', label: '#' },
            { key: 'firstName', label: 'Name', render: (v, row) => `${row.firstName} ${row.lastName}` },
            { key: 'email', label: 'Email' },
            { key: 'region', label: 'Region' },
            { key: 'commissionPct', label: 'Commission', render: v => `${v}%` },
            { key: 'status', label: 'Status', render: v => <Badge status={v} /> },
          ]}
          data={agents}
        />
      </Card>
    </Layout>
  );
}
