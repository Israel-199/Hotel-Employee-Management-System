"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  getAttendanceSummaryReportApi,
  getDepartmentAttendanceReportApi,
  getDepartmentsApi,
  EmployeeAttendanceReportItem,
  DepartmentAttendanceReportItem,
  Department,
} from "@/src/lib/api";
import {
  BarChart3,
  Filter,
  Loader2,
  AlertCircle,
  Building2,
  UserCheck,
  TrendingUp,
  Percent,
} from "lucide-react";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"employee" | "department">("employee");

  const [employeeReport, setEmployeeReport] = useState<EmployeeAttendanceReportItem[]>([]);
  const [departmentReport, setDepartmentReport] = useState<DepartmentAttendanceReportItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const fetchDropdowns = async () => {
    try {
      const res = await getDepartmentsApi();
      if (res.success) setDepartments(res.data);
    } catch {
      // ignore
    }
  };

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        departmentId: departmentId || undefined,
      };

      if (activeTab === "employee") {
        const res = await getAttendanceSummaryReportApi(params);
        if (res.success) setEmployeeReport(res.data);
      } else {
        const res = await getDepartmentAttendanceReportApi(params);
        if (res.success) setDepartmentReport(res.data);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to generate attendance reports.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, startDate, endDate, departmentId]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Overall average attendance calculation
  const getAverageAttendanceRate = () => {
    if (activeTab === "employee") {
      if (employeeReport.length === 0) return 0;
      const total = employeeReport.reduce((acc, curr) => acc + curr.attendanceRate, 0);
      return Math.round((total / employeeReport.length) * 10) / 10;
    } else {
      if (departmentReport.length === 0) return 0;
      const total = departmentReport.reduce((acc, curr) => acc + curr.attendanceRate, 0);
      return Math.round((total / departmentReport.length) * 10) / 10;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Non-trivial relational reporting across hotel staff and departments.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("employee")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "employee"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Employee Summary
          </button>
          <button
            onClick={() => setActiveTab("department")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "department"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Department Breakdown
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Attendance Rate
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {getAverageAttendanceRate()}%
            </h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">Overall operational metric</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Report Entities
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {activeTab === "employee" ? employeeReport.length : departmentReport.length}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {activeTab === "employee" ? "Staff members evaluated" : "Departments analyzed"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            {activeTab === "employee" ? (
              <UserCheck className="w-6 h-6" />
            ) : (
              <Building2 className="w-6 h-6" />
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Report Status
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Live Aggregate</h3>
            <p className="text-xs text-amber-600 font-medium mt-1">Real-time database queries</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">
          <Filter className="w-4 h-4 text-amber-500" />
          <span>Date & Unit Filters:</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">From:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        {activeTab === "employee" && (
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        )}

        {(startDate || endDate || departmentId) && (
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setDepartmentId("");
            }}
            className="text-xs text-amber-600 hover:text-amber-700 font-semibold ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* REPORT TABLES */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-xs font-medium">Generating Report...</span>
          </div>
        ) : activeTab === "employee" ? (
          employeeReport.length === 0 ? (
            <div className="text-center py-16 px-4">
              <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">No report data for selected range.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Employee</th>
                    <th className="py-3.5 px-6">Department</th>
                    <th className="py-3.5 px-6 text-center">Recorded Days</th>
                    <th className="py-3.5 px-6 text-center">Present</th>
                    <th className="py-3.5 px-6 text-center">Late</th>
                    <th className="py-3.5 px-6 text-center">Absent</th>
                    <th className="py-3.5 px-6 text-center">Leave</th>
                    <th className="py-3.5 px-6 text-right">Attendance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {employeeReport.map((item) => (
                    <tr key={item.employeeId} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-6">
                        <p className="font-bold text-slate-900">{item.employeeName}</p>
                        <p className="text-[11px] text-amber-600 font-mono">{item.employeeNumber}</p>
                      </td>
                      <td className="py-3.5 px-6 font-medium text-slate-700">
                        {item.departmentName}
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono font-semibold text-slate-700">
                        {item.totalDays}
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono font-bold text-emerald-600">
                        {item.present}
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono font-bold text-amber-600">
                        {item.late}
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono font-bold text-rose-600">
                        {item.absent}
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono font-bold text-blue-600">
                        {item.leave}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${Math.min(100, item.attendanceRate)}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-slate-900">
                            {item.attendanceRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : departmentReport.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">No department report data.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6 text-center">Total Staff</th>
                  <th className="py-3.5 px-6 text-center">Recorded Days</th>
                  <th className="py-3.5 px-6 text-center">Present</th>
                  <th className="py-3.5 px-6 text-center">Late</th>
                  <th className="py-3.5 px-6 text-center">Absent</th>
                  <th className="py-3.5 px-6 text-center">Leave</th>
                  <th className="py-3.5 px-6 text-right">Dept Attendance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {departmentReport.map((dept) => (
                  <tr key={dept.departmentId} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-6 font-bold text-slate-900">{dept.departmentName}</td>
                    <td className="py-3.5 px-6 text-center font-mono font-semibold text-slate-700">
                      {dept.totalEmployees}
                    </td>
                    <td className="py-3.5 px-6 text-center font-mono font-semibold text-slate-700">
                      {dept.totalRecordedDays}
                    </td>
                    <td className="py-3.5 px-6 text-center font-mono font-bold text-emerald-600">
                      {dept.present}
                    </td>
                    <td className="py-3.5 px-6 text-center font-mono font-bold text-amber-600">
                      {dept.late}
                    </td>
                    <td className="py-3.5 px-6 text-center font-mono font-bold text-rose-600">
                      {dept.absent}
                    </td>
                    <td className="py-3.5 px-6 text-center font-mono font-bold text-blue-600">
                      {dept.leave}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, dept.attendanceRate)}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-900">
                          {dept.attendanceRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
