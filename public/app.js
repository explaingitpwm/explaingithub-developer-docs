const page = document.getElementById("page");
const searchInput = document.getElementById("searchInput");

const baseUrl = "https://api.explaingithub.com";
const quickRequestBody = `{
  "question": "What failed in workflows in the last 24h?",
  "repo_ids": ["93b2cfb4f88278ad"],
  "time_range": "24h"
}`;

const repoChatRequestBody = `{
  "repo_id": "93b2cfb4f88278ad",
  "question": "How does this repository process GitHub webhook data?"
}`;

const issuesChatRequestBody = `{
  "repo_id": "93b2cfb4f88278ad",
  "issue_number": 123,
  "message": "Summarize this issue and comments",
  "context": {
    "include_comments": true
  }
}`;

const pullRequestChatRequestBody = `{
  "repo_id": "93b2cfb4f88278ad",
  "pr_number": 45,
  "message": "What changed and what are the risks?",
  "context": {
    "include_diff": true,
    "include_checks": true
  }
}`;

const workflowChatRequestBody = `{
  "repo_id": "93b2cfb4f88278ad",
  "workflow_id": "optional-workflow-id",
  "run_id": "optional-run-id",
  "question": "Why did this workflow fail?",
  "include_logs": false
}`;

const agentChatRequestBody = `{
  "repo_id": "93b2cfb4f88278ad",
  "query": "Why did CI fail and are there related open issues?"
}`;

const repoRegisterRequestBody = `{
  "provider": "github",
  "repo_url": "https://github.com/owner/repo",
  "branch": "main",
  "visibility": "private",
  "credential_id": "optional-for-public-required-for-private"
}`;

const quickCode = buildCodeSamples("POST", "/api/query", quickRequestBody);
const homeIcons = {
  communication: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v5A2.5 2.5 0 0 1 16.5 15H11l-3.5 3v-3H7.5A2.5 2.5 0 0 1 5 12.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
    </svg>
  `,
  portal: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.5 6.5h15v11h-15zM9 6.5v11M4.5 11.5h15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  release: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 18.5h12M8 18.5v-4l4-9 4 9v4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 9.5v3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
    </svg>
  `,
  cli: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 7.5l4 4-4 4M11.5 16.5H19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
};

