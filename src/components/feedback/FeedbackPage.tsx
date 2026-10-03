import React from 'react';
import type { FeedbackRecord } from '../../types/campus';
import { Star, MessageSquare, CheckCircle, ThumbsUp, Building, User } from 'lucide-react';

interface FeedbackPageProps {
  feedbackList: FeedbackRecord[];
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ feedbackList }) => {
  const avgRating =
    feedbackList.length > 0
      ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / feedbackList.length).toFixed(1)
      : '5.0';

  const excellentCount = feedbackList.filter((f) => f.satisfaction === 'Excellent').length;
  const goodCount = feedbackList.filter((f) => f.satisfaction === 'Good').length;
  const avgCount = feedbackList.filter((f) => f.satisfaction === 'Average').length;
  const poorCount = feedbackList.filter((f) => f.satisfaction === 'Poor').length;

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-[#dce3dd] dark:border-[#24332b]">
        <h1 className="text-xl font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
          RESOLUTION SATISFACTION AUDIT & FEEDBACK
        </h1>
        <p className="text-xs font-mono text-[#526359] dark:text-[#9cb1a5] mt-0.5">
          Student quality ratings, field repair feedback and maintenance crew accountability audits
        </p>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="card-blueprint rounded-lg p-3.5 bg-white dark:bg-[#161e1a]">
          <span className="text-[10px] text-[#7d8f85] uppercase block">Average Score</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">{avgRating}</span>
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
          </div>
          <span className="text-[10px] text-[#7d8f85] block mt-1">Out of 5.0 scale</span>
        </div>

        <div className="card-blueprint rounded-lg p-3.5 bg-white dark:bg-[#161e1a]">
          <span className="text-[10px] text-[#7d8f85] uppercase block">Excellent Ratings</span>
          <div className="text-2xl font-bold text-[#18221c] dark:text-[#f1f5f2] mt-1">{excellentCount}</div>
          <span className="text-[10px] text-emerald-800 dark:text-emerald-400 block mt-1">Highly satisfied</span>
        </div>

        <div className="card-blueprint rounded-lg p-3.5 bg-white dark:bg-[#161e1a]">
          <span className="text-[10px] text-[#7d8f85] uppercase block">Good Ratings</span>
          <div className="text-2xl font-bold text-[#18221c] dark:text-[#f1f5f2] mt-1">{goodCount}</div>
          <span className="text-[10px] text-blue-700 dark:text-blue-400 block mt-1">Acceptable SLA</span>
        </div>

        <div className="card-blueprint rounded-lg p-3.5 bg-white dark:bg-[#161e1a]">
          <span className="text-[10px] text-[#7d8f85] uppercase block">Audit Count</span>
          <div className="text-2xl font-bold text-[#18221c] dark:text-[#f1f5f2] mt-1">{feedbackList.length}</div>
          <span className="text-[10px] text-[#7d8f85] block mt-1">Verified entries</span>
        </div>
      </div>

      {/* FEEDBACK REVIEWS LIST */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
          INDIVIDUAL STUDENT FEEDBACK RESPONSES
        </h3>

        {feedbackList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            {feedbackList.map((item) => (
              <div
                key={item.id}
                className="card-blueprint rounded-lg p-4 bg-white dark:bg-[#161e1a] space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 dark:text-emerald-400">
                      {item.complaintCode}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <h4 className="font-sans font-semibold text-[#18221c] dark:text-[#f1f5f2] mt-1 line-clamp-1">
                    {item.complaintTitle}
                  </h4>

                  <p className="font-sans text-xs text-[#526359] dark:text-[#9cb1a5] mt-2 italic bg-[#f7f8f6] dark:bg-[#121614] p-2.5 rounded border border-[#dce3dd] dark:border-[#24332b]">
                    "{item.comment}"
                  </p>
                </div>

                <div className="pt-2 border-t border-[#dce3dd] dark:border-[#24332b] flex items-center justify-between text-[10px] text-[#7d8f85]">
                  <span>By: <strong className="text-[#18221c] dark:text-[#f1f5f2]">{item.studentName}</strong></span>
                  <span>Building: {item.building}</span>
                  <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-blueprint rounded-lg p-8 text-center text-xs font-mono text-[#526359] dark:text-[#9cb1a5]">
            No feedback entries logged yet.
          </div>
        )}
      </div>
    </div>
  );
};
