import React, { useState } from 'react';

// Saxta Təlim və Landing Səhifəsi Component-i
function LandingPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('https://phishguard-api.onrender.com/api/track', { method: 'POST' });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ padding: '60px', fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h1 style={{ color: '#e74c3c' }}>🚨 DİQQƏT! PhishGuard Fişinq Simulyasiyası</h1>
          <p style={{ fontSize: '18px', color: '#2c3e50' }}>Siz az əvvəl simulyasiya edilmiş təhlükəli forma məlumatı daxil etdiniz!</p>
          <hr />
          <div style={{ textAlign: 'left', background: '#edf2f7', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
            <h4 style={{ color: '#2c3e50', marginTop: 0 }}>💡 Nəyə diqqət etməli idiniz?</h4>
            <ul style={{ color: '#4a5568', lineHeight: '1.6' }}>
              <li>Göndərən ünvanın domeninə (IT-Support@your-company.com)[cite: 5]</li>
              <li>Səhifənin daxil olduğu domeni rəsmi portal ilə müqayisə edin</li>
              <li>Məktubdakı təcili təzyiq hissinə ("24 saat ərzində")[cite: 5]</li>
            </ul>
          </div>
          <button onClick={() => window.location.href = "/"} style={{ background: '#27ae60', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
            Anladım, Təlimi Bitir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '60px', fontFamily: 'Arial, sans-serif', backgroundColor: '#edf2f7', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '8px', maxWidth: '380px', width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <h2 style={{ color: '#2b6cb0', marginBottom: '8px' }}>🏢 Şirkət İT Portalı</h2>
        <p style={{ color: '#718096', fontSize: '14px', marginBottom: '24px' }}>Təhlükəsizlik yenilənməsi: Hesabınızın bloklanmaması üçün şifrənizi təsdiqləyin.</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', color: '#4a5568', fontWeight: 'bold' }}>İstifadəçi Adı / Email</label>
            <input type="text" placeholder="user@company.com" required style={{ width: '100%', padding: '10px', marginTop: '4px', border: '1px solid #cbd5e0', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
          
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', color: '#4a5568', fontWeight: 'bold' }}>Cari Şifrə</label>
            <input type="password" placeholder="••••••••" required style={{ width: '100%', padding: '10px', marginTop: '4px', border: '1px solid #cbd5e0', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" style={{ width: '100%', background: '#e53e3e', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}>
            Hesabı Təsdiqlə
          </button>
        </form>
      </div>
    </div>
  );
}

// Main App Dashboard (80% Feature UI)
export default function App() {
  const [email, setEmail] = useState('');
  const [template, setTemplate] = useState('it_support');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats] = useState({ sent: 24, clicks: 5, lastPreviewUrl: '', logs: [] });

  if (window.location.pathname === '/landing') {
    return <LandingPage />;
  }

  const clickRate = stats.sent > 0 ? Math.round((stats.clicks / stats.sent) * 100) : 0;

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#1e1e2f', color: '#fff', minHeight: '100vh' }}>
      {/* HEADER & NAV */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #3b3b58', paddingBottom: '15px', marginBottom: '25px' }}>
        <h2>🛡️ PhishGuard Platform (80% Completed UI)</h2>
        <div>
          <button onClick={() => setActiveTab('dashboard')} style={{ background: activeTab === 'dashboard' ? '#3498db' : '#2d2d44', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>Dashboard</button>
          <button onClick={() => setActiveTab('templates')} style={{ background: activeTab === 'templates' ? '#3498db' : '#2d2d44', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>Templates</button>
          <button onClick={() => setActiveTab('risk')} style={{ background: activeTab === 'risk' ? '#3498db' : '#2d2d44', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '5px', cursor: 'pointer' }}>Risk Scoring</button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <>
          {/* STATS KARTLARI */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: '#2d2d44', padding: '20px', borderRadius: '8px', flex: 1, borderLeft: '5px solid #3498db' }}>
              <h3>Ümumi Göndərilən</h3>
              <h1 style={{ color: '#3498db' }}>{stats.sent}</h1>
            </div>
            <div style={{ background: '#2d2d44', padding: '20px', borderRadius: '8px', flex: 1, borderLeft: '5px solid #e74c3c' }}>
              <h3>Tələyə Düşənlər (Clicks)</h3>
              <h1 style={{ color: '#e74c3c' }}>{stats.clicks}</h1>
            </div>
            <div style={{ background: '#2d2d44', padding: '20px', borderRadius: '8px', flex: 1, borderLeft: '5px solid #f1c40f' }}>
              <h3>Təhlükə Riski (Click Rate)</h3>
              <h1 style={{ color: '#f1c40f' }}>{clickRate}%</h1>
            </div>
          </div>

          {/* KAMPANİYA BAŞLATMA FORMASI */}
          <div style={{ background: '#2d2d44', padding: '25px', borderRadius: '8px', marginBottom: '30px' }}>
            <h3>🚀 Simulyasiya Kampaniyası Yaradın</h3>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Hədəf Əməkdaşın Email-i" 
                style={{ padding: '12px', width: '300px', borderRadius: '4px', border: 'none' }}
              />
              <select 
                value={template} 
                onChange={e => setTemplate(e.target.value)}
                style={{ padding: '12px', borderRadius: '4px', border: 'none', background: '#3b3b58', color: '#fff' }}
              >
                <option value="it_support">IT Support - Şifrə Yeniləməsi</option>
                <option value="hr_notice">HR Notice - Məzuniyyət Qrafiki</option>
                <option value="finance_invoice">Finance - Təcili Invoice Ödənişi</option>
              </select>
              <button onClick={() => alert("Kampaniya deploy olunmuş serverdən göndərildi!")} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Kampaniyanı Başlat
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'templates' && (
        <div style={{ background: '#2d2d44', padding: '25px', borderRadius: '8px' }}>
          <h3>📧 Fişinq Şablonları Kitabxanası</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
            <div style={{ background: '#3b3b58', padding: '15px', borderRadius: '8px' }}>
              <h4>🔐 IT Password Expiration</h4>
              <p style={{ fontSize: '13px', color: '#ccc' }}>İstifadəçiyə hesabının dondurulmaması üçün təcili linkə daxil olmasını tələb edir.</p>
            </div>
            <div style={{ background: '#3b3b58', padding: '15px', borderRadius: '8px' }}>
              <h4>🏖️ HR Leave Request</h4>
              <p style={{ fontSize: '13px', color: '#ccc' }}>Məzuniyyət günlərinin təsdiqlənməsi adı ilə saxta link təqdim edir.</p>
            </div>
            <div style={{ background: '#3b3b58', padding: '15px', borderRadius: '8px' }}>
              <h4>💳 Unpaid Invoice Notice</h4>
              <p style={{ fontSize: '13px', color: '#ccc' }}>Maliyyə şöbəsi adından ödəniş tələb edən inandırıcı e-poçt şablonu.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'risk' && (
        <div style={{ background: '#2d2d44', padding: '25px', borderRadius: '8px' }}>
          <h3>🎯 Əməkdaşlar üzrə Risk Scoring</h3>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #555', color: '#aaa' }}>
                <th style={{ padding: '10px' }}>Əməkdaş</th>
                <th>Şöbə</th>
                <th>Test Sayı</th>
                <th>Tələyə Düşmə</th>
                <th>Risk Statusu</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #3b3b58' }}>
                <td style={{ padding: '12px 10px' }}>cavid@holberton.az</td>
                <td>Frontend Dev</td>
                <td>3</td>
                <td>2</td>
                <td style={{ color: '#e74c3c', fontWeight: 'bold' }}>High Risk 🔴</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #3b3b58' }}>
                <td style={{ padding: '12px 10px' }}>omer@holberton.az</td>
                <td>Backend Dev</td>
                <td>3</td>
                <td>0</td>
                <td style={{ color: '#2ecc71', fontWeight: 'bold' }}>Low Risk 🟢</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
