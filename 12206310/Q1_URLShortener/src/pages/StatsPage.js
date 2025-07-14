import React, { useEffect, useState } from 'react';
import { Typography, Paper, Divider } from '@mui/material';

export default function StatsPage() {
  const [shortLinks, setShortLinks] = useState({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('shortLinks') || '{}');
    setShortLinks(data);
  }, []);

  return (
    <Paper sx={{ p: 3, m: 2 }} elevation={3}>
      <Typography variant="h5" gutterBottom>Shortened URL Statistics</Typography>
      {Object.entries(shortLinks).map(([code, info]) => (
        <div key={code} style={{ marginBottom: '1rem' }}>
          <Typography><strong>Short URL:</strong> <a href={`/${code}`}>http://localhost:3000/{code}</a></Typography>
          <Typography><strong>Original URL:</strong> {info.longUrl}</Typography>
          <Typography><strong>Created At:</strong> {info.createdAt}</Typography>
          <Typography><strong>Expires At:</strong> {info.expiresAt}</Typography>
          <Typography><strong>Click Count:</strong> {info.clicks.length}</Typography>
          <Typography><strong>Click Details:</strong></Typography>
          {info.clicks.map((click, idx) => (
            <Typography key={idx} sx={{ pl: 2 }}>
              • {click.timestamp} - {click.source || 'unknown'} - {click.location || 'N/A'}
            </Typography>
          ))}
          <Divider sx={{ my: 1 }} />
        </div>
      ))}
    </Paper>
  );
}
