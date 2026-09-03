# PBCSYSTEM Local Server

This repository contains a simple Express server to persist admin edits across devices.

Setup

1. Install dependencies:

```bash
npm install
```

2. Start server (serves static files and API):

```bash
npm start
```

The site will be available at `http://localhost:3000`. The client will POST edits to `/api/content` and GET from `/api/content`.
