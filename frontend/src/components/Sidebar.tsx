"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Clock,
  CalendarCheck,
  BarChart3,
  Hotel,
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Departments", href: "/departments", icon: Building2 },
  { name: "Roles", href: "/roles", icon: Briefcase },
  { name: "Shifts", href: "/shifts", icon: Clock },
  { name: "Attendance", href: "/attendance", icon: CalendarCheck },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 min-h-screen shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800 bg-slate-950/40">
        <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
          <Hotel className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-base text-slate-50 tracking-tight leading-none">
            Grand Haven
          </h1>
          <span className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">
            Employee Portal
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* System Footer Note */}
      <div className="p-4 border-t border-slate-800/80 text-xs text-slate-400 text-center">
        <p className="font-semibold text-slate-300">Hotel EMS v1.0</p>
        <p className="text-[10px] mt-0.5 text-slate-400">Secure Single-Admin System</p>
      </div>
    </aside>
  );
}
