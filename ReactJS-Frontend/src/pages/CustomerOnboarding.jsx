import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, Badge, Table, Loader, SectionTitle, Btn, Input, Modal } from '../components/UI';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, getAgents } from '../services/api';

const KYC_STEPS = ['Identity Verification', 'Address Proof', 'Photo Verification', 'Admin Approval'];

export default function CustomerOnboarding() {
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '',
    address: '', city: '', state: '', country: 'India', zipCode: '',
  });

  useEffect(() => {
    Promise.all([getCustomers(), getAgents()])
      .then(([c, a]) => { setCustomers(c.data); setAgents(a.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const res = await createCustomer(form);
      setCustomers(prev => [res.data, ...prev]);
      setSuccess(`Customer ${res.data.firstName} ${res.data.lastName} onboarded successfully!`);
      setShowModal(false);
      setForm({ firstName: '', lastName: '', email: '', phoneNumber: '', address: '', city: '', state: '', country: 'India', zipCode: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create customer');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err) { alert('Delete failed'); }
  };

  const filtered = customers.filter(c =>
    `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontFamily: "'DM Mono', monospace", letterSpacing: '2px', margin: '0 0 4px', textTransform: 'uppercase' }}>Module 2 · UC — Onboarding</p>
          <h1 style={{ color: '#fff', fontFamily: "'Cinzel', serif", fontSize: '26px', margin: 0 }}>Customer Onboarding & KYC</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: "'DM Mono', monospace", marginTop: '4px' }}>Register customers · API: POST /api/customers</p>
        </div>
        <Btn size="lg" onClick={() => setShowModal(true)}>+ Onboard Customer</Btn>
      </div>

      {success && (
        <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '4px', padding: '12px 16px', color: '#4ade80', fontSize: '12px', fontFamily: "'DM Mono', monospace", marginBottom: '20px' }}>
          ✓ {success}
        </div>
      )}

      {/* KYC Process Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', marginBottom: '24px' }}>
        <Card>
          <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 16px' }}>KYC Verification Steps</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {KYC_STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: i === 0 ? '#4ade80' : i === 1 ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#000', fontSize: '11px', fontWeight: 700, fontFamily: "'DM Mono', monospace",
                }}>
                  {i === 0 ? '✓' : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontSize: '12px', fontFamily: "'DM Mono', monospace" }}>{step}</div>
                </div>
                <span style={{
                  fontSize: '9px', letterSpacing: '1px', fontFamily: "'DM Mono', monospace",
                  color: i === 0 ? '#4ade80' : i === 1 ? '#fbbf24' : 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase',
                }}>
                  {i === 0 ? 'Done' : i === 1 ? 'In Progress' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ minWidth: '200px' }}>
          <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 16px' }}>Data Flow</h3>
          {['Form Validation (React)', 'POST /api/customers', 'Spring Boot processes KYC', 'Customer record → MySQL', 'Notification triggered to Agent'].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
              <span style={{ color: '#4ade80', fontSize: '10px', flexShrink: 0, marginTop: '2px' }}>◉</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontFamily: "'DM Mono', monospace" }}>{step}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Customer Table */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: 0 }}>Customer Directory ({filtered.length})</h3>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search customers..."
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '8px 14px', color: '#fff', fontSize: '12px', fontFamily: "'DM Mono', monospace", outline: 'none', width: '200px' }}
          />
        </div>
        <Table
          columns={[
            { key: 'id', label: 'ID', render: v => <span style={{ color: '#d4a843' }}>CUST-{String(v).padStart(5, '0')}</span> },
            { key: 'firstName', label: 'Name', render: (v, row) => `${row.firstName} ${row.lastName}` },
            { key: 'email', label: 'Email' },
            { key: 'phoneNumber', label: 'Phone' },
            { key: 'city', label: 'City' },
            { key: 'state', label: 'State' },
            { key: 'id', label: 'Actions', render: (v) => (
              <div style={{ display: 'flex', gap: '6px' }}>
                <Btn size="sm" variant="danger" onClick={() => handleDelete(v)}>Delete</Btn>
              </div>
            )},
          ]}
          data={filtered.slice(0, 20)}
        />
      </Card>

      {/* Create Customer Modal */}
      {showModal && (
        <Modal title="Onboard New Customer" onClose={() => { setShowModal(false); setError(''); }}>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', padding: '10px', color: '#ef4444', fontSize: '11px', marginBottom: '16px' }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Input label="First Name" value={form.firstName} onChange={v => setForm(f => ({ ...f, firstName: v }))} placeholder="Anita" required />
              <Input label="Last Name" value={form.lastName} onChange={v => setForm(f => ({ ...f, lastName: v }))} placeholder="Mehta" required />
            </div>
            <Input label="Email Address" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" placeholder="anita@email.com" required />
            <Input label="Phone Number" value={form.phoneNumber} onChange={v => setForm(f => ({ ...f, phoneNumber: v }))} placeholder="+91 98765 43210" required />
            <Input label="Address" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} placeholder="Flat 4B, Seaview Towers" required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <Input label="City" value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} placeholder="Mumbai" required />
              <Input label="State" value={form.state} onChange={v => setForm(f => ({ ...f, state: v }))} placeholder="Maharashtra" required />
              <Input label="Zip Code" value={form.zipCode} onChange={v => setForm(f => ({ ...f, zipCode: v }))} placeholder="400053" required />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <Btn size="lg" disabled={submitting} style={{ flex: 1 }}>
                {submitting ? 'Saving...' : '✓ Save & Submit KYC'}
              </Btn>
              <Btn size="lg" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
