import React, { useEffect, useState } from 'react';
import type { ComplaintHistoryItem, ComplaintStatus } from '../../types/campus';
import { campusService } from '../../services/campusService';
import { Check, Clock, AlertCircle, User, ArrowDown } from 'lucide-react';

interface ComplaintTimelineProps {
  complaintId: string;
  initialHistory?: ComplaintHistoryItem[];
  currentStatus: ComplaintStatus;
}

const ORDERED_STAGES: ComplaintStatus[] = [
  'SUBMITTED',
  'VERIFIED',
  'ASSIGNED',
  'IN PROGRESS',
  'RESOLVED',
];

export const ComplaintTimeline: React.FC<ComplaintTimelineProps> = ({
  complaintId,
  initialHistory = [],
  currentStatus,
}) => {
  const [history, setHistory] = useState<ComplaintHistoryItem[]>(initialHistory);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = campusService.subscribeComplaintHistory(complaintId, (items) => {
      setHistory(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [complaintId]);

  // Map history events by status
  const historyByStatus = new Map<ComplaintStatus, ComplaintHistoryItem>();
  history.forEach((h) => {
    historyByStatus.set(h.status, h);
  });

  const getStageIndex = (status: ComplaintStatus) => ORDERED_STAGES.indexOf(status);
  const currentIndex = getStageIndex(currentStatus);
  const isRejected = currentStatus === 'REJECTED';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#dce3dd] dark:border-[#24332b]">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
          LIFECYCLE AUDIT TRAIL
        </h4>
        <span className="text-[10px] font-mono text-[#526359] dark:text-[#9cb1a5]">
          LIVE COMPLAINT HISTORY ({history.length} Events)
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#dce3dd] dark:before:bg-[#24332b]">
        {ORDERED_STAGES.map((stage, idx) => {
          const historyEntry = historyByStatus.get(stage);
          const isPassed = currentIndex >= idx;
          const isCurrent = currentStatus === stage;

          // Format timestamp
          let formattedDate = '—';
          let formattedTime = '—';
          if (historyEntry?.changedAt) {
            const d = new Date(historyEntry.changedAt);
            formattedDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            formattedTime = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
          }

          return (
            <div key={stage} className="relative group">
              {/* Timeline Indicator Dot */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border text-[9px] font-mono font-bold transition-colors ${
                  isPassed
                    ? 'bg-emerald-900 text-white border-emerald-950 dark:bg-emerald-700 dark:border-emerald-600'
                    : 'bg-white dark:bg-[#161e1a] text-[#7d8f85] border-[#dce3dd] dark:border-[#24332b]'
                } ${isCurrent ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-[#101513]' : ''}`}
              >
                {isPassed ? <Check className="w-3 h-3 stroke-[2.5]" /> : idx + 1}
              </div>

              {/* Stage Content */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono font-bold tracking-wide uppercase ${
                      isCurrent
                        ? 'text-emerald-900 dark:text-emerald-300'
                        : isPassed
                        ? 'text-[#18221c] dark:text-[#f1f5f2]'
                        : 'text-[#7d8f85] dark:text-[#64756b]'
                    }`}
                  >
                    {stage}
                  </span>
                  {historyEntry && (
                    <span className="text-[10px] font-mono text-[#526359] dark:text-[#9cb1a5]">
                      {formattedDate} • {formattedTime}
                    </span>
                  )}
                </div>

                {historyEntry ? (
                  <div className="mt-1 p-2 rounded bg-[#f7f8f6] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#18221c] dark:text-[#f1f5f2] font-semibold">
                      <User className="w-3 h-3 text-emerald-800 dark:text-emerald-400" />
                      <span>{historyEntry.changedByName}</span>
                    </div>
                    {historyEntry.comment && (
                      <p className="mt-1 text-xs text-[#526359] dark:text-[#9cb1a5] font-sans leading-relaxed">
                        {historyEntry.comment}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] font-mono text-[#7d8f85] dark:text-[#64756b] mt-0.5 italic">
                    Pending progression...
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* If Rejected */}
        {isRejected && (
          <div className="relative pl-0 pt-2">
            <div className="absolute -left-6 top-3 w-5 h-5 rounded-full bg-red-800 text-white flex items-center justify-center border border-red-950">
              <AlertCircle className="w-3 h-3" />
            </div>
            <div className="p-2.5 rounded bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs">
              <span className="font-mono font-bold text-red-900 dark:text-red-300 uppercase block">
                COMPLAINT REJECTED
              </span>
              <p className="text-red-800 dark:text-red-400 mt-0.5">
                {historyByStatus.get('REJECTED')?.comment || 'Issue determined to be non-actionable or duplicate.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
