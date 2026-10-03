import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { CampusCareLogo } from '../common/CampusCareLogo';
import type { UserRole } from '../../types/campus';
import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  Map as MapIcon,
  Building,
  Users,
  GraduationCap,
  MessageSquare,
  BarChart3,
  Settings,
  Sun,
  Moon,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  UserCheck,
  ShieldCheck,
  Radio
} from 'lucide-react';

export type NavPage =
  | 'dashboard'
  | 'complaints'
  | 'assignments'
  | 'campus-map'
  | 'departments'
  | 'staff'
  | 'students'
  | 'feedback'
  | 'reports'
  | 'settings';

interface AppLayoutProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  children: React.ReactNode;
  unreadCount?: number;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentPage,
  onNavigate,
  children,
  unreadCount = 3,
}) => {
  const { user, logout, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, subtitle: 'Operations Hub' },
    { id: 'complaints', label: 'Complaints', icon: ClipboardList, subtitle: 'Master Registry' },
    { id: 'assignments', label: 'Assignments', icon: Wrench, subtitle: 'Work Orders' },
    { id: 'campus-map', label: 'Campus Map', icon: MapIcon, subtitle: 'Blueprint Matrix' },
    { id: 'departments', label: 'Departments', icon: Building, subtitle: 'Facility Units' },
    { id: 'staff', label: 'Staff', icon: Users, subtitle: 'Technicians' },
    { id: 'students', label: 'Students', icon: GraduationCap, subtitle: 'Campus Directory' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, subtitle: 'Satisfaction Audits' },
    { id: 'reports', label: 'Reports', icon: BarChart3, subtitle: 'Infrastructure Analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, subtitle: 'Preferences & RBAC' },
  ] as const;

  const handleNavClick = (page: NavPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const getPageTitle = (page: NavPage) => {
    switch (page) {
      case 'dashboard':
        return user?.role === 'Student' ? 'STUDENT SERVICES PORTAL' : 'CAMPUS OPERATIONS OVERVIEW';
      case 'complaints':
        return 'CAMPUS COMPLAINTS & ISSUE REGISTRY';
      case 'assignments':
        return 'MAINTENANCE WORK ORDER DISPATCH';
      case 'campus-map':
        return 'CAMPUS ARCHITECTURAL BLUEPRINT MAP';
      case 'departments':
        return 'FACILITY MAINTENANCE DEPARTMENTS';
      case 'staff':
        return 'CAMPUS TECHNICIANS & FIELD ENGINEERS';
      case 'students':
        return 'STUDENT DIRECTORY & INCIDENT LOGS';
      case 'feedback':
        return 'RESOLUTION SATISFACTION AUDIT';
      case 'reports':
        return 'CAMPUS OPERATIONS & INFRASTRUCTURE REPORTS';
      case 'settings':
        return 'SYSTEM PREFERENCES & ROLE PERMISSIONS';
      default:
        return 'CAMPUSCARE PLATFORM';
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f7f8f6] dark:bg-[#101513] text-[#18221c] dark:text-[#f1f5f2] relative">
      {/* Subtle Campus Blueprint Drafting Paper Background */}
      <div className="fixed inset-0 blueprint-bg pointer-events-none z-0 opacity-80" />

      {/* DESKTOP LEFT SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[#dce3dd] dark:border-[#24332b] bg-white dark:bg-[#151d19] z-20 shrink-0 select-none">
        {/* Top Logo */}
        <div className="p-4 border-b border-[#dce3dd] dark:border-[#24332b]">
          <CampusCareLogo size="md" />
        </div>

        {/* Technical Sub-Header */}
        <div className="px-4 py-2 bg-[#f9faf8] dark:bg-[#111714] border-b border-[#dce3dd] dark:border-[#24332b] flex items-center justify-between text-[10px] font-mono text-[#526359] dark:text-[#9cb1a5]">
          <span className="flex items-center gap-1.5">
            <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
            SYS ACTIVE
          </span>
          <span>ESTATE OPS • v2.6</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id as NavPage)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-mono transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-emerald-900 text-white font-bold dark:bg-emerald-800 dark:text-emerald-50 shadow-xs'
                    : 'text-[#526359] dark:text-[#9cb1a5] hover:bg-[#eff2ee] dark:hover:bg-[#1c2722] hover:text-[#18221c] dark:hover:text-[#f1f5f2]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-300' : 'text-[#7d8f85] dark:text-[#64756b]'}`} />
                <div className="flex-1 flex items-center justify-between truncate">
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Panel: Theme Toggle, User Profile & Logout */}
        <div className="p-3 border-t border-[#dce3dd] dark:border-[#24332b] space-y-2 bg-[#f9faf8] dark:bg-[#111714]">
          {/* Theme switch button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[11px] font-mono border border-[#dce3dd] dark:border-[#24332b] bg-white dark:bg-[#161e1a] text-[#526359] dark:text-[#9cb1a5] hover:bg-[#eff2ee] dark:hover:bg-[#1f2a24] cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-emerald-400" /> : <Sun className="w-3.5 h-3.5 text-amber-600" />}
              <span>{theme === 'dark' ? 'DARK MODE' : 'LIGHT MODE'}</span>
            </span>
            <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-[#eff2ee] dark:bg-[#1f2a24]">
              TOGGLE
            </span>
          </button>

          {/* User Profile Badge */}
          <div className="relative">
            <div
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="p-2 rounded border border-[#dce3dd] dark:border-[#24332b] bg-white dark:bg-[#161e1a] flex items-center justify-between cursor-pointer hover:border-emerald-800 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <div className="w-7 h-7 rounded bg-emerald-900 text-white dark:bg-emerald-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold truncate text-[#18221c] dark:text-[#f1f5f2]">
                    {user?.name || 'Authorized User'}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-800 dark:text-emerald-400 truncate">
                    {user?.role || 'Guest'}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#7d8f85] shrink-0 ml-1" />
            </div>

            {/* Quick Role Switcher Dropdown */}
            {roleSwitcherOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1.5 p-2 rounded bg-white dark:bg-[#161e1a] border border-[#dce3dd] dark:border-[#24332b] shadow-xl z-30 space-y-1 font-mono text-xs">
                <div className="text-[10px] font-bold text-[#7d8f85] uppercase px-1.5 py-1">
                  SWITCH PORTAL PERSONA
                </div>
                {(['Administrator', 'Student', 'Maintenance Staff', 'Staff'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      switchRole(r);
                      setRoleSwitcherOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between cursor-pointer ${
                      user?.role === r
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-300 font-bold'
                        : 'hover:bg-[#eff2ee] dark:hover:bg-[#223029]'
                    }`}
                  >
                    <span>{r}</span>
                    {user?.role === r && <UserCheck className="w-3 h-3 text-emerald-600" />}
                  </button>
                ))}
                <div className="pt-1 mt-1 border-t border-[#dce3dd] dark:border-[#24332b]">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setRoleSwitcherOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* TOP NAVIGATION BAR */}
        <header className="h-14 border-b border-[#dce3dd] dark:border-[#24332b] bg-white/95 dark:bg-[#151d19]/95 backdrop-blur-xs px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded text-[#526359] dark:text-[#9cb1a5] hover:bg-[#eff2ee] dark:hover:bg-[#1c2722] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Logo mark */}
            <div className="lg:hidden">
              <CampusCareLogo size="sm" showSubtitle={false} />
            </div>

            {/* Current Page Title */}
            <div className="hidden sm:block">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
                {getPageTitle(currentPage)}
              </div>
              <div className="text-[10px] font-mono text-[#526359] dark:text-[#9cb1a5]">
                CAMPUS SYSTEM COORDINATE: REF-{currentPage.toUpperCase().slice(0, 4)}-2026
              </div>
            </div>
          </div>

          {/* Top Bar Controls */}
          <div className="flex items-center gap-2.5">
            {/* Active Role Indicator Badge */}
            <div
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#eff2ee] dark:bg-[#1c2722] border border-[#dce3dd] dark:border-[#24332b] text-[11px] font-mono cursor-pointer hover:border-emerald-800 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
              <span>ROLE:</span>
              <strong className="text-emerald-900 dark:text-emerald-300 font-bold">{user?.role}</strong>
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded text-[#526359] dark:text-[#9cb1a5] hover:bg-[#eff2ee] dark:hover:bg-[#1c2722] border border-[#dce3dd] dark:border-[#24332b] cursor-pointer"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-600" />}
            </button>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded text-[#526359] dark:text-[#9cb1a5] hover:bg-[#eff2ee] dark:hover:bg-[#1c2722] border border-[#dce3dd] dark:border-[#24332b] cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded bg-white dark:bg-[#161e1a] border border-[#dce3dd] dark:border-[#24332b] shadow-2xl p-3 z-50 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#dce3dd] dark:border-[#24332b]">
                    <span className="font-bold text-[#18221c] dark:text-[#f1f5f2] uppercase text-[11px]">
                      SYSTEM NOTIFICATIONS
                    </span>
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-400">
                      {unreadCount} NEW
                    </span>
                  </div>
                  <div className="py-2 space-y-2">
                    <div className="p-2 rounded bg-[#f7f8f6] dark:bg-[#111714] border border-[#dce3dd] dark:border-[#24332b]">
                      <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                        NEW HIGH PRIORITY TICKET
                      </div>
                      <p className="text-[11px] text-[#18221c] dark:text-[#f1f5f2] font-sans">
                        AP-HSTL-3B offline in Boys Hostel Block B. Dispatched to Marcus Chen.
                      </p>
                      <span className="text-[9px] text-[#7d8f85]">10 mins ago</span>
                    </div>
                    <div className="p-2 rounded bg-[#f7f8f6] dark:bg-[#111714] border border-[#dce3dd] dark:border-[#24332b]">
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                        WORK COMPLETED
                      </div>
                      <p className="text-[11px] text-[#18221c] dark:text-[#f1f5f2] font-sans">
                        Conference Room 102 window glass replacement marked RESOLVED.
                      </p>
                      <span className="text-[9px] text-[#7d8f85]">1 hour ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={logout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono text-[#526359] dark:text-[#9cb1a5] hover:text-red-700 dark:hover:text-red-400 border border-[#dce3dd] dark:border-[#24332b] cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>EXIT</span>
            </button>
          </div>
        </header>

        {/* MOBILE SLIDE-OUT DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex">
            <div className="w-72 bg-white dark:bg-[#161e1a] h-full flex flex-col p-4 border-r border-[#dce3dd] dark:border-[#24332b] animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#dce3dd] dark:border-[#24332b]">
                <CampusCareLogo size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-[#526359] dark:text-[#9cb1a5]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-2">
                <span className="text-[10px] font-mono text-[#7d8f85] uppercase">Active Role:</span>
                <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400">
                  {user?.role} ({user?.name})
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto space-y-1 py-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id as NavPage)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-mono transition-colors text-left ${
                        isActive
                          ? 'bg-emerald-900 text-white font-bold dark:bg-emerald-800'
                          : 'text-[#526359] dark:text-[#9cb1a5] hover:bg-[#eff2ee] dark:hover:bg-[#1c2722]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-[#dce3dd] dark:border-[#24332b] space-y-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-full py-2 text-xs font-mono rounded border border-[#dce3dd] dark:border-[#24332b] flex items-center justify-center gap-2"
                >
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-600" />}
                  <span>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="w-full py-2 text-xs font-mono rounded bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
