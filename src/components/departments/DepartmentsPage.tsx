import React, { useState } from 'react';
import type { Department, Complaint } from '../../types/campus';
import { 
  Building, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Droplet, 
  Wifi, 
  HardHat, 
  Sparkles, 
  Home, 
  Shield
} from 'lucide-react';

interface DepartmentsPageProps {
  departments: Department[];
  complaints: Complaint[];
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  departments,
  complaints,
}) => {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  const getDeptIcon = (name: string) => {
    if (name.includes('Electrical')) return Zap;
    if (name.includes('Plumbing')) return Droplet;
    if (name.includes('IT')) return Wifi;
    if (name.includes('Civil')) return HardHat;
    if (name.includes('Housekeeping')) return Sparkles;
    if (name.includes('Hostel')) return Home;
    return Shield;
  };

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-[#dce3dd] dark:border-[#24332b] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
            FACILITIES MAINTENANCE DEPARTMENTS
          </h1>
          <p className="text-xs font-mono text-[#526359] dark:text-[#9cb1a5] mt-0.5">
            Operational service units, infrastructure maintenance responsibilities and response telemetry
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#eff2ee] dark:bg-[#1c2722] text-[#526359] dark:text-[#9cb1a5] self-start sm:self-auto">
          {departments.length} Units Active
        </span>
      </div>

      {/* DEPARTMENT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const Icon = getDeptIcon(dept.name);

          // Calculate real-time issues for this department
          const deptComplaints = complaints.filter(
            (c) => c.department.toLowerCase() === dept.name.toLowerCase()
          );
          const realOpenIssues = deptComplaints.filter(
            (c) => c.status !== 'RESOLVED' && c.status !== 'REJECTED'
          ).length;
          const realResolvedIssues = deptComplaints.filter((c) => c.status === 'RESOLVED').length;

          const total = realOpenIssues + realResolvedIssues;
          const resolutionRate = total > 0 ? Math.round((realResolvedIssues / total) * 100) : 100;

          return (
            <div
              key={dept.id}
              className="card-blueprint rounded-lg p-4 bg-white dark:bg-[#161e1a] flex flex-col justify-between hover:border-emerald-800 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#dce3dd] dark:border-[#24332b]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-[#eff2ee] dark:bg-[#1c2722] flex items-center justify-center text-emerald-800 dark:text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-mono font-bold text-[#18221c] dark:text-[#f1f5f2]">
                        {dept.name}
                      </h3>
                      <span className="text-[10px] text-[#7d8f85] font-mono">Head: {dept.head}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    dept.responseStatus === 'Optimal' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300' :
                    dept.responseStatus === 'Heavy Load' ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300'
                  }`}>
                    {dept.responseStatus}
                  </span>
                </div>

                <p className="text-xs text-[#526359] dark:text-[#9cb1a5] mt-2.5 leading-relaxed line-clamp-2">
                  {dept.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs font-mono">
                  <div className="p-2 rounded bg-[#f7f8f6] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b]">
                    <span className="text-[9px] text-[#7d8f85] uppercase block">Staff</span>
                    <span className="font-bold text-[#18221c] dark:text-[#f1f5f2] mt-0.5 block">{dept.staffCount}</span>
                  </div>
                  <div className="p-2 rounded bg-[#f7f8f6] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b]">
                    <span className="text-[9px] text-[#7d8f85] uppercase block">Open</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400 mt-0.5 block">{realOpenIssues}</span>
                  </div>
                  <div className="p-2 rounded bg-[#f7f8f6] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b]">
                    <span className="text-[9px] text-[#7d8f85] uppercase block">Resolved</span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-400 mt-0.5 block">{realResolvedIssues}</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 pt-3 border-t border-[#dce3dd] dark:border-[#24332b]">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#526359] dark:text-[#9cb1a5] mb-1">
                  <span>Resolution SLA</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-400">{resolutionRate}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#eff2ee] dark:bg-[#1c2722] overflow-hidden">
                  <div
                    className="h-full bg-emerald-800 dark:bg-emerald-500 rounded-full"
                    style={{ width: `${resolutionRate}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
