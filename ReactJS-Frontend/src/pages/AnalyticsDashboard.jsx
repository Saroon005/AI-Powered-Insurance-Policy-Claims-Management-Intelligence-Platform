import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, Loader, StatCard } from '../components/UI';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  getFraudSummary, getLossRatio, getAgentPerformance,
  getClaimSeverity, getClaimTypes, getRegionRisk, getKPIs, getClaimsTrend, getTopAgents
} from '../services/api';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const COLORS = ['#d4a843', '#60a5fa', '#4ade80', '#f87171', '#a78bfa', '#34d399'];

const TooltipStyle = {
  contentStyle: { background: '#0d1421', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontFamily: "'DM Mono', monospace", fontSize: '11px' },
  itemStyle: { color: '#fff' },
  labelStyle: { color: '#d4a843' },
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getFraudSummary().catch(() => null),
      getLossRatio().catch(() => null),
      getAgentPerformance().catch(() => null),
      getClaimSeverity().catch(() => null),
      getClaimTypes().catch(() => null),
      getRegionRisk().catch(() => null),
      getKPIs().catch(() => null),
      getClaimsTrend().catch(() => null),
      getTopAgents().catch(() => null),
    ]).then(([fraud, loss, agents, severity, types, region, kpis, trend, topAgents]) => {
      setData({ fraud: fraud?.data, loss: loss?.data, agents: agents?.data, severity: severity?.data, types: types?.data, region: region?.data, kpis: kpis?.data, trend: trend?.data, topAgents: topAgents?.data });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  // Format trend data
  const trendData = data.trend?.map(t => ({ month: MONTHS[(t.month - 1)] || `M${t.month}`, claims: t.total_claims })) || [];

  // Severity data for pie
  const severityPie = data.severity ? [
    { name: 'Low (<₹50K)', value: data.severity.low_severity, color: '#4ade80' },
    { name: 'Medium (₹50K–2L)', value: data.severity.medium_severity, color: '#fbbf24' },
    { name: 'High (>₹2L)', value: data.severity.high_severity, color: '#ef4444' },
  ] : [];

  // Risk distribution
  const riskPie = data.fraud ? [
    { name: 'Low Risk', value: data.fraud.low_risk, color: '#4ade80' },
    { name: 'Medium Risk', value: data.fraud.medium_risk, color: '#fbbf24' },
    { name: 'High Risk', value: data.fraud.high_risk, color: '#ef4444' },
  ] : [];

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontFamily: "'DM Mono', monospace", letterSpacing: '2px', margin: '0 0 4px', textTransform: 'uppercase' }}>Module 5 · Admin / Claims Manager</p>
        <h1 style={{ color: '#fff', fontFamily: "'Cinzel', serif", fontSize: '26px', margin: 0 }}>Analytics Dashboard</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: "'DM Mono', monospace", marginTop: '4px' }}>Claims trends, fraud patterns, agent performance, loss ratio · Python ETL + Recharts</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatCard label="Total Policies" value={(data.kpis?.total_policies || 0).toLocaleString()} sub={`↑ 4.2% vs last month`} accent="#d4a843" />
        <StatCard label="Fraud Rate" value={`${data.fraud ? ((data.fraud.high_risk / (data.fraud.total_claims || 1)) * 100).toFixed(1) : 0}%`} sub="High risk claims" accent="#ef4444" subColor="#ef4444" />
        <StatCard label="Loss Ratio" value={`${data.loss?.loss_ratio_percent || 0}%`} sub={`₹${((data.loss?.total_claims || 0) / 10000000).toFixed(1)}Cr claims`} accent="#fbbf24" subColor="#fbbf24" />
        <StatCard label="Total Customers" value={(data.kpis?.total_customers || 0).toLocaleString()} sub="Platform-wide" accent="#4ade80" subColor="#4ade80" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Claims Trend */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: 0 }}>Claims Received vs. Settled</h3>
            <span style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontSize: '10px', fontFamily: "'DM Mono', monospace", padding: '3px 8px', borderRadius: '4px' }}>↑ Improving</span>
          </div>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: "'DM Mono', monospace" }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: "'DM Mono', monospace" }} />
                <Tooltip {...TooltipStyle} />
                <Line type="monotone" dataKey="claims" stroke="#d4a843" strokeWidth={2} dot={{ fill: '#d4a843', r: 3 }} name="Claims" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: "'DM Mono', monospace" }}>
              No trend data available from Python service
            </div>
          )}
        </Card>

        {/* Risk Distribution Pie */}
        <Card>
          <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 20px' }}>Claims Risk Distribution</h3>
          {riskPie.length > 0 && riskPie.some(r => r.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={riskPie} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                    {riskPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip {...TooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                {riskPie.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontFamily: "'DM Mono', monospace" }}>{item.name}</span>
                    </div>
                    <span style={{ color: '#fff', fontSize: '12px', fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{item.value || 0}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: "'DM Mono', monospace" }}>Awaiting fraud data</div>
          )}
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Top Agents Bar Chart */}
        <Card>
          <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 20px' }}>🏆 Top Agents by Premium</h3>
          {data.topAgents?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.topAgents?.slice(0, 5).map(a => ({ name: a.agent_name?.split(' ')[0], premium: Math.round(a.premium_collected / 100000) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: "'DM Mono', monospace" }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: "'DM Mono', monospace" }} />
                <Tooltip {...TooltipStyle} formatter={v => [`₹${v}L`, 'Premium']} />
                <Bar dataKey="premium" fill="#d4a843" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: "'DM Mono', monospace" }}>No agent data from Python service</div>
          )}
        </Card>

        {/* Claim Severity */}
        <Card>
          <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 20px' }}>Claim Severity Distribution</h3>
          {severityPie.length > 0 && severityPie.some(s => s.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={severityPie} cx="50%" cy="50%" outerRadius={65} dataKey="value">
                    {severityPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip {...TooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', justifyContent: 'center' }}>
                {severityPie.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontFamily: "'DM Mono', monospace" }}>{item.name.split(' ')[0]}: {item.value || 0}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: "'DM Mono', monospace" }}>Awaiting severity data</div>
          )}
        </Card>
      </div>

      {/* Loss Ratio + Region Risk */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <Card>
          <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 16px' }}>Loss Ratio Overview</h3>
          {data.loss ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Total Premium Collected', val: `₹${(data.loss.total_premium / 10000000).toFixed(1)}Cr`, color: '#4ade80' },
                  { label: 'Total Claims Paid', val: `₹${(data.loss.total_claims / 10000000).toFixed(1)}Cr`, color: '#fbbf24' },
                  { label: 'Loss Ratio', val: `${data.loss.loss_ratio_percent}%`, color: data.loss.loss_ratio_percent > 60 ? '#ef4444' : '#4ade80' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontFamily: "'DM Mono', monospace" }}>{item.label}</span>
                    <span style={{ color: item.color, fontSize: '13px', fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{item.val}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '14px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(data.loss.loss_ratio_percent, 100)}%`, height: '100%', background: data.loss.loss_ratio_percent > 60 ? '#ef4444' : '#4ade80', borderRadius: '3px', transition: 'width 1s ease' }} />
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontFamily: "'DM Mono', monospace", marginTop: '6px' }}>
                Target loss ratio: &lt;60% · {data.loss.loss_ratio_percent > 60 ? 'Currently above threshold ⚠' : 'Within target ✓'}
              </div>
            </>
          ) : (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', textAlign: 'center', padding: '30px', fontFamily: "'DM Mono', monospace" }}>Python service unavailable</div>
          )}
        </Card>

        {/* Region Risk */}
        <Card>
          <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 16px' }}>Region Risk Analysis</h3>
          {data.region?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.region} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: "'DM Mono', monospace" }} domain={[0, 100]} />
                <YAxis dataKey="region" type="category" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: "'DM Mono', monospace" }} width={80} />
                <Tooltip {...TooltipStyle} formatter={v => [`${v}`, 'Avg Fraud Score']} />
                <Bar dataKey="avg_fraud_score" radius={[0, 2, 2, 0]}>
                  {data.region.map((entry, i) => (
                    <Cell key={i} fill={entry.avg_fraud_score >= 70 ? '#ef4444' : entry.avg_fraud_score >= 40 ? '#fbbf24' : '#4ade80'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: "'DM Mono', monospace" }}>No region data from Python service</div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
