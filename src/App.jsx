import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ConceptForm from "./ConceptForm";  // your form component
import ConceptView from "./ConceptView";  // your view component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/conceptform" replace />} />
        <Route path="/conceptform" element={<ConceptForm />} />
        <Route path="/concept/:id" element={<ConceptView />} />
        {/* Fallback if unknown route */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
