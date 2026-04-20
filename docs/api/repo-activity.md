---
id: repo-activity
title: GET /api/repos/{repo_id}/activity
---

# `GET /api/repos/{repo_id}/activity?limit=20`

Purpose: Read stored repo activity timeline summary.

Auth: public API auth.

## Context

Use this to fetch a repository activity timeline after registration, especially for dashboards and operational summaries.

## Path and query parameters

- `repo_id` (required)
- `limit` (optional, default `20`)

## Response

- Activity payload from server activity query service.
