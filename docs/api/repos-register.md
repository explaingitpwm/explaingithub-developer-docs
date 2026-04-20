---
id: repos-register
title: POST /api/repos/register
---

# POST /api/repos/register

Purpose: Register a repository for an organization.

Auth: public API auth.

## Context

Call this first when onboarding a new repository. Other repository-scoped endpoints assume the repo is registered and identified by `repo_id`.

## Request

```json
{
  "provider": "github",
  "repo_url": "https://github.com/owner/repo",
  "branch": "main",
  "visibility": "private",
  "credential_id": "optional-for-private"
}
```

## Response

```json
{
  "repo_id": "string",
  "status": "registered"
}
```
