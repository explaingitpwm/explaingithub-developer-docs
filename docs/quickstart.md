---
id: quickstart
title: Quickstart
---

# Quickstart

## Required headers

- `Authorization: Bearer <API_KEY>`
- `X-Organization-Id: <ORG_ID>`
- `Content-Type: application/json`

## Example request

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
