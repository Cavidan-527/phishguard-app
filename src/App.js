// src/App.js
// PhishGuard - Phishing Simulation & Security Awareness Platform (Frontend)
// React.js — Dark Mode, pure inline CSS, 100% responsive

import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://phishguard-backend-smit.onrender.com';

// Wraps fetch with a hard timeout so the UI never stays stuck waiting
// forever on a slow/cold-starting backend (common on free hosting tiers).
async function fetchWithTimeout(url, options = {}, timeoutMs = 25000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(
        'Server vaxtında cavab vermədi (25san). Backend "yatmış" ola bilər (Render cold-start) — bir neçə saniyə sonra yenidən cəhd edin.'
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ---------------------------------------------------------------------------
// STATIC DATA
// ---------------------------------------------------------------------------
const TEMPLATES = [
  {
    id: 'it_password',
    title: 'IT — Şifrə Müddətinin Bitməsi',
    icon: '🔐',
    desc: 'İstifadəçini "şifrə bitir" bəhanəsi ilə saxta IT portalına yönləndirir.',
    difficulty: 'Yüksək Risk',
  },
  {
    id: 'hr_leave',
    title: 'HR — Məzuniyyət Müraciəti',
    icon: '📄',
    desc: 'HR adından göndərilən saxta məzuniyyət təsdiq bildirişi.',
    difficulty: 'Orta Risk',
  },
  {
    id: 'finance_invoice',
    title: 'Maliyyə — Ödənilməmiş Faktura',
    icon: '💰',
    desc: 'Təcili ödəniş tələb edən saxta faktura bildirişi.',
    difficulty: 'Yüksək Risk',
  },
];

const RISK_DATA = [
  { name: 'Əli Məmmədov', dept: 'Maliyyə', score: 82, level: 'High', emoji: '🔴' },
  { name: 'Günel Həsənova', dept: 'İT', score: 18, level: 'Low', emoji: '🟢' },
  { name: 'Rəşad Quliyev', dept: 'Satış', score: 64, level: 'Medium', emoji: '🟡' },
  { name: 'Aynur Əliyeva', dept: 'HR', score: 25, level: 'Low', emoji: '🟢' },
  { name: 'Tural Orucov', dept: 'Marketinq', score: 71, level: 'High', emoji: '🔴' },
  { name: 'Nigar Vəliyeva', dept: 'Maliyyə', score: 44, level: 'Medium', emoji: '🟡' },
];

// ---------------------------------------------------------------------------
// STYLES (pure inline, no external CSS libs)
// ---------------------------------------------------------------------------
const colors = {
  bg: '#0a0e17',
  bgPanel: '#111827',
  bgCard: '#161f2e',
  border: '#232e42',
  text: '#e5e9f0',
  textMuted: '#8893a6',
  accent: '#3b82f6',
  danger: '#ef4444',
  success: '#22c55e',
  warning: '#eab308',
};

const styles = {
  page: {
    minHeight: '100vh',
    background: colors.bg,
    color: colors.text,
    fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 24px',
    borderBottom: `1px solid ${colors.border}`,
    background: colors.bgPanel,
    flexWrap: 'wrap',
    gap: 12,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 22,
    fontWeight: 700,
  },
  nav: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  navBtn: (active) => ({
    padding: '10px 18px',
    borderRadius: 8,
    border: `1px solid ${active ? colors.accent : colors.border}`,
    background: active ? colors.accent : 'transparent',
    color: active ? '#fff' : colors.textMuted,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    transition: 'all 0.15s ease',
  }),
  container: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '28px 20px 60px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginBottom: 28,
  },
  statCard: {
    background: colors.bgCard,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: '20px',
  },
  statLabel: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 800,
  },
  panel: {
    background: colors.bgCard,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 18,
  },
  formRow: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  input: {
    flex: '1 1 220px',
    padding: '12px 14px',
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    background: colors.bg,
    color: colors.text,
    fontSize: 14,
    outline: 'none',
  },
  select: {
    flex: '1 1 200px',
    padding: '12px 14px',
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    background: colors.bg,
    color: colors.text,
    fontSize: 14,
    outline: 'none',
  },
  button: (disabled) => ({
    padding: '12px 22px',
    borderRadius: 8,
    border: 'none',
    background: disabled ? '#3b4252' : colors.accent,
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.15s ease',
    whiteSpace: 'nowrap',
  }),
  alertBox: (type) => ({
    marginTop: 16,
    padding: '14px 16px',
    borderRadius: 8,
    background: type === 'error' ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
    border: `1px solid ${type === 'error' ? colors.danger : colors.success}`,
    color: type === 'error' ? '#fca5a5' : '#86efac',
    fontSize: 14,
  }),
  previewLink: {
    display: 'inline-block',
    marginTop: 12,
    padding: '10px 16px',
    background: colors.warning,
    color: '#1a1a1a',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 14,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: `2px solid ${colors.border}`,
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  td: {
    padding: '12px',
    borderBottom: `1px solid ${colors.border}`,
    color: colors.text,
  },
  tableWrap: {
    overflowX: 'auto',
  },
  templateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 18,
  },
  templateCard: {
    background: colors.bgCard,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: 22,
  },
  badge: (level) => ({
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    background:
      level === 'High' || level === 'Yüksək Risk'
        ? 'rgba(239,68,68,0.15)'
        : level === 'Medium' || level === 'Orta Risk'
        ? 'rgba(234,179,8,0.15)'
        : 'rgba(34,197,94,0.15)',
    color:
      level === 'High' || level === 'Yüksək Risk'
        ? '#fca5a5'
        : level === 'Medium' || level === 'Orta Risk'
        ? '#fde68a'
        : '#86efac',
  }),
};

