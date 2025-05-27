// ConceptForm.jsx
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Basic Quill styling

import { createClient } from "@supabase/supabase-js";

// Ensure these are securely loaded, e.g., from environment variables in a real app
const SUPABASE_URL = "https://bhxswytbbuoxcxhtanzm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeHN3eXRiYnVveGN4aHRhbnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzU2NTksImV4cCI6MjA2Mzg1MTY1OX0.32LDg5aQWRSNAOYnV8kYtnkIF0CAuQeuFsDvW6rHmT4";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ConceptForm = () => {
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [formMessage, setFormMessage] = useState({ text: "", type: "" }); // For success/error feedback
  const [isSubmitting, setIsSubmitting] = useState(false); // To prevent double submissions

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ text: "", type: "" }); // Clear previous messages
    setIsSubmitting(true); // Disable button during submission

    // Basic validation for content
    if (!content.trim() || content === "<p><br></p>") {
      setFormMessage({
        text: "Concept content cannot be empty.",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from("concepts_new").insert([
        {
          content,
          priority,
          last_revised: new Date().toISOString(), // auto timestamp
        },
      ]);

      if (error) {
        console.error("Supabase insert error:", error); // logs to browser console
        setFormMessage({
          text: "Error saving concept: " + error.message,
          type: "error",
        });
      } else {
        setFormMessage({
          text: "Concept saved successfully!",
          type: "success",
        });
        setContent(""); // Clear the editor
        setPriority("Medium"); // Reset priority
      }
    } catch (err) {
      console.error("Submission error:", err);
      setFormMessage({
        text: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  // Custom toolbar setup for ReactQuill
  const modules = {
    toolbar: {
      container: "#toolbar-container", // Link to the custom toolbar div
    },
  };

  // Ensure formats match the buttons in your custom toolbar
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "link",
    "formula",
    "align", // Added based on your custom toolbar
    "clean",
  ];

  return (
    <>
      {/* Embedded CSS for the ConceptForm */}
      <style>{`
        /* --- Base Form Container --- */
        .concept-form-container {
          padding: 30px;
          max-width: 700px;
          margin: 60px auto;
          background-color: #ffffff; /* Clean white background */
          border-radius: 12px; /* Softer rounded corners */
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); /* More refined shadow */
          font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; /* Modern sans-serif font */
          color: #333;
          line-height: 1.6;
          animation: fadeIn 0.5s ease-out; /* Simple fade-in animation */
        }

        /* --- Title --- */
        .concept-form-title {
          text-align: center;
          color: #2c3e50; /* Darker blue-gray for titles */
          margin-bottom: 30px;
          font-size: 2.2em; /* Prominent title size */
          font-weight: 700;
          border-bottom: 1px solid #e0e0e0; /* Subtle separator */
          padding-bottom: 15px;
        }

        /* --- Form Groups (Labels + Inputs) --- */
        .form-group {
          margin-bottom: 25px; /* Consistent spacing between form elements */
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #444;
          font-size: 0.95em;
          text-transform: uppercase; /* Subtle uppercase for labels */
          letter-spacing: 0.5px;
        }

        /* --- ReactQuill Editor Styling --- */
        /* Target the container for the Quill editor */
        .concept-quill-editor-wrapper {
          border: 1px solid #dcdcdc; /* Clean, light border */
          border-radius: 8px; /* Match container rounding */
          background-color: #fcfcfc; /* Slightly off-white for distinction */
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06); /* Inner shadow for depth */
          display: flex; /* Flex container for toolbar and editor */
          flex-direction: column; /* Stack toolbar above editor */
          min-height: 350px; /* Overall min-height for the combined Quill area */
        }

        /* Custom Toolbar Specific Styles */
        #toolbar-container {
          border-bottom: 1px solid #dcdcdc; /* Consistent border */
          background-color: #f5f5f5; /* Light gray for toolbar background */
          padding: 10px 15px;
          border-top-left-radius: 8px; /* Match editor border radius */
          border-top-right-radius: 8px; /* Match editor border radius */
          flex-shrink: 0; /* Prevent toolbar from shrinking */
        }

        /* Target Quill's internal editor content area */
        .concept-quill-editor-wrapper .ql-editor {
          padding: 15px;
          flex-grow: 1; /* Allow editor to take remaining space */
          font-size: 1em;
          line-height: 1.6;
          color: #333; /* Ensure text color matches theme */
          min-height: 250px; /* Minimum height for the editor content itself */
        }

        /* Adjust Quill's placeholder text color */
        .concept-quill-editor-wrapper .ql-blank::before {
            color: #999 !important; /* Muted placeholder text */
            font-style: normal !important; /* Prevent italic placeholder */
        }

        /* --- Select Input Styling --- */
        .select-wrapper {
            position: relative; /* For custom arrow positioning */
        }

        .form-select {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #dcdcdc;
          border-radius: 8px; /* Match other elements */
          font-size: 1em;
          background-color: #fff;
          cursor: pointer;
          appearance: none; /* Hide default browser arrow */
          -webkit-appearance: none; /* For Safari */
          -moz-appearance: none; /* For Firefox */
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666' width='18px' height='18px'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E"); /* Custom SVG arrow */
          background-repeat: no-repeat;
          background-position: right 15px center; /* Position arrow */
          padding-right: 40px; /* Make space for the custom arrow */
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .form-select:focus {
          outline: none;
          border-color: #007bff; /* Highlight on focus */
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25); /* Subtle glow on focus */
        }

        /* --- Submit Button --- */
        .submit-button {
          width: 100%;
          padding: 15px 20px; /* More padding for a bolder button */
          background-color: #007bff; /* Primary blue */
          color: #fff;
          border: none;
          border-radius: 8px; /* Match form elements */
          font-size: 1.1em;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.35); /* Prominent shadow */
          letter-spacing: 0.5px; /* Slight letter spacing */
        }

        .submit-button:hover {
          background-color: #0056b3; /* Darker blue on hover */
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.45); /* More pronounced shadow on hover */
        }

        .submit-button:active {
          transform: translateY(1px); /* Slight press down effect */
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2); /* Reduced shadow on active */
        }

        .submit-button:disabled {
          background-color: #a0c9ef; /* Lighter blue when disabled */
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        /* --- Form Messages (Success/Error) --- */
        .form-message {
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 25px;
          text-align: center;
          font-size: 0.95em;
          font-weight: 500;
          animation: slideInFromTop 0.4s ease-out; /* Animation for messages */
        }

        .form-message.success {
          background-color: #d4edda; /* Light green */
          color: #155724; /* Dark green text */
          border: 1px solid #c3e6cb;
        }

        .form-message.error {
          background-color: #f8d7da; /* Light red */
          color: #721c24; /* Dark red text */
          border: 1px solid #f5c6cb;
        }

        /* --- Animations --- */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInFromTop {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* --- Responsive Adjustments --- */
        @media (max-width: 768px) {
          .concept-form-container {
            margin: 20px; /* Smaller margins on smaller screens */
            padding: 20px;
            border-radius: 8px; /* Slightly less rounded */
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Softer shadow for mobile */
          }

          .concept-form-title {
            font-size: 1.8em; /* Smaller title on mobile */
            margin-bottom: 20px;
            padding-bottom: 10px;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-label {
            font-size: 0.9em;
          }

          .concept-quill-editor-wrapper {
            min-height: 300px; /* Slightly shorter overall editor on mobile */
          }

          .concept-quill-editor-wrapper .ql-editor {
              min-height: 200px; /* Adjusted editor content min-height */
              padding: 10px; /* Less padding inside editor */
          }

          #toolbar-container {
              padding: 8px 10px; /* Less padding in toolbar */
          }

          .form-select {
            padding: 10px 12px;
            font-size: 0.95em;
          }

          .submit-button {
            padding: 12px 15px;
            font-size: 1em;
          }

          .form-message {
            padding: 10px;
            margin-bottom: 15px;
          }
        }
      `}</style>

      <div className="concept-form-container">
        <h2 className="concept-form-title">Add a New Concept</h2>

        <form onSubmit={handleSubmit} className="concept-form">
          {/* Form Message Display */}
          {formMessage.text && (
            <div className={`form-message ${formMessage.type}`}>
              {formMessage.text}
            </div>
          )}

          {/* ReactQuill Editor and Custom Toolbar */}
          <div className="form-group">
            <label htmlFor="concept-content" className="form-label">
              Concept Content
            </label>
            <div className="concept-quill-editor-wrapper">
              {" "}
              {/* New wrapper for combined toolbar and editor styling */}
              <div id="toolbar-container">
                <span className="ql-formats">
                  <select className="ql-font" />
                  <select className="ql-size" />
                </span>
                <span className="ql-formats">
                  <button className="ql-bold" />
                  <button className="ql-italic" />
                  <button className="ql-underline" />
                  <button className="ql-strike" />
                </span>
                <span className="ql-formats">
                  <select className="ql-color" />
                  <select className="ql-background" />
                </span>
                <span className="ql-formats">
                  <button className="ql-blockquote" />
                  <button className="ql-code-block" />
                </span>
                <span className="ql-formats">
                  <button className="ql-list" value="ordered" />
                  <button className="ql-list" value="bullet" />
                  <button className="ql-indent" value="-1" />
                  <button className="ql-indent" value="+1" />
                </span>
                <span className="ql-formats">
                  <select className="ql-align" />
                </span>
                <span className="ql-formats">
                  <button className="ql-link" />
                  <button className="ql-formula" />
                </span>
                <span className="ql-formats">
                  <button className="ql-clean" />
                </span>
              </div>
              <ReactQuill
                id="concept-content"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Write your concept here with LaTeX..."
                // No className here, as styles are applied to the wrapper and Quill's internal classes
              />
            </div>
          </div>

          {/* Priority Selector */}
          <div className="form-group">
            <label htmlFor="priority-select" className="form-label">
              Priority
            </label>
            <div className="select-wrapper">
              <select
                id="priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-select"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting} // Disable button when submitting
          >
            {isSubmitting ? "Saving..." : "Save Concept"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ConceptForm;
