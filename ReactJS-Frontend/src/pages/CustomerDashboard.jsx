import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, Badge, Table, Loader, SectionTitle, Btn, StatCard } from '../components/UI';
import { getPolicies, getClaims } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CustomerDashboard() {
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getPolicies(), getClaims()])
      .then(([p, c]) => { setPolicies(p.data); setClaims(c.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activePolicies = policies.filter(p => p.status === 'ACTIVE');
  const myClaims = claims.slice(0, 10);
  const settledClaims = claims.filter(c => c.status === 'SETTLED').length;
  const pendingClaims = claims.filter(c => c.status === 'SUBMITTED' || c.status === 'IN_REVIEW').length;

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <SectionTitle sub="MODULE 2 · CUSTOMER VIEW — Personal insurance portfolio">Customer Dashboard</SectionTitle>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatCard label="Active Policies" value={activePolicies.length} sub="Currently active" accent="#d4a843" />
        <StatCard label="Total Claims" value={claims.length} sub="All time" accent="#60a5fa" subColor="#94a3b8" />
        <StatCard label="Settled Claims" value={settledClaims} sub="Successfully settled" accent="#4ade80" subColor="#4ade80" />
        <StatCard label="Pending Claims" value={pendingClaims} sub="Awaiting review" accent="#fbbf24" subColor="#fbbf24" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Profile Card */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #d4a843, #b8860b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel', serif", fontSize: '20px', color: '#000', fontWeight: 700 }}>
              {(user?.email?.[0] || 'U').toUpperCase()}
            </div>
            <div>
              <div style={{ color: '#fff', fontFamily: "'Cinzel', serif", fontSize: '16px' }}>{user?.email?.split('@')[0]}</div>
              <div style={{ color: '#4ade80', fontSize: '10px', fontFamily: "'DM Mono', monospace", letterSpacing: '2px', marginTop: '2px' }}>● ACTIVE MEMBER</div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <InfoRow label="Email" value={user?.email} />
            <InfoRow label="Role" value={user?.role} />
            <InfoRow label="Total Policies" value={policies.length} />
          </div>
          <Btn size="md" onClick={() => navigate('/claims')} style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
            + File New Claim
          </Btn>
        </Card>

        {/* My Policies */}
        <Card>
          <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 16px' }}>My Policies</h3>
          {activePolicies.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>No active policies</div>
          )}
          {activePolicies.slice(0, 4).map((p, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '14px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ color: 'rgba(212,168,67,0.7)', fontSize: '9px', letterSpacing: '2px', fontFamily: "'DM Mono', monospace", textTransform: 'uppercase' }}>{p.productName || 'Insurance Policy'}</div>
                  <div style={{ color: '#fff', fontFamily: "'Cinzel', serif", fontSize: '14px', marginTop: '4px' }}>POL-{p.id}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontFamily: "'DM Mono', monospace", marginTop: '4px' }}>₹{Number(p.premiumAmount).toLocaleString()} / year</div>
                </div>
                <Badge status={p.status} />
              </div>
              <div style={{ marginTop: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontFamily: "'DM Mono', monospace" }}>
                Renewal: {p.endDate || 'N/A'}
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Claim History */}
      <Card>
        <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 20px' }}>Claim History</h3>
        <Table
          columns={[
            { key: 'id', label: 'Claim ID', render: v => <span style={{ color: '#d4a843' }}>CLM-{v}</span> },
            { key: 'claimType', label: 'Type' },
            { key: 'claimAmount', label: 'Amount', render: v => `₹${Number(v).toLocaleString()}` },
            { key: 'incidentDate', label: 'Filed Date' },
            { key: 'fraudScore', label: 'Risk Score', render: v => <span style={{ color: v >= 70 ? '#ef4444' : v >= 40 ? '#fbbf24' : '#4ade80' }}>{v || 0}%</span> },
            { key: 'status', label: 'Status', render: v => <Badge status={v} /> },
          ]}
          data={myClaims}
        />
      </Card>
    </Layout>
  );
}

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: "'DM Mono', monospace", letterSpacing: '1px' }}>{label}</span>
    <span style={{ color: '#fff', fontSize: '11px', fontFamily: "'DM Mono', monospace" }}>{value}</span>
  </div>
);
