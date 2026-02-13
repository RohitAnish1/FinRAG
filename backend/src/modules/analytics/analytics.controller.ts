import { Request, Response } from "express"
import { buildAnalytics } from "./analytics.service"

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || req.user?.userId

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const analytics = await buildAnalytics(userId)
    return res.json(analytics)
  } catch (error) {
    console.error("Analytics controller error:", error)
    return res.status(500).json({ message: "Analytics computation failed" })
  }
}