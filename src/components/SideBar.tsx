"use client";
import Link from "next/link";
import { usePathname }  from "next/navigation";
import { Home, BarChart3, FileText, Settings, TrendingUp } from "lucide-react"; 

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Analysis", href: "/analysis", icon: BarChart3 },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
      <aside className="sideBarContent">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="trendingUpIcon" />
            <h1 className="sideBarTitle">Stonks</h1>
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
                        ? "activeTab"
                        : "inactiveTab"
                    }`}
                  >
                    <Icon />
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
