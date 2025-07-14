import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';
import { isValidURL, generateShortcode } from '../utils/helpers';
import { logEvent } from '../middleware/logger';

export default function ShortenerPage() {
  const [urls, setUrls] = useState([
    { longUrl: '', validity: '', shortcode: '', error: '' },
  ]);

  const handleInputChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const handleAdd = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validity: '', shortcode: '', error: '' }]);
    }
  };

  const handleShorten = () => {
    const updated = urls.map((entry) => {
      if (!isValidURL(entry.longUrl)) {
        return { ...entry, error: 'Invalid URL' };
      }
      const validity = parseInt(entry.validity || '30', 10);
      const shortcode = entry.shortcode || generateShortcode();
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + validity * 60000);

      const data = {
        longUrl: entry.longUrl,
        shortcode,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        clicks: [],
      };

      // Store in localStorage
      const allLinks = JSON.parse(localStorage.getItem('shortLinks') || '{}');
      if (allLinks[shortcode]) {
        return { ...entry, error: 'Shortcode already exists!' };
      }
      allLinks[shortcode] = data;
      localStorage.setItem('shortLinks', JSON.stringify(allLinks));

      logEvent({ type: 'SHORTEN_URL', shortcode, longUrl: entry.longUrl });

      return { ...entry, shortcode, error: '' };
    });

    setUrls(updated);
  };

  return (
    <Paper sx={{ p: 3, m: 2 }} elevation={3}>
      <Typography variant="h5" gutterBottom>URL Shortener</Typography>
      {urls.map((entry, idx) => (
        <Grid container spacing={2} key={idx} sx={{ mb: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Long URL"
              value={entry.longUrl}
              onChange={(e) => handleInputChange(idx, 'longUrl', e.target.value)}
              error={Boolean(entry.error)}
              helperText={entry.error}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Validity (min)"
              value={entry.validity}
              onChange={(e) => handleInputChange(idx, 'validity', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Custom Shortcode"
              value={entry.shortcode}
              onChange={(e) => handleInputChange(idx, 'shortcode', e.target.value)}
            />
          </Grid>
        </Grid>
      ))}
      <Button onClick={handleAdd} disabled={urls.length >= 5} sx={{ mt: 1, mr: 1 }}>+ Add More</Button>
      <Button variant="contained" onClick={handleShorten} sx={{ mt: 1 }}>Shorten URLs</Button>

      <Typography variant="h6" sx={{ mt: 3 }}>Results:</Typography>
      {urls.map((entry, idx) => (
        entry.shortcode && !entry.error ? (
          <Typography key={idx}>
            {entry.longUrl} → <a href={`/${entry.shortcode}`} target="_blank" rel="noreferrer">http://localhost:3000/{entry.shortcode}</a>
          </Typography>
        ) : null
      ))}
    </Paper>
  );
}
