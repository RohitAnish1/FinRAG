import { apiClient } from "./client"

export async function getAnalytics() {
  try {
    const res = await apiClient.get("/analytics")
    return res.data
  } catch (error) {
    console.error("Failed to fetch analytics:", error)
    throw error
  }
}