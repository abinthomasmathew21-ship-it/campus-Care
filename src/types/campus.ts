/**
 * CampusCare Infrastructure & Issue Management System
 * Core TypeScript Definitions
 */

export type UserRole = 'Student' | 'Staff' | 'Maintenance Staff' | 'Administrator';

export type ComplaintStatus = 
  | 'SUBMITTED' 
  | 'VERIFIED' 
  | 'ASSIGNED' 
  | 'IN PROGRESS' 
  | 'RESOLVED' 
  | 'REJECTED';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export type CampusBuilding = 
  | 'MAIN BLOCK'
  | 'LIBRARY'
  | 'LAB BLOCK'
  | 'HOSTEL'
  | 'CANTEEN'
  | 'ADMIN BLOCK'
  | 'SPORTS AREA';

export type ComplaintCategory = 
  | 'Electrical'
  | 'Plumbing'
  | 'Classroom'
  | 'Laboratory'
  | 'Hostel'
  | 'Wi-Fi / Network'
  | 'Furniture'
  | 'Cleaning'
  | 'Safety'
  | 'Other';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  department: string;
  collegeId: string;
  phone?: string;
  year?: string;
  createdAt: string;
}

export interface ComplaintHistoryItem {
  id: string;
  complaintId: string;
  status: ComplaintStatus;
  comment?: string;
  changedBy: string;
  changedByName: string;
  changedAt: string;
}

export interface Complaint {
  id: string;
  complaintId: string; // e.g. CC-2026-1042
  userId: string;
  userName: string;
  userEmail: string;
  userCollegeId?: string;
  title: string;
  description: string;
  building: CampusBuilding;
  floor: string;
  location: string; // Specific room/corridor, e.g. "Room 304, West Wing"
  category: ComplaintCategory;
  priority: PriorityLevel;
  status: ComplaintStatus;
  department: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  satisfactionRating?: number; // 1-5
  satisfactionComment?: string;
  history?: ComplaintHistoryItem[];
}

export interface Department {
  id: string;
  name: string;
  head: string;
  staffCount: number;
  openIssues: number;
  resolvedIssues: number;
  responseStatus: 'Optimal' | 'Heavy Load' | 'Delayed' | 'Critical';
  description: string;
}

export interface StaffMember {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  role: string;
  email: string;
  phone: string;
  activeAssignments: number;
  completedIssues: number;
  status: 'Active' | 'On Leave' | 'On Call';
}

export interface StudentRecord {
  id: string;
  name: string;
  studentId: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  totalComplaints: number;
  resolvedComplaints: number;
  accountStatus: 'Active' | 'Suspended' | 'Pending Verification';
}

export interface FeedbackRecord {
  id: string;
  complaintId: string;
  complaintCode: string;
  complaintTitle: string;
  studentId: string;
  studentName: string;
  building: string;
  rating: number; // 1 to 5
  satisfaction: 'Excellent' | 'Good' | 'Average' | 'Poor';
  comment: string;
  submittedAt: string;
}

export interface CampusBlockStatus {
  id: CampusBuilding;
  name: string;
  code: string;
  totalRooms: number;
  activeComplaints: number;
  highestPriority: PriorityLevel | 'None';
  statusColor: 'green' | 'yellow' | 'orange' | 'red' | 'blue';
  categories: { [key: string]: number };
  assignedStaff: string[];
  latestIssue?: {
    id: string;
    title: string;
    priority: PriorityLevel;
    timestamp: string;
  };
  gridCoordinates: string;
}
