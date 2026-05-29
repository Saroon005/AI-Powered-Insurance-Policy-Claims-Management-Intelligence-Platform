import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi, register as registerApi } from '../services/api';

const roleRoutes = {
  ADMIN: '/admin', CLAIMS_MANAGER: '/admin',
  AGENT: '/agent', CUSTOMER: '/customer',
};

export default function Login() {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await loginApi({ email, password });
      login(res.data);
      navigate(roleRoutes[res.data.role] || '/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await registerApi({ name, email, password, role });
      login(res.data);
      navigate(roleRoutes[res.data.role] || '/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#080c14',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Mono', monospace",
      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212,168,67,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(96,165,250,0.04) 0%, transparent 50%)',
    }}>
      {/* Decorative grid */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '32px', color: '#d4a843', marginBottom: '8px' }}>◈</div>
          <h1 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '24px', letterSpacing: '4px', margin: 0 }}>InsuranceIQ</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', marginTop: '6px' }}>Policy & Claims Intelligence Platform</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0d1421 0%, #111827 100%)',
          border: '1px solid rgba(212,168,67,0.2)',
          borderRadius: '12px', overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }}
                style={{
                  flex: 1, padding: '14px', background: 'none', border: 'none',
                  color: tab === t ? '#d4a843' : 'rgba(255,255,255,0.3)',
                  borderBottom: tab === t ? '2px solid #d4a843' : '2px solid transparent',
                  cursor: 'pointer', fontFamily: "'DM Mono', monospace",
                  fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
                  transition: 'all 0.2s',
                }}>
                {t}
              </button>
            ))}
          </div>

          <div style={{ padding: '32px' }}>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', padding: '10px 14px', color: '#ef4444', fontSize: '11px', marginBottom: '20px' }}>
                {error}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <Field label="Email Address" value={email} onChange={setEmail} type="email" placeholder="admin@insuranceiq.in" />
                <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••••••" />
                <button type="submit" disabled={loading} style={btnStyle}>
                  {loading ? 'Signing In...' : 'Sign In →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <Field label="Full Name" value={name} onChange={setName} placeholder="Enter full name" />
                <Field label="Email Address" value={email} onChange={setEmail} type="email" placeholder="email@insuranceiq.in" />
                <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••••••" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={labelStyle}>Role</label>
                  <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>
                    <option value="ADMIN">Admin</option>
                    <option value="AGENT">Agent</option>
                    <option value="CUSTOMER">Customer</option>
                    <option value="CLAIMS_MANAGER">Claims Manager</option>
                  </select>
                </div>
                <button type="submit" disabled={loading} style={btnStyle}>
                  {loading ? 'Creating Account...' : 'Create Account →'}
                </button>
              </form>
            )}

            <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '16px', color: 'rgba(255,255,255,0.2)', fontSize: '10px', letterSpacing: '1px', textAlign: 'center' }}>
              API: POST /api/auth/{tab} · JWT + RBAC
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '10px', marginTop: '24px', letterSpacing: '1px' }}>
          InsuranceIQ v1.0 · AI-Powered Intelligence Platform
        </p>
      </div>
    </div>
  );
}

const Field = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={labelStyle}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required
      style={inputStyle} />
  </div>
);

const labelStyle = { color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase' };
const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '11px 14px', color: '#fff', fontSize: '13px', fontFamily: "'DM Mono', monospace", outline: 'none', width: '100%', boxSizing: 'border-box' };
const btnStyle = { background: '#d4a843', color: '#000', border: 'none', borderRadius: '4px', padding: '13px', fontSize: '12px', fontFamily: "'DM Mono', monospace", letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s' };
