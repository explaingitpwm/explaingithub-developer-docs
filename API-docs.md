# Explaingithub Developer API Reference

This document is the implementation-grounded reference for the public developer API exposed under `/api/*`.

It is written for teams building developer tools, internal dashboards, assistants, CLI flows, Slack bots, release monitors, and operational copilots on top of GitHub activity. The API is especially strong when you want to turn raw GitHub state into usable answers:

- what changed recently
- what is failing in CI/CD
- which issues or PRs matter right now
- how a repository is structured
- what evidence backs the answer

Base URL:

- `https://api.explaingithub.com`

OpenAPI:

- `https://api.explaingithub.com/openapi.json`

## What Makes This API Useful

Explaingithub is not just a thin GitHub proxy. Different endpoints combine repository registration, tenant-aware access control, persisted activity, live GitHub reads, and AI synthesis in different ways.

In practice that means you can:

- register a repo once and reuse a stable `repo_id`
- ask operational questions and get a compact answer plus sources
- drill into code structure without building your own repo parser
- investigate workflows, PRs, and issues with one API surface
- build user-facing experiences that feel high-level while staying grounded

## Public Endpoint Index

- `GET /api/health`
- `POST /api/query`
- `POST /api/chat-with-repo`
- `POST /api/issues/chat`
- `POST /api/pull-requests/chat`
- `POST /api/workflows/chat`
- `POST /api/agent/chat`
- `POST /api/repos/register`
- `GET /api/repos/{repo_id}/activity`
- `GET /api/usage`
- `GET /api/usage/logs`
- `GET /health`

## Choosing The Right Endpoint

Use `POST /api/query` when you want a compact intelligence answer over one or more registered repositories, especially for broad operational questions.

Use `POST /api/chat-with-repo` when you want codebase understanding, architecture explanation, repo overview, or implementation walkthroughs based on repository files.

Use `POST /api/issues/chat` when your experience is issue-centric: issue summaries, issue search, issue triage, unresolved threads, workaround hunting.

Use `POST /api/pull-requests/chat` when your user is working from pull requests: change review, risk review, finding relevant PRs, or understanding checks and diff context.

Use `POST /api/workflows/chat` when the main object is GitHub Actions state, workflow runs, jobs, and optionally logs.

Use `POST /api/agent/chat` when the question is cross-domain and investigative, for example correlating workflows, PRs, issues, and deployments in one answer.

Use `GET /api/repos/{repo_id}/activity` when you need a raw recent activity feed rather than a synthesized answer.

Use `GET /api/usage` and `GET /api/usage/logs` when you are building developer-facing billing, observability, or API usage views.

## Authentication

All public developer endpoints except health checks require:

- `Authorization: Bearer <API_KEY>`
- `X-Organization-Id: <ORG_ID>`

Notes:

- Public developer endpoints do not require `X-Server-Auth`.
- The API key must belong to the same organization passed in `X-Organization-Id`.
- If the API key is revoked, expired, invalid, or linked to another organization, the request fails.

Example:

```bash
curl -X POST "https://api.explaingithub.com/api/query" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Organization-Id: YOUR_ORG_ID" \
  -H "Content-Type: application/json" \
  -d "{\"question\":\"What changed recently?\",\"repo_ids\":[\"93b2cfb4f88278ad\"]}"
```

## Rate Limits, Credits, And Response Headers

Authenticated requests are checked against organization billing and rate-limit policy.

When a request is allowed, the server can return headers such as:

- `Retry-After`
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
- `X-Plan-Name`
- `X-Credits-Remaining`
- `X-Credits-Reset-At`

Current endpoint credit weights in the implementation:

- `/api/query`: `1`
- `/api/chat-with-repo`: `2`
- `/api/agent/chat`: `4`
- most other public endpoints: `1` unless explicitly exempted
- `/api/usage`: `0`

If the caller exceeds a rate limit or monthly credit budget, the API returns `429`.

Example:

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

