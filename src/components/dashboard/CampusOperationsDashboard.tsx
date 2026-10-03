import React, { useState } from 'react';
import type { Complaint, UserProfile, StaffMember, Department, CampusBuilding } from '../../types/campus';
import { CampusStatusMap } from '../campus/CampusStatusMap';
import { ComplaintDetailModal } from '../complaints/ComplaintDetailModal';
import { ReportIssueModal } from '../complaints/ReportIssueModal';
import {
  ClipboardList,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  ChevronRight,
  Building,
  UserCheck,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

interface CampusOperationsDashboardProps {
  complaints: Complaint[];
  currentUser: UserProfile;
  staffList: StaffMember[];
  departments: Department[];
  onRefresh?: () => void;
  onNavigateToComplaints?: () => void;
}

export const CampusOperationsDashboard: React.FC<CampusOperationsDashboardProps> = ({
  complaints,
  currentUser,
  staffList,
  departments,
  onRefresh,
  onNavigateToComplaints,
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding | null>('LAB BLOCK');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetBuilding, setReportTargetBuilding] = useState<CampusBuilding>('MAIN BLOCK');

  // Compute 4 Compact Statistic Values
  const totalIssues = complaints.length;
  const pendingIssues = complaints.filter(
    (c) => c.status === 'SUBMITTED' || c.status === 'VERIFIED'
  ).length;
  const inProgressIssues = complaints.filter(
    (c) => c.status === 'ASSIGNED' || c.status === 'IN PROGRESS'
  ).length;
  const resolvedIssues = complaints.filter((c) => c.status === 'RESOLVED').length;

  // Urgent and high priority items requiring immediate triage
  const priorityActionItems = complaints
    .filter((c) => c.status !== 'RESOLVED' && c.status !== 'REJECTED')
    .sort((a, b) => {
      const priorityOrder = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 17) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  return (
    <div className="space-y-6">
      {/* Greeting & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#dce3dd] dark:border-[#24332b]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[#18221c] dark:text-[#f1f5f2]">
            {getGreeting()}, {currentUser.name.toUpperCase()}
          </h1>
          <p className="text-xs font-mono text-[#526359] dark:text-[#9cb1a5] mt-0.5">
            Campus Operations Overview • Estate Infrastructure Management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setReportTargetBuilding('MAIN BLOCK');
              setIsReportModalOpen(true);
            }}
            className="py-1.5 px-3 rounded text-xs font-mono font-bold bg-emerald-900 hover:bg-emerald-950 text-white dark:bg-emerald-800 dark:hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
          >
            + Dispatch Issue
          </button>
        </div>
      </div>

      {/* 4 COMPACT OPERATIONS STATISTIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* TOTAL ISSUES */}
        <div className="card-blueprint rounded-lg p-3.5 bg-white dark:bg-[#161e1a] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#526359] dark:text-[#9cb1a5] uppercase">
              TOTAL ISSUES
            </span>
            <div className="w-6 h-6 rounded bg-[#eff2ee] dark:bg-[#1c2722] flex items-center justify-center text-emerald-800 dark:text-emerald-400">
              <ClipboardList className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-[#18221c] dark:text-[#f1f5f2] leading-none">
              {totalIssues}
            </div>
            <p className="text-[11px] text-[#7d8f85] font-mono mt-1 truncate">
              Total campus complaints
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#dce3dd] dark:border-[#24332b] flex items-center justify-between text-[10px] font-mono">
            <span className="text-emerald-800 dark:text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +8% mo
            </span>
            <span className="text-[#7d8f85]">Registry</span>
          </div>
        </div>

        {/* PENDING */}
        <div className="card-blueprint rounded-lg p-3.5 bg-white dark:bg-[#161e1a] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-400 uppercase">
              PENDING
            </span>
            <div className="w-6 h-6 rounded bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400 leading-none">
              {pendingIssues}
            </div>
            <p className="text-[11px] text-[#7d8f85] font-mono mt-1 truncate">
              Awaiting verification
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#dce3dd] dark:border-[#24332b] flex items-center justify-between text-[10px] font-mono">
            <span className="text-amber-700 dark:text-amber-400 font-semibold">Triage queue</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
        </div>

        {/* IN PROGRESS */}
        <div className="card-blueprint rounded-lg p-3.5 bg-white dark:bg-[#161e1a] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-blue-800 dark:text-blue-400 uppercase">
              IN PROGRESS
            </span>
            <div className="w-6 h-6 rounded bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-700 dark:text-blue-400">
              <Wrench className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-blue-700 dark:text-blue-400 leading-none">
              {inProgressIssues}
            </div>
            <p className="text-[11px] text-[#7d8f85] font-mono mt-1 truncate">
              Field work underway
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#dce3dd] dark:border-[#24332b] flex items-center justify-between text-[10px] font-mono">
            <span className="text-blue-700 dark:text-blue-400 font-semibold">Active crews</span>
            <span className="text-[#7d8f85]">Dispatched</span>
          </div>
        </div>

        {/* RESOLVED */}
        <div className="card-blueprint rounded-lg p-3.5 bg-white dark:bg-[#161e1a] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-400 uppercase">
              RESOLVED
            </span>
            <div className="w-6 h-6 rounded bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-800 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-emerald-800 dark:text-emerald-400 leading-none">
              {resolvedIssues}
            </div>
            <p className="text-[11px] text-[#7d8f85] font-mono mt-1 truncate">
              Successfully restored
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#dce3dd] dark:border-[#24332b] flex items-center justify-between text-[10px] font-mono">
            <span className="text-emerald-800 dark:text-emerald-400 font-semibold">
              {Math.round((resolvedIssues / (totalIssues || 1)) * 100)}% Rate
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
          </div>
        </div>
      </div>

      {/* SIGNATURE COMPONENT: CAMPUS STATUS MAP */}
      <CampusStatusMap
        complaints={complaints}
        selectedBuilding={selectedBuilding}
        onSelectBuilding={setSelectedBuilding}
        onReportForBuilding={(bldg) => {
          setReportTargetBuilding(bldg);
          setIsReportModalOpen(true);
        }}
      />

      {/* TWO COLUMN LOWER SECTION: Priority Action Triage + Department Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority Action Triage Table (7 Cols) */}
        <div className="lg:col-span-7 card-blueprint rounded-lg bg-white dark:bg-[#161e1a] overflow-hidden">
          <div className="p-3.5 border-b border-[#dce3dd] dark:border-[#24332b] bg-[#f9faf8] dark:bg-[#121614] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
                PRIORITY ACTION QUEUE
              </h3>
            </div>
            {onNavigateToComplaints && (
              <button
                type="button"
                onClick={onNavigateToComplaints}
                className="text-[11px] font-mono text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Registry</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="divide-y divide-[#dce3dd] dark:divide-[#24332b]">
            {priorityActionItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedComplaint(item)}
                className="p-3 hover:bg-[#f7f8f6] dark:hover:bg-[#1c2722] cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-900 dark:text-emerald-400">
                      {item.complaintId}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      item.priority === 'Urgent' ? 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300' :
                      item.priority === 'High' ? 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300' :
                      'bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-300'
                    }`}>
                      {item.priority}
                    </span>
                    <span className="text-[10px] text-[#7d8f85] truncate">
                      {item.building} • {item.floor}
                    </span>
                  </div>
                  <h4 className="font-sans font-medium text-[#18221c] dark:text-[#f1f5f2] truncate mt-1">
                    {item.title}
                  </h4>
                  <div className="text-[10px] text-[#526359] dark:text-[#9cb1a5] mt-0.5 flex items-center gap-2">
                    <span>Tech: {item.assignedStaffName || 'Unassigned'}</span>
                    <span>•</span>
                    <span>Dept: {item.department}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'IN PROGRESS' ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300' :
                    item.status === 'ASSIGNED' ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300' :
                    'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {item.status}
                  </span>
                  <div className="text-[9px] text-[#7d8f85] mt-1">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Health Overview (5 Cols) */}
        <div className="lg:col-span-5 card-blueprint rounded-lg bg-white dark:bg-[#161e1a] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#dce3dd] dark:border-[#24332b]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
                DEPARTMENT LOAD STATUS
              </h3>
              <span className="text-[10px] font-mono text-[#526359] dark:text-[#9cb1a5]">
                {departments.length} Units Active
              </span>
            </div>

            <div className="mt-3 space-y-3 font-mono text-xs">
              {departments.slice(0, 5).map((dept) => {
                const total = dept.openIssues + dept.resolvedIssues;
                const percent = Math.round((dept.resolvedIssues / (total || 1)) * 100);
                return (
                  <div key={dept.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#18221c] dark:text-[#f1f5f2] truncate">
                        {dept.name}
                      </span>
                      <span className="text-[10px] text-[#526359] dark:text-[#9cb1a5] shrink-0">
                        {dept.openIssues} Open / {dept.resolvedIssues} Resolved
                      </span>
                    </div>

                    {/* Progress Meter */}
                    <div className="w-full h-1.5 rounded-full bg-[#eff2ee] dark:bg-[#1c2722] overflow-hidden">
                      <div
                        className="h-full bg-emerald-800 dark:bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#dce3dd] dark:border-[#24332b] text-[10px] font-mono text-[#7d8f85] flex items-center justify-between">
            <span>Average Resolution SLA: 18.4 hrs</span>
            <span className="text-emerald-800 dark:text-emerald-400 font-bold">94.2% Operational</span>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <ReportIssueModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          currentUser={currentUser}
          initialBuilding={reportTargetBuilding}
          onSuccess={() => {
            if (onRefresh) onRefresh();
          }}
        />
      )}

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
    </div>
  );
};