const pages = {
  "/": `
    <div class="breadcrumbs">Home <span>&rsaquo;</span> API <span>&rsaquo;</span> Docs</div>
    <div class="doc-hero home-hero">
      <span class="eyebrow">Overview</span>
      <h2>Build GitHub-aware product experiences without stitching together raw GitHub APIs.</h2>
      <p class="hero-text">
        Explaingithub gives your product one API for repository understanding, release
        diagnostics, workflow investigation, PR and issue analysis, and engineering-facing
        assistants. It is built for teams that want answers and actions in product surfaces
        engineers already use, not just raw repository objects.
      </p>
      <div class="hero-actions">
        <a class="primary-link" href="/api/query" data-route="/api/query">Try Query API</a>
        <a class="secondary-link" href="/api/repos-register" data-route="/api/repos-register">Register a repo</a>
      </div>
    </div>

    <section class="home-section">
      <div class="section-head">
        <h2>Where teams use it</h2>
        <p>Use it where engineers already need answers, not in a standalone tool they have to learn separately.</p>
      </div>
      <div class="cards cards-two">
        <article class="card">
          <div class="feature-mark" aria-hidden="true">${homeIcons.communication}</div>
          <h3>Communication channels</h3>
          <p>Use it in Slack and Microsoft Teams bots so engineers can ask what failed, what changed, and what is blocking release directly inside the channel where decisions happen.</p>
        </article>
        <article class="card">
          <div class="feature-mark" aria-hidden="true">${homeIcons.portal}</div>
          <h3>Developer portals</h3>
          <p>Add codebase explanation, recent repository activity, workflow health, and repository-level intelligence to internal engineering portals and platform surfaces.</p>
        </article>
        <article class="card">
          <div class="feature-mark" aria-hidden="true">${homeIcons.release}</div>
          <h3>Release and incident views</h3>
          <p>Power dashboards that need to connect failing workflows, risky pull requests, related issues, and recent repo events in one operational view.</p>
        </article>
        <article class="card">
          <div class="feature-mark" aria-hidden="true">${homeIcons.cli}</div>
          <h3>CLI tools and copilots</h3>
          <p>Embed the API in terminal tools, internal copilots, and support assistants that need to explain repositories or investigate engineering state on demand.</p>
        </article>
      </div>
    </section>

    <section class="home-section">
      <div class="section-head">
        <h2>How to roll it out</h2>
        <p>Start with one useful workflow, then expand only when the product surface becomes more specific.</p>
      </div>
      <div class="home-flow">
        <div class="mini-label">Recommended first run</div>
        <ol>
          <li>Register the repository with <code class="inline">POST /api/repos/register</code> and store the returned <code class="inline">repo_id</code>.</li>
          <li>Start with <code class="inline">POST /api/query</code> to answer broad questions like what changed, what failed, or what looks risky.</li>
          <li>Move into <code class="inline">POST /api/chat-with-repo</code>, issues, pull requests, or workflows when the user experience becomes more object-specific.</li>
          <li>Add usage and logs once the integration is live and you need operational visibility.</li>
        </ol>
        <div class="cards cards-two compact-inline-cards">
          <article class="card">
            <h3>Required headers</h3>
            <p><code class="inline">Authorization: Bearer &lt;API_KEY&gt;</code></p>
            <p><code class="inline">X-Organization-Id: &lt;ORG_ID&gt;</code></p>
            <a href="/authentication" data-route="/authentication">View auth reference</a>
          </article>
          <article class="card">
            <h3>Why this works better than raw GitHub APIs</h3>
            <p>Start broad with <code class="inline">POST /api/query</code>, then move into repository chat, issues, pull requests, and workflows without rebuilding the integration model.</p>
            <a href="/rate-limits" data-route="/rate-limits">View rate-limit behavior</a>
          </article>
        </div>
      </div>
    </section>

    <section class="home-section">
      <div class="section-head">
        <h2>Start with one request that proves value</h2>
        <p>The query endpoint is the fastest path to a useful first integration.</p>
      </div>
      ${renderCodeExample({
        title: "POST /api/query",
        description:
          "Ask a broad operational question first, return a grounded answer, then route users into deeper repository or object-specific flows.",
        samples: quickCode,
      })}
    </section>
  `,
  "/quickstart": renderDoc("Quickstart", [
    [
      "Base URL",
      `<p>Production: <code class="inline">${baseUrl}</code></p>`,
    ],
    [
      "Required headers",
      `<ul>
        <li><code class="inline">Authorization: Bearer &lt;API_KEY&gt;</code></li>
        <li><code class="inline">X-Organization-Id: &lt;ORG_ID&gt;</code></li>
        <li><code class="inline">Content-Type: application/json</code></li>
      </ul>`,
    ],
    [
      "Example request",
      renderCodeExample({
        title: "POST /api/query",
        description:
          "Ask a broad operational question first, then drill into code, issues, PRs, or workflows from there.",
        samples: quickCode,
      }),
    ],
    [
      "Recommended flow",
      `<ol>
        <li>Register a repo with <code class="inline">POST /api/repos/register</code>.</li>
        <li>Store the returned <code class="inline">repo_id</code>.</li>
        <li>Use <code class="inline">POST /api/query</code> for broad intelligence.</li>
        <li>Use more specific endpoints when the UX becomes code-centric or object-centric.</li>
      </ol>`,
    ],
  ]),
  "/authentication": renderDoc("Authentication", [
    [
      "Required headers",
      `<ul>
        <li><code class="inline">Authorization: Bearer &lt;API_KEY&gt;</code></li>
        <li><code class="inline">X-Organization-Id: &lt;ORG_ID&gt;</code></li>
      </ul>`,
    ],
    [
      "Notes",
      `<ul>
        <li>Public developer endpoints do not require <code class="inline">X-Server-Auth</code>.</li>
        <li>The API key must belong to the same organization passed in <code class="inline">X-Organization-Id</code>.</li>
        <li>If the API key is revoked, expired, invalid, or linked to another organization, the request fails.</li>
      </ul>`,
    ],
  ]),
  "/rate-limits": renderDoc("Rate Limits, Credits, And Response Headers", [
    [
      "Headers",
      `<p>Authenticated requests are checked against organization billing and rate-limit policy.</p>
      <p>When a request is allowed, the server can return headers such as:</p>
      <ul>
        <li><code class="inline">Retry-After</code></li>
        <li><code class="inline">X-RateLimit-Limit</code></li>
        <li><code class="inline">X-RateLimit-Remaining</code></li>
        <li><code class="inline">X-RateLimit-Reset</code></li>
        <li><code class="inline">X-Plan-Name</code></li>
        <li><code class="inline">X-Credits-Remaining</code></li>
        <li><code class="inline">X-Credits-Reset-At</code></li>
      </ul>`,
    ],
    [
      "Credit weights",
      `<ul>
        <li><code class="inline">/api/query</code>: <code class="inline">1</code></li>
        <li><code class="inline">/api/chat-with-repo</code>: <code class="inline">2</code></li>
        <li><code class="inline">/api/agent/chat</code>: <code class="inline">4</code></li>
        <li>Most other public endpoints: <code class="inline">1</code> unless explicitly exempted</li>
        <li><code class="inline">/api/usage</code>: <code class="inline">0</code></li>
      </ul>`,
    ],
    [
      "429 error contract",
      `<p>If the caller exceeds a rate limit or monthly credit budget, the API returns <code class="inline">429</code>.</p>
      <pre>${escapeHtml(`{
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Retry after 12 seconds.",
  "retry_after_seconds": 12
}`)}</pre>
      <p><code class="inline">error</code> can be <code class="inline">rate_limit_exceeded</code> or <code class="inline">quota_exhausted</code>.</p>`,
    ],
  ]),
  "/billing": renderDoc("Common Error Behavior", [
    [
      "Status codes",
      `<ul>
        <li><code class="inline">400</code> missing headers, malformed repo URL, or invalid request context</li>
        <li><code class="inline">401</code> missing or invalid API key, or expired API key</li>
        <li><code class="inline">403</code> key-org mismatch, revoked credentials, or forbidden credential usage</li>
        <li><code class="inline">404</code> organization not found or repository not registered</li>
        <li><code class="inline">409</code> repository registration conflict across organizations with attached credentials</li>
        <li><code class="inline">422</code> request validation failure from FastAPI</li>
        <li><code class="inline">429</code> rate-limit or credit exhaustion</li>
        <li><code class="inline">500</code> unhandled server error</li>
        <li><code class="inline">502</code> upstream GitHub fetch failure on endpoints that pull live GitHub data</li>
      </ul>`,
    ],
    [
      "Important implementation note",
      `<p><code class="inline">POST /api/issues/chat</code> currently returns a <code class="inline">200</code> payload with <code class="inline">{"error":"Repository not registered"}</code> if the repo is missing, instead of a <code class="inline">404</code>.</p>`,
    ],
  ]),
  "/curl-examples": renderDoc("Quick Copy-Paste Examples", [
    [
      "Register a repo",
      renderCodeExample({
        title: "POST /api/repos/register",
        description:
          "Register a repository and get back a stable repo identity for later calls.",
        samples: buildCodeSamples(
          "POST",
          "/api/repos/register",
          `{
  "provider": "github",
  "repo_url": "https://github.com/owner/repo",
  "visibility": "public"
}`
        ),
      }),
    ],
    [
      "Ask a unified query",
      renderCodeExample({
        title: "POST /api/query",
        description:
          "Ask what changed recently and what looks risky.",
        samples: buildCodeSamples(
          "POST",
          "/api/query",
          `{
  "question": "What changed recently and what looks risky?",
  "repo_ids": ["93b2cfb4f88278ad"]
}`
        ),
      }),
    ],
    [
      "Explain a repo",
      renderCodeExample({
        title: "POST /api/chat-with-repo",
        description:
          "Explain a repository's implementation, architecture, or important modules.",
        samples: buildCodeSamples("POST", "/api/chat-with-repo", repoChatRequestBody),
      }),
    ],
    [
      "Investigate CI",
      renderCodeExample({
        title: "POST /api/workflows/chat",
        description: "Ask why CI failed or how workflow health is trending.",
        samples: buildCodeSamples(
          "POST",
          "/api/workflows/chat",
          `{
  "repo_id": "93b2cfb4f88278ad",
  "question": "Why did CI fail?"
}`
        ),
      }),
    ],
    [
      "Run a cross-domain investigation",
      renderCodeExample({
        title: "POST /api/agent/chat",
        description:
          "Correlate failures, PRs, and issues in one server-side investigation.",
        samples: buildCodeSamples("POST", "/api/agent/chat", agentChatRequestBody),
      }),
    ],
    [
      "Read repo activity",
      renderCodeExample({
        title: "GET /api/repos/{repo_id}/activity",
        description: "Read recent persisted activity events for a registered repository.",
        samples: buildCodeSamples("GET", "/api/repos/93b2cfb4f88278ad/activity?limit=20", null),
      }),
    ],
  ]),
  "/non-api-endpoints": renderDoc("Non-API-Prefixed Endpoints", [
    [
      "GET /health",
      `<p>Global health endpoint with the same intent as <code class="inline">/api/health</code>.</p>`,
    ],
  ]),
  "/notes-for-docs-ui": renderDoc("Current Product Direction Vs Current Implementation", [
    [
      "Strongest examples today",
      `<ul>
        <li>Unified query over multiple GitHub evidence domains</li>
        <li>Operational views such as health, blockers, and release readiness</li>
        <li>Workflow and deployment-aware answers</li>
        <li>Tenant-scoped repo registration and usage tracking</li>
      </ul>`,
    ],
    [
      "Current caveats",
      `<ul>
        <li><code class="inline">time_range</code> on <code class="inline">/api/query</code> is accepted but not yet a strong execution filter</li>
        <li>Omitting <code class="inline">repo_ids</code> on <code class="inline">/api/query</code> does not yet mean all repos in the org</li>
        <li>Issue and PR chat responses do not yet expose rich <code class="inline">sources</code></li>
        <li>Registration does not yet perform repository indexing or backfill</li>
        <li>Some endpoints still have inconsistent error semantics inherited from older router code</li>
      </ul>`,
    ],
  ]),
  "/api/health": renderEndpoint({
    title: "GET /api/health",
    method: "GET",
    path: "/api/health",
    what: "Lightweight authenticated-surface health check.",
    why: ["Service liveness probes", "Uptime monitoring", "Basic readiness checks before sending traffic"],
    auth: "none",
    requestBody: null,
    response: `{
  "status": "ok",
  "service": "running"
}`,
  }),
  "/api/query": renderEndpoint({
    title: "POST /api/query",
    method: "POST",
    path: "/api/query",
    what: "Runs the unified GitHub intelligence query path and returns a compact answer with sources, confidence, and trace id.",
    why: [
      "Best single entry point for broad GitHub questions",
      "Combines intent planning, evidence collection, timeline lookup, derived operational views, and synthesis",
      "Well suited for dashboards, chat panels, and query boxes where response shape should stay stable",
    ],
    how: [
      "Classifies the question into evidence domains such as code, commits, PRs, issues, workflows, deployments, releases, and timeline",
      "Resolves the requested registered repositories",
      "Gathers domain evidence per repo, using cached payloads when live collection fails",
      "Builds derived views like repo health, blockers, release readiness, and recent changes",
      "Synthesizes a final answer and records a trace",
    ],
    auth: "public developer auth",
    best: ["What changed in the last day?", "What is blocking release?", "What failed recently in CI?", "Is this repo healthy right now?"],
    requestBody: quickRequestBody,
    fields: ["question: required natural-language query", "repo_ids: optional list of registered repo_id values", "time_range: optional string passed through to tracing and response metadata"],
    notes: [
      "Always pass repo_ids for now if you want repo-scoped evidence",
      "Omitting repo_ids does not currently trigger an organization-wide search across all registered repositories",
      "time_range is accepted and returned, but the current evidence collection path does not strongly enforce it as a hard filter",
    ],
    response: `{
  "answer": "string",
  "token_usage": {
    "input_tokens": 0,
    "output_tokens": 0,
    "total_tokens": 0
  },
  "trace_id": "trace_xxx",
  "confidence": 0.8,
  "sources": ["timeline_event:123", "/repos/owner/repo/pulls?state=all"]
}`,
    errors: ["401 missing or invalid API key", "403 API key belongs to another org or is revoked", "404 organization not found", "429 throttled or out of credits"],
  }),
  "/api/chat-with-repo": renderEndpoint({
    title: "POST /api/chat-with-repo",
    method: "POST",
    path: "/api/chat-with-repo",
    what: "Answers repository structure and code understanding questions by inspecting the registered repo's codebase.",
    why: [
      "Designed for code-aware explanations rather than generic repo metadata",
      "Can explain architecture, key modules, stack, major flows, and implementation patterns",
      "Returns file paths used for grounding, which is useful for clickable doc-site or IDE integrations",
    ],
    auth: "public developer auth",
    best: ["What does this repository do?", "Explain the auth flow.", "Where is webhook ingestion implemented?", "Summarize the architecture and key modules."],
    requestBody: repoChatRequestBody,
    fields: ["repo_id: required registered repository id", "question: required natural-language repo question"],
    notes: ["Initial file pick: 8", "Overview file cap: 8", "Max fetched files per answer: 20", "Max expansion iterations: 2", "File contents are truncated at 10,000 characters per file"],
    response: `{
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
}`,
    errors: ["404 repository not registered for the organization", "400 stored repo URL cannot be parsed as a GitHub repo URL", "429 throttled or out of credits"],
  }),
  "/api/issues-chat": renderEndpoint({
    title: "POST /api/issues/chat",
    method: "POST",
    path: "/api/issues/chat",
    what: "Provides issue-focused analysis over a registered repository.",
    why: [
      "Supports both direct issue analysis and issue discovery/search mode",
      "Good fit for triage tools, support workflows, release notes prep, and issue backlog UIs",
      "Can summarize a single issue thread or scan recent issues for patterns",
    ],
    auth: "public developer auth",
    best: ["Find the most discussed issues.", "Which issues look unresolved?", "Are there issues mentioning workarounds?", "Summarize this issue."],
    requestBody: issuesChatRequestBody,
    fields: ["repo_id: required", "message: required", "issue_number: optional, enables direct issue mode", "context.include_comments: optional, defaults to true"],
    notes: ["chat_id is accepted in the schema but not used by the endpoint", "context.depth exists in the schema default but is not used", "sources is currently empty even when live issue data was used", "Missing repo currently returns a 200 JSON error payload instead of a 404"],
    response: `{
  "reply": "string",
  "sources": [],
  "token_usage": {
    "input_tokens": 0,
    "output_tokens": 0,
    "total_tokens": 0
  }
}`,
    errors: ["GitHub fetch failures are returned as 502 in search mode"],
  }),
  "/api/pull-requests-chat": renderEndpoint({
    title: "POST /api/pull-requests/chat",
    method: "POST",
    path: "/api/pull-requests/chat",
    what: "Provides PR-focused analysis over a registered repository.",
    why: ["Works well for change review experiences and PR intelligence panels", "Supports both direct PR reasoning and query-based PR discovery mode", "Can incorporate diff text and check-run status for a richer answer on a known PR"],
    auth: "public developer auth",
    best: ["Merged PRs from last week", "PRs related to auth or performance", "PRs with review friction or changes requested"],
    requestBody: pullRequestChatRequestBody,
    fields: ["repo_id: required", "message: required", "pr_number: optional, enables direct PR mode", "context.include_diff: optional, defaults to true", "context.include_checks: optional, defaults to true"],
    notes: ["chat_id is accepted in the schema but not used", "sources is currently empty even when diff and check data were used", "If the repo has a stored credential_id but the token cannot be resolved, the endpoint returns 403", "GitHub fetch failures in search mode return 502"],
    response: `{
  "reply": "string",
  "sources": [],
  "token_usage": {
    "input_tokens": 0,
    "output_tokens": 0,
    "total_tokens": 0
  }
}`,
  }),
  "/api/workflows-chat": renderEndpoint({
    title: "POST /api/workflows/chat",
    method: "POST",
    path: "/api/workflows/chat",
    what: "Answers GitHub Actions workflow questions for a registered repo.",
    why: ["Purpose-built for CI/CD questions rather than general chat", "Supports repo-level, workflow-level, and specific run-level investigation", "Can optionally include run logs for deeper failure analysis"],
    auth: "public developer auth",
    best: ["What is workflow health this week?", "Why did this run fail?", "Which jobs look flaky?", "Are deployments failing alongside CI?"],
    requestBody: workflowChatRequestBody,
    notes: ["Repo-level mode can answer even without a repo-attached credential if enough evidence is available", "Live GitHub Actions fetch mode uses the repo's resolved token when available", "If Azure OpenAI is not configured, the service returns a plain fallback message instead of an LLM-generated answer", "Upstream live GitHub fetch failures return 502"],
    response: `{
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
}`,
  }),
  "/api/agent-chat": renderEndpoint({
    title: "POST /api/agent/chat",
    method: "POST",
    path: "/api/agent/chat",
    what: "Runs the autonomous investigation controller for cross-domain repository questions.",
    why: ["Best fit for investigate-and-correlate workflows", "The server-side agent can decide whether to inspect workflows, deployments, PRs, and issues based on the query", "Useful when a static single-domain endpoint would force your client to orchestrate multiple calls"],
    auth: "public developer auth",
    best: ["Why did CI fail and are there related open issues?", "What are the top release blockers?", "Did a recent PR likely cause deployment instability?"],
    requestBody: agentChatRequestBody,
    notes: ["If Azure OpenAI is not configured, the request fails because the agent requires model-based orchestration", "This endpoint is the heaviest public endpoint and currently carries the highest credit weight", "For simple known-object queries the domain-specific endpoints are cheaper and more predictable"],
    response: `{
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
}`,
  }),
  "/api/repo-activity": renderEndpoint({
    title: "GET /api/repos/{repo_id}/activity",
    method: "GET",
    path: "/api/repos/{repo_id}/activity?limit=20",
    what: "Returns recent persisted activity events for a registered repository.",
    why: ["Ideal for evidence panels, dashboards, feeds, and event timelines", "Complements /api/query by returning event data rather than a synthesized answer", "Useful for audit-style views and timelines"],
    auth: "public developer auth",
    requestBody: null,
    fields: ["Path param: repo_id", "Query param: limit default 20"],
    notes: ["Returns 200 with an empty events array when the repo exists but no activity is stored yet", "Returns 404 only when the repository is not registered to the org"],
    response: `{
  "found": true,
  "repo_id": "93b2cfb4f88278ad",
  "repo_url": "https://github.com/owner/repo",
  "repository_full_name": "owner/repo",
  "events": [],
  "event_count": 0
}`,
  }),
  "/api/usage": renderEndpoint({
    title: "GET /api/usage",
    method: "GET",
    path: "/api/usage?limit=20",
    what: "Returns a usage summary for the calling API key.",
    why: ["Easy way to build a self-serve developer dashboard", "Shows request volume, token estimates, error counts, recent requests, and hottest endpoints", "Useful for teams monitoring adoption and debugging integration problems"],
    auth: "public developer auth",
    requestBody: null,
    fields: ["Query param: limit optional, 1..100, default 20"],
    notes: ["This endpoint is API-key scoped, not full organization analytics"],
    response: `{
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
  "recent_requests": []
}`,
  }),
  "/api/usage-logs": renderEndpoint({
    title: "GET /api/usage/logs",
    method: "GET",
    path: "/api/usage/logs?page=1&limit=25",
    what: "Returns paginated raw usage logs for the calling API key.",
    why: ["Request-level troubleshooting", "Latency analysis", "Recent-failure audits", "Powering log tables and infinite-scroll usage views"],
    auth: "public developer auth",
    requestBody: null,
    fields: ["Query param: page optional, >=1, default 1", "Query param: limit optional, 1..100, default 25"],
    notes: ["has_more is derived from len(items) >= limit, so treat it as a practical paging hint rather than a total-count guarantee"],
    response: `{
  "page": 1,
  "limit": 25,
  "items": [],
  "has_more": false
}`,
  }),
  "/api/repos-register": renderEndpoint({
    title: "POST /api/repos/register",
    method: "POST",
    path: "/api/repos/register",
    what: "Registers a GitHub repository to an organization and returns a stable repo_id.",
    why: ["This is the onboarding step that makes the rest of the public API practical", "Your application can keep a stable repo_id instead of repeatedly passing full repo URLs", "Registration is idempotent for the same organization and repo"],
    auth: "public developer auth",
    requestBody: repoRegisterRequestBody,
    fields: ["provider: required; current product direction is GitHub-first", "repo_url: required GitHub repository URL", "branch: accepted but not currently used during registration", "visibility: optional, defaults to private", "credential_id: required if visibility is private"],
    notes: ["For private repos without credential_id, the current implementation returns a JSON error body instead of raising an HTTP 4xx", "Registration does not clone, index, or backfill the repository yet", "The real value of this endpoint is identity, access scoping, and enabling downstream API calls"],
    response: `{
  "repo_id": "93b2cfb4f88278ad",
  "status": "registered"
}`,
    errors: ["409 when the same repo URL is already registered under a different organization with attached credentials"],
  }),
};

