/**
 * CampusCare Service Layer
 * Firestore synchronization, real-time subscriptions, and institutional workflow logic
 */
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import type {
  Complaint,
  ComplaintHistoryItem,
  Department,
  StaffMember,
  StudentRecord,
  FeedbackRecord,
  ComplaintStatus,
  PriorityLevel,
  CampusBuilding,
  ComplaintCategory,
  UserProfile,
} from '../types/campus';

const COMPLAINTS_COL = 'complaints';
const DEPARTMENTS_COL = 'departments';
const STAFF_COL = 'staff';
const STUDENTS_COL = 'students';
const FEEDBACK_COL = 'feedback';
const USERS_COL = 'users';

// Institutional Seed Data
export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-electrical',
    name: 'Electrical Maintenance',
    head: 'Eng. Vikram Seth',
    staffCount: 8,
    openIssues: 5,
    resolvedIssues: 42,
    responseStatus: 'Optimal',
    description: 'Power distribution, high-voltage transformers, classroom AV systems, lighting, and backup generators.',
  },
  {
    id: 'dept-plumbing',
    name: 'Plumbing & Water Works',
    head: 'Eng. Ramesh Babu',
    staffCount: 6,
    openIssues: 3,
    resolvedIssues: 38,
    responseStatus: 'Optimal',
    description: 'Campus water filtration plants, washroom sanitation, overhead water reservoirs, and drainage pipelines.',
  },
  {
    id: 'dept-it-support',
    name: 'IT & Network Infrastructure',
    head: 'Dr. Anand Verma',
    staffCount: 11,
    openIssues: 7,
    resolvedIssues: 94,
    responseStatus: 'Heavy Load',
    description: 'Campus Wi-Fi access points, fiber-optic backbone, laboratory computing terminals, and lecture hall projectors.',
  },
  {
    id: 'dept-civil',
    name: 'Civil & Structural Maintenance',
    head: 'Eng. S. Murthy',
    staffCount: 9,
    openIssues: 4,
    resolvedIssues: 31,
    responseStatus: 'Optimal',
    description: 'Building masonry, roofing waterproofing, door/window fixtures, tiling, and staircase safety handrails.',
  },
  {
    id: 'dept-housekeeping',
    name: 'Housekeeping & Sanitation',
    head: 'Mrs. Sunita Rao',
    staffCount: 14,
    openIssues: 2,
    resolvedIssues: 120,
    responseStatus: 'Optimal',
    description: 'Corridor cleanliness, chemical waste disposal, classroom sanitization, and hostel floor maintenance.',
  },
  {
    id: 'dept-hostel',
    name: 'Hostel Facilities Administration',
    head: 'Warden Col. K. Nambiar',
    staffCount: 5,
    openIssues: 6,
    resolvedIssues: 54,
    responseStatus: 'Heavy Load',
    description: 'Student residential quarters, hot water geysers, furniture integrity, and student common rooms.',
  },
  {
    id: 'dept-security',
    name: 'Campus Safety & Physical Security',
    head: 'Chief Insp. Rajesh Nair',
    staffCount: 12,
    openIssues: 1,
    resolvedIssues: 27,
    responseStatus: 'Optimal',
    description: 'Surveillance CCTV coverage, electronic turnstiles, emergency exit signage, and fire alarm hydrants.',
  },
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-101',
    name: 'David Miller',
    employeeId: 'EMP-EL-204',
    department: 'Electrical Maintenance',
    role: 'Senior Electrical Engineer',
    email: 'd.miller@campus.edu',
    phone: '+1 (555) 019-2831',
    activeAssignments: 2,
    completedIssues: 34,
    status: 'Active',
  },
  {
    id: 'staff-102',
    name: 'Marcus Chen',
    employeeId: 'EMP-IT-118',
    department: 'IT & Network Infrastructure',
    role: 'Network Systems Specialist',
    email: 'm.chen@campus.edu',
    phone: '+1 (555) 019-4822',
    activeAssignments: 3,
    completedIssues: 52,
    status: 'Active',
  },
  {
    id: 'staff-103',
    name: 'Kavita Sundaram',
    employeeId: 'EMP-PL-092',
    department: 'Plumbing & Water Works',
    role: 'Lead Hydraulics Technician',
    email: 'k.sundaram@campus.edu',
    phone: '+1 (555) 019-8819',
    activeAssignments: 1,
    completedIssues: 29,
    status: 'Active',
  },
  {
    id: 'staff-104',
    name: 'Robert Vance',
    employeeId: 'EMP-CV-305',
    department: 'Civil & Structural Maintenance',
    role: 'Structural Field Supervisor',
    email: 'r.vance@campus.edu',
    phone: '+1 (555) 019-6120',
    activeAssignments: 2,
    completedIssues: 21,
    status: 'On Call',
  },
  {
    id: 'staff-105',
    name: 'Amina Al-Mansoor',
    employeeId: 'EMP-HK-044',
    department: 'Housekeeping & Sanitation',
    role: 'Operations Coordinator',
    email: 'a.almansoor@campus.edu',
    phone: '+1 (555) 019-3312',
    activeAssignments: 1,
    completedIssues: 68,
    status: 'Active',
  },
  {
    id: 'staff-106',
    name: 'Joseph O’Connor',
    employeeId: 'EMP-HS-150',
    department: 'Hostel Facilities Administration',
    role: 'Residential Facilities Officer',
    email: 'j.oconnor@campus.edu',
    phone: '+1 (555) 019-7744',
    activeAssignments: 2,
    completedIssues: 41,
    status: 'Active',
  },
];

