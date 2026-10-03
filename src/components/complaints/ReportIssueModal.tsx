import React, { useState } from 'react';
import type { CampusBuilding, ComplaintCategory, PriorityLevel, UserProfile } from '../../types/campus';
import { campusService } from '../../services/campusService';
import { X, Upload, Building, MapPin, Tag, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  initialBuilding?: CampusBuilding;
  onSuccess: (complaintId: string) => void;
}

const BUILDINGS: CampusBuilding[] = [
  'MAIN BLOCK',
  'LIBRARY',
  'LAB BLOCK',
  'HOSTEL',
  'CANTEEN',
  'ADMIN BLOCK',
  'SPORTS AREA',
];

const CATEGORIES: ComplaintCategory[] = [
  'Electrical',
  'Plumbing',
  'Classroom',
  'Laboratory',
  'Hostel',
  'Wi-Fi / Network',
  'Furniture',
  'Cleaning',
  'Safety',
  'Other',
];

const PRIORITIES: PriorityLevel[] = ['Low', 'Medium', 'High', 'Urgent'];

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialBuilding = 'MAIN BLOCK',
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [building, setBuilding] = useState<CampusBuilding>(initialBuilding);
  const [floor, setFloor] = useState('Ground Floor');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Electrical');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      setErrorMessage('Please fill in all required fields (Title, Specific Location, Description).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const newId = await campusService.createComplaint({
        title: title.trim(),
        description: description.trim(),
        building,
        floor,
        location: location.trim(),
        category,
        priority,
        user: currentUser,
        imageUrl: imagePreview || undefined,
      });

      onSuccess(newId);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage('An error occurred submitting the complaint to the campus database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white dark:bg-[#161e1a] rounded-lg border border-[#dce3dd] dark:border-[#24332b] shadow-2xl flex flex-col overflow-hidden max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#dce3dd] dark:border-[#24332b] bg-[#f9faf8] dark:bg-[#121614] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-800 dark:bg-emerald-400" />
              REPORT CAMPUS ISSUE
            </h3>
            <p className="text-[11px] font-mono text-[#526359] dark:text-[#9cb1a5] mt-0.5">
              Submit an infrastructure failure or maintenance work order ticket
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#526359] hover:text-[#18221c] dark:text-[#9cb1a5] dark:hover:text-[#f1f5f2] hover:bg-[#e9ece8] dark:hover:bg-[#223029] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 font-mono">
              {errorMessage}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-xs font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
              ISSUE TITLE *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Overhead projector flickering during lecture, or Water leakage in 2nd floor restroom"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs font-sans px-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2] focus:outline-emerald-800"
            />
          </div>

          {/* Building & Floor Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
                CAMPUS BUILDING *
              </label>
              <select
                value={building}
                onChange={(e) => setBuilding(e.target.value as CampusBuilding)}
                className="w-full text-xs font-mono px-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
              >
                {BUILDINGS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
                FLOOR LEVEL *
              </label>
              <select
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
              >
                <option value="Basement">Basement</option>
                <option value="Ground Floor">Ground Floor</option>
                <option value="1st Floor">1st Floor</option>
                <option value="2nd Floor">2nd Floor</option>
                <option value="3rd Floor">3rd Floor</option>
                <option value="4th Floor">4th Floor</option>
                <option value="5th Floor">5th Floor</option>
                <option value="Outdoor Grounds">Outdoor Grounds</option>
              </select>
            </div>
          </div>

          {/* Specific Location Room / Corridor */}
          <div>
            <label className="text-xs font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
              SPECIFIC LOCATION / ROOM CODE *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lab 204, AI Research Wing, Desk #14"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs font-sans px-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
                CATEGORY *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full text-xs font-mono px-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
                SEVERITY / PRIORITY *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full text-xs font-mono px-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p} Priority
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
              DETAILED TECHNICAL DESCRIPTION *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe what occurred, any equipment model numbers, error indicators, or safety hazards..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs font-sans px-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="text-xs font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
              ATTACH EVIDENCE PHOTO (OPTIONAL)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex flex-col items-center justify-center p-4 border border-dashed border-[#dce3dd] dark:border-[#24332b] rounded bg-[#fbfbfa] dark:bg-[#121614] hover:bg-[#eff2ee] dark:hover:bg-[#1c2722] cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-emerald-800 dark:text-emerald-400 mb-1" />
                <span className="text-xs font-mono text-[#526359] dark:text-[#9cb1a5]">
                  Click to select photo or drag file here
                </span>
                <span className="text-[10px] font-mono text-[#7d8f85] mt-0.5">
                  PNG, JPG up to 5MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative w-20 h-20 rounded border border-[#dce3dd] dark:border-[#24332b] overflow-hidden shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submitter Metadata Summary */}
          <div className="p-3 rounded bg-[#eff2ee] dark:bg-[#1c2722] text-[11px] font-mono text-[#526359] dark:text-[#9cb1a5] flex items-center justify-between">
            <span>Logged by: <strong className="text-[#18221c] dark:text-[#f1f5f2]">{currentUser.name}</strong> ({currentUser.collegeId})</span>
            <span>Dept: {currentUser.department}</span>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-[#dce3dd] dark:border-[#24332b] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 text-xs font-mono rounded bg-white dark:bg-[#161e1a] text-[#526359] dark:text-[#9cb1a5] border border-[#dce3dd] dark:border-[#24332b] hover:bg-[#f0f2ef] dark:hover:bg-[#223029] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-5 text-xs font-mono font-bold rounded bg-emerald-900 hover:bg-emerald-950 text-white dark:bg-emerald-800 dark:hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? 'Dispatching...' : '+ Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
