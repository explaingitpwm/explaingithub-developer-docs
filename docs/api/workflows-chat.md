---
id: workflows-chat
title: POST /api/workflows/chat
---

# POST /api/workflows/chat

Purpose: GitHub Actions workflows/runs chat.

Auth: public API auth.

## Context

Use this endpoint when debugging CI runs, understanding failed jobs, or asking workflow-specific operational questions.

## Request

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "workflow_id": "optional",
  "run_id": "optional",
  "question": "Why did this workflow fail?",
  "include_logs": false
}
```

## Response (compact)

```json
{
  "answer": "string",
  "sources": ["..."],
  "token_usage": {
    "input_tokens": 0,
    "output_tokens": 0,
    "total_tokens": 0
  }
}
```
