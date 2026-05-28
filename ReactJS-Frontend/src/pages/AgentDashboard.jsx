import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { StatCard, Card, Badge, Table, Loader, SectionTitle, Btn } from '../components/UI';
import { getPolicies, getCustomers, getClaims } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AgentDashboard() {
  const [policies, setPolicies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getPolicies(), getCustomers(), getClaims()])
      .then(([p, c, cl]) => {
        setPolicies(p.data);
        setCustomers(c.data.slice(0, 8));
        setClaims(cl.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activePolicies = policies.filter(p => p.status === 'ACTIVE').length;
  const renewalDue = policies.filter(p => {
    if (!p.endDate) return false;
    const end = new Date(p.endDate);
    const diff = (end - new Date()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 30;
  }).length;

  const totalPremium = policies.reduce((sum, p) => sum + (Number(p.premiumAmount) || 0), 0);

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <SectionTitle sub="MODULE 2 · AGENT VIEW — Personal sales pipeline and customer portfolio">Agent Dashboard</SectionTitle>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatCard label="Policies Issued" value={activePolicies} sub="Active policies" accent="#d4a843" />
        <StatCard label="Total Premium" value={`₹${(totalPremium / 100000).toFixed(1)}L`} sub="Premium collected" accent="#4ade80" subColor="#4ade80" />
        <StatCard label="Renewals Due" value={renewalDue} sub="In next 30 days" accent="#ef4444" subColor="#ef4444" />
        <StatCard label="Customers" value={customers.length} sub="Managed accounts" accent="#8b5cf6" subColor="#94a3b8" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* My Customers */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: 0 }}>My Customers</h3>
            <Btn size="sm" onClick={() => navigate('/customers')}>+ Onboard New</Btn>
          </div>
          <Table
            columns={[
              { key: 'firstName', label: 'Name', render: (v, row) => `${row.firstName} ${row.lastName}` },
              { key: 'email', label: 'Email' },
              { key: 'city', label: 'City' },
              { key: 'id', label: 'Action', render: (v) => <Btn size="sm" variant="ghost" onClick={() => navigate('/policies')}>View</Btn> },
            ]}
            data={customers}
          />
        </Card>

        {/* Renewal Alerts */}
        <Card>
          <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 20px' }}>Renewal Alerts</h3>
          {policies.filter(p => {
            if (!p.endDate) return false;
            const diff = (new Date(p.endDate) - new Date()) / (1000 * 60 * 60 * 24);
            return diff > 0 && diff <= 60;
          }).slice(0, 6).map((p, i) => {
            const days = Math.ceil((new Date(p.endDate) - new Date()) / (1000 * 60 * 60 * 24));
            const urgent = days <= 7;
            return (
              <div key={i} style={{
                background: urgent ? 'rgba(239,68,68,0.07)' : 'rgba(251,191,36,0.07)',
                border: `1px solid ${urgent ? 'rgba(239,68,68,0.2)' : 'rgba(251,191,36,0.2)'}`,
                borderRadius: '4px', padding: '10px 14px', marginBottom: '8px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ color: '#fff', fontSize: '12px', fontFamily: "'DM Mono', monospace" }}>{p.customerName}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '2px' }}>{p.productName}</div>
                </div>
                <span style={{ color: urgent ? '#ef4444' : '#fbbf24', fontSize: '10px', fontFamily: "'DM Mono', monospace', fontWeight: 700" }}>{days} DAYS</span>
              </div>
            );
          })}
          {renewalDue === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', textAlign: 'center', padding: '20px 0' }}>No urgent renewals</p>}
        </Card>
      </div>

      {/* Active Policies Table */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: 0 }}>Policy Portfolio</h3>
          <Btn size="sm" onClick={() => navigate('/policies')}>Issue New Policy</Btn>
        </div>
        <Table
          columns={[
            { key: 'id', label: 'Policy ID', render: v => <span style={{ color: '#d4a843' }}>POL-{v}</span> },
            { key: 'customerName', label: 'Customer' },
            { key: 'productName', label: 'Product' },
            { key: 'premiumAmount', label: 'Premium', render: v => `₹${Number(v).toLocaleString()}` },
            { key: 'endDate', label: 'Renewal' },
            { key: 'status', label: 'Status', render: v => <Badge status={v} /> },
          ]}
          data={policies.slice(0, 10)}
        />
      </Card>
    </Layout>
  );
}
