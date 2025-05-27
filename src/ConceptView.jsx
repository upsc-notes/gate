import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Basic Quill styling
import { createClient } from "@supabase/supabase-js";
import { useParams } from "react-router-dom";
import { FaMoon, FaSun, FaExclamationTriangle } from "react-icons/fa"; // Icons for theme toggle and error

// Initialize Supabase client
const supabaseUrl = "https://bhxswytbbuoxcxhtanzm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeHN3eXRiYnVveGN4aHRhbnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzU2NTksImV4cCI6MjA2Mzg1MTY1OX0.32LDg5aQWRSNAOYnV8kYtnkIF0CAuQeuFsDvW6rHmT4";
const supabase = createClient(supabaseUrl, supabaseKey);

// --- PriorityBadge Component (retained for clean display) ---
const PriorityBadge = ({ priority }) => {
  const getBadgeColors = (prio) => {
    switch (prio?.toLowerCase()) {
      case "high":
        return { background: "#dc3545", shadow: "rgba(220, 53, 69, 0.4)" }; // Red (can keep this vibrant)
      case "medium":
        return { background: "#ffc107", shadow: "rgba(255, 193, 7, 0.4)" }; // Yellow/Orange
      case "low":
        return { background: "#28a745", shadow: "rgba(40, 167, 69, 0.4)" }; // Green
      default:
        return { background: "#6c757d", shadow: "rgba(108, 117, 125, 0.4)" }; // Gray
    }
  };

  const colors = getBadgeColors(priority);

  const badgeStyles = {
    padding: "8px 16px",
    borderRadius: "25px",
    fontWeight: "bold",
    fontSize: "0.95em",
    color: "#fff",
    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
    minWidth: "100px",
    textAlign: "center",
    boxShadow: `0 4px 15px ${colors.shadow}`, // Dynamic shadow
    letterSpacing: "0.5px",
    backgroundColor: colors.background, // Dynamic background
  };

  return <span style={badgeStyles}>{priority || "N/A"}</span>;
};

