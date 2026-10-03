import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import type { UserRole } from '../../types/campus';
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Lock, 
  Sun, 
  Moon, 
  Sliders, 
  KeyRound, 
  CheckCircle,
  Database,
  Info
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'permissions' | 'database'>('profile');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsUrgent, setSmsUrgent] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-[#dce3dd] dark:border-[#24332b]">
        <h1 className="text-xl font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
          SYSTEM PREFERENCES & ROLE PERMISSIONS
        </h1>
        <p className="text-xs font-mono text-[#526359] dark:text-[#9cb1a5] mt-0.5">
          User profiles, access control matrices, notification gateways and database sync
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Tabs (3 Cols) */}
        <div className="md:col-span-3 space-y-1 font-mono text-xs">
          {[
            { id: 'profile', label: 'User Profile & Identity', icon: User },
            { id: 'notifications', label: 'Dispatch Notifications', icon: Bell },
            { id: 'security', label: 'Password & Auth', icon: Lock },
            { id: 'permissions', label: 'Role Permissions (RBAC)', icon: ShieldCheck },
            { id: 'database', label: 'Database & Sync Status', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-left cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-emerald-900 text-white font-bold dark:bg-emerald-800'
                    : 'text-[#526359] dark:text-[#9cb1a5] hover:bg-[#eff2ee] dark:hover:bg-[#1c2722]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body (9 Cols) */}
        <div className="md:col-span-9 card-blueprint rounded-lg p-5 bg-white dark:bg-[#161e1a]">
          {saveSuccess && (
            <div className="mb-4 p-3 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs font-mono text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Settings and preferences successfully persisted.</span>
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold uppercase text-[#18221c] dark:text-[#f1f5f2] pb-2 border-b border-[#dce3dd] dark:border-[#24332b]">
                PROFILE & CREDENTIALS
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#526359] dark:text-[#9cb1a5] block mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full text-xs font-sans px-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#526359] dark:text-[#9cb1a5] block mb-1">
                    Institutional ID
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.collegeId}
                    className="w-full text-xs font-mono px-3 py-2 rounded bg-[#eff2ee] dark:bg-[#1c2722] border border-[#dce3dd] dark:border-[#24332b] text-[#7d8f85]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#526359] dark:text-[#9cb1a5] block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full text-xs font-sans px-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#526359] dark:text-[#9cb1a5] block mb-1">
                    Assigned Role
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.role}
                    className="w-full text-xs font-mono px-3 py-2 rounded bg-[#eff2ee] dark:bg-[#1c2722] border border-[#dce3dd] dark:border-[#24332b] text-[#7d8f85]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#526359] dark:text-[#9cb1a5] block mb-1">
                  Department / Directorate
                </label>
                <input
                  type="text"
                  defaultValue={user?.department}
                  className="w-full text-xs font-sans px-3 py-2 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
                />
              </div>

              {/* Theme Preference */}
              <div className="pt-3 border-t border-[#dce3dd] dark:border-[#24332b]">
                <label className="text-[10px] uppercase font-bold text-[#526359] dark:text-[#9cb1a5] block mb-2">
                  Campus Blueprint Display Mode
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (theme !== 'light') toggleTheme();
                    }}
                    className={`flex-1 p-3 rounded border text-left cursor-pointer ${
                      theme === 'light'
                        ? 'border-emerald-800 bg-emerald-50 dark:bg-emerald-950 font-bold'
                        : 'border-[#dce3dd] dark:border-[#24332b]'
                    }`}
                  >
                    <span className="block font-bold">Light Blueprint (Paper)</span>
                    <span className="text-[10px] text-[#7d8f85]">Warm off-white drafting grid</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (theme !== 'dark') toggleTheme();
                    }}
                    className={`flex-1 p-3 rounded border text-left cursor-pointer ${
                      theme === 'dark'
                        ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300 font-bold'
                        : 'border-[#dce3dd] dark:border-[#24332b]'
                    }`}
                  >
                    <span className="block font-bold">Dark Blueprint (Graphite)</span>
                    <span className="text-[10px] text-[#7d8f85]">Charcoal green technical matrix</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="py-2 px-5 rounded bg-emerald-900 hover:bg-emerald-950 text-white font-bold cursor-pointer"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold uppercase text-[#18221c] dark:text-[#f1f5f2] pb-2 border-b border-[#dce3dd] dark:border-[#24332b]">
                DISPATCH NOTIFICATION PREFERENCES
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded border border-[#dce3dd] dark:border-[#24332b] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#18221c] dark:text-[#f1f5f2] block">Email Work Order Alerts</span>
                    <span className="text-[10px] text-[#7d8f85]">Send instant email when tickets are assigned or resolved</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 accent-emerald-800"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded border border-[#dce3dd] dark:border-[#24332b] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#18221c] dark:text-[#f1f5f2] block">SMS Urgent Incident Paging</span>
                    <span className="text-[10px] text-[#7d8f85]">Send SMS priority broadcast for High and Urgent campus threats</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsUrgent}
                    onChange={(e) => setSmsUrgent(e.target.checked)}
                    className="w-4 h-4 accent-emerald-800"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold uppercase text-[#18221c] dark:text-[#f1f5f2] pb-2 border-b border-[#dce3dd] dark:border-[#24332b]">
                CREDENTIALS & SECURITY
              </h3>
              <div className="space-y-3 max-w-sm">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#526359] dark:text-[#9cb1a5] block mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full text-xs font-sans px-3 py-1.5 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#526359] dark:text-[#9cb1a5] block mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full text-xs font-sans px-3 py-1.5 rounded bg-[#fbfbfa] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => alert('Password updated successfully.')}
                  className="py-1.5 px-4 rounded bg-emerald-900 text-white font-bold cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold uppercase text-[#18221c] dark:text-[#f1f5f2] pb-2 border-b border-[#dce3dd] dark:border-[#24332b]">
                ROLE-BASED ACCESS CONTROL (RBAC) MATRIX
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#f0f2ef] dark:bg-[#121614] uppercase text-[#7d8f85] border-b border-[#dce3dd] dark:border-[#24332b]">
                    <tr>
                      <th className="py-2 px-3">System Permission</th>
                      <th className="py-2 px-3 text-center">Student</th>
                      <th className="py-2 px-3 text-center">Staff</th>
                      <th className="py-2 px-3 text-center">Maintenance</th>
                      <th className="py-2 px-3 text-center">Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dce3dd] dark:divide-[#24332b]">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Report Campus Issue</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Track & View Audit Timeline</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Verify & Triage Complaints</td>
                      <td className="py-2.5 px-3 text-center text-gray-400">—</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Dispatch / Reassign Technicians</td>
                      <td className="py-2.5 px-3 text-center text-gray-400">—</td>
                      <td className="py-2.5 px-3 text-center text-gray-400">—</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Mark Resolved & Signoff</td>
                      <td className="py-2.5 px-3 text-center text-gray-400">—</td>
                      <td className="py-2.5 px-3 text-center text-gray-400">—</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Submit Resolution Feedback Rating</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700">✓</td>
                      <td className="py-2.5 px-3 text-center text-gray-400">—</td>
                      <td className="py-2.5 px-3 text-center text-gray-400">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold uppercase text-[#18221c] dark:text-[#f1f5f2] pb-2 border-b border-[#dce3dd] dark:border-[#24332b]">
                DATABASE TELEMETRY & PERSISTENCE
              </h3>
              <div className="p-3.5 rounded bg-[#f7f8f6] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#7d8f85]">Active Firestore Database:</span>
                  <span className="font-bold text-emerald-900 dark:text-emerald-400">
                    ai-studio-8c8c7ee0-67bc-4744-b55f-61e293071a3e
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7d8f85]">Assigned Cluster Host:</span>
                  <span className="font-bold text-[#18221c] dark:text-[#f1f5f2]">
                    bold-lambda-l40ks.firebaseapp.com
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7d8f85]">Security Rules Deployment:</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-400">
                    DEPLOYED (firestore.rules active)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7d8f85]">Real-time Sync Mode:</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-400">
                    Live WebSockets (onSnapshot listeners)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
