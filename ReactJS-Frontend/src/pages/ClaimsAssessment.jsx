import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, Badge, Loader, Btn, StatCard } from '../components/UI';
import { getClaims, updateClaimStatus, checkFraud } from '../services/api';

export default function ClaimsAssessment() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getClaims()
      .then(res => setClaims(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      const res = await updateClaimStatus(id, status);
      setClaims(prev => prev.map(c => c.id === id ? res.data : c));
    } catch (err) { alert('Update failed: ' + (err.response?.data?.message || err.message)); }
    finally { setUpdating(null); }
  };

  const handleFraudCheck = async (claimId) => {
    setUpdating(claimId);
    try {
      await checkFraud(claimId);
      const res = await getClaims();
      setClaims(res.data);
      navigate(`/fraud?claimId=${claimId}`);
    } catch (err) { alert('Fraud check failed'); }
    finally { setUpdating(null); }
  };

  const getRiskLevel = (score) => {
    if (score >= 70) return 'HIGH_RISK';
    if (score >= 40) return 'MEDIUM_RISK';
    return 'LOW_RISK';
  };

  const inReview = claims.filter(c => c.status === 'SUBMITTED' || c.status === 'IN_REVIEW').length;
  const fraudFlagged = claims.filter(c => c.fraudScore >= 70).length;
  const settled = claims.filter(c => c.status === 'SETTLED').length;
  const totalAmount = claims.filter(c => c.status === 'SETTLED').reduce((s, c) => s + (Number(c.claimAmount) || 0), 0);

  let filtered = claims.filter(c => {
    const matchSearch = !search || `CLM-${c.id} ${c.customerName}`.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || c.claimType === filterType;
    const matchRisk = !filterRisk || getRiskLevel(c.fraudScore) === filterRisk;
    return matchSearch && matchType && matchRisk;
  });

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontFamily: "'DM Mono', monospace", letterSpacing: '2px', margin: '0 0 4px', textTransform: 'uppercase' }}>Module 3 · Claims Manager View</p>
        <h1 style={{ color: '#fff', fontFamily: "'Cinzel', serif", fontSize: '26px', margin: 0 }}>Claims Assessment & Workflow</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: "'DM Mono', monospace", marginTop: '4px' }}>Review, approve, or reject claims · API: PUT /api/claims/{'{id}'}/status</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatCard label="In Review" value={inReview} accent="#fbbf24" subColor="#fbbf24" />
        <StatCard label="Fraud Flagged" value={fraudFlagged} accent="#ef4444" subColor="#ef4444" />
        <StatCard label="Settled This Period" value={settled} accent="#4ade80" subColor="#4ade80" />
        <StatCard label="Total Settlement" value={`₹${(totalAmount / 10000000).toFixed(1)}Cr`} accent="#d4a843" />
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search claim ID or customer..."
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '8px 14px', color: '#fff', fontSize: '12px', fontFamily: "'DM Mono', monospace", outline: 'none', flex: 1, minWidth: '180px' }} />
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '8px 14px', color: '#fff', fontSize: '12px', fontFamily: "'DM Mono', monospace", outline: 'none' }}>
            <option value="">All Types</option>
            {['MOTOR_ACCIDENT', 'HEALTH_HOSPITALIZATION', 'PROPERTY_DAMAGE', 'LIFE_INSURANCE'].map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
          </select>
          <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '8px 14px', color: '#fff', fontSize: '12px', fontFamily: "'DM Mono', monospace", outline: 'none' }}>
            <option value="">All Risk Levels</option>
            <option value="HIGH_RISK">High Risk</option>
            <option value="MEDIUM_RISK">Medium Risk</option>
            <option value="LOW_RISK">Low Risk</option>
          </select>
        </div>
      </Card>

      {/* Claims Queue */}
      <Card>
        <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 20px' }}>Claims Queue ({filtered.length})</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Mono', monospace" }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(212,168,67,0.2)' }}>
                {['CLAIM ID', 'CUSTOMER', 'TYPE', 'AMOUNT', 'FRAUD SCORE', 'RISK', 'STATUS', 'ACTIONS'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '2px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 25).map((claim) => {
                const risk = getRiskLevel(claim.fraudScore || 0);
                const isUpdating = updating === claim.id;
                return (
                  <tr key={claim.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px', color: '#d4a843', fontSize: '12px' }}>CLM-{claim.id}</td>
                    <td style={{ padding: '12px', color: '#fff', fontSize: '12px' }}>{claim.customerName}</td>
                    <td style={{ padding: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>{claim.claimType?.replace(/_/g, ' ')}</td>
                    <td style={{ padding: '12px', color: '#fff', fontSize: '12px' }}>₹{Number(claim.claimAmount).toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${claim.fraudScore || 0}%`, height: '100%', background: (claim.fraudScore || 0) >= 70 ? '#ef4444' : (claim.fraudScore || 0) >= 40 ? '#fbbf24' : '#4ade80', borderRadius: '2px' }} />
                        </div>
                        <span style={{ color: (claim.fraudScore || 0) >= 70 ? '#ef4444' : (claim.fraudScore || 0) >= 40 ? '#fbbf24' : '#4ade80', fontSize: '11px' }}>{claim.fraudScore || 0}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}><Badge status={risk} /></td>
                    <td style={{ padding: '12px' }}><Badge status={claim.status} /></td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap' }}>
                        {(claim.status === 'SUBMITTED' || claim.status === 'IN_REVIEW') && (
                          <>
                            <Btn size="sm" variant="success" onClick={() => handleStatus(claim.id, 'APPROVED')} disabled={isUpdating}>
                              {isUpdating ? '...' : 'Approve'}
                            </Btn>
                            <Btn size="sm" variant="danger" onClick={() => handleStatus(claim.id, 'REJECTED')} disabled={isUpdating}>Reject</Btn>
                          </>
                        )}
                        {claim.status === 'APPROVED' && (
                          <Btn size="sm" variant="success" onClick={() => handleStatus(claim.id, 'SETTLED')} disabled={isUpdating}>Settle</Btn>
                        )}
                        <Btn size="sm" variant="warning" onClick={() => handleFraudCheck(claim.id)} disabled={isUpdating}>
                          Fraud Report
                        </Btn>
                        <Btn size="sm" variant="ghost" onClick={() => handleStatus(claim.id, 'ESCALATED')} disabled={isUpdating}>Escalate</Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>No claims found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
}
