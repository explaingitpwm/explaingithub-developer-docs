// @ts-check

const config = {
  title: "ExplainingGitHub Developers",
  tagline: "API documentation for explaingithub.com",
  url: "https://developers.explaingithub.com",
  baseUrl: "/",
  organizationName: "explaingithub",
  projectName: "developer-docs",
  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn"
    }
  },
  future: {
    faster: {
      rspackBundler: true,
      rspackPersistentCache: false
    }
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en"]
  },
  presets: [
    [
      "classic",
      {
        docs: {
          path: "docs",
          routeBasePath: "api/docs",
          sidebarPath: require.resolve("./sidebars.js")
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ],
  themeConfig: {
    metadata: [
      {
        name: "description",
        content: "Enterprise developer portal for the ExplainingGitHub API."
      }
    ],
    navbar: {
      title: "ExplainingGitHub Developers",
      hideOnScroll: true,
      items: [
        {
          to: "/",
          position: "left",
          label: "Home"
        },
        {
          to: "/api/docs/",
          position: "left",
          label: "API"
        },
        {
          to: "/api/docs/api/query",
          position: "left",
          label: "API Reference"
        },
        {
          to: "/api/docs/quickstart",
          position: "left",
          label: "Quickstart"
        },
        {
          to: "/api/docs/changelog",
          position: "left",
          label: "Resources"
        },
        {
          href: "https://explaingithub.com",
          label: "API Dashboard",
          position: "right"
        }
      ]
    },
    footer: {
      style: "light",
      links: [
        {
          title: "Docs",
          items: [
            { label: "Overview", to: "/api/docs/" },
            { label: "Quickstart", to: "/api/docs/quickstart" },
            { label: "API reference", to: "/api/docs/api/query" }
          ]
        },
        {
          title: "Platform",
          items: [
            { label: "Authentication", to: "/api/docs/authentication" },
            { label: "Rate limits", to: "/api/docs/rate-limits" },
            { label: "Billing", to: "/api/docs/billing" }
          ]
        },
        {
          title: "Company",
          items: [{ label: "Product", href: "https://explaingithub.com" }]
        }
      ],
      copyright: `Copyright ${new Date().getFullYear()} ExplainingGitHub.`
    },
    colorMode: {
      defaultMode: "light",
      disableSwitch: false
    },
    prism: {
      additionalLanguages: ["bash", "json"]
    }
  }
};

module.exports = config;