function endpoint(title, purpose, auth, request, response, context) {
  const [method, ...rest] = title.split(" ");
  const path = rest.join(" ");
  const requestSection = renderCodeExample({
    title,
    description: `${purpose} ${context}`,
    samples: buildCodeSamples(method, normalizePath(path), method !== "GET" ? request : null),
  });

  return renderDoc(title, [
    ["What it does", `<p>${purpose}</p>`],
    ["Authentication", `<p>${auth}</p>`],
    ["Why developers use it", `<p>${context}</p>`],
    ["Example request", requestSection],
    ["Request body", request ? `<pre>${escapeHtml(request)}</pre>` : `<p>No body.</p>`],
    ["Success response", response ? `<pre>${escapeHtml(response)}</pre>` : `<p>No body.</p>`],
  ]);
}

function renderEndpoint(config) {
  const summaryBar = renderEndpointSummary(config);
  const parameterSections = renderParameterSections(config);
  const statusCodes = renderStatusCodes(config.errors);
  const notesBlock = config.notes ? compactBlock("Notes", htmlList(config.notes)) : "";

  return `
    <div class="breadcrumbs">Home <span>&rsaquo;</span> API <span>&rsaquo;</span> ${escapeHtml(config.title)}</div>
    <div class="doc-hero endpoint-hero">
      <span class="eyebrow">Endpoint reference</span>
      <div class="endpoint-title-row">
        <h2>${escapeHtml(config.title)}</h2>
      </div>
      <p class="hero-text">${config.what}</p>
    </div>
    <div class="endpoint-page">
      ${summaryBar}
      <div class="endpoint-main-grid">
        ${renderCodeExample({
          title: config.title,
          description: config.requestDescription || config.what,
          samples: buildCodeSamples(config.method, normalizePath(config.path), config.requestBody),
        })}
        <div class="endpoint-response-card">
          <div class="mini-label">Response</div>
          <pre>${escapeHtml(config.response)}</pre>
        </div>
      </div>
      <div class="endpoint-ref-grid">
        ${parameterSections ? compactBlock("Parameters", parameterSections) : ""}
        ${statusCodes ? compactBlock("Status codes", statusCodes) : ""}
      </div>
      ${notesBlock ? `<div class="endpoint-secondary-grid">${notesBlock}</div>` : ""}
    </div>
  `;
}

