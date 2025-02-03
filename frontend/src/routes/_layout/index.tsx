import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/_layout/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* ✅ Hero Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          padding: "3rem",
          background: "linear-gradient(135deg, #007BFF, #0056b3)",
          borderRadius: "12px",
          color: "white",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1 style={{ margin: "0", fontSize: "2.5rem", fontWeight: "bold" }}>
          Web Data Commons Analyzer
        </h1>
        <p style={{ fontSize: "1.2rem", marginTop: "0.5rem", opacity: 0.9 }}>
          An interactive tool for exploring, visualizing, and analyzing RDF data
          extracted from the Web Data Commons project.
        </p>
      </div>

      {/* ✅ Two-Column Layout */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "center",
          marginBottom: "3rem",
        }}
      >
        {/* Left: Description Section */}
        <div style={{ flex: "1", textAlign: "left" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Why use this tool?</h2>
          <p style={{ fontSize: "1rem", color: "#555", lineHeight: "1.6" }}>
            The Web Data Commons Analyzer allows users to:
          </p>
          <ul style={{ paddingLeft: "1rem", color: "#333", fontSize: "1rem" }}>
            <li>📊 Visualize data with **Charts**</li>
            <li>🔗 Analyze relationships using **Graphs**</li>
            <li>📜 Explore RDF **Records**</li>
            <li>📂 Export data in **JSON-LD** or **RDF** formats</li>
            <li>⚡ Gain insights into **structured web data**</li>
          </ul>
        </div>

        {/* Right: Quick Access Buttons */}
        <div
          style={{
            flex: "1",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          {[
            { title: "View Records", description: "Browse raw RDF triples", route: "/visualize/records", icon: "📄" },
            { title: "View Charts", description: "Analyze datasets visually", route: "/visualize/charts", icon: "📊" },
            { title: "View Graphs", description: "Explore entity relationships", route: "/visualize/graphs", icon: "🔗" },
            { title: "Export Data", description: "Download RDF & JSON-LD", route: "/export", icon: "📥" },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                padding: "1.5rem",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                textAlign: "center",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => navigate({ to: feature.route })}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.1)")
              }
            >
              <h2 style={{ margin: "0", fontSize: "1.5rem" }}>{feature.icon}</h2>
              <h3 style={{ margin: "0.5rem 0", fontSize: "1.2rem" }}>{feature.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "#555" }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Footer Section (Optional) */}
      <div
        style={{
          textAlign: "center",
          padding: "1rem",
          marginTop: "3rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          Built with ❤️ for structured web data analysis |{" "}
          <a href="https://webdatacommons.org/" target="_blank" rel="noopener noreferrer" style={{ color: "#007BFF", textDecoration: "none" }}>
            Learn more
          </a>
        </p>
      </div>
    </div>
  );
}

export default Home;
