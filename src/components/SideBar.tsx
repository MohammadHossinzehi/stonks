"use client";
import Link from "next/link";
import { usePathname }  from "next/navigation";
import { Home, BarChart3, FileText, Settings, TrendingUp } from "lucide-react"; 

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Analysis", href: "/analysis", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#EDE8F5]/80 backdrop-blur-lg border-r border-purple-200 shadow-lg z-50">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="h-8 w-8 text-[#3D52A0]" />
            <h1 className="text-2xl font-bold text-[#3D52A0]">Stonks</h1>
          </div>

          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-[#7091E6] text-[#3D52A0] shadow"
                        : "text-gray-700 hover:bg-[#ADBBDA] hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    );
}
