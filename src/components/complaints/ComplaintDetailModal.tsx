import React, { useState } from 'react';
import type { Complaint, StaffMember, Department, UserProfile } from '../../types/campus';
import { ComplaintTimeline } from './ComplaintTimeline';
import { campusService } from '../../services/campusService';
import { 
  X, 
  MapPin, 
  Building, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Tag, 
  ShieldAlert, 
  CheckCircle, 
  Play, 
  UserCheck, 
  Ban,
  Star,
  MessageSquare,
  FileText
} from 'lucide-react';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  currentUser: UserProfile;
  staffList: StaffMember[];
  departments: Department[];
  onRefresh?: () => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  onClose,
  currentUser,
  staffList,
  departments,
  onRefresh,
}) => {
  if (!complaint) return null;

  const [commentText, setCommentText] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState(complaint.assignedStaffId || '');
  const [actionLoading, setActionLoading] = useState(false);

  // Student Feedback Form State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackSatisfaction, setFeedbackSatisfaction] = useState<'Excellent' | 'Good' | 'Average' | 'Poor'>('Excellent');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const canAdminister = currentUser.role === 'Administrator' || currentUser.role === 'Maintenance Staff';
  const isCreator = currentUser.id === complaint.userId;
  const isAssignedTech = currentUser.id === complaint.assignedStaffId;

  // Handle Action Controls
  const handleStatusUpdate = async (nextStatus: Complaint['status']) => {
    setActionLoading(true);
    try {
      await campusService.updateComplaintStatus(
        complaint.id,
        nextStatus,
        commentText.trim() || `Workflow state advanced to ${nextStatus}`,
        currentUser
      );
      setCommentText('');
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignSubmit = async () => {
    if (!selectedStaffId) return;
    const staff = staffList.find((s) => s.id === selectedStaffId);
    if (!staff) return;

    setActionLoading(true);
    try {
      await campusService.assignComplaint(
        complaint.id,
        staff.id,
        staff.name,
        staff.department,
        commentText.trim() || `Work order assigned to ${staff.name}`,
        currentUser
      );
      setCommentText('');
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await campusService.submitFeedback(
        complaint.id,
        complaint,
        currentUser,
        feedbackRating,
        feedbackSatisfaction,
        feedbackComment
      );
      setFeedbackSubmitted(true);
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#161e1a] rounded-lg border border-[#dce3dd] dark:border-[#24332b] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#dce3dd] dark:border-[#24332b] bg-[#f9faf8] dark:bg-[#121614] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              {complaint.complaintId}
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                complaint.priority === 'Urgent' ? 'bg-red-100 text-red-900 border border-red-300 dark:bg-red-950 dark:text-red-300' :
                complaint.priority === 'High' ? 'bg-orange-100 text-orange-900 border border-orange-300 dark:bg-orange-950 dark:text-orange-300' :
                complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-900 border border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300' :
                'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {complaint.priority} Priority
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#eff2ee] dark:bg-[#1c2722] text-[#18221c] dark:text-[#f1f5f2] border border-[#dce3dd] dark:border-[#24332b]">
                {complaint.status}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded text-[#526359] hover:text-[#18221c] dark:text-[#9cb1a5] dark:hover:text-[#f1f5f2] hover:bg-[#e9ece8] dark:hover:bg-[#223029] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body: Two Column Layout */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Complaint Information & Student Details */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#18221c] dark:text-[#f1f5f2]">
                {complaint.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-[#526359] dark:text-[#9cb1a5]">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                  {complaint.building} • {complaint.floor}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                  {complaint.location}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                  {complaint.category}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="p-3.5 rounded bg-[#f7f8f6] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b]">
              <h4 className="text-[11px] font-mono font-bold uppercase text-[#526359] dark:text-[#9cb1a5] mb-1">
                INCIDENT DESCRIPTION
              </h4>
              <p className="text-xs text-[#18221c] dark:text-[#f1f5f2] leading-relaxed whitespace-pre-line">
                {complaint.description}
              </p>
            </div>

            {/* Student Submitter Information */}
            <div className="p-3.5 rounded bg-[#f7f8f6] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b]">
              <h4 className="text-[11px] font-mono font-bold uppercase text-[#526359] dark:text-[#9cb1a5] mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                REPORTING STUDENT / STAFF
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#7d8f85] block">Name:</span>
                  <span className="font-semibold text-[#18221c] dark:text-[#f1f5f2]">{complaint.userName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7d8f85] block">ID / Roll No:</span>
                  <span className="font-semibold text-[#18221c] dark:text-[#f1f5f2]">{complaint.userCollegeId || 'CAMPUS-USER'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7d8f85] block">Email:</span>
                  <span className="text-[#526359] dark:text-[#9cb1a5]">{complaint.userEmail}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7d8f85] block">Logged Date:</span>
                  <span className="text-[#526359] dark:text-[#9cb1a5]">
                    {new Date(complaint.createdAt).toLocaleDateString()} {new Date(complaint.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Image / Attachment Area */}
            <div>
              <h4 className="text-[11px] font-mono font-bold uppercase text-[#526359] dark:text-[#9cb1a5] mb-2">
                ATTACHMENTS & TECHNICAL EVIDENCE
              </h4>
              {complaint.imageUrl ? (
                <div className="border border-[#dce3dd] dark:border-[#24332b] rounded overflow-hidden max-h-48">
                  <img src={complaint.imageUrl} alt="Issue Evidence" className="w-full object-cover" />
                </div>
              ) : (
                <div className="p-4 rounded border border-dashed border-[#dce3dd] dark:border-[#24332b] bg-[#fcfdfc] dark:bg-[#151c18] flex items-center justify-center gap-2 text-xs font-mono text-[#7d8f85]">
                  <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>No digital photo attachment provided with initial ticket</span>
                </div>
              )}
            </div>

            {/* Student Resolution Feedback Section (If resolved) */}
            {complaint.status === 'RESOLVED' && (
              <div className="p-3.5 rounded bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    RESOLUTION SATISFACTION AUDIT
                  </h4>
                  {complaint.satisfactionRating && (
                    <div className="flex items-center gap-1 text-amber-600">
                      {[...Array(complaint.satisfactionRating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  )}
                </div>

                {complaint.satisfactionComment ? (
                  <div className="mt-2 text-xs font-mono text-emerald-950 dark:text-emerald-200">
                    <p className="italic">"{complaint.satisfactionComment}"</p>
                  </div>
                ) : isCreator && !feedbackSubmitted ? (
                  <form onSubmit={handleFeedbackSubmit} className="mt-3 space-y-2">
                    <p className="text-xs text-[#526359] dark:text-[#9cb1a5]">
                      As the student who reported this issue, please rate the quality of the maintenance resolution:
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFeedbackRating(star)}
                            className="cursor-pointer"
                          >
                            <Star className={`w-4 h-4 ${star <= feedbackRating ? 'fill-current' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                      <select
                        value={feedbackSatisfaction}
                        onChange={(e) => setFeedbackSatisfaction(e.target.value as any)}
                        className="text-xs font-mono px-2 py-1 rounded bg-white dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b]"
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Average">Average</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Optional feedback comment on the repair..."
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      className="w-full text-xs font-sans px-2.5 py-1.5 rounded bg-white dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
                    />
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="py-1 px-3 text-xs font-mono font-bold rounded bg-emerald-900 text-white hover:bg-emerald-950 cursor-pointer"
                    >
                      Submit Feedback
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-[#7d8f85] mt-1 font-mono italic">
                    {feedbackSubmitted ? 'Thank you! Your feedback has been recorded.' : 'Awaiting student rating.'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Status Timeline, Assignment & Action Controls */}
          <div className="md:col-span-5 space-y-5 border-t md:border-t-0 md:border-l md:pl-5 border-[#dce3dd] dark:border-[#24332b]">
            {/* Assignment & Department Card */}
            <div className="p-3.5 rounded bg-[#f7f8f6] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-xs font-mono">
              <h4 className="text-[11px] font-bold uppercase text-[#526359] dark:text-[#9cb1a5] mb-2">
                ASSIGNMENT & DISPATCH
              </h4>
              <div className="space-y-1.5">
                <div>
                  <span className="text-[10px] text-[#7d8f85] block">Responsible Department:</span>
                  <span className="font-semibold text-[#18221c] dark:text-[#f1f5f2]">
                    {complaint.department || 'Not yet dispatched'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7d8f85] block">Assigned Engineer / Tech:</span>
                  <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                    {complaint.assignedStaffName || 'Unassigned'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7d8f85] block">Last Activity:</span>
                  <span className="text-[#526359] dark:text-[#9cb1a5]">
                    {new Date(complaint.updatedAt).toLocaleDateString()} {new Date(complaint.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Vertical Technical Lifecycle Timeline */}
            <ComplaintTimeline
              complaintId={complaint.id}
              initialHistory={complaint.history}
              currentStatus={complaint.status}
            />

            {/* Action Controls for Admin & Maintenance Staff */}
            {canAdminister && (
              <div className="pt-3 border-t border-[#dce3dd] dark:border-[#24332b] space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
                  OPERATIONAL CONTROLS
                </h4>

                {/* Audit Comment / Work Note */}
                <div>
                  <label className="text-[10px] font-mono text-[#526359] dark:text-[#9cb1a5] block mb-1">
                    AUDIT NOTE / ACTION LOG:
                  </label>
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Enter inspection finding or work log..."
                    className="w-full text-xs font-sans px-2.5 py-1.5 rounded bg-white dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
                  />
                </div>

                {/* Staff Assignment Selector (if pending or reassigning) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#526359] dark:text-[#9cb1a5] block">
                    REASSIGN WORK ORDER:
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedStaffId}
                      onChange={(e) => setSelectedStaffId(e.target.value)}
                      className="flex-1 text-xs font-mono px-2 py-1.5 rounded bg-white dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
                    >
                      <option value="">Select Staff Engineer...</option>
                      {staffList.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({st.department})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={!selectedStaffId || actionLoading}
                      onClick={handleAssignSubmit}
                      className="px-3 py-1.5 text-xs font-mono font-bold rounded bg-emerald-900 hover:bg-emerald-950 text-white cursor-pointer disabled:opacity-50"
                    >
                      Assign
                    </button>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                  {complaint.status === 'SUBMITTED' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleStatusUpdate('VERIFIED')}
                      className="py-2 px-3 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verify Issue
                    </button>
                  )}

                  {(complaint.status === 'VERIFIED' || complaint.status === 'ASSIGNED') && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleStatusUpdate('IN PROGRESS')}
                      className="py-2 px-3 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Start Work
                    </button>
                  )}

                  {complaint.status === 'IN PROGRESS' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleStatusUpdate('RESOLVED')}
                      className="col-span-2 py-2 px-3 rounded bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark Resolved
                    </button>
                  )}

                  {complaint.status !== 'RESOLVED' && complaint.status !== 'REJECTED' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleStatusUpdate('REJECTED')}
                      className="py-2 px-3 rounded bg-white dark:bg-[#1c2722] hover:bg-red-50 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-900 font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      Reject Ticket
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