## Common Error Behavior

Common status codes across the public API:

- `400` missing headers, malformed repo URL, or invalid request context
- `401` missing or invalid API key, or expired API key
- `403` key-org mismatch, revoked credentials, or forbidden credential usage
- `404` organization not found or repository not registered
- `409` repository registration conflict across organizations with attached credentials
- `422` request validation failure from FastAPI
- `429` rate-limit or credit exhaustion
- `500` unhandled server error
- `502` upstream GitHub fetch failure on endpoints that pull live GitHub data

Important implementation note:

- `POST /api/issues/chat` currently returns a `200` payload with `{"error":"Repository not registered"}` if the repo is missing, instead of a `404`. Document your client defensively if you integrate that endpoint today.

## Token Usage

Many answer endpoints return:

```json
"token_usage": {
  "input_tokens": 0,
  "output_tokens": 0,
  "total_tokens": 0
}
```

These are estimated usage values derived from payload length, not provider-billed token counts.

## Source Semantics

The `sources` field is intentionally lightweight, but it is not uniform across all endpoints.

- `POST /api/query` returns internal timeline identifiers and GitHub API path-style sources.
- `POST /api/chat-with-repo` returns repository file paths used to build the answer.
- `POST /api/workflows/chat` returns GitHub Actions API path-style sources such as `/actions/runs/{id}`.
- `POST /api/agent/chat` returns GitHub URLs collected from tool output when available.
- `POST /api/issues/chat` and `POST /api/pull-requests/chat` currently return an empty `sources` array even when live GitHub content was used.

## Endpoint Reference

### `GET /api/health`

What it does:

- Lightweight authenticated-surface health check.

Why developers use it:

- service liveness probes
- uptime monitoring
- basic readiness checks before sending traffic

Authentication:

- none

Example:

```bash
curl -X GET "https://api.explaingithub.com/api/health"
```

Success response:

```json
{
  "status": "ok",
  "service": "running"
}
```

---

### `POST /api/query`

What it does:

- Runs the unified GitHub intelligence query path and returns a compact answer with sources, confidence, and trace id.

Why this endpoint is powerful:

- best single entry point for product experiences that ask broad GitHub questions
- combines intent planning, evidence collection, timeline lookup, derived operational views, and synthesis
- well suited for dashboards, chat panels, and query boxes where response shape should stay stable

How it works internally:

- classifies the question into evidence domains such as code, commits, PRs, issues, workflows, deployments, releases, and timeline
- resolves the requested registered repositories
- gathers domain evidence per repo, using cached payloads when live collection fails
- builds derived views like repo health, blockers, release readiness, and recent changes
- synthesizes a final answer and records a trace

Best questions:

- "What changed in the last day?"
- "What is blocking release?"
- "What failed recently in CI?"
- "Is this repo healthy right now?"
- "Summarize recent risky activity in these repos."

Request body:

```json
{
  "question": "What failed in workflows in the last 24h?",
  "repo_ids": ["93b2cfb4f88278ad"],
  "time_range": "24h"
}
```

Fields:

- `question`: required natural-language query
- `repo_ids`: optional list of registered `repo_id` values
- `time_range`: optional string passed through to tracing and response metadata

Implementation notes you should know:

- Always pass `repo_ids` for now if you want repo-scoped evidence.
- Omitting `repo_ids` does not currently trigger an organization-wide search across all registered repositories.
- `time_range` is accepted and returned, but the current evidence collection path does not strongly enforce it as a hard filter.

Success response:

```json
{
  "answer": "string",
  "token_usage": {
    "input_tokens": 0,
    "output_tokens": 0,
    "total_tokens": 0
  },
  "trace_id": "trace_xxx",
  "confidence": 0.8,
  "sources": ["timeline_event:123", "/repos/owner/repo/pulls?state=all"]
}
```

Why product teams like it:

- compact schema
- traceability through `trace_id`
- confidence score for UI treatment
- evidence-first answers without requiring clients to orchestrate GitHub APIs themselves

