import { Home, MessageSquare, Briefcase, BarChart2, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: Home },
  { label: "Chat", icon: MessageSquare },
  { label: "Portfolio", icon: Briefcase },
  { label: "Market Sentiment", icon: BarChart2 },
  { label: "Alerts", icon: Bell },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 fixed h-full">
      <div className="flex items-center mb-8 px-2">
        <span className="font-extrabold text-2xl text-blue-600">FinRAG</span>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-700`}
            onClick={() => {
              if (item.label === "Dashboard") navigate("/");
              else if (item.label === "Chat") navigate("/chat");
              // Add more routes as needed
            }}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
