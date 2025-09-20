import { Home, MessageSquare, Briefcase, BarChart2, Bell } from "lucide-react"

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 fixed h-full md:block hidden">
      <div className="flex items-center mb-8 px-2">
        <MessageSquare className="text-blue-600 mr-2" size={28} />
        <span className="font-extrabold text-2xl text-gray-800">FinRAG</span>
      </div>
      <nav className="flex flex-col gap-2">
        {[
          { label: "Dashboard", icon: Home, active: true },
          { label: "Chat", icon: MessageSquare },
          { label: "Portfolio", icon: Briefcase },
          { label: "Market", icon: BarChart2 },
          { label: "Alerts", icon: Bell },
        ].map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-semibold ${item.active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
