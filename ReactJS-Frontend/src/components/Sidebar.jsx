import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const navItems = {
  ADMIN: [
    { path: '/admin', label: 'Dashboard', icon: '⬡' },
    { path: '/customers', label: 'Customers', icon: '◈' },
    { path: '/agents', label: 'Agents', icon: '◉' },
    { path: '/policies', label: 'Policies', icon: '◫' },
    { path: '/claims-assessment', label: 'Claims', icon: '◎' },
    { path: '/fraud', label: 'Fraud Detection', icon: '⚠' },
    { path: '/analytics', label: 'Analytics', icon: '▦' },
    { path: '/notifications', label: 'Notifications', icon: '◌' },
  ],
  AGENT: [
    { path: '/agent', label: 'Dashboard', icon: '⬡' },
    { path: '/customers', label: 'Customers', icon: '◈' },
    { path: '/policies', label: 'Policies', icon: '◫' },
    { path: '/claims', label: 'File Claim', icon: '◎' },
    { path: '/notifications', label: 'Notifications', icon: '◌' },
  ],
  CUSTOMER: [
    { path: '/customer', label: 'My Portfolio', icon: '⬡' },
    { path: '/claims', label: 'File Claim', icon: '◎' },
    { path: '/notifications', label: 'Notifications', icon: '◌' },
  ],
  CLAIMS_MANAGER: [
    { path: '/admin', label: 'Dashboard', icon: '⬡' },
    { path: '/claims-assessment', label: 'Claims Queue', icon: '◎' },
    { path: '/fraud', label: 'Fraud Reports', icon: '⚠' },
    { path: '/analytics', label: 'Analytics', icon: '▦' },
    { path: '/notifications', label: 'Notifications', icon: '◌' },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const items = navItems[user?.role] || [];

  return (
    <aside style={{
      width: collapsed ? '64px' : '220px',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0e1a 0%, #0d1421 100%)',
      borderRight: '1px solid rgba(212,168,67,0.15)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      position: 'fixed',
      left: 0, top: 0, bottom: 0,
      zIndex: 100,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 16px',
        borderBottom: '1px solid rgba(212,168,67,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
      }} onClick={() => setCollapsed(!collapsed)}>
        <span style={{ fontSize: '22px', color: '#d4a843', flexShrink: 0 }}>◈</span>
        {!collapsed && (
          <div>
            <div style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", fontSize: '14px', fontWeight: 700, letterSpacing: '2px' }}>InsuranceIQ</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase' }}>{user?.role}</div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
        {items.map(item => {
          const active = location.pathname === item.path;
          const isNotif = item.path === '/notifications';
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 16px',
                cursor: 'pointer',
                background: active ? 'rgba(212,168,67,0.1)' : 'transparent',
                borderLeft: active ? '2px solid #d4a843' : '2px solid transparent',
                transition: 'all 0.2s',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '16px', color: active ? '#d4a843' : 'rgba(255,255,255,0.5)', flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span style={{ fontSize: '12px', color: active ? '#d4a843' : 'rgba(255,255,255,0.6)', fontFamily: "'DM Mono', monospace", letterSpacing: '1px', textTransform: 'uppercase' }}>{item.label}</span>}
              {isNotif && unreadCount > 0 && (
                <span style={{
                  position: 'absolute', right: '12px',
                  background: '#e85d5d', color: '#fff', fontSize: '10px',
                  borderRadius: '10px', padding: '1px 6px', fontWeight: 700
                }}>{unreadCount}</span>
              )}
            </div>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(212,168,67,0.1)' }}>
        {!collapsed && (
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontFamily: "'DM Mono', monospace", marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
        )}
        <div
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
            fontSize: '11px', fontFamily: "'DM Mono', monospace",
            padding: '6px 4px', transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#e85d5d'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
        >
          <span>⊗</span>
          {!collapsed && 'SIGN OUT'}
        </div>
      </div>
    </aside>
  );
}