// ---------------------------------------------------------------------------
// LANDING (FAKE PHISHING) PAGE COMPONENT
// ---------------------------------------------------------------------------
function LandingPage() {
  const [stage, setStage] = useState('login'); // 'login' | 'training'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setError('');
      try {
        await fetchWithTimeout(
          `${API_BASE}/api/track`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: username }),
          },
          10000
        );
      } catch (err) {
        setError('Qeydiyyat zamanı şəbəkə xətası (davam edilir).');
      } finally {
        setSubmitting(false);
        setStage('training');
      }
    },
    [username]
  );

  if (stage === 'training') {
    return (
      <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div
          style={{
            maxWidth: 560,
            background: colors.bgCard,
            border: `1px solid ${colors.danger}`,
            borderRadius: 16,
            padding: 36,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>🚨</div>
          <h1 style={{ color: colors.danger, marginBottom: 10 }}>DİQQƏT! Bu bir Fişinq Simulyasiyası idi</h1>
          <p style={{ color: colors.textMuted, marginBottom: 20, lineHeight: 1.6 }}>
            Siz hazırda şirkətin daxili təhlükəsizlik maarifləndirmə proqramının bir hissəsi olan saxta fişinq
            e-poçtundakı linkə klikləyib, öz məlumatlarınızı daxil etdiniz. Real bir hücumda bu məlumatlar
            hücumçunun əlinə keçə bilərdi.
          </p>
          <div style={{ textAlign: 'left', background: colors.bg, borderRadius: 10, padding: 18, marginBottom: 18 }}>
            <h3 style={{ marginTop: 0, color: colors.text }}>Nələrə diqqət etməli idiniz?</h3>
            <ul style={{ color: colors.textMuted, lineHeight: 1.8, paddingLeft: 20 }}>
              <li>Göndərənin e-poçt ünvanı şübhəli və ya naməlum domen idi.</li>
              <li>Mesajda "təcili", "dərhal", "24 saat ərzində" kimi təzyiq yaradan ifadələr var idi.</li>
              <li>Link ünvanı şirkətin rəsmi domeni ilə üst-üstə düşmürdü.</li>
              <li>Şifrə və ya şəxsi məlumat tələb edən formalar həmişə şübhə doğurmalıdır.</li>
              <li>Şübhəli hesab etdiyiniz e-poçtları həmişə IT Təhlükəsizlik şöbəsinə bildirin.</li>
            </ul>
          </div>
          <p style={{ fontSize: 13, color: colors.textMuted }}>
            Bu təlim PhishGuard Fişinq Simulyasiyası Platforması tərəfindən həyata keçirilmişdir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#fff',
          color: '#1a1a1a',
          borderRadius: 10,
          padding: 36,
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>🏢</div>
          <h2 style={{ margin: 0 }}>Korporativ IT Portalı</h2>
          <p style={{ color: '#666', fontSize: 13, marginTop: 6 }}>Hesabınıza daxil olun</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="İstifadəçi adı / E-poçt"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 14px',
              marginBottom: 12,
              borderRadius: 6,
              border: '1px solid #ccc',
              fontSize: 14,
              boxSizing: 'border-box',
            }}
          />
          <input
            type="password"
            placeholder="Şifrə"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 14px',
              marginBottom: 18,
              borderRadius: 6,
              border: '1px solid #ccc',
              fontSize: 14,
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 6,
              border: 'none',
              background: submitting ? '#999' : '#0d1b2a',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Daxil olunur...' : 'Daxil Ol'}
          </button>
          {error && <p style={{ color: '#b00020', fontSize: 12, marginTop: 10 }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DASHBOARD TAB
// ---------------------------------------------------------------------------
function DashboardTab({ stats, refreshStats }) {
  const [email, setEmail] = useState('');
  const [template, setTemplate] = useState(TEMPLATES[0].id);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', message, previewUrl }

  const clickRate = stats.sent > 0 ? ((stats.clicks / stats.sent) * 100).toFixed(1) : '0.0';

  const sendSimulation = useCallback(
    async (e) => {
      e.preventDefault();
      if (!email) return;

      setLoading(true);
      setFeedback(null);

      try {
        const res = await fetchWithTimeout(
          `${API_BASE}/api/send`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, template }),
          },
          45000
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Bilinməyən xəta baş verdi.');
        }

        setFeedback({
          type: 'success',
          message: data.message || 'Simulyasiya uğurla göndərildi.',
          previewUrl: data.previewUrl,
          deliveryMode: data.deliveryMode || 'real',
        });

        setEmail('');
        await refreshStats();
      } catch (err) {
        setFeedback({
          type: 'error',
          message: err.message || 'Şəbəkə xətası baş verdi. Zəhmət olmasa yenidən cəhd edin.',
        });
      } finally {
        // Loading state is ALWAYS reset, regardless of success or failure
        setLoading(false);
      }
    },
    [email, template, refreshStats]
  );

  return (
    <div>
      {/* STATS CARDS */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Göndərilən Simulyasiya</div>
          <div style={{ ...styles.statValue, color: colors.accent }}>{stats.sent}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Tələyə Düşənlər</div>
          <div style={{ ...styles.statValue, color: colors.danger }}>{stats.clicks}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Təhlükə Riski (Click Rate)</div>
          <div style={{ ...styles.statValue, color: colors.warning }}>{clickRate}%</div>
        </div>
      </div>

      {/* SEND FORM */}
      <div style={styles.panel}>
        <div style={styles.panelTitle}>📨 Yeni Fişinq Simulyasiyası Göndər</div>
        <form onSubmit={sendSimulation}>
          <div style={styles.formRow}>
            <input
              type="email"
              placeholder="hedef@sirket.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <select value={template} onChange={(e) => setTemplate(e.target.value)} style={styles.select}>
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.icon} {t.title}
                </option>
              ))}
            </select>
            <button type="submit" disabled={loading} style={styles.button(loading)}>
              {loading ? 'Göndərilir...' : 'Simulyasiyanı Göndər'}
            </button>
          </div>
        </form>

        {feedback && (
          <div style={styles.alertBox(feedback.type)}>
            <div>
              {feedback.message}
              {feedback.deliveryMode === 'simulated' && (
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: 'rgba(234,179,8,0.2)',
                    color: '#fde68a',
                    fontWeight: 700,
                  }}
                >
                  SİMULYASİYA REJİMİ
                </span>
              )}
            </div>
            {feedback.previewUrl && (
              <a
                href={feedback.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.previewLink}
              >
                📬 {feedback.deliveryMode === 'simulated' ? 'E-poçt Məzmununa Bax' : 'Gələn E-poçtu Aç (Inbox Preview)'}
              </a>
            )}
          </div>
        )}
      </div>

      {/* LOGS TABLE */}
      <div style={styles.panel}>
        <div style={styles.panelTitle}>📋 Kampaniya Logları</div>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Hədəf Email</th>
                <th style={styles.th}>Vaxt</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.logs.length === 0 ? (
                <tr>
                  <td style={styles.td} colSpan={3}>
                    <span style={{ color: colors.textMuted }}>Hələ heç bir log yoxdur.</span>
                  </td>
                </tr>
              ) : (
                stats.logs.map((log) => (
                  <tr key={log.id}>
                    <td style={styles.td}>{log.email}</td>
                    <td style={styles.td}>{new Date(log.time).toLocaleString('az-AZ')}</td>
                    <td style={styles.td}>{log.statusLabel}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TEMPLATES TAB
// ---------------------------------------------------------------------------
function TemplatesTab() {
  return (
    <div style={styles.panel}>
      <div style={styles.panelTitle}>🧩 Fişinq Şablonları</div>
      <div style={styles.templateGrid}>
        {TEMPLATES.map((t) => (
          <div key={t.id} style={styles.templateCard}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{t.icon}</div>
            <h3 style={{ margin: '0 0 8px 0' }}>{t.title}</h3>
            <p style={{ color: colors.textMuted, fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>{t.desc}</p>
            <span style={styles.badge(t.difficulty)}>{t.difficulty}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RISK SCORING TAB
// ---------------------------------------------------------------------------
function RiskScoringTab() {
  return (
    <div style={styles.panel}>
      <div style={styles.panelTitle}>📊 Əməkdaş və Şöbə Risk Qiymətləndirməsi</div>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Əməkdaş</th>
              <th style={styles.th}>Şöbə</th>
              <th style={styles.th}>Risk Balı</th>
              <th style={styles.th}>Səviyyə</th>
            </tr>
          </thead>
          <tbody>
            {RISK_DATA.map((r, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{r.name}</td>
                <td style={styles.td}>{r.dept}</td>
                <td style={styles.td}>{r.score}/100</td>
                <td style={styles.td}>
                  <span style={styles.badge(r.level)}>
                    {r.emoji} {r.level === 'High' ? 'Yüksək' : r.level === 'Medium' ? 'Orta' : 'Aşağı'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN APP COMPONENT
// ---------------------------------------------------------------------------
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ sent: 0, clicks: 0, lastPreviewUrl: null, logs: [] });
  const [isLanding, setIsLanding] = useState(false);

  useEffect(() => {
    setIsLanding(window.location.pathname === '/landing');
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/stats`, {}, 15000);
      if (!res.ok) throw new Error('Stats sorğusu uğursuz oldu.');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Stats yüklənmədi:', err.message);
    }
  }, []);

  useEffect(() => {
    if (!isLanding) {
      refreshStats();
      const interval = setInterval(refreshStats, 8000);
      return () => clearInterval(interval);
    }
  }, [isLanding, refreshStats]);

  if (isLanding) {
    return <LandingPage />;
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <span>🛡️</span>
          <span>
            Phish<span style={{ color: colors.accent }}>Guard</span>
          </span>
        </div>
        <nav style={styles.nav}>
          <button style={styles.navBtn(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </button>
          <button style={styles.navBtn(activeTab === 'templates')} onClick={() => setActiveTab('templates')}>
            Templates
          </button>
          <button style={styles.navBtn(activeTab === 'risk')} onClick={() => setActiveTab('risk')}>
            Risk Scoring
          </button>
        </nav>
      </header>

      <div style={styles.container}>
        {activeTab === 'dashboard' && <DashboardTab stats={stats} refreshStats={refreshStats} />}
        {activeTab === 'templates' && <TemplatesTab />}
        {activeTab === 'risk' && <RiskScoringTab />}
      </div>
    </div>
  );
}

export default App;