export const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 'stu-501',
    name: 'Rahul Sharma',
    studentId: 'STU-CS-2023-041',
    department: 'Computer Science & Engineering',
    year: '3rd Year (Semester 6)',
    email: 'rahul.s@student.campus.edu',
    phone: '+1 (555) 028-1190',
    totalComplaints: 4,
    resolvedComplaints: 3,
    accountStatus: 'Active',
  },
  {
    id: 'stu-502',
    name: 'Maya Patel',
    studentId: 'STU-EE-2024-088',
    department: 'Electrical & Electronics',
    year: '2nd Year (Semester 4)',
    email: 'maya.p@student.campus.edu',
    phone: '+1 (555) 028-4421',
    totalComplaints: 2,
    resolvedComplaints: 2,
    accountStatus: 'Active',
  },
  {
    id: 'stu-503',
    name: 'Alexander Wood',
    studentId: 'STU-ME-2022-019',
    department: 'Mechanical Engineering',
    year: '4th Year (Semester 8)',
    email: 'alex.w@student.campus.edu',
    phone: '+1 (555) 028-7654',
    totalComplaints: 5,
    resolvedComplaints: 4,
    accountStatus: 'Active',
  },
  {
    id: 'stu-504',
    name: 'Fatima Zahra',
    studentId: 'STU-CV-2023-112',
    department: 'Civil Engineering',
    year: '3rd Year (Semester 5)',
    email: 'fatima.z@student.campus.edu',
    phone: '+1 (555) 028-9801',
    totalComplaints: 3,
    resolvedComplaints: 2,
    accountStatus: 'Active',
  },
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'comp-1001',
    complaintId: 'CC-2026-1041',
    userId: 'stu-501',
    userName: 'Rahul Sharma',
    userEmail: 'rahul.s@student.campus.edu',
    userCollegeId: 'STU-CS-2023-041',
    title: 'High-voltage flicker & breaker tripping in Advanced AI Lab',
    description: 'During peak compute practical sessions, distribution board breaker B3 trips intermittently. Three workstations lose power instantly, causing experiment resets.',
    building: 'LAB BLOCK',
    floor: '2nd Floor',
    location: 'Lab Room 204 (AI & ML Research Lab)',
    category: 'Electrical',
    priority: 'Urgent',
    status: 'IN PROGRESS',
    department: 'Electrical Maintenance',
    assignedStaffId: 'staff-101',
    assignedStaffName: 'David Miller',
    createdAt: '2026-10-01T09:15:00Z',
    updatedAt: '2026-10-02T11:30:00Z',
    history: [
      {
        id: 'h-1',
        complaintId: 'comp-1001',
        status: 'SUBMITTED',
        comment: 'Report submitted via Student Portal with lab session error code.',
        changedBy: 'stu-501',
        changedByName: 'Rahul Sharma',
        changedAt: '2026-10-01T09:15:00Z',
      },
      {
        id: 'h-2',
        complaintId: 'comp-1001',
        status: 'VERIFIED',
        comment: 'Site inspected by Lab Assistant. High load fault confirmed.',
        changedBy: 'admin-01',
        changedByName: 'Campus Admin Office',
        changedAt: '2026-10-01T10:45:00Z',
      },
      {
        id: 'h-3',
        complaintId: 'comp-1001',
        status: 'ASSIGNED',
        comment: 'Work order dispatched to Senior Electrical Engineer David Miller.',
        changedBy: 'admin-01',
        changedByName: 'Chief Facilities Officer',
        changedAt: '2026-10-01T13:20:00Z',
      },
      {
        id: 'h-4',
        complaintId: 'comp-1001',
        status: 'IN PROGRESS',
        comment: 'Thermal imaging scan underway. Replacement 63A MCB requisitioned from campus store.',
        changedBy: 'staff-101',
        changedByName: 'David Miller',
        changedAt: '2026-10-02T11:30:00Z',
      },
    ],
  },
  {
    id: 'comp-1002',
    complaintId: 'CC-2026-1038',
    userId: 'stu-502',
    userName: 'Maya Patel',
    userEmail: 'maya.p@student.campus.edu',
    userCollegeId: 'STU-EE-2024-088',
    title: 'Ceiling water leakage near rare manuscript archives',
    description: 'Continuous condensation drip observed from the suspended AC plenum above Book Stack section 4C. Risk of paper degradation if not sealed immediately.',
    building: 'LIBRARY',
    floor: '3rd Floor',
    location: 'North Wing, Archive Stack 4C',
    category: 'Plumbing',
    priority: 'High',
    status: 'ASSIGNED',
    department: 'Plumbing & Water Works',
    assignedStaffId: 'staff-103',
    assignedStaffName: 'Kavita Sundaram',
    createdAt: '2026-10-01T14:30:00Z',
    updatedAt: '2026-10-02T08:15:00Z',
    history: [
      {
        id: 'h-201',
        complaintId: 'comp-1002',
        status: 'SUBMITTED',
        comment: 'Logged by student librarian assistant.',
        changedBy: 'stu-502',
        changedByName: 'Maya Patel',
        changedAt: '2026-10-01T14:30:00Z',
      },
      {
        id: 'h-202',
        complaintId: 'comp-1002',
        status: 'VERIFIED',
        comment: 'Building supervisor physically inspected plenum. Drainage line block suspected.',
        changedBy: 'admin-01',
        changedByName: 'Campus Admin Office',
        changedAt: '2026-10-01T16:00:00Z',
      },
      {
        id: 'h-203',
        complaintId: 'comp-1002',
        status: 'ASSIGNED',
        comment: 'Assigned to Lead Hydraulics Technician Kavita Sundaram.',
        changedBy: 'admin-01',
        changedByName: 'Estate Director',
        changedAt: '2026-10-02T08:15:00Z',
      },
    ],
  },
  {
    id: 'comp-1003',
    complaintId: 'CC-2026-1025',
    userId: 'stu-503',
    userName: 'Alexander Wood',
    userEmail: 'alex.w@student.campus.edu',
    userCollegeId: 'STU-ME-2022-019',
    title: 'Dual ceiling fan vibration and bearing noise in Seminar Hall',
    description: 'During guest lectures in Main Block Lecture Hall A, two fans make loud grinding metallic noise. Audio recording microphones pick up severe humming.',
    building: 'MAIN BLOCK',
    floor: '1st Floor',
    location: 'Auditorium Hall A, Row 8',
    category: 'Classroom',
    priority: 'Medium',
    status: 'VERIFIED',
    department: 'Electrical Maintenance',
    createdAt: '2026-09-30T11:00:00Z',
    updatedAt: '2026-10-01T10:00:00Z',
    history: [
      {
        id: 'h-301',
        complaintId: 'comp-1003',
        status: 'SUBMITTED',
        comment: 'Logged after Mechanical department seminar.',
        changedBy: 'stu-503',
        changedByName: 'Alexander Wood',
        changedAt: '2026-09-30T11:00:00Z',
      },
      {
        id: 'h-302',
        complaintId: 'comp-1003',
        status: 'VERIFIED',
        comment: 'Verified during empty hall inspection. Bearing lubrication or motor replacement required.',
        changedBy: 'admin-01',
        changedByName: 'Facilities Manager',
        changedAt: '2026-10-01T10:00:00Z',
      },
    ],
  },
  {
    id: 'comp-1004',
    complaintId: 'CC-2026-1012',
    userId: 'stu-501',
    userName: 'Rahul Sharma',
    userEmail: 'rahul.s@student.campus.edu',
    userCollegeId: 'STU-CS-2023-041',
    title: 'Wi-Fi Access Point AP-HSTL-3B offline in Boys Hostel Block B',
    description: 'Access point loses beacon signal every evening between 7 PM and 11 PM. Over 60 resident students experiencing dropped connections during study hours.',
    building: 'HOSTEL',
    floor: '3rd Floor',
    location: 'Corridor Wing B, Room 310-324',
    category: 'Wi-Fi / Network',
    priority: 'High',
    status: 'IN PROGRESS',
    department: 'IT & Network Infrastructure',
    assignedStaffId: 'staff-102',
    assignedStaffName: 'Marcus Chen',
    createdAt: '2026-09-29T19:40:00Z',
    updatedAt: '2026-10-02T09:00:00Z',
    history: [
      {
        id: 'h-401',
        complaintId: 'comp-1004',
        status: 'SUBMITTED',
        comment: 'Logged by Hostel Committee rep.',
        changedBy: 'stu-501',
        changedByName: 'Rahul Sharma',
        changedAt: '2026-09-29T19:40:00Z',
      },
      {
        id: 'h-402',
        complaintId: 'comp-1004',
        status: 'VERIFIED',
        comment: 'Confirmed via centralized Cisco controller dashboard.',
        changedBy: 'admin-01',
        changedByName: 'Network Admin',
        changedAt: '2026-09-30T09:10:00Z',
      },
      {
        id: 'h-403',
        complaintId: 'comp-1004',
        status: 'ASSIGNED',
        comment: 'Dispatched to Marcus Chen for PoE switchport cable test.',
        changedBy: 'admin-01',
        changedByName: 'IT Operations Head',
        changedAt: '2026-09-30T10:00:00Z',
      },
      {
        id: 'h-404',
        complaintId: 'comp-1004',
        status: 'IN PROGRESS',
        comment: 'Faulty patch cord detected in riser cabinet. Rewiring with Cat6 shielded line.',
        changedBy: 'staff-102',
        changedByName: 'Marcus Chen',
        changedAt: '2026-10-02T09:00:00Z',
      },
    ],
  },
  {
    id: 'comp-1005',
    complaintId: 'CC-2026-0995',
    userId: 'stu-504',
    userName: 'Fatima Zahra',
    userEmail: 'fatima.z@student.campus.edu',
    userCollegeId: 'STU-CV-2023-112',
    title: 'Broken window latch and glass hairline crack after rainstorm',
    description: 'Ground floor administration conference room 102 window latch broke during high wind gusts, causing glass pane to tap against concrete casing.',
    building: 'ADMIN BLOCK',
    floor: 'Ground Floor',
    location: 'Conference Room 102',
    category: 'Furniture',
    priority: 'Medium',
    status: 'RESOLVED',
    department: 'Civil & Structural Maintenance',
    assignedStaffId: 'staff-104',
    assignedStaffName: 'Robert Vance',
    createdAt: '2026-09-25T11:20:00Z',
    updatedAt: '2026-09-28T15:30:00Z',
    resolvedAt: '2026-09-28T15:30:00Z',
    satisfactionRating: 5,
    satisfactionComment: 'Promptly repaired before the evening academic council meeting. Excellent work!',
    history: [
      {
        id: 'h-501',
        complaintId: 'comp-1005',
        status: 'SUBMITTED',
        comment: 'Logged by administrative intern.',
        changedBy: 'stu-504',
        changedByName: 'Fatima Zahra',
        changedAt: '2026-09-25T11:20:00Z',
      },
      {
        id: 'h-502',
        complaintId: 'comp-1005',
        status: 'VERIFIED',
        comment: 'Inspected by Assistant Registrar.',
        changedBy: 'admin-01',
        changedByName: 'Campus Admin Office',
        changedAt: '2026-09-25T14:00:00Z',
      },
      {
        id: 'h-503',
        complaintId: 'comp-1005',
        status: 'ASSIGNED',
        comment: 'Assigned to Robert Vance for glazing refit.',
        changedBy: 'admin-01',
        changedByName: 'Facilities Manager',
        changedAt: '2026-09-26T09:00:00Z',
      },
      {
        id: 'h-504',
        complaintId: 'comp-1005',
        status: 'IN PROGRESS',
        comment: 'New safety glass panel cut and brass latch installed.',
        changedBy: 'staff-104',
        changedByName: 'Robert Vance',
        changedAt: '2026-09-27T10:00:00Z',
      },
      {
        id: 'h-505',
        complaintId: 'comp-1005',
        status: 'RESOLVED',
        comment: 'Sealant cured and safety lock verified. Completed.',
        changedBy: 'staff-104',
        changedByName: 'Robert Vance',
        changedAt: '2026-09-28T15:30:00Z',
      },
    ],
  },
  {
    id: 'comp-1006',
    complaintId: 'CC-2026-0980',
    userId: 'stu-502',
    userName: 'Maya Patel',
    userEmail: 'maya.p@student.campus.edu',
    userCollegeId: 'STU-EE-2024-088',
    title: 'Water dispenser cooling compressor failure in Central Canteen',
    description: 'The stainless steel drinking water dispenser near the south dining bay is dispensing room-temperature water with a burning smell from the rear compressor cage.',
    building: 'CANTEEN',
    floor: 'Ground Floor',
    location: 'Dining Hall South Bay, Station #2',
    category: 'Electrical',
    priority: 'Low',
    status: 'RESOLVED',
    department: 'Electrical Maintenance',
    assignedStaffId: 'staff-101',
    assignedStaffName: 'David Miller',
    createdAt: '2026-09-22T13:00:00Z',
    updatedAt: '2026-09-24T16:00:00Z',
    resolvedAt: '2026-09-24T16:00:00Z',
    satisfactionRating: 4,
    satisfactionComment: 'Fixed within two days. Cold water flow restored.',
    history: [
      {
        id: 'h-601',
        complaintId: 'comp-1006',
        status: 'SUBMITTED',
        comment: 'Reported by dining student committee.',
        changedBy: 'stu-502',
        changedByName: 'Maya Patel',
        changedAt: '2026-09-22T13:00:00Z',
      },
      {
        id: 'h-602',
        complaintId: 'comp-1006',
        status: 'VERIFIED',
        comment: 'Compressor thermal overload verified.',
        changedBy: 'admin-01',
        changedByName: 'Canteen Inspector',
        changedAt: '2026-09-22T15:30:00Z',
      },
      {
        id: 'h-603',
        complaintId: 'comp-1006',
        status: 'ASSIGNED',
        comment: 'Assigned to David Miller.',
        changedBy: 'admin-01',
        changedByName: 'Estate Director',
        changedAt: '2026-09-23T09:00:00Z',
      },
      {
        id: 'h-604',
        complaintId: 'comp-1006',
        status: 'IN PROGRESS',
        comment: 'Thermostat relay replaced and refrigerant topped up.',
        changedBy: 'staff-101',
        changedByName: 'David Miller',
        changedAt: '2026-09-23T14:00:00Z',
      },
      {
        id: 'h-605',
        complaintId: 'comp-1006',
        status: 'RESOLVED',
        comment: 'Chilling temperature test passed at 12°C. Returned to service.',
        changedBy: 'staff-101',
        changedByName: 'David Miller',
        changedAt: '2026-09-24T16:00:00Z',
      },
    ],
  },
  {
    id: 'comp-1007',
    complaintId: 'CC-2026-1045',
    userId: 'stu-503',
    userName: 'Alexander Wood',
    userEmail: 'alex.w@student.campus.edu',
    userCollegeId: 'STU-ME-2022-019',
    title: 'Synthetic turf seam detachment along midfield goal line',
    description: 'Heavy rainfall eroded the sub-base bonding glue along a 3-meter section of the synthetic turf line. Tripping hazard during university tournament practice.',
    building: 'SPORTS AREA',
    floor: 'Ground Level',
    location: 'Outdoor Football Arena, North Goal',
    category: 'Safety',
    priority: 'Medium',
    status: 'SUBMITTED',
    department: 'Civil & Structural Maintenance',
    createdAt: '2026-10-02T15:45:00Z',
    updatedAt: '2026-10-02T15:45:00Z',
    history: [
      {
        id: 'h-701',
        complaintId: 'comp-1007',
        status: 'SUBMITTED',
        comment: 'Report submitted with turf photographs by Sports Club captain.',
        changedBy: 'stu-503',
        changedByName: 'Alexander Wood',
        changedAt: '2026-10-02T15:45:00Z',
      },
    ],
  },
];

