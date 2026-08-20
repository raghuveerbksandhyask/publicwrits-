'use client';

import { useState, useEffect } from 'react';

export default function AdminGeneratePage() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [draftsLoading, setDraftsLoading] = useState(false);

  const loadDrafts = () => {
    if (!password) return;
    setDraftsLoading(true);
    fetch('/api/drafts', {
      headers: { Authorization: `Bearer ${password}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setDrafts(data.drafts || []);
        setDraftsLoading(false);
      })
      .catch(() => {
        setDrafts([]);
        setDraftsLoading(false);
      });
  };

  useEffect(() => {
    if (password.length > 5) {
      loadDrafts();
    }
  }, [password]);

  const handleGenerate = async () => {
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch('/api/cron/generate-news', {
        headers: { Authorization: `Bearer ${password}` },
      });
      const data = await res.json();
      if (data.success) {
        setStatus(`Draft created: ${data.slug}`);
        loadDrafts();
      } else {
        setStatus(data.error || data.message || 'Failed');
      }
    } catch (e) {
      setStatus('Error: ' + e.message);
    }
    setLoading(false);
  };

  const handleAction = async (slug, action) => {
    setStatus('');
    try {
      const res = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ slug, action }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(action === 'approve' ? `Published: ${slug}` : `Deleted: ${slug}`);
        loadDrafts();
      } else {
        setStatus(data.error || 'Action failed');
      }
    } catch (e) {
      setStatus('Error: ' + e.message);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '28px 24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem' }}>PublicWrits</h1>
        <p style={{ margin: '0 0 24px', color: '#64748b' }}>Admin – Generate & Approve Drafts</p>

        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#475569' }}>
          Admin Password (CRON_SECRET)
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '15px',
            marginBottom: '16px',
            boxSizing: 'border-box',
          }}
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !password}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#94a3b8' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Generating…' : 'Generate New Draft'}
        </button>

        {status && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: status.includes('Error') || status.includes('Failed') ? '#fef2f2' : '#f0fdf4',
            color: status.includes('Error') || status.includes('Failed') ? '#b91c1c' : '#166534',
            borderRadius: '8px',
            fontSize: '14px',
          }}>
            {status}
          </div>
        )}
      </div>

      <div style={{
        marginTop: '28px',
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '1.15rem' }}>Pending Drafts</h2>

        {draftsLoading && <p style={{ color: '#64748b' }}>Loading drafts…</p>}

        {!draftsLoading && drafts.length === 0 && (
          <p style={{ color: '#94a3b8' }}>No pending drafts. Generate one above.</p>
        )}

        {drafts.map((d) => (
          <div key={d.slug} style={{
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '12px',
          }}>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>
              {d.title_kn || d.title_en || d.slug}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>
              {d.title_en} · {d.category} · {d.slug}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleAction(d.slug, 'approve')}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#16a34a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Approve & Publish
              </button>
              <button
                onClick={() => handleAction(d.slug, 'delete')}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#f1f5f9',
                  color: '#b91c1c',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
