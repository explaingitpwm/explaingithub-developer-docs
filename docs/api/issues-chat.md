---
id: issues-chat
title: POST /api/issues/chat
---

# POST /api/issues/chat

Purpose: Issue-oriented chat.

Auth: public API auth.

## Context

Use this endpoint to investigate a specific issue thread, summarize discussions, or extract next actions.

## Request

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "issue_number": 123,
  "message": "Summarize this issue",
  "context": {
    "include_comments": true
  }
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
