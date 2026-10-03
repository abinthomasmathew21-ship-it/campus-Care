import React, { useState } from 'react';
import type { Complaint, UserProfile, StaffMember, Department, CampusBuilding } from '../../types/campus';
import { ComplaintDetailModal } from '../complaints/ComplaintDetailModal';
import { ReportIssueModal } from '../complaints/ReportIssueModal';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Building, 
  ChevronRight, 
  FileText,
  Star,
  Sparkles,
  Layers
} from 'lucide-react';

interface StudentPortalProps {
  complaints: Complaint[];
  currentUser: UserProfile;
  staffList: StaffMember[];
  departments: Department[];
  onRefresh?: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  complaints,
  currentUser,
  staffList,
  departments,
  onRefresh,
}) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');

  // Filter complaints logged by this student or campus-wide visible to student
  const studentComplaints = complaints.filter(
    (c) => c.userId === currentUser.id || c.userName.toLowerCase() === currentUser.name.toLowerCase()
  );

  const activeCount = studentComplaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'REJECTED').length;
  const resolvedCount = studentComplaints.filter((c) => c.status === 'RESOLVED').length;

  const filteredComplaints = studentComplaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.complaintId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.building.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'ACTIVE') return c.status !== 'RESOLVED' && c.status !== 'REJECTED';
    if (statusFilter === 'RESOLVED') return c.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Student Welcome Header Card */}
      <div className="card-blueprint rounded-lg p-5 sm:p-6 bg-white dark:bg-[#161e1a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-800 dark:text-emerald-400 font-bold uppercase">
            <span>STUDENT SERVICES HUB</span>
            <span>•</span>
            <span>{currentUser.collegeId}</span>
          </div>
          <h1 className="text-xl font-bold text-[#18221c] dark:text-[#f1f5f2] mt-1">
            Hello, {currentUser.name}
          </h1>
          <p className="text-xs text-[#526359] dark:text-[#9cb1a5] mt-0.5">
            {currentUser.department} • Submit and monitor your campus repair work orders
          </p>
        </div>

        {/* Primary CTA: + REPORT CAMPUS ISSUE */}
        <button
          type="button"
          onClick={() => setIsReportModalOpen(true)}
          className="py-2.5 px-4 text-xs font-mono font-bold rounded bg-emerald-900 hover:bg-emerald-950 text-white dark:bg-emerald-800 dark:hover:bg-emerald-700 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ REPORT CAMPUS ISSUE</span>
        </button>
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="card-blueprint rounded-lg p-4 bg-white dark:bg-[#161e1a]">
          <span className="text-[10px] font-mono text-[#526359] dark:text-[#9cb1a5] uppercase block">
            MY TOTAL COMPLAINTS
          </span>
          <div className="text-2xl font-bold font-mono text-[#18221c] dark:text-[#f1f5f2] mt-1">
            {studentComplaints.length}
          </div>
          <span className="text-[10px] text-[#7d8f85] font-mono">Recorded in student history</span>
        </div>

        <div className="card-blueprint rounded-lg p-4 bg-white dark:bg-[#161e1a]">
          <span className="text-[10px] font-mono text-[#526359] dark:text-[#9cb1a5] uppercase block">
            PENDING & IN PROGRESS
          </span>
          <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400 mt-1">
            {activeCount}
          </div>
          <span className="text-[10px] text-[#7d8f85] font-mono">Assigned to maintenance crews</span>
        </div>

        <div className="card-blueprint rounded-lg p-4 bg-white dark:bg-[#161e1a]">
          <span className="text-[10px] font-mono text-[#526359] dark:text-[#9cb1a5] uppercase block">
            RESOLVED ISSUES
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-800 dark:text-emerald-400 mt-1">
            {resolvedCount}
          </div>
          <span className="text-[10px] text-[#7d8f85] font-mono">Verified repairs completed</span>
        </div>
      </div>

      {/* MY COMPLAINTS Section */}
      <div className="card-blueprint rounded-lg bg-white dark:bg-[#161e1a] overflow-hidden">
        {/* Table & Filter Toolbar */}
        <div className="p-4 border-b border-[#dce3dd] dark:border-[#24332b] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#f9faf8] dark:bg-[#121614]">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
              MY COMPLAINTS
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#eff2ee] dark:bg-[#1c2722] text-[#526359] dark:text-[#9cb1a5]">
              {filteredComplaints.length} Records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <input
                type="text"
                placeholder="Search ticket ID or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-sans pl-8 pr-3 py-1.5 rounded bg-white dark:bg-[#161e1a] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
              />
              <Search className="w-3.5 h-3.5 text-[#7d8f85] absolute left-2.5 top-2" />
            </div>

            {/* Status Tabs */}
            <div className="flex rounded border border-[#dce3dd] dark:border-[#24332b] p-0.5 bg-white dark:bg-[#161e1a] text-xs font-mono">
              {(['ALL', 'ACTIVE', 'RESOLVED'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-2.5 py-1 rounded text-[11px] cursor-pointer transition-colors ${
                    statusFilter === tab
                      ? 'bg-emerald-900 text-white font-bold dark:bg-emerald-800'
                      : 'text-[#526359] dark:text-[#9cb1a5] hover:text-[#18221c]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        {filteredComplaints.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#f0f2ef] dark:bg-[#121614] text-[10px] text-[#526359] dark:text-[#9cb1a5] uppercase border-b border-[#dce3dd] dark:border-[#24332b]">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Complaint ID</th>
                  <th className="py-2.5 px-4 font-bold">Issue Title</th>
                  <th className="py-2.5 px-4 font-bold">Location</th>
                  <th className="py-2.5 px-4 font-bold">Category</th>
                  <th className="py-2.5 px-4 font-bold">Priority</th>
                  <th className="py-2.5 px-4 font-bold">Status</th>
                  <th className="py-2.5 px-4 font-bold">Submitted Date</th>
                  <th className="py-2.5 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce3dd] dark:divide-[#24332b]">
                {filteredComplaints.map((item) => (
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
                    <td className="py-3 px-4 text-[#526359] dark:text-[#9cb1a5] max-w-[180px] truncate">
                      {item.building} • {item.location}
                    </td>
                    <td className="py-3 px-4 text-[#526359] dark:text-[#9cb1a5]">
                      {item.category}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.priority === 'Urgent' ? 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300' :
                        item.priority === 'High' ? 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300' :
                        item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-300' :
                        'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
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
                    <td className="py-3 px-4 text-[11px] text-[#7d8f85]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedComplaint(item);
                        }}
                        className="p-1 rounded text-emerald-900 dark:text-emerald-400 hover:bg-[#eff2ee] dark:hover:bg-[#223029] inline-flex items-center gap-1 text-[11px] font-bold"
                      >
                        <span>Track</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center space-y-2">
            <FileText className="w-8 h-8 text-[#7d8f85] mx-auto stroke-[1.5]" />
            <h4 className="text-xs font-mono font-bold uppercase text-[#18221c] dark:text-[#f1f5f2]">
              No Tickets Matching Criteria
            </h4>
            <p className="text-xs text-[#526359] dark:text-[#9cb1a5]">
              You have not submitted any complaints matching this filter. Click "+ REPORT CAMPUS ISSUE" to submit a maintenance request.
            </p>
          </div>
        )}
      </div>

      {/* Report Issue Modal */}
      {isReportModalOpen && (
        <ReportIssueModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          currentUser={currentUser}
          onSuccess={(id) => {
            if (onRefresh) onRefresh();
          }}
        />
      )}

      {/* Complaint Detail Tracking Drawer */}
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
    </div>
  );
};
