import React from 'react';
import type { Complaint, Department, StaffMember } from '../../types/campus';
import { CAMPUS_BLOCKS } from '../campus/CampusStatusMap';
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertTriangle, Building, Wrench } from 'lucide-react';

interface ReportsPageProps {
  complaints: Complaint[];
  departments: Department[];
  staffList: StaffMember[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  complaints,
  departments,
  staffList,
}) => {
  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;

  // Issues by Department
  const deptCounts: Record<string, { total: number; resolved: number; open: number }> = {};
  departments.forEach((d) => {
    deptCounts[d.name] = { total: 0, resolved: 0, open: 0 };
  });
  complaints.forEach((c) => {
    if (!deptCounts[c.department]) {
      deptCounts[c.department] = { total: 0, resolved: 0, open: 0 };
    }
    deptCounts[c.department].total += 1;
    if (c.status === 'RESOLVED') deptCounts[c.department].resolved += 1;
    else if (c.status !== 'REJECTED') deptCounts[c.department].open += 1;
  });

  // Issues by Building
  const buildingCounts: Record<string, number> = {};
  CAMPUS_BLOCKS.forEach((b) => {
    buildingCounts[b.id] = 0;
  });
  complaints.forEach((c) => {
    buildingCounts[c.building] = (buildingCounts[c.building] || 0) + 1;
  });

  // Issues by Category
  const categoryCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  // Monthly Complaints
  const monthlyData = [
    { month: 'Jun', count: 18, resolved: 17 },
    { month: 'Jul', count: 24, resolved: 22 },
    { month: 'Aug', count: 32, resolved: 29 },
    { month: 'Sep', count: 41, resolved: 36 },
    { month: 'Oct (Current)', count: complaints.length, resolved },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-[#dce3dd] dark:border-[#24332b]">
        <h1 className="text-xl font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
          CAMPUS OPERATIONS & INFRASTRUCTURE REPORTS
        </h1>
        <p className="text-xs font-mono text-[#526359] dark:text-[#9cb1a5] mt-0.5">
          Audited metrics on facilities reliability, response SLA, departmental workloads and building integrity
        </p>
      </div>

      {/* TOP SUMMARY KPI BAND */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="card-blueprint rounded-lg p-3.5 bg-white dark:bg-[#161e1a]">
          <span className="text-[10px] text-[#7d8f85] uppercase block">Total Incident Volume</span>
          <div className="text-2xl font-bold text-[#18221c] dark:text-[#f1f5f2] mt-1">{total}</div>
          <span className="text-[10px] text-emerald-800 dark:text-emerald-400 block mt-1">+14% vs last term</span>
        </div>

        <div className="card-blueprint rounded-lg p-3.5 bg-white dark:bg-[#161e1a]">
          <span className="text-[10px] text-[#7d8f85] uppercase block">Overall Resolution Rate</span>
          <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-400 mt-1">{resolutionRate}%</div>
          <span className="text-[10px] text-[#7d8f85] block mt-1">Institutional target: 85%</span>
        </div>

        <div className="card-blueprint rounded-lg p-3.5 bg-white dark:bg-[#161e1a]">
          <span className="text-[10px] text-[#7d8f85] uppercase block">Average Resolution SLA</span>
          <div className="text-2xl font-bold text-[#18221c] dark:text-[#f1f5f2] mt-1">18.4 hrs</div>
          <span className="text-[10px] text-blue-700 dark:text-blue-400 block mt-1">Within standard limits</span>
        </div>

        <div className="card-blueprint rounded-lg p-3.5 bg-white dark:bg-[#161e1a]">
          <span className="text-[10px] text-[#7d8f85] uppercase block">Active Tech Deployment</span>
          <div className="text-2xl font-bold text-[#18221c] dark:text-[#f1f5f2] mt-1">
            {staffList.filter((s) => s.status === 'Active').length} / {staffList.length}
          </div>
          <span className="text-[10px] text-[#7d8f85] block mt-1">On duty technicians</span>
        </div>
      </div>

      {/* TWO COLUMN: ISSUES BY DEPARTMENT & ISSUES BY BUILDING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues by Department */}
        <div className="card-blueprint rounded-lg p-5 bg-white dark:bg-[#161e1a]">
          <div className="flex items-center justify-between pb-3 border-b border-[#dce3dd] dark:border-[#24332b]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
              ISSUES BY DEPARTMENT
            </h3>
            <span className="text-[10px] font-mono text-[#7d8f85]">Volume & Resolution</span>
          </div>

          <div className="mt-4 space-y-3 font-mono text-xs">
            {Object.entries(deptCounts).map(([name, data]) => {
              const maxVal = Math.max(...Object.values(deptCounts).map((v) => v.total), 1);
              const barWidth = Math.round((data.total / maxVal) * 100);

              return (
                <div key={name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#18221c] dark:text-[#f1f5f2] truncate">
                      {name}
                    </span>
                    <span className="text-[11px] text-[#526359] dark:text-[#9cb1a5]">
                      <strong>{data.total}</strong> ({data.open} open • {data.resolved} resolved)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded bg-[#eff2ee] dark:bg-[#1c2722] overflow-hidden flex">
                    <div
                      className="bg-emerald-800 dark:bg-emerald-500 h-full transition-all"
                      style={{ width: `${(data.resolved / (data.total || 1)) * barWidth}%` }}
                      title="Resolved"
                    />
                    <div
                      className="bg-amber-600 h-full transition-all"
                      style={{ width: `${(data.open / (data.total || 1)) * barWidth}%` }}
                      title="Open / In Progress"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Issues by Campus Building */}
        <div className="card-blueprint rounded-lg p-5 bg-white dark:bg-[#161e1a]">
          <div className="flex items-center justify-between pb-3 border-b border-[#dce3dd] dark:border-[#24332b]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
              ISSUES BY CAMPUS BUILDING
            </h3>
            <span className="text-[10px] font-mono text-[#7d8f85]">Infrastructure Map Distribution</span>
          </div>

          <div className="mt-4 space-y-3 font-mono text-xs">
            {Object.entries(buildingCounts).map(([bldg, count]) => {
              const maxBldg = Math.max(...Object.values(buildingCounts), 1);
              const barWidth = Math.round((count / maxBldg) * 100);

              return (
                <div key={bldg} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#18221c] dark:text-[#f1f5f2]">
                      {bldg}
                    </span>
                    <span className="text-[11px] text-[#526359] dark:text-[#9cb1a5]">
                      <strong>{count}</strong> tickets
                    </span>
                  </div>

                  <div className="w-full h-2 rounded bg-[#eff2ee] dark:bg-[#1c2722] overflow-hidden">
                    <div
                      className="bg-[#2d5a51] dark:bg-[#4b8979] h-full transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TWO COLUMN: ISSUES BY CATEGORY & MONTHLY COMPLAINTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues by Category */}
        <div className="card-blueprint rounded-lg p-5 bg-white dark:bg-[#161e1a]">
          <div className="flex items-center justify-between pb-3 border-b border-[#dce3dd] dark:border-[#24332b]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
              ISSUES BY CATEGORY
            </h3>
            <span className="text-[10px] font-mono text-[#7d8f85]">Failure Mode Breakdown</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <div
                key={cat}
                className="p-2.5 rounded bg-[#f7f8f6] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] flex items-center justify-between"
              >
                <span className="text-[#18221c] dark:text-[#f1f5f2] truncate">{cat}</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-400 ml-2">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend Bar Visualization */}
        <div className="card-blueprint rounded-lg p-5 bg-white dark:bg-[#161e1a]">
          <div className="flex items-center justify-between pb-3 border-b border-[#dce3dd] dark:border-[#24332b]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
              MONTHLY COMPLAINT TRAJECTORY
            </h3>
            <span className="text-[10px] font-mono text-[#7d8f85]">Total vs Resolved</span>
          </div>

          <div className="mt-6 flex items-end justify-between h-40 gap-4 pt-4 border-b border-[#dce3dd] dark:border-[#24332b] font-mono text-xs">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] text-[#7d8f85]">{d.count}</span>
                <div className="w-full max-w-[28px] rounded-t flex flex-col items-center bg-[#eff2ee] dark:bg-[#1c2722] overflow-hidden" style={{ height: `${(d.count / 45) * 100}%` }}>
                  <div
                    className="w-full bg-emerald-800 dark:bg-emerald-500 rounded-t"
                    style={{ height: `${(d.resolved / d.count) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#526359] dark:text-[#9cb1a5] truncate">
                  {d.month.slice(0, 3)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-center gap-4 text-[10px] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-800 dark:bg-emerald-500" />
              <span>Resolved</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#eff2ee] dark:bg-[#1c2722]" />
              <span>Reported</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
