/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  docsSidebar: [
    "overview",
    {
      type: "category",
      label: "Get Started",
      collapsed: false,
      items: ["quickstart", "authentication", "rate-limits", "billing", "curl-examples"]
    },
    {
      type: "category",
      label: "Platform",
      collapsed: false,
      items: [
        "non-api-endpoints",
        "notes-for-docs-ui",
        "changelog"
      ]
    },
    {
      type: "category",
      label: "API Reference",
      collapsed: false,
      items: [
        "api/health",
        "api/query",
        "api/chat-with-repo",
        "api/issues-chat",
        "api/pull-requests-chat",
        "api/workflows-chat",
        "api/agent-chat",
        "api/repo-activity",
        "api/usage",
        "api/usage-logs",
        "api/repos-register"
      ]
    }
  ]
};

module.exports = sidebars;
