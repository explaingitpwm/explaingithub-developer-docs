---
id: usage
title: GET /api/usage
---

# GET /api/usage?limit=20

Purpose: API key usage summary.

Auth: public API auth.

## Context

Use this endpoint for aggregated usage reporting, billing visibility, and monitoring API consumption patterns.

## Response fields

- `api_key_id`
- `organization_id`
- `total_requests`
- `error_count`
- `avg_duration_ms`
- `input_tokens`
- `output_tokens`
- `total_tokens`
- `top_endpoints`
- `recent_requests`
