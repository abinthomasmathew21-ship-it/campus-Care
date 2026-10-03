import React, { useState } from 'react';
import type { Complaint, StaffMember, Department, UserProfile } from '../../types/campus';
import { campusService } from '../../services/campusService';
import { ComplaintDetailModal } from '../complaints/ComplaintDetailModal';
import {
  Wrench,
  UserCheck,
  Building,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';

interface AssignmentsPageProps {
  complaints: Complaint[];
  staffList: StaffMember[];
  departments: Department[];
  currentUser: UserProfile;
  onRefresh?: () => void;
}

export const AssignmentsPage: React.FC<AssignmentsPageProps> = ({
  complaints,
  staffList,
  departments,
  currentUser,
  onRefresh,
}) => {
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>('');
  const [targetStaffId, setTargetStaffId] = useState<string>('');
  const [targetDepartment, setTargetDepartment] = useState<string>(departments[0]?.name || '');
  const [assignmentNote, setAssignmentNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeModalComplaint, setActiveModalComplaint] = useState<Complaint | null>(null);

  // Issues needing assignment (SUBMITTED, VERIFIED, or unassigned)
  const unassignedIssues = complaints.filter(
    (c) => (!c.assignedStaffId || c.status === 'SUBMITTED' || c.status === 'VERIFIED') && c.status !== 'RESOLVED' && c.status !== 'REJECTED'
  );

  // Issues already assigned and underway
  const assignedIssues = complaints.filter(
    (c) => c.assignedStaffId && c.status !== 'RESOLVED' && c.status !== 'REJECTED'
  );

  const handleQuickAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaintId || !targetStaffId) return;

    const staff = staffList.find((s) => s.id === targetStaffId);
    if (!staff) return;

    setIsSubmitting(true);
    try {
      await campusService.assignComplaint(
        selectedComplaintId,
        staff.id,
        staff.name,
        targetDepartment || staff.department,
        assignmentNote.trim() || `Dispatched to ${staff.name} via Assignment Management console`,
        currentUser
      );
      setSelectedComplaintId('');
      setTargetStaffId('');
      setAssignmentNote('');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-3 border-b border-[#dce3dd] dark:border-[#24332b]">
        <h1 className="text-xl font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
          MAINTENANCE WORK ORDER DISPATCH & ASSIGNMENTS
        </h1>
        <p className="text-xs font-mono text-[#526359] dark:text-[#9cb1a5] mt-0.5">
          Triage reported defects, allocate field technicians, and balance maintenance workloads
        </p>
      </div>

      {/* DISPATCH / ALLOCATE CONSOLE */}
      <div className="card-blueprint rounded-lg p-5 bg-white dark:bg-[#161e1a]">
        <div className="flex items-center gap-2 pb-3 border-b border-[#dce3dd] dark:border-[#24332b]">
          <Wrench className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
            QUICK DISPATCH CONSOLE
          </h3>
        </div>

        <form onSubmit={handleQuickAssign} className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs font-mono">
          {/* Select Ticket */}
          <div className="md:col-span-4">
            <label className="text-[10px] uppercase font-bold text-[#526359] dark:text-[#9cb1a5] block mb-1">
              Select Ticket To Assign *
            </label>
            <select
              value={selectedComplaintId}
              onChange={(e) => setSelectedComplaintId(e.target.value)}
              className="w-full text-xs font-mono px-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
            >
              <option value="">Choose pending work order...</option>
              {unassignedIssues.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  [{comp.complaintId}] {comp.building} - {comp.title.slice(0, 35)}... ({comp.priority})
                </option>
              ))}
            </select>
          </div>

          {/* Select Department */}
          <div className="md:col-span-3">
            <label className="text-[10px] uppercase font-bold text-[#526359] dark:text-[#9cb1a5] block mb-1">
              Target Department
            </label>
            <select
              value={targetDepartment}
              onChange={(e) => setTargetDepartment(e.target.value)}
              className="w-full text-xs font-mono px-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Staff Member */}
          <div className="md:col-span-3">
            <label className="text-[10px] uppercase font-bold text-[#526359] dark:text-[#9cb1a5] block mb-1">
              Assign Technician *
            </label>
            <select
              value={targetStaffId}
              onChange={(e) => setTargetStaffId(e.target.value)}
              className="w-full text-xs font-mono px-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
            >
              <option value="">Select staff technician...</option>
              {staffList.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.role} • {st.status})
                </option>
              ))}
            </select>
          </div>

          {/* Dispatch CTA */}
          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={!selectedComplaintId || !targetStaffId || isSubmitting}
              className="w-full py-2 px-3 text-xs font-mono font-bold rounded bg-emerald-900 hover:bg-emerald-950 text-white dark:bg-emerald-800 dark:hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Dispatch Work</span>
            </button>
          </div>

          {/* Optional Note Row */}
          <div className="md:col-span-12">
            <input
              type="text"
              placeholder="Optional dispatch instruction or tool requisition note..."
              value={assignmentNote}
              onChange={(e) => setAssignmentNote(e.target.value)}
              className="w-full text-xs font-sans px-3 py-1.5 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
            />
          </div>
        </form>
      </div>

      {/* ACTIVE WORK ORDER ASSIGNMENTS TABLE */}
      <div className="card-blueprint rounded-lg bg-white dark:bg-[#161e1a] overflow-hidden">
        <div className="p-4 border-b border-[#dce3dd] dark:border-[#24332b] bg-[#f9faf8] dark:bg-[#121614] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
              CURRENT ACTIVE ASSIGNMENTS
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#eff2ee] dark:bg-[#1c2722] text-[#526359] dark:text-[#9cb1a5]">
              {assignedIssues.length} In Progress
            </span>
          </div>
        </div>

        {assignedIssues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#f0f2ef] dark:bg-[#121614] text-[10px] text-[#526359] dark:text-[#9cb1a5] uppercase border-b border-[#dce3dd] dark:border-[#24332b]">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Complaint</th>
                  <th className="py-2.5 px-4 font-bold">Location</th>
                  <th className="py-2.5 px-4 font-bold">Priority</th>
                  <th className="py-2.5 px-4 font-bold">Assigned Staff</th>
                  <th className="py-2.5 px-4 font-bold">Department</th>
                  <th className="py-2.5 px-4 font-bold">Assignment Date</th>
                  <th className="py-2.5 px-4 font-bold">Current Status</th>
                  <th className="py-2.5 px-4 font-bold text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce3dd] dark:divide-[#24332b]">
                {assignedIssues.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setActiveModalComplaint(item)}
                    className="hover:bg-[#f7f8f6] dark:hover:bg-[#1c2722] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-emerald-900 dark:text-emerald-400">
                        {item.complaintId}
                      </div>
                      <div className="font-sans text-xs text-[#18221c] dark:text-[#f1f5f2] truncate max-w-xs">
                        {item.title}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#526359] dark:text-[#9cb1a5]">
                      {item.building} • {item.location}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.priority === 'Urgent' ? 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300' :
                        item.priority === 'High' ? 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300' :
                        'bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-300'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-900 dark:text-emerald-300">
                      {item.assignedStaffName}
                    </td>
                    <td className="py-3 px-4 text-[#526359] dark:text-[#9cb1a5]">
                      {item.department}
                    </td>
                    <td className="py-3 px-4 text-[#7d8f85]">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalComplaint(item);
                        }}
                        className="p-1 rounded text-emerald-800 dark:text-emerald-400 hover:bg-[#eff2ee] dark:hover:bg-[#223029]"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs font-mono text-[#526359] dark:text-[#9cb1a5]">
            No issues currently assigned to technicians.
          </div>
        )}
      </div>

      {/* STAFF WORKLOAD OVERVIEW GRID */}
      <div>
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2] mb-3">
          FIELD TECHNICIAN WORKLOAD DISTRIBUTION
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {staffList.map((tech) => {
            const currentActive = complaints.filter(
              (c) => c.assignedStaffId === tech.id && c.status !== 'RESOLVED' && c.status !== 'REJECTED'
            ).length;

            return (
              <div
                key={tech.id}
                className="card-blueprint rounded-lg p-3.5 bg-white dark:bg-[#161e1a] text-xs font-mono flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#7d8f85]">{tech.employeeId}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      tech.status === 'Active' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {tech.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-[#18221c] dark:text-[#f1f5f2] text-sm mt-1">
                    {tech.name}
                  </h4>
                  <p className="text-[11px] text-[#526359] dark:text-[#9cb1a5]">{tech.department}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#dce3dd] dark:border-[#24332b] flex items-center justify-between text-[11px]">
                  <span>Active Queue: <strong className="text-emerald-900 dark:text-emerald-400 font-bold">{currentActive}</strong></span>
                  <span className="text-[#7d8f85]">Completed: {tech.completedIssues}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {activeModalComplaint && (
        <ComplaintDetailModal
          complaint={activeModalComplaint}
          onClose={() => setActiveModalComplaint(null)}
          currentUser={currentUser}
          staffList={staffList}
          departments={departments}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};
