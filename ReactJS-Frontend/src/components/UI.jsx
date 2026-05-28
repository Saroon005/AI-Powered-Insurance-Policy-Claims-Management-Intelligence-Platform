// Stat Card
export const StatCard = ({ label, value, sub, subColor = '#4ade80', accent = '#d4a843' }) => (
  <div style={{
    background: 'linear-gradient(135deg, #0d1421 0%, #111827 100%)',
    border: `1px solid rgba(${hexToRgb(accent)},0.25)`,
    borderTop: `2px solid ${accent}`,
    borderRadius: '8px',
    padding: '24px',
    flex: 1,
  }}>
    <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '28px', fontWeight: 700, fontFamily: "'Cinzel', serif" }}>{value}</div>
    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", marginTop: '4px' }}>{label}</div>
    {sub && <div style={{ color: subColor, fontSize: '11px', marginTop: '6px', fontFamily: "'DM Mono', monospace" }}>{sub}</div>}
  </div>
);

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

// Status Badge
export const Badge = ({ status }) => {
  const map = {
    ACTIVE: { bg: 'rgba(74,222,128,0.15)', color: '#4ade80', label: 'Active' },
    LAPSED: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', label: 'Lapsed' },
    EXPIRED: { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8', label: 'Expired' },
    CANCELLED: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Cancelled' },
    RENEWED: { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa', label: 'Renewed' },
    SUBMITTED: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', label: 'Submitted' },
    IN_REVIEW: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', label: 'In Review' },
    APPROVED: { bg: 'rgba(74,222,128,0.15)', color: '#4ade80', label: 'Approved' },
    REJECTED: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Rejected' },
    SETTLED: { bg: 'rgba(74,222,128,0.15)', color: '#4ade80', label: 'Settled' },
    ESCALATED: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Escalated' },
    HIGH_RISK: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'High Risk' },
    MEDIUM_RISK: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', label: 'Medium Risk' },
    LOW_RISK: { bg: 'rgba(74,222,128,0.15)', color: '#4ade80', label: 'Low Risk' },
    'HIGH RISK': { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'High Risk' },
    'MEDIUM RISK': { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', label: 'Medium Risk' },
    'LOW RISK': { bg: 'rgba(74,222,128,0.15)', color: '#4ade80', label: 'Low Risk' },
  };
  const s = map[status] || { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8', label: status };
  return (
    <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '4px', fontSize: '10px', fontFamily: "'DM Mono', monospace", letterSpacing: '1px', textTransform: 'uppercase' }}>
      {s.label}
    </span>
  );
};

// Button
export const Btn = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, style: extraStyle }) => {
  const variants = {
    primary: { background: '#d4a843', color: '#000', border: 'none' },
    danger: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
    ghost: { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' },
    success: { background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' },
    warning: { background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' },
  };
  const sizes = {
    sm: { padding: '5px 12px', fontSize: '10px' },
    md: { padding: '8px 18px', fontSize: '11px' },
    lg: { padding: '12px 28px', fontSize: '13px' },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant], ...sizes[size],
        borderRadius: '4px', cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: "'DM Mono', monospace", letterSpacing: '1.5px', textTransform: 'uppercase',
        fontWeight: 600, transition: 'all 0.2s', opacity: disabled ? 0.5 : 1,
        ...extraStyle
      }}
    >
      {children}
    </button>
  );
};

// Input
export const Input = ({ label, value, onChange, type = 'text', placeholder, required, options, style: extraStyle }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...extraStyle }}>
    {label && <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>{label}</label>}
    {options ? (
      <select value={value} onChange={e => onChange(e.target.value)} required={required} style={inputStyle}>
        <option value="">Select...</option>
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} style={inputStyle} />
    )}
  </div>
);

const inputStyle = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '4px', padding: '10px 14px', color: '#fff', fontSize: '13px',
  fontFamily: "'DM Mono', monospace", outline: 'none', width: '100%', boxSizing: 'border-box',
};

// Section Title
export const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: '24px' }}>
    <h1 style={{ color: '#fff', fontFamily: "'Cinzel', serif", fontSize: '26px', margin: 0, fontWeight: 700 }}>{children}</h1>
    {sub && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: "'DM Mono', monospace", marginTop: '4px', letterSpacing: '1px' }}>{sub}</p>}
  </div>
);

// Card container
export const Card = ({ children, style: extraStyle }) => (
  <div style={{
    background: 'linear-gradient(135deg, #0d1421 0%, #111827 100%)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '8px', padding: '24px',
    ...extraStyle
  }}>
    {children}
  </div>
);

// Loading spinner
export const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px' }}>
    <div style={{ width: '36px', height: '36px', border: '2px solid rgba(212,168,67,0.2)', borderTop: '2px solid #d4a843', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// Table
export const Table = ({ columns, data, onRowClick }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Mono', monospace" }}>
      <thead>
        <tr style={{ borderBottom: '1px solid rgba(212,168,67,0.2)' }}>
          {columns.map(col => (
            <th key={col.key} style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'left', whiteSpace: 'nowrap' }}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.length === 0 && (
          <tr><td colSpan={columns.length} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '40px', fontSize: '12px' }}>No records found</td></tr>
        )}
        {data?.map((row, i) => (
          <tr key={i}
            onClick={() => onRowClick?.(row)}
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: onRowClick ? 'pointer' : 'default', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {columns.map(col => (
              <td key={col.key} style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.8)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Modal
export const Modal = ({ title, children, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
    <div style={{ background: '#0d1421', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '8px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: '#d4a843', fontFamily: "'Cinzel', serif", margin: 0, fontSize: '16px' }}>{title}</h3>
        <span onClick={onClose} style={{ color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '18px' }}>⊗</span>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  </div>
);
