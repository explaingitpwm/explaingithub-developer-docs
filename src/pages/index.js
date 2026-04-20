import React from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";

export default function Home() {
  return (
    <Layout
      title="ExplainingGitHub Developer Docs"
      description="Developer documentation for ExplainingGitHub API."
    >
      <main style={{ maxWidth: 920, margin: "0 auto", padding: "4rem 1.25rem" }}>
        <h1 style={{ marginBottom: "0.75rem" }}>ExplainingGitHub API Platform</h1>
        <p style={{ marginBottom: "1.25rem", color: "#4b5563" }}>
          Explore guides, API docs, and examples for the ExplainingGitHub API.
        </p>
        <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
          <Link className="button button--primary button--lg" to="/api/docs/">
            Open docs
          </Link>
          <Link className="button button--secondary button--lg" to="/api/docs/quickstart">
            Quickstart
          </Link>
        </div>
      </main>
    </Layout>
  );
}