// --- Main ConceptView Component ---
export default function ConceptView() {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize dark mode from localStorage or system preference
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return (
        savedTheme === "dark" ||
        (savedTheme === null &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
      document.body.classList.toggle("dark-mode", isDarkMode);
      document.body.classList.toggle("light-mode", !isDarkMode);
    }
  }, [isDarkMode]);

  useEffect(() => {
    async function fetchConcept() {
      try {
        const { data, error: fetchError } = await supabase
          .from("concepts_new")
          .select("content, priority")
          .eq("id", parseInt(id))
          .single();

        if (fetchError) {
          if (fetchError.code === "PGRST116") {
            throw new Error(
              "Concept not found. It might have been deleted or never existed.",
            );
          }
          throw fetchError;
        }

        setContent(data.content || "");
        setPriority(data.priority || "");
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    if (id) {
      fetchConcept();
    } else {
      setError("No concept ID provided in the URL.");
      setLoading(false);
    }
  }, [id]);

  // Dynamic styles based on theme and responsiveness
  const getDynamicStyles = (darkMode) => ({
    container: {
      maxWidth: "920px",
      margin: "50px auto",
      padding: "50px",
      backgroundColor: darkMode
        ? "var(--bg-card-dark)"
        : "var(--bg-card-light)",
      borderRadius: "15px",
      boxShadow: darkMode
        ? "0 10px 40px rgba(0, 0, 0, 0.2)" // Softer shadow for dark mode
        : "0 10px 40px rgba(0, 0, 0, 0.15)",
      fontFamily: "var(--font-primary)",
      color: darkMode ? "var(--text-color-dark)" : "var(--text-color-light)",
      lineHeight: "1.8",
      fontSize: "1.15em",
      letterSpacing: "0.01em",
      transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "40px",
      paddingBottom: "25px",
      borderBottom: `1px solid ${darkMode ? "var(--border-color-dark)" : "var(--border-color-light)"}`,
      flexDirection: "column", // Default to column on small screens
      textAlign: "center",
    },
    title: {
      color: darkMode ? "var(--title-color-dark)" : "var(--title-color-light)",
      fontSize: "3em",
      fontWeight: "700",
      letterSpacing: "-0.02em",
      margin: 0,
      fontFamily: "var(--font-heading)",
      marginBottom: "20px", // Space between title and priority on small screens
    },
    priorityWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    priorityLabel: {
      fontWeight: "600",
      color: darkMode
        ? "var(--text-secondary-dark)"
        : "var(--text-secondary-light)",
      marginRight: "15px",
      fontSize: "1.1em",
    },
    contentSection: {},
    contentBox: {
      padding: "40px",
      border: "none",
      borderRadius: "10px",
      backgroundColor: darkMode
        ? "var(--bg-content-dark)"
        : "var(--bg-content-light)",
      minHeight: "500px",
      overflowY: "auto",
      boxShadow: darkMode
        ? "inset 0 2px 10px rgba(0,0,0,0.1)" // Softer inner shadow for dark mode
        : "0 2px 15px rgba(0,0,0,0.05)",
      lineHeight: "1.9",
      fontSize: "1.1em",
      transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    },
    quillDisplay: {},
    message: {
      textAlign: "center",
      fontSize: "1.6em",
      color: darkMode
        ? "var(--text-secondary-dark)"
        : "var(--text-secondary-light)",
      padding: "80px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    },
    themeToggleButton: {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: darkMode ? "var(--bg-content-dark)" : "var(--bg-card-light)",
      color: darkMode ? "var(--text-color-dark)" : "var(--title-color-light)",
      border: `1px solid ${darkMode ? "var(--border-color-dark)" : "var(--border-color-light)"}`,
      borderRadius: "50%",
      width: "50px",
      height: "50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "1.2em",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      transition:
        "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
      zIndex: 1000,
    },
    // Media queries (simulated with inline styles - for a real app, use a CSS file)
    "@media (min-width: 768px)": {
      header: {
        flexDirection: "row",
        textAlign: "left",
      },
      title: {
        marginBottom: "0",
      },
    },
    "@media (max-width: 767px)": {
      container: {
        margin: "20px",
        padding: "20px",
        borderRadius: "8px",
      },
      title: {
        fontSize: "2em",
      },
      contentBox: {
        padding: "20px",
        minHeight: "300px",
      },
      message: {
        padding: "40px",
        fontSize: "1.2em",
      },
    },
  });

  const currentStyles = getDynamicStyles(isDarkMode);

  return (
    <>
      {/* Global CSS variables for theming */}
      <style jsx>{`
        :root {
          --bg-body-light: #f4f6f8;
          --bg-card-light: #ffffff;
          --bg-content-light: #fcfcfc;
          --text-color-light: #333;
          --title-color-light: #2c3e50;
          --text-secondary-light: #7f8c8d;
          --border-color-light: #e0e0e0;

          /* NEW Minimalist Dark Mode Colors */
          --bg-body-dark: #1e1e2e; /* Muted dark blue-gray */
          --bg-card-dark: #2a2a3d; /* Slightly lighter card background */
          --bg-content-dark: #3a3a4e; /* Even lighter for content area, good contrast */
          --text-color-dark: #e0e0e0; /* Soft white for primary text */
          --title-color-dark: #f0f0f0; /* Brighter white for titles */
          --text-secondary-dark: #b0b0b0; /* Lighter gray for secondary text */
          --border-color-dark: #4a4a60; /* Darker border for separation */

          --font-primary: "Merriweather", Georgia, serif;
          --font-heading: "Playfair Display", serif;
        }

        body {
          background-color: var(--bg-body-light);
          transition: background-color 0.3s ease;
        }

        body.dark-mode {
          background-color: var(--bg-body-dark);
        }

        /* Override Quill's default font/line-height for better dark mode readability */
        .ql-editor {
          font-family: var(--font-primary) !important;
          font-size: 1.1em !important; /* Slightly larger for readability */
          line-height: 1.9 !important; /* Enhanced line height */
          color: ${isDarkMode
            ? "var(--text-color-dark)"
            : "var(--text-color-light)"} !important;
        }

        .ql-blank::before {
          color: ${isDarkMode
            ? "var(--text-secondary-dark)"
            : "var(--text-secondary-light)"} !important;
        }

        /* Basic responsiveness for the main container */
        @media (max-width: 767px) {
          .concept-view-container {
            margin: 20px !important;
            padding: 20px !important;
            border-radius: 8px !important;
          }
          .concept-view-title {
            font-size: 2em !important;
          }
          .concept-view-content-box {
            padding: 20px !important;
            min-height: 300px !important;
          }
          .concept-view-message {
            padding: 40px !important;
            font-size: 1.2em !important;
          }
        }

        /* Specific styles for header on small screens */
        @media (max-width: 767px) {
          .concept-view-header {
            flex-direction: column !important;
            text-align: center !important;
          }
          .concept-view-title {
            margin-bottom: 20px !important;
          }
        }

        /* Adjust Quill's height on smaller screens */
        @media (max-width: 767px) {
          .ql-container {
            min-height: 250px !important; /* Adjust if needed for better mobile experience */
          }
        }
      `}</style>

      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={currentStyles.themeToggleButton}
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? <FaSun /> : <FaMoon />}
      </button>

      <div className="concept-view-container" style={currentStyles.container}>
        <header className="concept-view-header" style={currentStyles.header}>
          <h1 className="concept-view-title" style={currentStyles.title}>
            Believe you can and you're halfway there.
          </h1>
          {/* Priority Wrapper was moved inside header for better mobile layout, ensure it's here */}
        </header>

        <div
          className="concept-view-content-section"
          style={currentStyles.contentSection}
        >
          <div
            className="concept-view-content-box"
            style={currentStyles.contentBox}
          >
            <ReactQuill
              value={content}
              readOnly={true}
              theme="bubble"
              modules={{ toolbar: false }}
              // No direct inline style for Quill's container as .ql-editor handles content styling
            />
          </div>
        </div>
      </div>
    </>
  );
}
