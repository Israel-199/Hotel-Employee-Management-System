"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardSummaryApi, DashboardSummary } from "@/src/lib/api";
import {
  Users,
  Building2,
  Briefcase,
  Clock,
  UserCheck,
  UserX,
  AlertCircle,
  Calendar,
  Plus,
  ArrowRight,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboardSummaryApi();
      if (res.success && res.data) {
        setSummary(res.data);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load dashboard metrics.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        <span className="text-sm font-medium">Loading Dashboard Data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-rose-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600" />
          <span>{error}</span>
        </div>
        <button
          onClick={fetchSummary}
          className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time operations summary for Grand Haven Hotel staff and attendance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSummary}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 shadow-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <Link
            href="/employees"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-sm shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Employee</span>
          </Link>
        </div>
      </div>

      {/* Main KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Staff
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{summary?.totalEmployees || 0}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">Active workforce</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Departments
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{summary?.totalDepartments || 0}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Operational units</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Job Roles
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{summary?.totalRoles || 0}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Designated positions</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Shifts
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{summary?.totalShifts || 0}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">24/7 Coverage</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Today's Attendance Overview */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              Today&apos;s Attendance Live Breakdown
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status counts for staff scheduled on duty today.
            </p>
          </div>
          <Link
            href="/attendance"
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>Attendance Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Present
              </span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-950 mt-2">
              {summary?.todayPresent || 0}
            </p>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">On site & checked in</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                Late Arrival
              </span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-amber-950 mt-2">
              {summary?.todayLate || 0}
            </p>
            <p className="text-[11px] text-amber-700 mt-1 font-medium">Checked in after start</p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
                Absent
              </span>
              <UserX className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-2xl font-extrabold text-rose-950 mt-2">
              {summary?.todayAbsent || 0}
            </p>
            <p className="text-[11px] text-rose-700 mt-1 font-medium">Unexcused absence</p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                On Leave
              </span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-blue-950 mt-2">
              {summary?.todayLeave || 0}
            </p>
            <p className="text-[11px] text-blue-700 mt-1 font-medium">Approved annual / sick leave</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          href="/employees"
          className="group bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:border-amber-400 hover:shadow-md transition duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition">
              Staff Directory
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition" />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            View, search, filter, and add new hotel employees.
          </p>
        </Link>

        <Link
          href="/attendance"
          className="group bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:border-amber-400 hover:shadow-md transition duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition">
              Daily Attendance
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition" />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Record employee check-ins, check-outs, and notes.
          </p>
        </Link>

        <Link
          href="/reports"
          className="group bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:border-amber-400 hover:shadow-md transition duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition">
              Analytics & Reports
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition" />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Generate employee attendance summaries and department rates.
          </p>
        </Link>
      </div>
    </div>
  );
}
