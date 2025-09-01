import { useState } from "react";
import axios from "axios";

export const useQueryAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<string | null>(null);

  const sendQuery = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/query", { query });
      console.log("Backend Response:", response.data); // Log the response
      setData(response.data.answer);
    } catch (err: any) {
      console.error("Error:", err.response?.data?.detail || err.message);
      setError(err.response?.data?.detail || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, sendQuery };
};
