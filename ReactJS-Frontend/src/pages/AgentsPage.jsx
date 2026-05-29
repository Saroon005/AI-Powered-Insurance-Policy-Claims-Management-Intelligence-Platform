import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, Badge, Table, Loader, SectionTitle, Btn, Input, Modal } from '../components/UI';
import { getAgents, createAgent, deleteAgent } from '../services/api';

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '',
    licenseNo: '', region: '', commissionPct: '', status: 'ACTIVE',
  });

  useEffect(() => {
    getAgents().then(r => setAgents(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true); setError('');
    try {
      const payload = { ...form, commissionPct: Number(form.commissionPct) };
      const res = await createAgent(payload);
      setAgents(prev => [res.data, ...prev]);
      setSuccess(`Agent ${res.data.firstName} ${res.data.lastName} added!`);
      setShowModal(false);
      setForm({ firstName: '', lastName: '', email: '', phoneNumber: '', licenseNo: '', region: '', commissionPct: '', status: 'ACTIVE' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create agent');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this agent?')) return;
    try { await deleteAgent(id); setAgents(prev => prev.filter(a => a.id !== id)); }
    catch { alert('Delete failed'); }
  };

  const filtered = agents.filter(a =>
    `${a.firstName} ${a.lastName} ${a.email} ${a.region}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <SectionTitle sub="Manage insurance agents and their portfolios">Agent Management</SectionTitle>
        <Btn size="lg" onClick={() => setShowModal(true)}>+ Add Agent</Btn>
      </div>

      {success && <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '4px', padding: '12px 16px', color: '#4ade80', fontSize: '12px', fontFamily: "'DM Mono', monospace", marginBottom: '20px' }}>✓ {success}</div>}

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: 0 }}>Agents ({filtered.length})</h3>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agents..."
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '8px 14px', color: '#fff', fontSize: '12px', fontFamily: "'DM Mono', monospace", outline: 'none', width: '200px' }} />
        </div>
        <Table
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'firstName', label: 'Name', render: (v, row) => `${row.firstName} ${row.lastName}` },
            { key: 'email', label: 'Email' },
            { key: 'licenseNo', label: 'License' },
            { key: 'region', label: 'Region' },
            { key: 'commissionPct', label: 'Commission', render: v => `${v}%` },
            { key: 'status', label: 'Status', render: v => <Badge status={v} /> },
            { key: 'id', label: 'Actions', render: v => <Btn size="sm" variant="danger" onClick={() => handleDelete(v)}>Delete</Btn> },
          ]}
          data={filtered.slice(0, 25)}
        />
      </Card>

      {showModal && (
        <Modal title="Add New Agent" onClose={() => { setShowModal(false); setError(''); }}>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', padding: '10px', color: '#ef4444', fontSize: '11px', marginBottom: '14px' }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Input label="First Name" value={form.firstName} onChange={v => setForm(f => ({ ...f, firstName: v }))} required />
              <Input label="Last Name" value={form.lastName} onChange={v => setForm(f => ({ ...f, lastName: v }))} required />
            </div>
            <Input label="Email" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} required />
            <Input label="Phone" value={form.phoneNumber} onChange={v => setForm(f => ({ ...f, phoneNumber: v }))} required />
            <Input label="License No" value={form.licenseNo} onChange={v => setForm(f => ({ ...f, licenseNo: v }))} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Input label="Region" value={form.region} onChange={v => setForm(f => ({ ...f, region: v }))}
                options={['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad'].map(r => ({ value: r, label: r }))} />
              <Input label="Commission %" type="number" value={form.commissionPct} onChange={v => setForm(f => ({ ...f, commissionPct: v }))} placeholder="12.5" required />
            </div>
            <Input label="Status" value={form.status} onChange={v => setForm(f => ({ ...f, status: v }))}
              options={['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED'].map(s => ({ value: s, label: s }))} />
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <Btn size="lg" disabled={submitting} style={{ flex: 1 }}>{submitting ? 'Adding...' : 'Add Agent'}</Btn>
              <Btn size="lg" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
