import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { logEvent } from '../middleware/logger';

export default function RedirectPage() {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('shortLinks') || '{}');
    const entry = data[shortcode];

    if (!entry) {
      alert('Invalid shortcode');
      navigate('/');
      return;
    }

    const now = new Date();
    const expiry = new Date(entry.expiresAt);
    if (now > expiry) {
      alert('Short link has expired');
      navigate('/');
      return;
    }

    // Log click
    const click = {
      timestamp: new Date().toISOString(),
      source: document.referrer || 'direct',
      location: 'local' // no IP/location API due to offline client-side constraint
    };
    entry.clicks.push(click);
    data[shortcode] = entry;
    localStorage.setItem('shortLinks', JSON.stringify(data));
    logEvent({ type: 'REDIRECT', shortcode });

    window.location.href = entry.longUrl;
  }, [shortcode, navigate]);

  return <p>Redirecting...</p>;
}
