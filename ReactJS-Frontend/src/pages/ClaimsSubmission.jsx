import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, Badge, Table, Loader, Btn, Input, Modal } from '../components/UI';
import { getClaims, createClaim, getPolicies } from '../services/api';

const LIFECYCLE_STEPS = [
  { num: 1, label: 'Intake', desc: 'Customer / Agent submits claim form + docs' },
  { num: 2, label: 'Registration', desc: 'Claim ID assigned · Surveyor auto-notified' },
  { num: 3, label: 'Survey (Current)', desc: 'Field inspection and report upload' },
  { num: 4, label: 'Assessment', desc: 'Claims Manager review + AI fraud check' },
  { num: 5, label: 'Settlement', desc: 'Payment processing by Finance' },
  { num: 6, label: 'Closure', desc: 'Records updated · Customer notified' },
];

export default function ClaimsSubmission() {
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    policyId: '', claimType: 'MOTOR_ACCIDENT', incidentDate: '', claimAmount: '', surveyorId: 1,
  });

  useEffect(() => {
    Promise.all([getClaims(), getPolicies()])
      .then(([c, p]) => { setClaims(c.data); setPolicies(p.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleFormChange = (field, val) => {
    const newForm = { ...form, [field]: val };
    setForm(newForm);
    if (newForm.policyId && newForm.claimAmount) {
      setPreview({
        claimId: 'CLM-AUTO',
        policy: policies.find(p => p.id === Number(newForm.policyId)),
        amount: newForm.claimAmount,
        type: newForm.claimType,
        status: 'Pending Registration',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const payload = {
        policyId: Number(form.policyId),
        claimType: form.claimType,
        incidentDate: form.incidentDate,
        claimAmount: Number(form.claimAmount),
        surveyorId: Number(form.surveyorId),
      };
      const res = await createClaim(payload);
      setClaims(prev => [res.data, ...prev]);
      setSuccess(`Claim CLM-${res.data.id} submitted successfully! Claims Manager has been notified.`);
      setShowModal(false);
      setForm({ policyId: '', claimType: 'MOTOR_ACCIDENT', incidentDate: '', claimAmount: '', surveyorId: 1 });
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit claim');
    } finally { setSubmitting(false); }
  };

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontFamily: "'DM Mono', monospace", letterSpacing: '2px', margin: '0 0 4px', textTransform: 'uppercase' }}>Module 3 · Claims Submission</p>
          <h1 style={{ color: '#fff', fontFamily: "'Cinzel', serif", fontSize: '26px', margin: 0 }}>Claims Submission</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: "'DM Mono', monospace", marginTop: '4px' }}>File a new insurance claim · API: POST /api/claims</p>
        </div>
        <Btn size="lg" onClick={() => setShowModal(true)}>+ File New Claim</Btn>
      </div>

      {success && (
        <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '4px', padding: '12px 16px', color: '#4ade80', fontSize: '12px', fontFamily: "'DM Mono', monospace", marginBottom: '20px' }}>
          ✓ {success}
        </div>
      )}

      {/* Claims Table */}
      <Card>
        <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 20px' }}>All Claims ({claims.length})</h3>
        <Table
          columns={[
            { key: 'id', label: 'Claim ID', render: v => <span style={{ color: '#d4a843' }}>CLM-{v}</span> },
            { key: 'policyId', label: 'Policy', render: v => `POL-${v}` },
            { key: 'customerName', label: 'Customer' },
            { key: 'claimType', label: 'Type', render: v => v?.replace(/_/g, ' ') },
            { key: 'claimAmount', label: 'Amount', render: v => `₹${Number(v).toLocaleString()}` },
            { key: 'incidentDate', label: 'Date' },
            { key: 'fraudScore', label: 'Fraud Score', render: v => (
              <span style={{ color: v >= 70 ? '#ef4444' : v >= 40 ? '#fbbf24' : '#4ade80', fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>{v || 0}%</span>
            )},
            { key: 'status', label: 'Status', render: v => <Badge status={v} /> },
          ]}
          data={claims.slice(0, 20)}
        />
      </Card>

      {/* File Claim Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0d1421', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '8px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {/* Left: Form */}
            <div style={{ padding: '28px', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", margin: '0 0 20px', fontSize: '16px' }}>Claim Details</h3>
              {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', padding: '10px', color: '#ef4444', fontSize: '11px', marginBottom: '14px' }}>{error}</div>}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Input label="Select Policy" value={form.policyId} onChange={v => handleFormChange('policyId', v)} required
                  options={policies.map(p => ({ value: p.id, label: `POL-${p.id} — ${p.customerName} (${p.productName || 'Policy'})` }))} />
                <Input label="Claim Type" value={form.claimType} onChange={v => handleFormChange('claimType', v)}
                  options={['MOTOR_ACCIDENT', 'HEALTH_HOSPITALIZATION', 'PROPERTY_DAMAGE', 'LIFE_INSURANCE'].map(t => ({ value: t, label: t.replace(/_/g, ' ') }))} />
                <Input label="Incident Date" type="date" value={form.incidentDate} onChange={v => handleFormChange('incidentDate', v)} required />
                <Input label="Claimed Amount (₹)" type="number" value={form.claimAmount} onChange={v => handleFormChange('claimAmount', v)} placeholder="95000" required />
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <Btn size="lg" disabled={submitting} style={{ flex: 1 }}>{submitting ? 'Submitting...' : 'Submit Claim'}</Btn>
                  <Btn size="lg" variant="ghost" onClick={() => { setShowModal(false); setPreview(null); }}>Cancel</Btn>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', fontFamily: "'DM Mono', monospace", marginTop: '4px' }}>
                  POST /api/claims · Claim ID auto-generated · Notification → Claims Manager
                </div>
              </form>
            </div>

            {/* Right: Lifecycle + Preview */}
            <div style={{ padding: '28px' }}>
              <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", margin: '0 0 20px', fontSize: '14px' }}>Claims Lifecycle</h3>
              {LIFECYCLE_STEPS.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: i < 2 ? '#4ade80' : i === 2 ? '#fbbf24' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i < 3 ? '#000' : 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>{step.num}</div>
                    {i < LIFECYCLE_STEPS.length - 1 && <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.1)', marginTop: '4px' }} />}
                  </div>
                  <div style={{ paddingTop: '4px' }}>
                    <div style={{ color: i === 2 ? '#fbbf24' : '#fff', fontSize: '12px', fontFamily: "'DM Mono', monospace" }}>{step.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '2px', fontFamily: "'DM Mono', monospace" }}>{step.desc}</div>
                  </div>
                </div>
              ))}

              {preview && (
                <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px' }}>
                  <div style={{ color: '#d4a843', fontSize: '11px', fontFamily: "'Cinzel', serif", marginBottom: '12px' }}>Claim Preview</div>
                  {[
                    ['Claim ID', <span style={{ color: '#d4a843' }}>CLM-AUTO</span>],
                    ['Policy', preview.policy ? `POL-${preview.policy.id}` : '—'],
                    ['Amount', `₹${Number(preview.amount).toLocaleString()}`],
                    ['Type', preview.type?.replace(/_/g, ' ')],
                    ['Status', <span style={{ color: '#fbbf24' }}>Pending Registration</span>],
                  ].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: "'DM Mono', monospace" }}>{label}</span>
                      <span style={{ color: '#fff', fontSize: '11px', fontFamily: "'DM Mono', monospace" }}>{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
