import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
      <Sidebar />
      <main className="flex-1 md:ml-64 flex flex-col h-screen">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-8 py-4 border-b bg-white">
          <div />
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-700">
              <span className="material-icons">notifications</span>
            </button>
            <button className="text-gray-400 hover:text-gray-700">
              <span className="material-icons">dark_mode</span>
            </button>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
              JD
            </div>
          </div>
        </div>
        {/* Dashboard Title */}
        <div className="px-8 pt-8 pb-2">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        {/* Dashboard Stats */}
        <div className="px-8 grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-gray-500 font-medium">Total Portfolio</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              $102,582.35
            </p>
            <p className="text-sm text-red-500 mt-1">
              ▼ 0.03% from yesterday
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-gray-500 font-medium">Day's Change</h3>
            <p className="text-3xl font-bold text-red-500 mt-2">-$27.33</p>
            <p className="text-sm text-red-500 mt-1">Loss today</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-gray-500 font-medium">Active Positions</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">4</p>
            <p className="text-sm text-gray-500 mt-1">Across 4 stocks</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-gray-500 font-medium">AI Confidence</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">84%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: "84%" }}
              ></div>
            </div>
          </div>
        </div>
        {/* Portfolio + AI Suggestions */}
        <div className="px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Portfolio Summary
            </h2>
            <p className="text-gray-500 mb-4">
              Your current holdings and performance
            </p>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="font-bold text-gray-800">
                  AAPL{" "}
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                    50 shares
                  </span>
                </span>
                <span className="text-right">
                  <span className="font-semibold text-gray-800">$175.43</span>
                  <span className="ml-2 text-green-600 font-medium text-sm">
                    ▲ 2.34%
                  </span>
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-bold text-gray-800">
                  GOOGL{" "}
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                    25 shares
                  </span>
                </span>
                <span className="text-right">
                  <span className="font-semibold text-gray-800">$2847.63</span>
                  <span className="ml-2 text-red-600 font-medium text-sm">
                    ▼ 1.23%
                  </span>
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-bold text-gray-800">
                  TSLA{" "}
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                    30 shares
                  </span>
                </span>
                <span className="text-right">
                  <span className="font-semibold text-gray-800">$248.87</span>
                  <span className="ml-2 text-green-600 font-medium text-sm">
                    ▲ 5.67%
                  </span>
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-bold text-gray-800">
                  MSFT{" "}
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                    40 shares
                  </span>
                </span>
                <span className="text-right">
                  <span className="font-semibold text-gray-800">$378.85</span>
                  <span className="ml-2 text-green-600 font-medium text-sm">
                    ▲ 1.45%
                  </span>
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              AI Investment Suggestions
            </h2>
            <p className="text-gray-500 mb-4">
              Personalized recommendations based on market analysis
            </p>
            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">NVDA</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Strong AI growth potential
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Confidence: 87%
                  </p>
                  <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full inline-block mt-2">
                    Medium Risk
                  </span>
                </div>
                <button className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-700">
                  Buy
                </button>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">BTC-ETF</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Crypto market recovery signals
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Confidence: 72%
                  </p>
                  <span className="text-xs font-medium bg-red-100 text-red-800 px-2 py-0.5 rounded-full inline-block mt-2">
                    High Risk
                  </span>
                </div>
                <button className="bg-gray-200 text-gray-800 px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-300">
                  Consider
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
          onClick={() => navigate("/chat")}
        >
          Go to Chat
        </button>
      </main>
    </div>
  );
}