Example:

```bash
curl -X POST "https://api.explaingithub.com/api/query" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Organization-Id: YOUR_ORG_ID" \
  -H "Content-Type: application/json" \
  -d "{\"question\":\"What changed in the last 24 hours?\",\"repo_ids\":[\"93b2cfb4f88278ad\"],\"time_range\":\"24h\"}"
```

Common errors:

- `401` missing or invalid API key
- `403` API key belongs to another org or is revoked
- `404` organization not found
- `429` throttled or out of credits

---

### `POST /api/chat-with-repo`

What it does:

- Answers repository structure and code understanding questions by inspecting the registered repo's codebase.

Why this endpoint is powerful:

- designed for code-aware explanations rather than generic repo metadata
- can explain architecture, key modules, stack, major flows, and implementation patterns
- returns file paths used for grounding, which is useful for clickable doc-site or IDE integrations

How it works internally:

- verifies the repo is registered to the caller organization
- resolves GitHub access for the repo if credentials are attached
- fetches repo structure and summary
- detects overview-style questions and handles them with a fast overview path
- otherwise performs question decomposition, keyword filtering, LLM-based file selection, and limited multi-hop file expansion
- fetches selected files, builds a code inventory, and generates the answer

Current implementation limits:

- initial file pick: `8`
- overview file cap: `8`
- max fetched files per answer: `20`
- max expansion iterations: `2`
- file contents are truncated at `10,000` characters per file

Best questions:

- "What does this repository do?"
- "Explain the auth flow."
- "Where is webhook ingestion implemented?"
- "How do API routers connect to services?"
- "Summarize the architecture and key modules."

Request body:

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "question": "How does this repository process GitHub webhook data?"
}
```

Fields:

- `repo_id`: required registered repository id
- `question`: required natural-language repo question

Success response:

```json
{
  "reply": "string",
  "sources": [
    "app/main.py",
    "app/api/routers/webhooks.py",
    "app/ingestion/handlers/github_webhooks.py"
  ],
  "token_usage": {
    "input_tokens": 0,
    "output_tokens": 0,
    "total_tokens": 0
  }
}
```

Example:

```bash
curl -X POST "https://api.explaingithub.com/api/chat-with-repo" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Organization-Id: YOUR_ORG_ID" \
  -H "Content-Type: application/json" \
  -d "{\"repo_id\":\"93b2cfb4f88278ad\",\"question\":\"What is this repo about?\"}"
```

Common errors:

- `404` repository not registered for the organization
- `400` stored repo URL cannot be parsed as a GitHub repo URL
- `429` throttled or out of credits

When to prefer this over `POST /api/query`:

- when the question is codebase-centric instead of operational
- when you want file-path grounding
- when the user expects an explanation of implementation rather than state

---

### `POST /api/issues/chat`

What it does:

- Provides issue-focused analysis over a registered repository.

Why this endpoint is useful:

- supports both direct issue analysis and issue discovery/search mode
- good fit for triage tools, support workflows, release notes prep, and issue backlog UIs
- can summarize a single issue thread or scan recent issues for patterns

How it works internally:

- verifies the repo is registered
- resolves GitHub token if available
- if `issue_number` is present, fetches the issue plus optional comments and asks the model to answer from that context
- if `issue_number` is omitted, fetches recent issues and applies deterministic filtering heuristics based on the user query

Search mode can help answer questions like:

- "Find the most discussed issues."
- "Which issues look unresolved?"
- "Are there issues mentioning workarounds?"
- "Show issues waiting for more info."

Single-issue mode is best for:

- "Summarize this issue."
- "What is the current resolution status?"
- "What root cause is being discussed?"

Request body:

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "issue_number": 123,
  "message": "Summarize this issue and comments",
  "context": {
    "include_comments": true
  }
}
```

Fields:

- `repo_id`: required
- `message`: required
- `issue_number`: optional, enables direct issue mode
- `context.include_comments`: optional, defaults to `true`

Single-issue example:

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "issue_number": 231,
  "message": "What is the root cause and current resolution status?"
}
```

Search-mode example:

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "message": "Find unresolved issues with workaround discussions"
}
```

