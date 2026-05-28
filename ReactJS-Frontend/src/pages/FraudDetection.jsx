import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, Badge, Loader, Btn, StatCard } from '../components/UI';
import { getClaims, checkFraud, predictFraud } from '../services/api';

const FRAUD_RULES = [
  { color: '#ef4444', rule: 'Claim > ₹2L + Policy < 30 days + Prior Claims > 3 → High Risk' },
  { color: '#fbbf24', rule: 'Claim ₹50K–2L + 30–180 days + 2–3 claims → Moderate Risk' },
  { color: '#4ade80', rule: 'Claim < ₹50K + Policy > 180 days + 0–1 claims → Low Risk' },
];

export default function FraudDetection() {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    getClaims()
      .then(res => {
        setClaims(res.data);
        const params = new URLSearchParams(location.search);
        const cid = params.get('claimId');
        if (cid) {
          const found = res.data.find(c => c.id === Number(cid));
          if (found) { setSelectedClaim(found); }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAnalyze = async () => {
    if (!selectedClaim) return;
    setAnalyzing(true); setError(''); setResult(null);
    try {
      // Try Spring Boot (which calls Python internally)
      const res = await checkFraud(selectedClaim.id);
      setResult({
        claimId: selectedClaim.id,
        fraudScore: res.data.fraud_score || res.data.fraudScore,
        riskLevel: res.data.risk_level || res.data.riskLevel,
        action: res.data.action,
      });
      // Refresh claim data
      const claimsRes = await getClaims();
      setClaims(claimsRes.data);
      const updated = claimsRes.data.find(c => c.id === selectedClaim.id);
      if (updated) setSelectedClaim(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Fraud analysis failed. Ensure Python service is running on port 8000.');
    } finally { setAnalyzing(false); }
  };

  const score = result?.fraudScore ?? selectedClaim?.fraudScore ?? 0;
  const riskLevel = result?.riskLevel ?? (score >= 70 ? 'HIGH_RISK' : score >= 40 ? 'MEDIUM_RISK' : 'LOW_RISK');

  const riskColor = riskLevel?.includes('HIGH') ? '#ef4444' : riskLevel?.includes('MEDIUM') ? '#fbbf24' : '#4ade80';

  const featBars = selectedClaim ? [
    { label: 'Claim Amount', value: Math.min(100, (Number(selectedClaim.claimAmount) / 500000) * 100), display: `₹${Number(selectedClaim.claimAmount).toLocaleString()}`, color: '#ef4444' },
    { label: 'Fraud Score', value: score, display: `${score}%`, color: riskColor },
  ] : [];

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontFamily: "'DM Mono', monospace", letterSpacing: '2px', margin: '0 0 4px', textTransform: 'uppercase' }}>Module 4 · AI / ML · Python FastAPI</p>
        <h1 style={{ color: '#fff', fontFamily: "'Cinzel', serif", fontSize: '26px', margin: 0 }}>Fraud Detection Report</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: "'DM Mono', monospace", marginTop: '4px' }}>ML-powered fraud risk scoring · Python API: POST /fraud/predict/{'{claimId}'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left: Claim Selection + Analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Card>
            <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 16px' }}>Select Claim for Analysis</h3>
            <select value={selectedClaim?.id || ''} onChange={e => setSelectedClaim(claims.find(c => c.id === Number(e.target.value)) || null)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '10px 14px', color: '#fff', fontSize: '12px', fontFamily: "'DM Mono', monospace", outline: 'none', width: '100%', marginBottom: '14px' }}>
              <option value="">Select a claim...</option>
              {claims.map(c => <option key={c.id} value={c.id}>CLM-{c.id} — {c.customerName} — ₹{Number(c.claimAmount).toLocaleString()}</option>)}
            </select>

            {selectedClaim && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontFamily: "'DM Mono', monospace", letterSpacing: '1px' }}>{selectedClaim.claimType?.replace(/_/g, ' ')}</div>
                    <div style={{ color: '#fff', fontFamily: "'Cinzel', serif", fontSize: '15px', marginTop: '2px' }}>{selectedClaim.customerName}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontFamily: "'DM Mono', monospace" }}>CLM-{selectedClaim.id} · ₹{Number(selectedClaim.claimAmount).toLocaleString()}</div>
                  </div>
                  <Badge status={riskLevel} />
                </div>
                {featBars.map(bar => (
                  <div key={bar.label} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontFamily: "'DM Mono', monospace" }}>{bar.label}</span>
                      <span style={{ color: '#fff', fontSize: '11px', fontFamily: "'DM Mono', monospace" }}>{bar.display}</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${bar.value}%`, height: '100%', background: bar.color, borderRadius: '2px', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Request preview */}
            {selectedClaim && (
              <div style={{ background: '#060a12', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '14px', marginBottom: '14px', fontFamily: "'DM Mono', monospace", fontSize: '11px' }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '8px', fontSize: '10px' }}>REQUEST → POST /api/fraud/check/{selectedClaim.id}</div>
                <div style={{ color: '#4ade80' }}>{'{'}</div>
                <div style={{ paddingLeft: '16px', color: 'rgba(255,255,255,0.7)' }}>
                  <div><span style={{ color: '#60a5fa' }}>"claim_id"</span>: {selectedClaim.id},</div>
                  <div><span style={{ color: '#60a5fa' }}>"claim_amount"</span>: {selectedClaim.claimAmount},</div>
                  <div><span style={{ color: '#60a5fa' }}>"claim_type"</span>: "{selectedClaim.claimType}"</div>
                </div>
                <div style={{ color: '#4ade80' }}>{'}'}</div>
              </div>
            )}

            {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', padding: '10px', color: '#ef4444', fontSize: '11px', marginBottom: '12px', fontFamily: "'DM Mono', monospace" }}>{error}</div>}

            <Btn size="lg" onClick={handleAnalyze} disabled={!selectedClaim || analyzing} style={{ width: '100%', textAlign: 'center' }}>
              {analyzing ? '⟳ Analyzing...' : '⚡ Run Fraud Analysis'}
            </Btn>
          </Card>

          {/* Fraud Rules */}
          <Card>
            <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 16px' }}>Fraud Rule Logic</h3>
            {FRAUD_RULES.map((rule, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px', background: `${rule.color}10`, border: `1px solid ${rule.color}25`, borderRadius: '4px', padding: '10px 14px' }}>
                <span style={{ color: rule.color, fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>●</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontFamily: "'DM Mono', monospace", lineHeight: 1.5 }}>{rule.rule}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Right: Result Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Fraud Score */}
          <Card style={{ background: score >= 70 ? 'linear-gradient(135deg, #1a0808, #1f0d0d)' : score >= 40 ? 'linear-gradient(135deg, #1a1208, #1f160d)' : 'linear-gradient(135deg, #081a0d, #0d1f10)', border: `1px solid ${riskColor}30` }}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: "'DM Mono', monospace", letterSpacing: '3px', marginBottom: '12px' }}>FRAUD PROBABILITY</div>
              <div style={{ fontSize: '72px', fontWeight: 700, color: riskColor, fontFamily: "'Cinzel', serif", lineHeight: 1 }}>{score}%</div>
              <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: `${riskColor}20`, border: `1px solid ${riskColor}40`, borderRadius: '6px', padding: '8px 16px' }}>
                <span style={{ color: riskColor, fontSize: '14px' }}>⚠</span>
                <span style={{ color: riskColor, fontSize: '12px', fontFamily: "'DM Mono', monospace", letterSpacing: '1px' }}>{riskLevel?.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </Card>

          {/* Python Response */}
          {result && (
            <Card>
              <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 16px' }}>Python Response</h3>
              <div style={{ background: '#060a12', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '14px', fontFamily: "'DM Mono', monospace", fontSize: '11px' }}>
                <div style={{ color: '#4ade80' }}>{'{'}</div>
                <div style={{ paddingLeft: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8' }}>
                  <div><span style={{ color: '#60a5fa' }}>"fraud_score"</span>: <span style={{ color: '#fbbf24' }}>{result.fraudScore}</span>,</div>
                  <div><span style={{ color: '#60a5fa' }}>"risk_level"</span>: <span style={{ color: '#f87171' }}>"{result.riskLevel}"</span>,</div>
                  <div><span style={{ color: '#60a5fa' }}>"action"</span>: <span style={{ color: '#34d399' }}>"{result.action}"</span></div>
                </div>
                <div style={{ color: '#4ade80' }}>{'}'}</div>
              </div>

              {result.riskLevel?.includes('HIGH') && (
                <div style={{ marginTop: '14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '6px', padding: '14px' }}>
                  <div style={{ color: '#ef4444', fontSize: '10px', fontFamily: "'DM Mono', monospace", letterSpacing: '2px', marginBottom: '8px' }}>⚠ RECOMMENDATION</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontFamily: "'DM Mono', monospace", lineHeight: 1.6 }}>
                    Request additional documents and surveyor re-inspection. Policy claim submitted — high-risk pattern detected.
                  </div>
                </div>
              )}

              {/* Architecture Flow */}
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                {['Spring Boot', 'Python ML', 'MySQL'].map((s, i) => (
                  <>
                    <div key={s} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '8px 12px', fontSize: '10px', fontFamily: "'DM Mono', monospace", color: ['#60a5fa', '#fbbf24', '#4ade80'][i], textAlign: 'center' }}>
                      <div>{s}</div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', marginTop: '2px' }}>{['Triggers', 'Scores Fraud', 'Stores Result'][i]}</div>
                    </div>
                    {i < 2 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>→</span>}
                  </>
                ))}
              </div>
            </Card>
          )}

          {!result && !selectedClaim && (
            <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚡</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: "'DM Mono', monospace" }}>Select a claim and run fraud analysis to see ML results</div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
