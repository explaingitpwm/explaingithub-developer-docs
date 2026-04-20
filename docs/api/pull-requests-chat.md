---
id: pull-requests-chat
title: POST /api/pull-requests/chat
---

# POST /api/pull-requests/chat

Purpose: PR-oriented chat.

Auth: public API auth.

## Context

Use this for pull request summaries, change-risk analysis, and review assistance on a specific PR number.

## Request

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "pr_number": 45,
  "message": "What changed and what are the risks?"
}
```

## Response (compact)

```json
{
  "reply": "string",
  "sources": [],
  "token_usage": {
    "input_tokens": 0,
    "output_tokens": 0,
    "total_tokens": 0
  }
}
```