Success response:

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

Current implementation notes:

- `chat_id` is accepted in the schema but not used by the endpoint.
- `context.depth` exists in the schema default but is not used by the current implementation.
- `sources` is currently empty even when live issue data was used.
- Missing repo currently returns a `200` JSON error payload instead of a `404`.

Upstream errors:

- GitHub fetch failures are returned as `502` in search mode

---

### `POST /api/pull-requests/chat`

What it does:

- Provides PR-focused analysis over a registered repository.

Why this endpoint is useful:

- works well for change review experiences, PR intelligence panels, and engineering manager summaries
- supports both direct PR reasoning and query-based PR discovery mode
- can incorporate diff text and check-run status for a richer answer on a known PR

How it works internally:

- verifies the repo belongs to the caller organization
- resolves GitHub token if attached
- if `pr_number` is present, fetches PR metadata and optionally diff and check runs, then asks the model to answer from that context
- if `pr_number` is omitted, fetches recent PRs and applies deterministic query heuristics

Search mode is especially good for:

- merged PRs from last week
- PRs related to auth or performance
- PRs that touched certain files or paths
- PRs with review friction or changes requested

Request body:

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "pr_number": 45,
  "message": "What changed and what are the risks?",
  "context": {
    "include_diff": true,
    "include_checks": true
  }
}
```

Fields:

- `repo_id`: required
- `message`: required
- `pr_number`: optional, enables direct PR mode
- `context.include_diff`: optional, defaults to `true`
- `context.include_checks`: optional, defaults to `true`

Direct PR example:

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "pr_number": 145,
  "message": "Summarize the change and highlight deployment risk",
  "context": {
    "include_diff": true,
    "include_checks": true
  }
}
```

Search-mode example:

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "message": "Show merged auth-related PRs from last week"
}
```

Success response:

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

Current implementation notes:

- `chat_id` is accepted in the schema but not used.
- `sources` is currently empty even when diff and check data were used.
- If the repo has a stored `credential_id` but the token cannot be resolved, the endpoint returns `403`.
- GitHub fetch failures in search mode return `502`.

Why developers choose this endpoint:

- simpler than building your own PR discovery heuristics
- useful for review assistance and release review surfaces
- easy to map into "Find PRs about X" product experiences

---

### `POST /api/workflows/chat`

What it does:

- Answers GitHub Actions workflow questions for a registered repo.

Why this endpoint is powerful:

- purpose-built for CI/CD questions rather than general chat
- supports repo-level, workflow-level, and specific run-level investigation
- can optionally include run logs for deeper failure analysis

How it works internally:

- if only `repo_id` is provided and `include_logs` is `false`, it uses the unified query service to summarize workflow and deployment state from collected evidence
- if `workflow_id`, `run_id`, or `include_logs=true` is present, it resolves GitHub access and fetches live workflow data from GitHub Actions endpoints
- summarizes workflows, runs, jobs, and failure patterns
- asks the model to answer strictly from the structured workflow context

Scope behavior:

- `repo_id` only: repo-level workflow and deployment summary
- `workflow_id`: aggregate workflow-run analysis for that workflow
- `run_id`: run-specific analysis, including jobs
- `run_id` plus `include_logs=true`: deepest available path in the current implementation

Best questions:

- "What is workflow health this week?"
- "Why did this run fail?"
- "Which jobs look flaky?"
- "Are deployments failing alongside CI?"

Request body:

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "workflow_id": "optional-workflow-id",
  "run_id": "optional-run-id",
  "question": "Why did this workflow fail?",
  "include_logs": false
}
```

