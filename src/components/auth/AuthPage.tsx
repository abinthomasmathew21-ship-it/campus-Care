import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { CampusCareLogo } from '../common/CampusCareLogo';
import type { UserRole } from '../../types/campus';
import { 
  Building2, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  GraduationCap, 
  ShieldCheck, 
  Wrench, 
  Sun, 
  Moon, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { loginWithCredentials, registerUser, loginAsRole } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isRegistering, setIsRegistering] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Student');

  // Registration Fields
  const [regFullName, setRegFullName] = useState('');
  const [regCollegeId, setRegCollegeId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regDepartment, setRegDepartment] = useState('Computer Science & Engineering');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Student');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please provide your username/email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await loginWithCredentials(identifier.trim(), selectedRole);
    } catch (err) {
      setError('Failed to authenticate with campus directories.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regEmail || !regUsername || !regPassword || !regCollegeId) {
      setError('Please complete all mandatory university registration fields.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await registerUser({
        name: regFullName.trim(),
        username: regUsername.trim(),
        email: regEmail.trim(),
        collegeId: regCollegeId.trim(),
        department: regDepartment,
        phone: regPhone.trim(),
        role: regRole,
      });
    } catch (err) {
      setError('Registration error. Please check system records.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative bg-[#f7f8f6] dark:bg-[#101513] text-[#18221c] dark:text-[#f1f5f2] select-none">
      {/* Subtle Architectural Blueprint Background Grid */}
      <div className="fixed inset-0 blueprint-bg opacity-90 pointer-events-none" />

      {/* Architectural Corner Watermarks & Technical Coordinates */}
      <div className="fixed top-6 left-6 font-mono text-[10px] text-[#7d8f85] dark:text-[#64756b] hidden sm:block pointer-events-none">
        <span>ARCHITECTURAL SPEC: UNV-BLDG-FACILITIES-2026</span><br />
        <span>GRID REF: QUADRANT-A4 • AXIS 12.80N</span>
      </div>

      <div className="fixed top-6 right-6 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded bg-white dark:bg-[#161e1a] border border-[#dce3dd] dark:border-[#24332b] text-[#526359] dark:text-[#9cb1a5] hover:bg-[#eff2ee] dark:hover:bg-[#1c2722] cursor-pointer"
        >
          {theme === 'dark' ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-600" />}
        </button>
      </div>

      {/* Authentication Card */}
      <div className="w-full max-w-md bg-white dark:bg-[#161e1a] rounded-lg border border-[#dce3dd] dark:border-[#24332b] shadow-xl p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Logo & Heading */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <CampusCareLogo size="lg" showSubtitle={false} />
          </div>
          <h1 className="text-base font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
            WELCOME TO CAMPUSCARE
          </h1>
          <p className="text-xs font-mono text-[#526359] dark:text-[#9cb1a5] mt-1">
            Campus Issue & Infrastructure Management
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs font-mono text-red-800 dark:text-red-300">
            {error}
          </div>
        )}

        {/* FORM: Sign In */}
        {!isRegistering ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
                USERNAME OR EMAIL
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. rahul.s@student.campus.edu or cfo_vance"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full text-xs font-sans pl-9 pr-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2] focus:outline-emerald-800"
                />
                <User className="w-4 h-4 text-[#7d8f85] absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono font-bold text-[#18221c] dark:text-[#f1f5f2]">
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to registered institutional email.')}
                  className="text-[11px] font-mono text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs font-sans pl-9 pr-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2] focus:outline-emerald-800"
                />
                <Lock className="w-4 h-4 text-[#7d8f85] absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
                CAMPUS PORTAL ROLE
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full text-xs font-mono px-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
              >
                <option value="Administrator">Administrator (Estate Operations)</option>
                <option value="Student">Student (Student Portal)</option>
                <option value="Maintenance Staff">Maintenance Staff (Technician Workflows)</option>
                <option value="Staff">Faculty / Department Staff</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-xs font-mono font-bold rounded bg-emerald-900 hover:bg-emerald-950 text-white dark:bg-emerald-800 dark:hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            {/* Quick Demo Switcher Panel */}
            <div className="pt-4 border-t border-[#dce3dd] dark:border-[#24332b] mt-4">
              <span className="text-[10px] font-mono text-[#7d8f85] uppercase tracking-wider block mb-2 text-center">
                OR SIGN IN WITH INSTANT DEMO PERSONA:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => loginAsRole('Administrator')}
                  className="p-2 rounded border border-[#dce3dd] dark:border-[#24332b] bg-[#f7f8f6] dark:bg-[#121614] hover:border-emerald-800 text-left cursor-pointer"
                >
                  <span className="font-bold text-[#18221c] dark:text-[#f1f5f2] block">Director</span>
                  <span className="text-[10px] text-[#7d8f85]">Administrator</span>
                </button>
                <button
                  type="button"
                  onClick={() => loginAsRole('Student')}
                  className="p-2 rounded border border-[#dce3dd] dark:border-[#24332b] bg-[#f7f8f6] dark:bg-[#121614] hover:border-emerald-800 text-left cursor-pointer"
                >
                  <span className="font-bold text-[#18221c] dark:text-[#f1f5f2] block">Student</span>
                  <span className="text-[10px] text-[#7d8f85]">Rahul Sharma</span>
                </button>
                <button
                  type="button"
                  onClick={() => loginAsRole('Maintenance Staff')}
                  className="p-2 rounded border border-[#dce3dd] dark:border-[#24332b] bg-[#f7f8f6] dark:bg-[#121614] hover:border-emerald-800 text-left cursor-pointer"
                >
                  <span className="font-bold text-[#18221c] dark:text-[#f1f5f2] block">Electrician</span>
                  <span className="text-[10px] text-[#7d8f85]">Maintenance</span>
                </button>
                <button
                  type="button"
                  onClick={() => loginAsRole('Staff')}
                  className="p-2 rounded border border-[#dce3dd] dark:border-[#24332b] bg-[#f7f8f6] dark:bg-[#121614] hover:border-emerald-800 text-left cursor-pointer"
                >
                  <span className="font-bold text-[#18221c] dark:text-[#f1f5f2] block">Faculty</span>
                  <span className="text-[10px] text-[#7d8f85]">Prof. Anita Rao</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-3 text-xs font-mono text-[#526359] dark:text-[#9cb1a5]">
              <span>New to CampusCare? </span>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setIsRegistering(true);
                }}
                className="text-emerald-800 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </div>
          </form>
        ) : (
          /* FORM: Registration */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Patel"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full text-xs font-sans px-2.5 py-1.5 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
                  COLLEGE / ID NUMBER *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. STU-EE-2024-088"
                  value={regCollegeId}
                  onChange={(e) => setRegCollegeId(e.target.value)}
                  className="w-full text-xs font-sans px-2.5 py-1.5 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@student.campus.edu"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full text-xs font-sans px-2.5 py-1.5 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
                  USERNAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="username"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full text-xs font-sans px-2.5 py-1.5 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
                  DEPARTMENT
                </label>
                <select
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                  className="w-full text-xs font-mono px-2 py-1.5 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
                >
                  <option value="Computer Science & Engineering">Computer Science & Eng.</option>
                  <option value="Electrical & Electronics">Electrical & Electronics</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Physics & Applied Sciences">Physics & Applied Sciences</option>
                  <option value="Campus Estate & Directorate">Campus Estate Directorate</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
                  ACCOUNT ROLE *
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full text-xs font-mono px-2 py-1.5 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
                >
                  <option value="Student">Student</option>
                  <option value="Staff">Faculty / Staff</option>
                  <option value="Maintenance Staff">Maintenance Staff</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
                PHONE NUMBER
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="w-full text-xs font-sans px-2.5 py-1.5 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
                  PASSWORD *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full text-xs font-sans px-2.5 py-1.5 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono font-bold text-[#18221c] dark:text-[#f1f5f2] block mb-1">
                  CONFIRM PASSWORD *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full text-xs font-sans px-2.5 py-1.5 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-xs font-mono font-bold rounded bg-emerald-900 hover:bg-emerald-950 text-white dark:bg-emerald-800 dark:hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>

            <div className="text-center pt-2 text-xs font-mono text-[#526359] dark:text-[#9cb1a5]">
              <span>Already registered? </span>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setIsRegistering(false);
                }}
                className="text-emerald-800 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>

      {/* University Compliance Sub-footer */}
      <div className="mt-6 text-center text-[10px] font-mono text-[#7d8f85] dark:text-[#64756b] z-10 space-y-1">
        <p>CampusCare Institutional Facilities System • Architecture Blueprint Edition</p>
        <p>All activity logged according to Campus Safety & IT Infrastructure Policy</p>
      </div>
    </div>
  );
};
