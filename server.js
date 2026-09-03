const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));

const DATA_FILE = path.join(__dirname, 'siteContent.json');
const CONFIG_FILE = path.join(__dirname, 'siteConfig.json');

app.use(express.static(path.join(__dirname)));

app.get('/api/content', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') return res.json({});
      return res.status(500).json({ error: 'Error reading content file' });
    }
    try {
      const json = JSON.parse(data || '{}');
      res.json(json);
    } catch (e) {
      res.status(500).json({ error: 'Invalid JSON in content file' });
    }
  });
});

app.post('/api/content', (req, res) => {
  const payload = req.body || {};
  fs.writeFile(DATA_FILE, JSON.stringify(payload, null, 2), 'utf8', (err) => {
    if (err) return res.status(500).json({ error: 'Error saving content' });
    res.json({ ok: true });
  });
});

app.get('/api/config', (req, res) => {
  fs.readFile(CONFIG_FILE, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') return res.json({});
      return res.status(500).json({ error: 'Error reading config file' });
    }
    try {
      const json = JSON.parse(data || '{}');
      res.json(json);
    } catch (e) {
      res.status(500).json({ error: 'Invalid JSON in config file' });
    }
  });
});

app.post('/api/config', (req, res) => {
  const payload = req.body || {};
  fs.writeFile(CONFIG_FILE, JSON.stringify(payload, null, 2), 'utf8', (err) => {
    if (err) return res.status(500).json({ error: 'Error saving config' });
    res.json({ ok: true });
  });
});

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  if (req.method === 'GET' && (req.path.endsWith('.html') || req.path.endsWith('.htm'))) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