Repo-level example:

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "question": "What is workflow health for this repo this week?"
}
```

Run-level example:

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "run_id": "123456789",
  "question": "Why did this run fail?",
  "include_logs": true
}
```

Success response:

```json
{
  "answer": "string",
  "sources": [
    "/actions/workflows",
    "/actions/runs/123456789",
    "/actions/runs/123456789/jobs"
  ],
  "token_usage": {
    "input_tokens": 0,
    "output_tokens": 0,
    "total_tokens": 0
  }
}
```

Current implementation notes:

- repo-level mode can answer even without a repo-attached credential if enough evidence is available
- live GitHub Actions fetch mode uses the repo's resolved token when available, but can still try unauthenticated access for public repositories
- if Azure OpenAI is not configured, the service returns a plain fallback message instead of an LLM-generated answer
- upstream live GitHub fetch failures return `502`

---

### `POST /api/agent/chat`

What it does:

- Runs the autonomous investigation controller for cross-domain repository questions.

Why this endpoint is powerful:

- best fit for "investigate and correlate" workflows
- the server-side agent can decide whether to inspect workflows, deployments, PRs, and issues based on the query
- useful when a static single-domain endpoint would force your client to orchestrate multiple calls

How it works internally:

- resolves the repo and credential context
- builds a bounded tool registry
- uses an LLM tool-calling loop to choose tools
- enforces per-tool timeout and maximum iteration limits
- synthesizes a final grounded answer from tool evidence

Current tool set:

- failed workflows
- deployments
- recent pull requests
- recent issues

Current safety and execution bounds:

- maximum iterations: `8`
- per-tool timeout: `25s`
- failure recovery feeds tool errors back into the loop rather than crashing the whole request

Best questions:

- "Why did CI fail and are there related open issues?"
- "What are the top release blockers?"
- "Did a recent PR likely cause deployment instability?"
- "Investigate why engineering velocity dropped this week."

Request body:

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "query": "Why did CI fail and are there related open issues?"
}
```

Success response:

```json
{
  "answer": "string",
  "sources": [
    "https://github.com/owner/repo/actions/runs/123",
    "https://github.com/owner/repo/pull/45"
  ],
  "token_usage": {
    "input_tokens": 0,
    "output_tokens": 0,
    "total_tokens": 0
  }
}
```

Current implementation notes:

- if Azure OpenAI is not configured, the request fails because the agent requires model-based orchestration
- this endpoint is the heaviest public endpoint and currently carries the highest credit weight
- it is ideal for investigative UX, but for simple known-object queries the domain-specific endpoints are cheaper and more predictable

---

### `POST /api/repos/register`

What it does:

- Registers a GitHub repository to an organization and returns a stable `repo_id`.

Why it matters:

- this is the onboarding step that makes the rest of the public API practical
- your application can keep a stable `repo_id` instead of repeatedly passing full repo URLs
- registration is idempotent for the same organization and repo

How it works internally:

- computes a deterministic `repo_id` from `repo_url`
- checks if the same repo is already registered for the organization
- inserts the repo registration if not present
- blocks conflicting cross-org reuse when credentials are attached to another org's copy

Request body:

```json
{
  "provider": "github",
  "repo_url": "https://github.com/owner/repo",
  "branch": "main",
  "visibility": "private",
  "credential_id": "optional-for-public-required-for-private"
}
```

Fields:

- `provider`: required; current product direction is GitHub-first
- `repo_url`: required GitHub repository URL
- `branch`: accepted but not currently used during registration
- `visibility`: optional, defaults to `private`
- `credential_id`: required if `visibility` is `private`

Public repo example:

```json
{
  "provider": "github",
  "repo_url": "https://github.com/openai/openai-python",
  "visibility": "public"
}
```

Private repo example:

```json
{
  "provider": "github",
  "repo_url": "https://github.com/your-org/private-repo",
  "visibility": "private",
  "credential_id": "cred_123"
}
```

Success response:

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "status": "registered"
}
```

Idempotent repeat response:

