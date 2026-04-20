---
id: billing
title: Billing Model
---

# Billing Model

- Credits are charged per accepted request.
- Credits are tracked at **organization level** (shared across API keys in same org).
- Default endpoint weights:
  - `/api/query` = `1`
  - `/api/chat-with-repo` = `2`
  - `/api/agent/chat` = `4`
  - Other endpoints default to `1` unless set to `0` internally.
