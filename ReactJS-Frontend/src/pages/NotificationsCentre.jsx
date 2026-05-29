import { useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, SectionTitle } from '../components/UI';
import { useNotifications } from '../context/NotificationContext';

const typeStyles = {
  CLAIM_FILED: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', label: 'New Claim', icon: '🔔' },
  CLAIM_STATUS_UPDATED: { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', label: 'Status Update', icon: '◎' },
  FRAUD_SCORE_GENERATED: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Fraud Alert', icon: '⚠' },
  POLICY_RENEWAL_DUE: { color: '#f97316', bg: 'rgba(249,115,22,0.1)', label: 'Renewal Alert', icon: '🔔' },
  PREMIUM_PAYMENT_RECEIVED: { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', label: 'Payment', icon: '💳' },
  CLAIM_SETTLED: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', label: 'Settled', icon: '✓' },
};

const SOCKET_EVENTS = [
  { name: 'claimFiled', desc: 'Customer/Agent → Claims Manager', color: '#ef4444' },
  { name: 'claimStatusUpdated', desc: 'PUT /api/claims/{id}/status → Customer + Agent', color: '#fbbf24' },
  { name: 'fraudScoreGenerated', desc: 'Python ML response → Claims Manager alert', color: '#60a5fa' },
  { name: 'policyRenewalDue', desc: 'Cron trigger → Customer + Agent (30/7/1 day)', color: '#8b5cf6' },
  { name: 'premiumPaymentReceived', desc: 'Payment gateway callback → Customer', color: '#4ade80' },
  { name: 'claimSettled', desc: 'Finance closure → Customer + Finance', color: '#34d399' },
];

export default function NotificationsCentre() {
  const { notifications, unreadCount, markAllRead } = useNotifications();

  useEffect(() => {
    markAllRead();
  }, []);

  const getTimeAgo = (ts) => {
    if (!ts) return 'Just now';
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontFamily: "'DM Mono', monospace", letterSpacing: '2px', margin: '0 0 4px', textTransform: 'uppercase' }}>Module 6 · NodeJS + Socket.IO</p>
          <h1 style={{ color: '#fff', fontFamily: "'Cinzel', serif", fontSize: '26px', margin: 0 }}>Notifications Centre</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: "'DM Mono', monospace", marginTop: '4px' }}>Real-time event alerts via Socket.IO · Spring Boot → NodeJS → Browser WebSocket</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '20px', padding: '5px 12px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 1.5s infinite' }} />
            <span style={{ color: '#4ade80', fontSize: '10px', fontFamily: "'DM Mono', monospace", letterSpacing: '1px' }}>LIVE</span>
          </div>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Live Feed */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: 0 }}>Live Notifications</h3>
            {notifications.length > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', fontSize: '10px', borderRadius: '10px', padding: '2px 8px', fontFamily: "'DM Mono', monospace" }}>{notifications.length}</span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.3 }}>◌</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: "'DM Mono', monospace" }}>No notifications yet. Waiting for events...</div>
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', fontFamily: "'DM Mono', monospace", marginTop: '8px' }}>
                Events fire when claims are filed, status updated, or fraud detected
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflowY: 'auto' }}>
              {notifications.map((notif) => {
                const style = typeStyles[notif.type] || { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', label: notif.type, icon: '●' };
                return (
                  <div key={notif.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    background: style.bg, border: `1px solid ${style.color}20`,
                    borderRadius: '6px', padding: '12px 14px',
                    animation: 'slideIn 0.3s ease',
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: style.color, flexShrink: 0, marginTop: '5px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#fff', fontSize: '13px', fontFamily: "'DM Mono', monospace" }}>{notif.title || notif.type?.replace(/_/g, ' ')}</div>
                      {notif.message && <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '2px', fontFamily: "'DM Mono', monospace" }}>{notif.message}</div>}
                      {notif.claimId && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginTop: '3px' }}>Claim: {notif.claimId}</div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                      <span style={{ background: style.bg, color: style.color, fontSize: '9px', padding: '2px 6px', borderRadius: '3px', fontFamily: "'DM Mono', monospace", letterSpacing: '1px' }}>{style.label}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontFamily: "'DM Mono', monospace" }}>{getTimeAgo(notif.timestamp)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }`}</style>
        </Card>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Socket Events */}
          <Card>
            <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 16px' }}>Socket.IO Event Types</h3>
            {SOCKET_EVENTS.map((event, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: i < SOCKET_EVENTS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ width: '3px', height: '36px', background: event.color, borderRadius: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#fff', fontSize: '12px', fontFamily: "'DM Mono', monospace" }}>{event.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '2px', fontFamily: "'DM Mono', monospace" }}>{event.desc}</div>
                </div>
              </div>
            ))}
          </Card>

          {/* Architecture */}
          <Card>
            <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', margin: '0 0 16px' }}>Socket Architecture</h3>
            {[
              { label: 'Browser Client (React)', sub: '↕ WebSocket (ws://)', color: '#60a5fa' },
              { label: 'NodeJS Socket.IO Server', sub: '↕ HTTP Event Emitter :5001', color: '#fbbf24' },
              { label: 'Spring Boot API Server', sub: '↕ Spring Data JPA :8081', color: '#4ade80' },
              { label: 'MySQL Database', sub: 'insurance_iq', color: '#a78bfa' },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>
                <div style={{ color: item.color, fontSize: '12px', fontFamily: "'DM Mono', monospace" }}>{item.label}</div>
                {i < 3 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontFamily: "'DM Mono', monospace", paddingLeft: '4px', margin: '2px 0' }}>{item.sub}</div>}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