```json
{
  "repo_id": "93b2cfb4f88278ad",
  "status": "already_registered"
}
```

Current implementation notes:

- for private repos without `credential_id`, the current implementation returns a JSON error body instead of raising an HTTP `4xx`
- registration does not clone, index, or backfill the repository yet
- the real value of this endpoint is identity, access scoping, and enabling downstream API calls

Conflict behavior:

- `409` when the same repo URL is already registered under a different organization with attached credentials

---

### `GET /api/repos/{repo_id}/activity`

What it does:

- Returns recent persisted activity events for a registered repository.

Why it is useful:

- ideal for evidence panels, dashboards, feeds, and "show me the underlying events" UIs
- complements `/api/query` by returning event data rather than a synthesized answer
- useful for audit-style views and timelines

How it works internally:

- confirms the repo belongs to the caller organization
- resolves the repo's `repository_full_name`
- reads recent entries from the timeline event store

Request:

- path param: `repo_id`
- query param: `limit` default `20`

Example:

```bash
curl -X GET "https://api.explaingithub.com/api/repos/93b2cfb4f88278ad/activity?limit=20" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Organization-Id: YOUR_ORG_ID"
```

Success response shape:

```json
{
  "found": true,
  "repo_id": "93b2cfb4f88278ad",
  "repo_url": "https://github.com/owner/repo",
  "repository_full_name": "owner/repo",
  "events": [],
  "event_count": 0
}
```

Current implementation notes:

- this endpoint returns `200` with an empty `events` array when the repo exists but no activity is stored yet
- it returns `404` only when the repository is not registered to the org

---

### `GET /api/usage`

What it does:

- Returns a usage summary for the calling API key.

Why this endpoint is useful:

- easy way to build a self-serve developer dashboard
- shows request volume, token estimates, error counts, recent requests, and hottest endpoints
- useful for teams monitoring adoption and debugging integration problems

Important scope note:

- this endpoint is API-key scoped, not full organization analytics

Query params:

- `limit`: optional, `1..100`, default `20`

Success response shape:

```json
{
  "api_key_id": "uuid",
  "organization_id": "org_xxx",
  "total_requests": 0,
  "error_count": 0,
  "avg_duration_ms": 0,
  "input_tokens": 0,
  "output_tokens": 0,
  "total_tokens": 0,
  "top_endpoints": [
    { "endpoint": "/api/query", "count": 12 }
  ],
  "recent_requests": [
    {
      "request_id": "uuid",
      "api_key_id": "uuid",
      "endpoint": "/api/query",
      "method": "POST",
      "status_code": 200,
      "duration_ms": 123,
      "input_tokens": 10,
      "output_tokens": 40,
      "total_tokens": 50,
      "error_message": null,
      "created_at": "2026-04-17T12:00:00Z"
    }
  ]
}
```

Example:

```bash
curl -X GET "https://api.explaingithub.com/api/usage?limit=20" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Organization-Id: YOUR_ORG_ID"
```

---

### `GET /api/usage/logs`

What it does:

- Returns paginated raw usage logs for the calling API key.

Why developers use it:

- request-level troubleshooting
- latency analysis
- recent-failure audits
- powering log tables and infinite-scroll usage views

Query params:

- `page`: optional, `>=1`, default `1`
- `limit`: optional, `1..100`, default `25`

Success response:

```json
{
  "page": 1,
  "limit": 25,
  "items": [],
  "has_more": false
}
```

Item fields currently include:

- `request_id`
- `api_key_id`
- `endpoint`
- `method`
- `status_code`
- `duration_ms`
- `input_tokens`
- `output_tokens`
- `total_tokens`
- `error_message`
- `created_at`

Example:

```bash
curl -X GET "https://api.explaingithub.com/api/usage/logs?page=1&limit=25" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Organization-Id: YOUR_ORG_ID"
```

Pagination note:

- `has_more` is derived from `len(items) >= limit`, so clients should treat it as a practical paging hint rather than a total-count guarantee

