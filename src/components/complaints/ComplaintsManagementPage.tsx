import React, { useState } from 'react';
import type { Complaint, StaffMember, Department, UserProfile, ComplaintStatus, PriorityLevel, CampusBuilding } from '../../types/campus';
import { ComplaintDetailModal } from './ComplaintDetailModal';
import { ReportIssueModal } from './ReportIssueModal';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Building,
  User,
  Tag,
  Calendar,
  ChevronRight,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface ComplaintsManagementPageProps {
  complaints: Complaint[];
  currentUser: UserProfile;
  staffList: StaffMember[];
  departments: Department[];
  onRefresh?: () => void;
}

export const ComplaintsManagementPage: React.FC<ComplaintsManagementPageProps> = ({
  complaints,
  currentUser,
  staffList,
  departments,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Filter complaints
  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.complaintId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.assignedStaffName && c.assignedStaffName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedStatus !== 'ALL' && c.status !== selectedStatus) return false;
    if (selectedPriority !== 'ALL' && c.priority !== selectedPriority) return false;
    if (selectedDepartment !== 'ALL' && c.department !== selectedDepartment) return false;
    if (selectedBuilding !== 'ALL' && c.building !== selectedBuilding) return false;
    return true;
  });

  // Sort complaints
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'priority') {
      const pWeights = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
      return pWeights[a.priority] - pWeights[b.priority];
    }
    return 0;
  });

  const exportCSV = () => {
    const headers = ['Complaint ID', 'Title', 'Building', 'Location', 'Category', 'Priority', 'Status', 'Submitted By', 'Assigned Staff', 'Created At'];
    const rows = sorted.map((c) => [
      c.complaintId,
      `"${c.title.replace(/"/g, '""')}"`,
      c.building,
      `"${c.location.replace(/"/g, '""')}"`,
      c.category,
      c.priority,
      c.status,
      c.userName,
      c.assignedStaffName || 'Unassigned',
      c.createdAt,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CampusCare_Complaints_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Top Header & CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#dce3dd] dark:border-[#24332b]">
        <div>
          <h1 className="text-xl font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
            COMPLAINT REGISTRY & INCIDENT MANAGEMENT
          </h1>
          <p className="text-xs font-mono text-[#526359] dark:text-[#9cb1a5] mt-0.5">
            Centralized ticket repository • Triage, audit trail, assignment and SLA resolution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportCSV}
            className="py-1.5 px-3 rounded text-xs font-mono border border-[#dce3dd] dark:border-[#24332b] bg-white dark:bg-[#161e1a] text-[#526359] dark:text-[#9cb1a5] hover:bg-[#eff2ee] dark:hover:bg-[#223029] flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="py-1.5 px-3 rounded text-xs font-mono font-bold bg-emerald-900 hover:bg-emerald-950 text-white dark:bg-emerald-800 dark:hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Log Complaint</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="card-blueprint rounded-lg p-4 bg-white dark:bg-[#161e1a] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="lg:col-span-2 relative">
            <input
              type="text"
              placeholder="Search complaint code, keyword, room or technician..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-sans pl-8 pr-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
            />
            <Search className="w-4 h-4 text-[#7d8f85] absolute left-2.5 top-2.5" />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs font-mono px-2.5 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
            >
              <option value="ALL">Status: All States</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full text-xs font-mono px-2.5 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
            >
              <option value="ALL">Priority: All</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Building Filter */}
          <div>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="w-full text-xs font-mono px-2.5 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
            >
              <option value="ALL">Building: All Areas</option>
              <option value="MAIN BLOCK">MAIN BLOCK</option>
              <option value="LIBRARY">LIBRARY</option>
              <option value="LAB BLOCK">LAB BLOCK</option>
              <option value="HOSTEL">HOSTEL</option>
              <option value="CANTEEN">CANTEEN</option>
              <option value="ADMIN BLOCK">ADMIN BLOCK</option>
              <option value="SPORTS AREA">SPORTS AREA</option>
            </select>
          </div>
        </div>

        {/* Second row: Department and Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#dce3dd] dark:border-[#24332b] text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#7d8f85] uppercase">Department:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="text-xs font-mono px-2 py-1 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#7d8f85] uppercase">Sort by:</span>
              <button
                type="button"
                onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
                className="px-2 py-1 rounded border border-[#dce3dd] dark:border-[#24332b] hover:bg-[#eff2ee] dark:hover:bg-[#223029] cursor-pointer flex items-center gap-1"
              >
                <ArrowUpDown className="w-3 h-3" />
                <span>{sortBy === 'newest' ? 'Newest First' : 'Oldest First'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy('priority')}
                className={`px-2 py-1 rounded border border-[#dce3dd] dark:border-[#24332b] cursor-pointer ${
                  sortBy === 'priority' ? 'bg-emerald-900 text-white font-bold' : 'hover:bg-[#eff2ee] dark:hover:bg-[#223029]'
                }`}
              >
                Severity Rank
              </button>
            </div>

            <span className="text-[11px] text-[#526359] dark:text-[#9cb1a5]">
              Showing <strong>{sorted.length}</strong> of {complaints.length}
            </span>
          </div>
        </div>
      </div>

      {/* COMPLAINTS DATA TABLE */}
      <div className="card-blueprint rounded-lg bg-white dark:bg-[#161e1a] overflow-hidden">
        {sorted.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#f0f2ef] dark:bg-[#121614] text-[10px] text-[#526359] dark:text-[#9cb1a5] uppercase border-b border-[#dce3dd] dark:border-[#24332b]">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Complaint ID</th>
                  <th className="py-2.5 px-4 font-bold">Issue Summary</th>
                  <th className="py-2.5 px-4 font-bold">Location</th>
                  <th className="py-2.5 px-4 font-bold">Category</th>
                  <th className="py-2.5 px-4 font-bold">Priority</th>
                  <th className="py-2.5 px-4 font-bold">Status</th>
                  <th className="py-2.5 px-4 font-bold">Submitted By</th>
                  <th className="py-2.5 px-4 font-bold">Assigned Staff</th>
                  <th className="py-2.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce3dd] dark:divide-[#24332b]">
                {sorted.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedComplaint(item)}
                    className="hover:bg-[#f7f8f6] dark:hover:bg-[#1c2722] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-emerald-900 dark:text-emerald-400">
                      {item.complaintId}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-[#18221c] dark:text-[#f1f5f2] max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-3 px-4 text-[#526359] dark:text-[#9cb1a5] max-w-[160px] truncate">
                      {item.building} • {item.floor}
                    </td>
                    <td className="py-3 px-4 text-[#526359] dark:text-[#9cb1a5]">
                      {item.category}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.priority === 'Urgent' ? 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-900' :
                        item.priority === 'High' ? 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300 border border-orange-300 dark:border-orange-900' :
                        item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-900' :
                        'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-900'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300' :
                        item.status === 'IN PROGRESS' ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300' :
                        item.status === 'ASSIGNED' ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300' :
                        item.status === 'VERIFIED' ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300' :
                        item.status === 'REJECTED' ? 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#526359] dark:text-[#9cb1a5] max-w-[120px] truncate">
                      {item.userName}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-900 dark:text-emerald-300 max-w-[130px] truncate">
                      {item.assignedStaffName || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedComplaint(item);
                        }}
                        className="py-1 px-2.5 rounded text-xs font-mono font-bold bg-[#eff2ee] dark:bg-[#1c2722] hover:bg-emerald-900 hover:text-white dark:hover:bg-emerald-800 text-[#18221c] dark:text-[#f1f5f2] inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-[#7d8f85] mx-auto stroke-[1.5]" />
            <h4 className="text-xs font-mono font-bold uppercase text-[#18221c] dark:text-[#f1f5f2]">
              No complaints match selected criteria
            </h4>
            <p className="text-xs text-[#526359] dark:text-[#9cb1a5]">
              Adjust your search keywords or clear status/building filters to view records.
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          currentUser={currentUser}
          staffList={staffList}
          departments={departments}
          onRefresh={onRefresh}
        />
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <ReportIssueModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          currentUser={currentUser}
          onSuccess={() => {
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
};
