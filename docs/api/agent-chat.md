---
id: agent-chat
title: POST /api/agent/chat
---

# POST /api/agent/chat

Purpose: Autonomous multi-tool investigation.

Auth: public API auth.

## Context

Use this for deeper investigations that may require correlating multiple repository signals (workflows, issues, pull requests).

## Request

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "query": "Why did CI fail and are there related open issues?"
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
