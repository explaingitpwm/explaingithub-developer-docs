---
id: overview
title: Developer API Reference
slug: /
hide_table_of_contents: true
---

# Developer API Reference

## API Platform

<div className="eg-quickstart-panel">
  <div className="eg-quickstart-copy">
    <h2>Developer quickstart</h2>
    <p>
      Make your first API request in minutes.
    </p>
    <div className="eg-quickstart-actions">
      <a className="button button--primary button--sm" href="/api/docs/quickstart">Get started</a>
      <a className="button button--secondary button--sm" href="/api/docs/authentication">Authentication</a>
    </div>
  </div>
  <div className="eg-quickstart-code">

```bash
curl -X POST "https://api.explaingithub.com/api/query" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Organization-Id: YOUR_ORG_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What failed in my recent workflows?",
    "repo_ids": ["93b2cfb4f88278ad"],
    "time_range": "24h"
  }'
```

  </div>
</div>

## Base URL

- Production: `https://api.explaingithub.com`
- OpenAPI JSON: `/openapi.json`
- Swagger UI: `/docs`
- ReDoc: `/redoc`

## Contents (same structure as the API reference)

- Base URL
- Authentication
- Rate Limit / Quota Error Contract
- Billing Model
- Public Endpoints (`/api/...`)
- Non-API-Prefixed Endpoints
- cURL Examples
- Notes for Docs UI Team