function renderEndpointSummary(config) {
  const headerItems = [
    ["Method", `<code class="inline">${config.method}</code>`],
    ["Path", `<code class="inline">${escapeHtml(config.path.split("?")[0])}</code>`],
    ["Auth", `<span>${escapeHtml(config.auth)}</span>`],
    ["Base URL", `<code class="inline">${baseUrl}</code>`],
  ];

  return `
    <div class="endpoint-summary">
      ${headerItems
        .map(
          ([label, value]) => `
            <div class="endpoint-summary-item">
              <span class="endpoint-summary-label">${label}</span>
              <div class="endpoint-summary-value">${value}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderParameterSections(config) {
  const groups = [];
  const headerParams = config.auth === "none"
    ? []
    : [
        "Authorization: Bearer <API_KEY>",
        "X-Organization-Id: <ORG_ID>",
      ];

  if (headerParams.length) {
    groups.push(["Headers", headerParams]);
  }

  const pathParams = (config.fields || []).filter((field) => field.toLowerCase().startsWith("path param:"));
  const queryParams = (config.fields || []).filter((field) => field.toLowerCase().startsWith("query param:"));
  const bodyParams = (config.fields || []).filter(
    (field) => !field.toLowerCase().startsWith("path param:") && !field.toLowerCase().startsWith("query param:")
  );

  if (pathParams.length) {
    groups.push(["Path parameters", pathParams.map((item) => item.replace(/^Path param:\s*/i, ""))]);
  }

  if (queryParams.length) {
    groups.push(["Query parameters", queryParams.map((item) => item.replace(/^Query param:\s*/i, ""))]);
  }

  if (bodyParams.length && config.method !== "GET") {
    groups.push(["Request body", bodyParams]);
  }

  if (!groups.length) {
    return "";
  }

  return `
    <div class="parameter-groups">
      ${groups
        .map(
          ([heading, items]) => `
            <div class="parameter-group">
              <h3>${heading}</h3>
              ${htmlList(items)}
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderStatusCodes(errors) {
  const rows = [["200", "Successful response"]];

  (errors || []).forEach((error) => {
    const match = error.match(/^(\d{3})\s+(.*)$/);
    if (match) {
      rows.push([match[1], match[2]]);
    } else {
      rows.push(["Note", error]);
    }
  });

  return `
    <div class="status-table">
      ${rows
        .map(
          ([code, description]) => `
            <div class="status-row">
              <div class="status-code">${escapeHtml(code)}</div>
              <div class="status-description">${escapeHtml(description)}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderDoc(title, sections) {
  const blocks = sections
    .map(
      ([heading, body]) => `
        <section class="doc-section">
          ${heading ? `<div class="doc-section-head"><h2>${heading}</h2></div>` : ""}
          <div class="doc-section-body">${body}</div>
        </section>
      `
    )
    .join("");

  return `
    <div class="breadcrumbs">Home <span>&rsaquo;</span> API <span>&rsaquo;</span> ${escapeHtml(title)}</div>
    <div class="doc-hero doc-page-header">
      <span class="eyebrow">Reference</span>
      <h2>${escapeHtml(title)}</h2>
    </div>
    <div class="doc-shell">${blocks}</div>
  `;
}

function htmlList(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function compactBlock(title, body) {
  return `
    <section class="compact-block">
      <div class="mini-label">${title}</div>
      <div class="compact-block-body">${body}</div>
    </section>
  `;
}

function escapeHtml(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function normalizePath(path) {
  return path.replace("{repo_id}", "93b2cfb4f88278ad");
}

function buildCodeSamples(method, path, body) {
  const url = `${baseUrl}${path}`;
  const authHeaders = [
    `  -H "Authorization: Bearer YOUR_API_KEY"`,
    `  -H "X-Organization-Id: YOUR_ORG_ID"`,
  ];

  if (method === "GET") {
    return {
      curl: [`curl -X ${method} "${url}"`, ...authHeaders].join(" \\\n"),
      javascript: `const response = await fetch("${url}", {
  method: "${method}",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "X-Organization-Id": "YOUR_ORG_ID"
  }
});

const data = await response.json();
console.log(data);`,
      python: `import requests

response = requests.${method.toLowerCase()}(
    "${url}",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "X-Organization-Id": "YOUR_ORG_ID",
    },
)

print(response.json())`,
    };
  }

  return {
    curl: [`curl -X ${method} "${url}"`, ...authHeaders, `  -H "Content-Type: application/json"`, `  -d '${body}'`].join(" \\\n"),
    javascript: `const response = await fetch("${url}", {
  method: "${method}",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "X-Organization-Id": "YOUR_ORG_ID",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(${body})
});

const data = await response.json();
console.log(data);`,
    python: `import requests

response = requests.${method.toLowerCase()}(
    "${url}",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "X-Organization-Id": "YOUR_ORG_ID",
        "Content-Type": "application/json",
    },
    json=${body}
)

print(response.json())`,
  };
}

function renderCodeExample({ title, description, samples }) {
  const sampleEntries = Object.entries(samples);
  const options = sampleEntries
    .map(([language]) => `<option value="${language}">${labelForLanguage(language)}</option>`)
    .join("");
  const blocks = sampleEntries
    .map(
      ([language, code]) => `
        <pre class="code-block ${language === "curl" ? "is-active" : ""}" data-language-block="${language}">${escapeHtml(code)}</pre>
      `
    )
    .join("");

  return `
    <div class="code-example">
      <div class="code-example-copy">
        <h3>${title}</h3>
        <p>${description}</p>
      </div>
      <div class="code-panel" data-code-example>
        <div class="code-toolbar">
          <select class="code-language-select" aria-label="Choose programming language">
            ${options}
          </select>
          <button class="copy-button" type="button">Copy code</button>
        </div>
        <div class="code-stack">
          ${blocks}
        </div>
      </div>
    </div>
  `;
}

function labelForLanguage(language) {
  if (language === "curl") return "cURL";
  if (language === "javascript") return "JavaScript";
  if (language === "python") return "Python";
  return language;
}

function render(pathname) {
  const content = pages[pathname] || pages["/"];
  page.innerHTML = content;

  document.querySelectorAll("[data-route]").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("data-route") === pathname);
  });
}

function navigate(pathname) {
  history.pushState({}, "", pathname);
  render(pathname);
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-route]");
  if (target) {
    event.preventDefault();
    navigate(target.getAttribute("data-route"));
    return;
  }

  const copyButton = event.target.closest(".copy-button");
  if (!copyButton) {
    return;
  }

  const codePanel = copyButton.closest("[data-code-example]");
  const activeBlock = codePanel.querySelector(".code-block.is-active");
  navigator.clipboard.writeText(activeBlock.textContent).then(() => {
    const originalText = copyButton.textContent;
    copyButton.textContent = "Copied";
    window.setTimeout(() => {
      copyButton.textContent = originalText;
    }, 1200);
  });
});

window.addEventListener("popstate", () => render(location.pathname));

document.addEventListener("change", (event) => {
  const select = event.target.closest(".code-language-select");
  if (!select) {
    return;
  }

  const codePanel = select.closest("[data-code-example]");
  codePanel.querySelectorAll(".code-block").forEach((block) => {
    block.classList.toggle("is-active", block.dataset.languageBlock === select.value);
  });
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  document.querySelectorAll(".nav-item").forEach((item) => {
    const visible = item.textContent.toLowerCase().includes(query);
    item.style.display = visible ? "block" : "none";
  });
});

render(location.pathname);

