'use client';

import { useState } from 'react';

export default function GenerateAdminPage() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');

  const handleGenerate = async () => {
    if (!password) {
      setMessage('Please enter the admin password (CRON_SECRET)');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('Generating article… this can take 15–40 seconds');

    try {
      const res = await fetch('/api/cron/generate-news', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setStatus('success');
      setMessage(
        data.slug
          ? `Success! New article created: ${data.slug}`
          : data.message || 'Done'
      );
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '420px',
          width: '100%',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          padding: '32px',
        }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
          PublicWrits
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
          Manual Article Generator
        </p>

        <div style={{ marginTop: '28px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '6px',
            }}
          >
            Admin Password (CRON_SECRET)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter CRON_SECRET"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={status === 'loading'}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            background: status === 'loading' ? '#94a3b8' : '#2563eb',
            color: 'white',
            fontSize: '15px',
            fontWeight: 600,
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          }}
        >
          {status === 'loading' ? 'Generating…' : 'Generate New Article'}
        </button>

        {message && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '14px',
              background:
                status === 'success'
                  ? '#f0fdf4'
                  : status === 'error'
                  ? '#fef2f2'
                  : '#eff6ff',
              color:
                status === 'success'
                  ? '#166534'
                  : status === 'error'
                  ? '#991b1b'
                  : '#1e40af',
            }}
          >
            {message}
          </div>
        )}

        <p
          style={{
            marginTop: '24px',
            fontSize: '12px',
            color: '#94a3b8',
            textAlign: 'center',
          }}
        >
          This uses the same pipeline as the every-2-hour cron job.
        </p>
      </div>
    </div>
  );
}
