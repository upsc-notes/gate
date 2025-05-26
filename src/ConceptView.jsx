import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "react-router-dom"; // ✅ for route params

// Initialize Supabase client
const supabaseUrl = "https://bhxswytbbuoxcxhtanzm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeHN3eXRiYnVveGN4aHRhbnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzU2NTksImV4cCI6MjA2Mzg1MTY1OX0.32LDg5aQWRSNAOYnV8kYtnkIF0CAuQeuFsDvW6rHmT4";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ConceptView() {
  const { id } = useParams(); // ✅ get the concept ID from the route
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchConcept() {
      try {
        const { data, error } = await supabase
          .from("concepts_new")
          .select("content, priority")
          .eq("id", parseInt(id)) // ✅ use the dynamic id
          .single();

        if (error) throw error;

        setContent(data.content || "");
        setPriority(data.priority || "");
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    if (id) fetchConcept(); // ✅ only fetch if id exists
  }, [id]);

  if (loading) return <p>Loading concept...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ maxWidth: 700, margin: "20px auto" }}>
      <h2>Concept (Priority: {priority})</h2>
      <ReactQuill
        value={content}
        readOnly={true}
        theme="snow"
        modules={{ toolbar: false }}
        style={{ height: "300px" }}
      />
    </div>
  );
}