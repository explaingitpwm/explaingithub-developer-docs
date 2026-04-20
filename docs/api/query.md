---
id: query
title: POST /api/query
---

# POST /api/query

Purpose: Unified repository intelligence query.

Auth: public API auth.

## Context

Use this as the primary entrypoint when you need a broad repository-level answer across one or many repositories and a time window.

## Request body

```json
{
  "question": "What failed in my recent workflows?",
  "repo_ids": ["93b2cfb4f88278ad"],
  "time_range": "24h"
}
```

## Response (compact)

```json
{
  "answer": "string",
  "token_usage": {
    "input_tokens": 0,
    "output_tokens": 0,
    "total_tokens": 0
  },
  "trace_id": "trace_xxx",
  "confidence": 0.8,
  "sources": ["..."]
}
```