export const INITIAL_FEEDBACK: FeedbackRecord[] = [
  {
    id: 'fb-1',
    complaintId: 'comp-1005',
    complaintCode: 'CC-2026-0995',
    complaintTitle: 'Broken window latch and glass hairline crack after rainstorm',
    studentId: 'stu-504',
    studentName: 'Fatima Zahra',
    building: 'ADMIN BLOCK',
    rating: 5,
    satisfaction: 'Excellent',
    comment: 'Promptly repaired before the evening academic council meeting. Excellent craftsmanship by Robert Vance.',
    submittedAt: '2026-09-28T16:00:00Z',
  },
  {
    id: 'fb-2',
    complaintId: 'comp-1006',
    complaintCode: 'CC-2026-0980',
    complaintTitle: 'Water dispenser cooling compressor failure in Central Canteen',
    studentId: 'stu-502',
    studentName: 'Maya Patel',
    building: 'CANTEEN',
    rating: 4,
    satisfaction: 'Good',
    comment: 'Fixed within two days. Cold water flow restored and safe to drink.',
    submittedAt: '2026-09-24T17:10:00Z',
  },
];

class CampusService {
  private initialized = false;

  async ensureSeeded() {
    if (this.initialized) return;
    try {
      const snap = await getDocs(collection(db, COMPLAINTS_COL));
      if (snap.empty) {
        // Seed departments
        for (const dept of INITIAL_DEPARTMENTS) {
          await setDoc(doc(db, DEPARTMENTS_COL, dept.id), dept);
        }
        // Seed staff
        for (const st of INITIAL_STAFF) {
          await setDoc(doc(db, STAFF_COL, st.id), st);
        }
        // Seed students
        for (const stu of INITIAL_STUDENTS) {
          await setDoc(doc(db, STUDENTS_COL, stu.id), stu);
        }
        // Seed complaints
        for (const comp of INITIAL_COMPLAINTS) {
          const { history, ...compData } = comp;
          await setDoc(doc(db, COMPLAINTS_COL, comp.id), compData);
          if (history && history.length > 0) {
            for (const h of history) {
              await setDoc(doc(db, `${COMPLAINTS_COL}/${comp.id}/history`, h.id), h);
            }
          }
        }
        // Seed feedback
        for (const fb of INITIAL_FEEDBACK) {
          await setDoc(doc(db, FEEDBACK_COL, fb.id), fb);
        }
      }
      this.initialized = true;
    } catch (e) {
      console.warn('Initial seeding note (will use memory fallback if offline):', e);
    }
  }

