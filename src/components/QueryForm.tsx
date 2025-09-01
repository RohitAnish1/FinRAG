import React, { useState } from "react";
import { useQueryAPI } from "@/hooks/useQueryAPI";

const QueryForm: React.FC = () => {
  const [query, setQuery] = useState("");
  const { loading, error, data, sendQuery } = useQueryAPI();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents navigation
    console.log("Form submitted with query:", query); // Debug log
    sendQuery(query); // Calls backend API
  };

  // Debug log for displayed data
  console.log("Displayed data:", data);

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your financial query"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
      {/* Direct API test button for debugging */}
      <button
        type="button"
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => {
          console.log("Direct API button clicked with query:", query);
          sendQuery(query);
        }}
      >
        Test API
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {data && (
        <div className="mt-4">
          <h3 className="font-bold">Answer:</h3>
          <p>{data}</p>
        </div>
      )}
    </div>
  );
};

export default QueryForm;