import { Router } from "express"
import {
  searchStocksController,
  addStockToPortfolioController,
} from "./market.controller"

const router = Router()

router.get("/search", searchStocksController)
router.post("/add", addStockToPortfolioController)

export default router
