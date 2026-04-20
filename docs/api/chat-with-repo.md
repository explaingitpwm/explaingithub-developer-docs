---
id: chat-with-repo
title: POST /api/chat-with-repo
---

# POST /api/chat-with-repo

Purpose: Repo-focused answer over registered repo context.

Auth: public API auth.

## Context

Use this when the question targets a single repository and you want repository-scoped answers with sources.

## Request

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "question": "What is this repo about?"
}
```

## Response (compact)

```json
{
  "reply": "string",
  "sources": ["..."],
  "token_usage": {
    "input_tokens": 0,
    "output_tokens": 0,
    "total_tokens": 0
  }
}
```
