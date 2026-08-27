"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { LogOut, UserCheck } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-xs z-10 sticky top-0">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
          Hotel Management System
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
            <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-bold text-xs">
              <UserCheck className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-slate-700 block leading-tight">{user.email}</span>
              <span className="text-[10px] font-medium text-emerald-600">Administrator</span>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
          title="Sign out of system"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
