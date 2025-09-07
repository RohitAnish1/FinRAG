import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
      <div>
        <h1 className="font-bold text-xl text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back! Here's your financial overview.</p>
      </div>
      <div className="flex items-center gap-4">
        <Bell className="text-gray-600" />
        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
          JD
        </div>
      </div>
    </header>
  );
}
