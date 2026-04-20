---
id: rate-limits
title: Rate Limit / Quota Error Contract
---

# Rate Limit / Quota Error Contract

When blocked by rate limit or quota:

- HTTP status: `429`
- JSON error body:

```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Retry after 12 seconds.",
  "retry_after_seconds": 12
}
```

Possible `error` values:

- `rate_limit_exceeded`
- `quota_exhausted`
