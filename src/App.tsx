/**
 * CampusCare - Campus Issue & Infrastructure Management
 * Main Application Orchestrator
 */
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { campusService } from './services/campusService';
import type { Complaint, Department, StaffMember, StudentRecord, FeedbackRecord } from './types/campus';
import { AppLayout, NavPage } from './components/layout/AppLayout';
import { AuthPage } from './components/auth/AuthPage';
import { CampusOperationsDashboard } from './components/dashboard/CampusOperationsDashboard';
import { StudentPortal } from './components/portal/StudentPortal';
import { ComplaintsManagementPage } from './components/complaints/ComplaintsManagementPage';
import { AssignmentsPage } from './components/assignments/AssignmentsPage';
import { CampusMapPage } from './components/campus/CampusMapPage';
import { DepartmentsPage } from './components/departments/DepartmentsPage';
import { StaffPage } from './components/staff/StaffPage';
import { StudentsPage } from './components/students/StudentsPage';
import { FeedbackPage } from './components/feedback/FeedbackPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { SettingsPage } from './components/settings/SettingsPage';

const MainAppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');

  // Real-time Firestore state
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackRecord[]>([]);

  // Subscriptions
  useEffect(() => {
    const unsubComplaints = campusService.subscribeComplaints(setComplaints);
    const unsubDepartments = campusService.subscribeDepartments(setDepartments);
    const unsubStaff = campusService.subscribeStaff(setStaffList);
    const unsubStudents = campusService.subscribeStudents(setStudents);
    const unsubFeedback = campusService.subscribeFeedback(setFeedbackList);

    return () => {
      unsubComplaints();
      unsubDepartments();
      unsubStaff();
      unsubStudents();
      unsubFeedback();
    };
  }, []);

  if (!isAuthenticated || !user) {
    return <AuthPage />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        if (user.role === 'Student') {
          return (
            <StudentPortal
              complaints={complaints}
              currentUser={user}
              staffList={staffList}
              departments={departments}
            />
          );
        }
        return (
          <CampusOperationsDashboard
            complaints={complaints}
            currentUser={user}
            staffList={staffList}
            departments={departments}
            onNavigateToComplaints={() => setCurrentPage('complaints')}
          />
        );

      case 'complaints':
        return (
          <ComplaintsManagementPage
            complaints={complaints}
            currentUser={user}
            staffList={staffList}
            departments={departments}
          />
        );

      case 'assignments':
        return (
          <AssignmentsPage
            complaints={complaints}
            staffList={staffList}
            departments={departments}
            currentUser={user}
          />
        );

      case 'campus-map':
        return (
          <CampusMapPage
            complaints={complaints}
            currentUser={user}
            staffList={staffList}
            departments={departments}
          />
        );

      case 'departments':
        return <DepartmentsPage departments={departments} complaints={complaints} />;

      case 'staff':
        return (
          <StaffPage
            staffList={staffList}
            complaints={complaints}
            currentUser={user}
          />
        );

      case 'students':
        return <StudentsPage students={students} complaints={complaints} />;

      case 'feedback':
        return <FeedbackPage feedbackList={feedbackList} />;

      case 'reports':
        return (
          <ReportsPage
            complaints={complaints}
            departments={departments}
            staffList={staffList}
          />
        );

      case 'settings':
        return <SettingsPage />;

      default:
        return (
          <CampusOperationsDashboard
            complaints={complaints}
            currentUser={user}
            staffList={staffList}
            departments={departments}
          />
        );
    }
  };

  return (
    <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderCurrentPage()}
    </AppLayout>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
