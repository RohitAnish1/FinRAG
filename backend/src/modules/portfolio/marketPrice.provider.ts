import axios from "axios";

const FASTAPI_BASE_URL = "http://localhost:8000";

export async function getLivePrices(
  symbols: string[]
): Promise<Record<string, { currentPrice: number; previousClose: number }>> {
  if (symbols.length === 0) return {};

  try {
    const response = await axios.post(
      `${FASTAPI_BASE_URL}/api/prices`,
      { symbols }
    );

    // Ensure the response includes both `currentPrice` and `previousClose`
    return response.data.reduce((acc: any, item: any) => {
      acc[item.symbol] = {
        currentPrice: item.currentPrice,
        previousClose: item.previousClose,
      };
      return acc;
    }, {});
  } catch (err) {
    console.error("Failed to fetch live prices from FastAPI");
    throw new Error("Market price service unavailable");
  }
}