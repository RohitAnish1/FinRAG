import { useEffect, useState } from "react";
import * as portfolioApi from "../api/portfolio.api";

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state

  async function load() {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const data = await portfolioApi.fetchPortfolio();
      setPortfolio(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load portfolio"); // Handle error
    } finally {
      setLoading(false);
    }
  }

  async function buy(payload: {
    symbol: string;
    shares: number;
    price: number;
    sector?: string;
  }) {
    try {
      await portfolioApi.buyStock(payload);
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to buy stock");
    }
  }

  async function sell(payload: {
    symbol: string;
    shares: number;
    price: number;
  }) {
    try {
      await portfolioApi.sellStock(payload);
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to sell stock");
    }
  }

  async function addCash(amount: number) {
    try {
      await portfolioApi.addCash(amount);
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to add cash");
      throw err;
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    portfolio,
    loading,
    error, // Expose error state
    buy,
    sell,
    addCash,
    refresh: load,
  };
}