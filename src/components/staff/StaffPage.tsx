import React, { useState } from 'react';
import type { StaffMember, Complaint, UserProfile } from '../../types/campus';
import { campusService } from '../../services/campusService';
import { Users, Mail, Phone, Wrench, CheckCircle, ShieldCheck, ChevronRight, UserPlus, Search } from 'lucide-react';

interface StaffPageProps {
  staffList: StaffMember[];
  complaints: Complaint[];
  currentUser: UserProfile;
  onRefresh?: () => void;
}

export const StaffPage: React.FC<StaffPageProps> = ({
  staffList,
  complaints,
  currentUser,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechForAssign, setSelectedTechForAssign] = useState<StaffMember | null>(null);
  const [ticketToAssign, setTicketToAssign] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Unassigned complaints
  const unassignedComplaints = complaints.filter(
    (c) => c.status !== 'RESOLVED' && c.status !== 'REJECTED'
  );

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDirectAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTechForAssign || !ticketToAssign) return;

    setIsAssigning(true);
    try {
      await campusService.assignComplaint(
        ticketToAssign,
        selectedTechForAssign.id,
        selectedTechForAssign.name,
        selectedTechForAssign.department,
        `Direct dispatch via Staff Management Console`,
        currentUser
      );
      setSelectedTechForAssign(null);
      setTicketToAssign('');
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-[#dce3dd] dark:border-[#24332b] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
            CAMPUS MAINTENANCE CREWS & FIELD TECHNICIANS
          </h1>
          <p className="text-xs font-mono text-[#526359] dark:text-[#9cb1a5] mt-0.5">
            Certified campus engineers, technical trades, field dispatch and active work loads
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search technician or trade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-sans pl-8 pr-3 py-1.5 rounded bg-white dark:bg-[#161e1a] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
          />
          <Search className="w-4 h-4 text-[#7d8f85] absolute left-2.5 top-2" />
        </div>
      </div>

      {/* STAFF TABLE */}
      <div className="card-blueprint rounded-lg bg-white dark:bg-[#161e1a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#f0f2ef] dark:bg-[#121614] text-[10px] text-[#526359] dark:text-[#9cb1a5] uppercase border-b border-[#dce3dd] dark:border-[#24332b]">
              <tr>
                <th className="py-2.5 px-4 font-bold">Staff Name</th>
                <th className="py-2.5 px-4 font-bold">Employee ID</th>
                <th className="py-2.5 px-4 font-bold">Department</th>
                <th className="py-2.5 px-4 font-bold">Trade / Role</th>
                <th className="py-2.5 px-4 font-bold">Contact</th>
                <th className="py-2.5 px-4 font-bold text-center">Active Work Orders</th>
                <th className="py-2.5 px-4 font-bold text-center">Completed</th>
                <th className="py-2.5 px-4 font-bold">Status</th>
                <th className="py-2.5 px-4 font-bold text-right">Assign</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce3dd] dark:divide-[#24332b]">
              {filteredStaff.map((staff) => {
                // Real-time active assignments from complaints
                const activeJobs = complaints.filter(
                  (c) => c.assignedStaffId === staff.id && c.status !== 'RESOLVED' && c.status !== 'REJECTED'
                ).length;

                return (
                  <tr key={staff.id} className="hover:bg-[#f7f8f6] dark:hover:bg-[#1c2722] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#18221c] dark:text-[#f1f5f2]">{staff.name}</div>
                      <div className="text-[10px] text-[#7d8f85]">{staff.email}</div>
                    </td>
                    <td className="py-3 px-4 text-[#526359] dark:text-[#9cb1a5] font-semibold">
                      {staff.employeeId}
                    </td>
                    <td className="py-3 px-4 text-[#526359] dark:text-[#9cb1a5]">
                      {staff.department}
                    </td>
                    <td className="py-3 px-4 text-[#18221c] dark:text-[#f1f5f2]">
                      {staff.role}
                    </td>
                    <td className="py-3 px-4 text-[#526359] dark:text-[#9cb1a5] text-[11px]">
                      {staff.phone}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-emerald-900 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40">
                        {activeJobs}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-[#526359] dark:text-[#9cb1a5]">
                      {staff.completedIssues}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        staff.status === 'Active' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300' :
                        staff.status === 'On Call' ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedTechForAssign(staff)}
                        className="py-1 px-2.5 rounded text-xs font-mono font-bold bg-[#eff2ee] dark:bg-[#1c2722] hover:bg-emerald-900 hover:text-white dark:hover:bg-emerald-800 transition-colors cursor-pointer"
                      >
                        + Assign
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Assignment Modal */}
      {selectedTechForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#161e1a] rounded-lg border border-[#dce3dd] dark:border-[#24332b] p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase text-[#18221c] dark:text-[#f1f5f2]">
              DIRECT WORK ORDER ASSIGNMENT
            </h3>
            <p className="text-xs text-[#526359] dark:text-[#9cb1a5]">
              Assign a campus ticket to <strong>{selectedTechForAssign.name}</strong> ({selectedTechForAssign.department}).
            </p>

            <form onSubmit={handleDirectAssign} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#526359] dark:text-[#9cb1a5] block mb-1">
                  Select Ticket:
                </label>
                <select
                  value={ticketToAssign}
                  onChange={(e) => setTicketToAssign(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
                >
                  <option value="">Select ticket...</option>
                  {unassignedComplaints.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.complaintId}] {c.title.slice(0, 30)} ({c.building})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTechForAssign(null)}
                  className="py-1.5 px-3 rounded border border-[#dce3dd] dark:border-[#24332b] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!ticketToAssign || isAssigning}
                  className="py-1.5 px-4 rounded bg-emerald-900 text-white font-bold cursor-pointer disabled:opacity-50"
                >
                  {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
