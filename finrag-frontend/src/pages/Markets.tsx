"use client"

import { useMarkets } from "../hooks/useMarkets"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import Sidebar from "../components/Sidebar"
import MobileHeader from "../components/MobileHeader"
import Header from "../components/Header"

export default function Markets() {
  const { stocks, loading, error, addToPortfolio, searchStocks } = useMarkets()

  const handleSearch = (query: string) => {
    searchStocks(query)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader showSidebarButton />
        <Sidebar />
        <div className="md:ml-64">
          <Header />
          <div className="p-6">Loading stocks...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader showSidebarButton />
        <Sidebar />
        <div className="md:ml-64">
          <Header />
          <div className="p-6 text-red-500">Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader showSidebarButton />
      <Sidebar />
      <div className="md:ml-64">
        <Header />
        <div className="p-6">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search for stocks..."
              className="border p-2 rounded w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(e.currentTarget.value)
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map((stock: any) => (
              <Card key={stock.symbol}>
                <CardHeader>
                  <CardTitle>{stock.symbol}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>Price: ₹{stock.currentPrice}</div>
                  <div>Previous Close: ₹{stock.previousClose}</div>
                  <Button className="mt-4" onClick={() => addToPortfolio(stock)}>
                    Add to Portfolio
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}