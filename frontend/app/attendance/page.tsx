"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  getAttendanceApi,
  createAttendanceApi,
  updateAttendanceApi,
  deleteAttendanceApi,
  getEmployeesApi,
  Attendance,
  Employee,
  AttendanceStatus,
  Pagination,
} from "@/src/lib/api";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  CalendarCheck,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

export default function AttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters
  const [dateFilter, setDateFilter] = useState("");
  const [employeeIdFilter, setEmployeeIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Attendance | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formState, setFormState] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    status: "PRESENT" as AttendanceStatus,
    checkIn: "",
    checkOut: "",
    notes: "",
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEmployeesList = async () => {
    try {
      const res = await getEmployeesApi({ limit: 100 });
      if (res.success) setEmployees(res.data);
    } catch {
      // ignore
    }
  };

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAttendanceApi({
        page,
        limit: 10,
        date: dateFilter || undefined,
        employeeId: employeeIdFilter || undefined,
        status: (statusFilter as AttendanceStatus) || undefined,
      });
      if (res.success) {
        setRecords(res.data);
        if (res.pagination) setPagination(res.pagination);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to load attendance records.");
    } finally {
      setLoading(false);
    }
  }, [page, dateFilter, employeeIdFilter, statusFilter]);

  useEffect(() => {
    fetchEmployeesList();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleOpenCreate = () => {
    setEditingRecord(null);
    setFormState({
      employeeId: employees[0]?.id || "",
      date: new Date().toISOString().split("T")[0],
      status: "PRESENT",
      checkIn: "08:00",
      checkOut: "16:00",
      notes: "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec: Attendance) => {
    setEditingRecord(rec);
    setFormState({
      employeeId: rec.employeeId,
      date: new Date(rec.date).toISOString().split("T")[0],
      status: rec.status,
      checkIn: rec.checkIn ? new Date(rec.checkIn).toISOString().substring(11, 16) : "",
      checkOut: rec.checkOut ? new Date(rec.checkOut).toISOString().substring(11, 16) : "",
      notes: rec.notes || "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.employeeId || !formState.date || !formState.status) {
      setFormError("Employee, date, and status are required.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      let checkInISO: string | undefined = undefined;
      let checkOutISO: string | undefined = undefined;

      if (formState.checkIn) {
        checkInISO = `${formState.date}T${formState.checkIn}:00.000Z`;
      }
      if (formState.checkOut) {
        checkOutISO = `${formState.date}T${formState.checkOut}:00.000Z`;
      }

      const payload = {
        employeeId: formState.employeeId,
        date: formState.date,
        status: formState.status,
        checkIn: checkInISO,
        checkOut: checkOutISO,
        notes: formState.notes || undefined,
      };

      if (editingRecord) {
        await updateAttendanceApi(editingRecord.id, payload);
        setSuccessMsg("Attendance record updated.");
      } else {
        await createAttendanceApi(payload);
        setSuccessMsg("Attendance recorded successfully.");
      }

      setIsModalOpen(false);
      fetchAttendance();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) setFormError(err.message);
      else setFormError("Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteAttendanceApi(deletingId);
      setSuccessMsg("Record deleted.");
      setDeletingId(null);
      fetchAttendance();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to delete record.");
      setDeletingId(null);
    }
  };

  const getStatusBadge = (st: AttendanceStatus) => {
    switch (st) {
      case "PRESENT":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "LATE":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "ABSENT":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "LEAVE":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Log</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor daily check-ins, check-outs, and shift status.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-sm shadow-amber-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record Attendance</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">
          <Filter className="w-4 h-4 text-amber-500" />
          <span>Filters:</span>
        </div>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-mono"
        />

        <select
          value={employeeIdFilter}
          onChange={(e) => {
            setEmployeeIdFilter(e.target.value);
            setPage(1);
          }}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="">All Employees</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.firstName} {e.lastName} ({e.employeeNumber})
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="PRESENT">PRESENT</option>
          <option value="LATE">LATE</option>
          <option value="ABSENT">ABSENT</option>
          <option value="LEAVE">LEAVE</option>
        </select>

        {(dateFilter || employeeIdFilter || statusFilter) && (
          <button
            onClick={() => {
              setDateFilter("");
              setEmployeeIdFilter("");
              setStatusFilter("");
              setPage(1);
            }}
            className="text-xs text-amber-600 hover:text-amber-700 font-semibold ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-xs font-medium">Fetching Attendance Records...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-16 px-4">
            <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">No attendance records found.</p>
            <p className="text-xs text-slate-400 mt-1">Adjust filters or record a new entry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Check In / Out</th>
                  <th className="py-3.5 px-6">Notes</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-6 font-mono text-slate-700 font-semibold">
                      {new Date(rec.date).toISOString().split("T")[0]}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-900">
                        {rec.employee ? `${rec.employee.firstName} ${rec.employee.lastName}` : "Unknown"}
                      </div>
                      <div className="text-[11px] text-amber-600 font-mono">
                        {rec.employee?.employeeNumber}
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {rec.employee?.department?.name || "N/A"}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                          rec.status
                        )}`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-mono text-slate-600">
                      {rec.checkIn || rec.checkOut ? (
                        <span>
                          {rec.checkIn ? new Date(rec.checkIn).toISOString().substring(11, 16) : "--:--"}
                          {" - "}
                          {rec.checkOut ? new Date(rec.checkOut).toISOString().substring(11, 16) : "--:--"}
                        </span>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 italic max-w-xs truncate">
                      {rec.notes || "-"}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(rec)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(rec.id)}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing page <strong className="text-slate-800">{pagination.page}</strong> of{" "}
            <strong className="text-slate-800">{pagination.totalPages}</strong> ({pagination.total} records)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingRecord ? "Edit Attendance Record" : "Record Attendance Entry"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Employee</label>
                <select
                  value={formState.employeeId}
                  onChange={(e) => setFormState({ ...formState, employeeId: e.target.value })}
                  required
                  disabled={!!editingRecord}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 disabled:opacity-70"
                >
                  <option value="">Select Employee</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.firstName} {e.lastName} ({e.employeeNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formState.date}
                    onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formState.status}
                    onChange={(e) =>
                      setFormState({ ...formState, status: e.target.value as AttendanceStatus })
                    }
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="PRESENT">PRESENT</option>
                    <option value="LATE">LATE</option>
                    <option value="ABSENT">ABSENT</option>
                    <option value="LEAVE">LEAVE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Check In Time</label>
                  <input
                    type="time"
                    value={formState.checkIn}
                    onChange={(e) => setFormState({ ...formState, checkIn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Check Out Time</label>
                  <input
                    type="time"
                    value={formState.checkOut}
                    onChange={(e) => setFormState({ ...formState, checkOut: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                  placeholder="Reason for late arrival, leave approval, etc."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingRecord ? "Save Record" : "Submit Attendance"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Delete Attendance Entry</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this attendance log entry?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