  // Subscribe to Complaints in real-time
  subscribeComplaints(callback: (complaints: Complaint[]) => void): () => void {
    const colRef = collection(db, COMPLAINTS_COL);
    return onSnapshot(
      colRef,
      async (snapshot) => {
        if (snapshot.empty && !this.initialized) {
          await this.ensureSeeded();
        }
        const complaints: Complaint[] = [];
        for (const document of snapshot.docs) {
          const data = document.data() as Complaint;
          complaints.push({ ...data, id: document.id });
        }
        // Sort descending by created
        complaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(complaints.length > 0 ? complaints : INITIAL_COMPLAINTS);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, COMPLAINTS_COL);
      }
    );
  }

  // Subscribe to single complaint history
  subscribeComplaintHistory(complaintId: string, callback: (history: ComplaintHistoryItem[]) => void): () => void {
    const historyCol = collection(db, `${COMPLAINTS_COL}/${complaintId}/history`);
    return onSnapshot(
      historyCol,
      (snapshot) => {
        const history: ComplaintHistoryItem[] = [];
        snapshot.forEach((docSnap) => {
          history.push({ ...(docSnap.data() as ComplaintHistoryItem), id: docSnap.id });
        });
        history.sort((a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime());
        callback(history);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `${COMPLAINTS_COL}/${complaintId}/history`);
      }
    );
  }

  // Create a new complaint
  async createComplaint(payload: {
    title: string;
    description: string;
    building: CampusBuilding;
    floor: string;
    location: string;
    category: ComplaintCategory;
    priority: PriorityLevel;
    user: UserProfile;
    imageUrl?: string;
  }): Promise<string> {
    const id = `comp-${Date.now()}`;
    const complaintId = `CC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    // Map category to responsible department
    let department = 'Civil & Structural Maintenance';
    if (payload.category === 'Electrical') department = 'Electrical Maintenance';
    else if (payload.category === 'Plumbing') department = 'Plumbing & Water Works';
    else if (payload.category === 'Wi-Fi / Network') department = 'IT & Network Infrastructure';
    else if (payload.category === 'Hostel') department = 'Hostel Facilities Administration';
    else if (payload.category === 'Cleaning') department = 'Housekeeping & Sanitation';
    else if (payload.category === 'Safety') department = 'Campus Safety & Physical Security';
    else if (payload.category === 'Classroom' || payload.category === 'Laboratory' || payload.category === 'Furniture') {
      department = 'Civil & Structural Maintenance';
    }

    const complaintData: Complaint = {
      id,
      complaintId,
      userId: payload.user.id,
      userName: payload.user.name,
      userEmail: payload.user.email,
      userCollegeId: payload.user.collegeId,
      title: payload.title,
      description: payload.description,
      building: payload.building,
      floor: payload.floor,
      location: payload.location,
      category: payload.category,
      priority: payload.priority,
      status: 'SUBMITTED',
      department,
      imageUrl: payload.imageUrl,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, COMPLAINTS_COL, id), complaintData);

      // Create initial history record
      const historyItem: ComplaintHistoryItem = {
        id: `h-${Date.now()}`,
        complaintId: id,
        status: 'SUBMITTED',
        comment: `Complaint registered in portal by ${payload.user.name} (${payload.user.role}).`,
        changedBy: payload.user.id,
        changedByName: payload.user.name,
        changedAt: now,
      };
      await setDoc(doc(db, `${COMPLAINTS_COL}/${id}/history`, historyItem.id), historyItem);

      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COMPLAINTS_COL);
    }
  }

  // Update status (e.g., VERIFY, START WORK, RESOLVE, REJECT)
  async updateComplaintStatus(
    complaintId: string,
    status: ComplaintStatus,
    comment: string,
    user: UserProfile,
    additionalData?: { assignedStaffId?: string; assignedStaffName?: string }
  ) {
    const now = new Date().toISOString();
    const updatePayload: Record<string, unknown> = {
      status,
      updatedAt: now,
    };

    if (status === 'RESOLVED') {
      updatePayload.resolvedAt = now;
    }
    if (additionalData?.assignedStaffId) {
      updatePayload.assignedStaffId = additionalData.assignedStaffId;
      updatePayload.assignedStaffName = additionalData.assignedStaffName;
    }

    try {
      await updateDoc(doc(db, COMPLAINTS_COL, complaintId), updatePayload);

      // Add history
      const historyId = `h-${Date.now()}`;
      const historyItem: ComplaintHistoryItem = {
        id: historyId,
        complaintId,
        status,
        comment: comment || `Status moved to ${status} by ${user.name}.`,
        changedBy: user.id,
        changedByName: user.name,
        changedAt: now,
      };
      await setDoc(doc(db, `${COMPLAINTS_COL}/${complaintId}/history`, historyId), historyItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COMPLAINTS_COL}/${complaintId}`);
    }
  }

  // Assign complaint to staff / department
  async assignComplaint(
    complaintId: string,
    staffId: string,
    staffName: string,
    department: string,
    comment: string,
    user: UserProfile
  ) {
    const now = new Date().toISOString();
    try {
      await updateDoc(doc(db, COMPLAINTS_COL, complaintId), {
        status: 'ASSIGNED',
        assignedStaffId: staffId,
        assignedStaffName: staffName,
        department,
        updatedAt: now,
      });

      const historyId = `h-${Date.now()}`;
      const historyItem: ComplaintHistoryItem = {
        id: historyId,
        complaintId,
        status: 'ASSIGNED',
        comment: comment || `Assigned to ${staffName} (${department}) by ${user.name}.`,
        changedBy: user.id,
        changedByName: user.name,
        changedAt: now,
      };
      await setDoc(doc(db, `${COMPLAINTS_COL}/${complaintId}/history`, historyId), historyItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COMPLAINTS_COL}/${complaintId}`);
    }
  }

  // Submit Feedback
  async submitFeedback(
    complaintId: string,
    complaint: Complaint,
    student: UserProfile,
    rating: number,
    satisfaction: 'Excellent' | 'Good' | 'Average' | 'Poor',
    comment: string
  ) {
    const now = new Date().toISOString();
    const feedbackId = `fb-${Date.now()}`;

    const record: FeedbackRecord = {
      id: feedbackId,
      complaintId,
      complaintCode: complaint.complaintId,
      complaintTitle: complaint.title,
      studentId: student.id,
      studentName: student.name,
      building: complaint.building,
      rating,
      satisfaction,
      comment,
      submittedAt: now,
    };

    try {
      await setDoc(doc(db, FEEDBACK_COL, feedbackId), record);
      await updateDoc(doc(db, COMPLAINTS_COL, complaintId), {
        satisfactionRating: rating,
        satisfactionComment: comment,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, FEEDBACK_COL);
    }
  }

  // Subscriptions for Departments, Staff, Students, Feedback
  subscribeDepartments(callback: (deps: Department[]) => void): () => void {
    return onSnapshot(
      collection(db, DEPARTMENTS_COL),
      (snapshot) => {
        const deps: Department[] = [];
        snapshot.forEach((d) => deps.push({ ...(d.data() as Department), id: d.id }));
        callback(deps.length > 0 ? deps : INITIAL_DEPARTMENTS);
      },
      (error) => handleFirestoreError(error, OperationType.GET, DEPARTMENTS_COL)
    );
  }

  subscribeStaff(callback: (staff: StaffMember[]) => void): () => void {
    return onSnapshot(
      collection(db, STAFF_COL),
      (snapshot) => {
        const staffList: StaffMember[] = [];
        snapshot.forEach((d) => staffList.push({ ...(d.data() as StaffMember), id: d.id }));
        callback(staffList.length > 0 ? staffList : INITIAL_STAFF);
      },
      (error) => handleFirestoreError(error, OperationType.GET, STAFF_COL)
    );
  }

  subscribeStudents(callback: (students: StudentRecord[]) => void): () => void {
    return onSnapshot(
      collection(db, STUDENTS_COL),
      (snapshot) => {
        const stuList: StudentRecord[] = [];
        snapshot.forEach((d) => stuList.push({ ...(d.data() as StudentRecord), id: d.id }));
        callback(stuList.length > 0 ? stuList : INITIAL_STUDENTS);
      },
      (error) => handleFirestoreError(error, OperationType.GET, STUDENTS_COL)
    );
  }

  subscribeFeedback(callback: (feedback: FeedbackRecord[]) => void): () => void {
    return onSnapshot(
      collection(db, FEEDBACK_COL),
      (snapshot) => {
        const fbList: FeedbackRecord[] = [];
        snapshot.forEach((d) => fbList.push({ ...(d.data() as FeedbackRecord), id: d.id }));
        callback(fbList.length > 0 ? fbList : INITIAL_FEEDBACK);
      },
      (error) => handleFirestoreError(error, OperationType.GET, FEEDBACK_COL)
    );
  }
}

export const campusService = new CampusService();
