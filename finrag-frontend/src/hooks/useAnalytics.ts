import { useEffect, useState } from "react"
import { getAnalytics } from "../api/analytics.api"

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAnalytics()
      .then(setAnalytics)
      .catch((err) => {
        console.error("Failed to fetch analytics", err)
        setError(err.message || "Failed to fetch analytics")
      })
      .finally(() => setLoading(false))
  }, [])

  return { analytics, loading, error }
}