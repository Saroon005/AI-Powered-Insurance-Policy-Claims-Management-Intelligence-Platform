import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, Badge, Table, Loader, SectionTitle, Btn, Input, Modal } from '../components/UI';
import { getPolicies, createPolicy, deletePolicy, getCustomers, getAgents, getProducts } from '../services/api';

export default function PolicyManagement() {
  const [policies, setPolicies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    customerId: '', agentId: '', productId: '',
    startDate: '', endDate: '', premiumAmount: '',
    status: 'ACTIVE', fraudRiskScore: 0,
  });

  useEffect(() => {
    Promise.all([getPolicies(), getCustomers(), getAgents(), getProducts()])
      .then(([p, c, a, pr]) => {
        setPolicies(p.data);
        setCustomers(c.data);
        setAgents(a.data);
        setProducts(pr.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const payload = {
        ...form,
        customerId: Number(form.customerId),
        agentId: Number(form.agentId),
        productId: Number(form.productId),
        premiumAmount: Number(form.premiumAmount),
        fraudRiskScore: 0,
      };
      const res = await createPolicy(payload);
      setPolicies(prev => [res.data, ...prev]);
      setSuccess(`Policy POL-${res.data.id} issued successfully!`);
      setShowModal(false);
      setForm({ customerId: '', agentId: '', productId: '', startDate: '', endDate: '', premiumAmount: '', status: 'ACTIVE', fraudRiskScore: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue policy');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this policy?')) return;
    try { await deletePolicy(id); setPolicies(prev => prev.filter(p => p.id !== id)); }
    catch { alert('Delete failed'); }
  };

  const filtered = policies.filter(p =>
    `${p.customerName} ${p.productName} ${p.agentName}`.toLowerCase().includes(search.toLowerCase())
  );

  // Renewal alerts
  const renewalAlerts = policies.filter(p => {
    if (!p.endDate) return false;
    const diff = (new Date(p.endDate) - new Date()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 30;
  }).slice(0, 4);

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontFamily: "'DM Mono', monospace", letterSpacing: '2px', margin: '0 0 4px', textTransform: 'uppercase' }}>Module 2 · UC — Policy</p>
          <h1 style={{ color: '#fff', fontFamily: "'Cinzel', serif", fontSize: '26px', margin: 0 }}>Policy Issuance & Management</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: "'DM Mono', monospace", marginTop: '4px' }}>Quote, issue, and renew insurance policies · API: POST /api/policies</p>
        </div>
        <Btn size="lg" onClick={() => setShowModal(true)}>+ Issue New Policy</Btn>
      </div>

      {success && (
        <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '4px', padding: '12px 16px', color: '#4ade80', fontSize: '12px', fontFamily: "'DM Mono', monospace", marginBottom: '20px' }}>
          ✓ {success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', marginBottom: '24px' }}>
        {/* Policy Stats */}
        <div style={{ display: 'flex', gap: '14px' }}>
          {[
            { label: 'Active', val: policies.filter(p => p.status === 'ACTIVE').length, color: '#4ade80' },
            { label: 'Lapsed', val: policies.filter(p => p.status === 'LAPSED').length, color: '#fbbf24' },
            { label: 'Expired', val: policies.filter(p => p.status === 'EXPIRED').length, color: '#94a3b8' },
            { label: 'Renewed', val: policies.filter(p => p.status === 'RENEWED').length, color: '#60a5fa' },
          ].map(item => (
            <div key={item.label} style={{ background: 'linear-gradient(135deg, #0d1421, #111827)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '20px', flex: 1, borderTop: `2px solid ${item.color}` }}>
              <div style={{ color: '#fff', fontSize: '24px', fontWeight: 700, fontFamily: "'Cinzel', serif" }}>{item.val}</div>
              <div style={{ color: item.color, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", marginTop: '4px' }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Renewal Alerts */}
        <Card>
          <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '13px', margin: '0 0 12px' }}>Policy Renewal Alerts</h3>
          {renewalAlerts.map((p, i) => {
            const days = Math.ceil((new Date(p.endDate) - new Date()) / (1000 * 60 * 60 * 24));
            return (
              <div key={i} style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', padding: '8px 12px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ color: '#fff', fontSize: '11px', fontFamily: "'DM Mono', monospace" }}>{p.customerName}</div>
                <span style={{ color: '#ef4444', fontSize: '10px', fontWeight: 700 }}>{days}d</span>
              </div>
            );
          })}
          {renewalAlerts.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', textAlign: 'center' }}>No urgent renewals</p>}
        </Card>
      </div>

      {/* Policy Table */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: 0 }}>Active Policies ({filtered.length})</h3>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search policies..."
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '8px 14px', color: '#fff', fontSize: '12px', fontFamily: "'DM Mono', monospace", outline: 'none', width: '220px' }} />
        </div>
        <Table
          columns={[
            { key: 'id', label: 'Policy ID', render: v => <span style={{ color: '#d4a843' }}>POL-{v}</span> },
            { key: 'customerName', label: 'Customer' },
            { key: 'agentName', label: 'Agent' },
            { key: 'productName', label: 'Product' },
            { key: 'premiumAmount', label: 'Premium', render: v => `₹${Number(v).toLocaleString()}` },
            { key: 'startDate', label: 'Start' },
            { key: 'endDate', label: 'End' },
            { key: 'status', label: 'Status', render: v => <Badge status={v} /> },
            { key: 'fraudRiskScore', label: 'Risk', render: v => <span style={{ color: v >= 70 ? '#ef4444' : v >= 40 ? '#fbbf24' : '#4ade80' }}>{v || 0}</span> },
            { key: 'id', label: 'Actions', render: v => <Btn size="sm" variant="danger" onClick={() => handleDelete(v)}>Delete</Btn> },
          ]}
          data={filtered.slice(0, 20)}
        />
      </Card>

      {/* Issue Policy Modal */}
      {showModal && (
        <Modal title="Issue New Policy" onClose={() => { setShowModal(false); setError(''); }}>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', padding: '10px', color: '#ef4444', fontSize: '11px', marginBottom: '16px' }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input label="Customer" value={form.customerId} onChange={v => setForm(f => ({ ...f, customerId: v }))} required
              options={customers.map(c => ({ value: c.id, label: `${c.firstName} ${c.lastName} — CUST-${c.id}` }))} />
            <Input label="Agent" value={form.agentId} onChange={v => setForm(f => ({ ...f, agentId: v }))} required
              options={agents.map(a => ({ value: a.id, label: `${a.firstName} ${a.lastName} — ${a.region}` }))} />
            <Input label="Product" value={form.productId} onChange={v => setForm(f => ({ ...f, productId: v }))} required
              options={products.map(p => ({ value: p.id, label: `${p.productName} (${p.productType})` }))} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Input label="Start Date" type="date" value={form.startDate} onChange={v => setForm(f => ({ ...f, startDate: v }))} required />
              <Input label="End Date" type="date" value={form.endDate} onChange={v => setForm(f => ({ ...f, endDate: v }))} required />
            </div>
            <Input label="Annual Premium (₹)" type="number" value={form.premiumAmount} onChange={v => setForm(f => ({ ...f, premiumAmount: v }))} placeholder="25000" required />
            <Input label="Policy Status" value={form.status} onChange={v => setForm(f => ({ ...f, status: v }))}
              options={['ACTIVE', 'LAPSED', 'EXPIRED', 'CANCELLED', 'RENEWED'].map(s => ({ value: s, label: s }))} />
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <Btn size="lg" disabled={submitting} style={{ flex: 1 }}>{submitting ? 'Issuing...' : 'Issue Policy'}</Btn>
              <Btn size="lg" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