---

### `GET /health`

What it does:

- Global health alias outside `/api`.

Authentication:

- none

Success response:

```json
{
  "status": "ok",
  "service": "running"
}
```

## Recommended Integration Flow

Typical first-run flow for external developers:

1. Register the repo with `POST /api/repos/register`.
2. Store the returned `repo_id`.
3. Start broad with `POST /api/query` for operational intelligence.
4. Drill into code with `POST /api/chat-with-repo` when the user asks implementation questions.
5. Drill into domain-specific objects with `/issues/chat`, `/pull-requests/chat`, or `/workflows/chat`.
6. Use `POST /api/agent/chat` for high-value investigative UX where cross-domain correlation matters.
7. Surface adoption and billing views with `GET /api/usage` and `GET /api/usage/logs`.

## Quick Copy-Paste Examples

### Register A Repo

```bash
curl -X POST "https://api.explaingithub.com/api/repos/register" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Organization-Id: YOUR_ORG_ID" \
  -H "Content-Type: application/json" \
  -d "{\"provider\":\"github\",\"repo_url\":\"https://github.com/owner/repo\",\"visibility\":\"public\"}"
```

### Ask A Unified Query

```bash
curl -X POST "https://api.explaingithub.com/api/query" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Organization-Id: YOUR_ORG_ID" \
  -H "Content-Type: application/json" \
  -d "{\"question\":\"What changed recently and what looks risky?\",\"repo_ids\":[\"93b2cfb4f88278ad\"]}"
```

### Explain A Repo

```bash
curl -X POST "https://api.explaingithub.com/api/chat-with-repo" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Organization-Id: YOUR_ORG_ID" \
  -H "Content-Type: application/json" \
  -d "{\"repo_id\":\"93b2cfb4f88278ad\",\"question\":\"Explain the auth architecture\"}"
```

### Investigate CI

```bash
curl -X POST "https://api.explaingithub.com/api/workflows/chat" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Organization-Id: YOUR_ORG_ID" \
  -H "Content-Type: application/json" \
  -d "{\"repo_id\":\"93b2cfb4f88278ad\",\"question\":\"Why did CI fail?\"}"
```

### Run A Cross-Domain Investigation

```bash
curl -X POST "https://api.explaingithub.com/api/agent/chat" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Organization-Id: YOUR_ORG_ID" \
  -H "Content-Type: application/json" \
  -d "{\"repo_id\":\"93b2cfb4f88278ad\",\"query\":\"Why did CI fail and are there related open issues?\"}"
```

### Read Repo Activity

```bash
curl -X GET "https://api.explaingithub.com/api/repos/93b2cfb4f88278ad/activity?limit=20" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Organization-Id: YOUR_ORG_ID"
```

### Read Usage Summary

```bash
curl -X GET "https://api.explaingithub.com/api/usage?limit=20" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Organization-Id: YOUR_ORG_ID"
```

### Read Usage Logs

```bash
curl -X GET "https://api.explaingithub.com/api/usage/logs?page=1&limit=25" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Organization-Id: YOUR_ORG_ID"
```

## Current Product Direction Vs Current Implementation

The product direction in this repository is broader than a repo-chat product, and the public API is already moving in that direction. The strongest examples today are:

- unified query over multiple GitHub evidence domains
- operational views such as health, blockers, and release readiness
- workflow and deployment-aware answers
- tenant-scoped repo registration and usage tracking

A few behaviors are still transitional and should be documented clearly for external users:

- `time_range` on `/api/query` is accepted but not yet a strong execution filter
- omitting `repo_ids` on `/api/query` does not yet mean "all repos in my org"
- issue and PR chat responses do not yet expose rich `sources`
- registration does not yet perform repository indexing or backfill
- some endpoints still have inconsistent error semantics inherited from older router code

Those caveats are worth being explicit about in public docs, because the API is much easier to trust when developers understand both what it already does well and what is still evolving.
