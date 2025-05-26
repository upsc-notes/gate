// ConceptForm.jsx
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bhxswytbbuoxcxhtanzm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeHN3eXRiYnVveGN4aHRhbnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzU2NTksImV4cCI6MjA2Mzg1MTY1OX0.32LDg5aQWRSNAOYnV8kYtnkIF0CAuQeuFsDvW6rHmT4";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ConceptForm = () => {
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("concepts_new").insert([
      {
        content,
        priority,
        last_revised: new Date().toISOString(), // auto timestamp
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error); // logs to browser console
      alert("Error saving concept: " + error.message); // shows actual error
    } else {
      alert("Concept saved successfully!");
      setContent("");
    }
  };

  const modules = {
    toolbar: "#toolbar-container",
  };

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
    "clean",
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h2>Insert Concept</h2>
      <form onSubmit={handleSubmit}>
        {/* Toolbar */}
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

        {/* Editor */}
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder="Write your concept here with LaTeX..."
        />

        {/* Priority */}
        <div style={{ marginTop: "10px" }}>
          <label>Priority: </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Save Concept
        </button>
      </form>
    </div>
  );
};

export default ConceptForm;
