import React, { useState } from 'react';
import type { Complaint, UserProfile, StaffMember, Department, CampusBuilding } from '../../types/campus';
import { CampusStatusMap } from './CampusStatusMap';
import { ReportIssueModal } from '../complaints/ReportIssueModal';
import { ComplaintDetailModal } from '../complaints/ComplaintDetailModal';
import { Layers, MapPin, Plus, Filter, Info, Building } from 'lucide-react';

interface CampusMapPageProps {
  complaints: Complaint[];
  currentUser: UserProfile;
  staffList: StaffMember[];
  departments: Department[];
  onRefresh?: () => void;
}

export const CampusMapPage: React.FC<CampusMapPageProps> = ({
  complaints,
  currentUser,
  staffList,
  departments,
  onRefresh,
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding | null>('MAIN BLOCK');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [targetBuilding, setTargetBuilding] = useState<CampusBuilding>('MAIN BLOCK');
  const [detailComplaint, setDetailComplaint] = useState<Complaint | null>(null);

  const activeComplaintsInSelected = selectedBuilding
    ? complaints.filter((c) => c.building === selectedBuilding && c.status !== 'RESOLVED' && c.status !== 'REJECTED')
    : [];

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-[#dce3dd] dark:border-[#24332b] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
            CAMPUS ARCHITECTURAL BLUEPRINT MAP
          </h1>
          <p className="text-xs font-mono text-[#526359] dark:text-[#9cb1a5] mt-0.5">
            Full-site structural schematic • Real-time building defect telemetry and maintenance zones
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setTargetBuilding(selectedBuilding || 'MAIN BLOCK');
            setIsReportOpen(true);
          }}
          className="py-1.5 px-3 rounded text-xs font-mono font-bold bg-emerald-900 hover:bg-emerald-950 text-white dark:bg-emerald-800 dark:hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Report for Area</span>
        </button>
      </div>

      {/* Main Interactive Blueprint */}
      <CampusStatusMap
        complaints={complaints}
        selectedBuilding={selectedBuilding}
        onSelectBuilding={setSelectedBuilding}
        onReportForBuilding={(bldg) => {
          setTargetBuilding(bldg);
          setIsReportOpen(true);
        }}
      />

      {/* Active Issues in Selected Building List */}
      {selectedBuilding && (
        <div className="card-blueprint rounded-lg bg-white dark:bg-[#161e1a] overflow-hidden">
          <div className="p-4 border-b border-[#dce3dd] dark:border-[#24332b] bg-[#f9faf8] dark:bg-[#121614] flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
              ACTIVE ISSUES REGISTERED IN {selectedBuilding}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#eff2ee] dark:bg-[#1c2722] text-[#526359] dark:text-[#9cb1a5]">
              {activeComplaintsInSelected.length} Active Records
            </span>
          </div>

          {activeComplaintsInSelected.length > 0 ? (
            <div className="divide-y divide-[#dce3dd] dark:divide-[#24332b] text-xs font-mono">
              {activeComplaintsInSelected.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setDetailComplaint(item)}
                  className="p-3.5 hover:bg-[#f7f8f6] dark:hover:bg-[#1c2722] cursor-pointer transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-900 dark:text-emerald-400">
                        {item.complaintId}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        item.priority === 'Urgent' ? 'bg-red-100 text-red-900' :
                        item.priority === 'High' ? 'bg-orange-100 text-orange-900' :
                        'bg-yellow-100 text-yellow-900'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-[#7d8f85]">{item.floor} • {item.location}</span>
                    </div>
                    <h4 className="font-sans text-xs font-medium text-[#18221c] dark:text-[#f1f5f2] mt-1 truncate">
                      {item.title}
                    </h4>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                      {item.status}
                    </span>
                    <div className="text-[10px] text-[#7d8f85] mt-1">
                      Assigned: {item.assignedStaffName || 'Unassigned'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-mono text-[#526359] dark:text-[#9cb1a5]">
              No active issues currently reported in {selectedBuilding}. Facilities are operational.
            </div>
          )}
        </div>
      )}

      {/* Report Modal */}
      {isReportOpen && (
        <ReportIssueModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          currentUser={currentUser}
          initialBuilding={targetBuilding}
          onSuccess={() => {
            if (onRefresh) onRefresh();
          }}
        />
      )}

      {/* Detail Modal */}
      {detailComplaint && (
        <ComplaintDetailModal
          complaint={detailComplaint}
          onClose={() => setDetailComplaint(null)}
          currentUser={currentUser}
          staffList={staffList}
          departments={departments}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};
