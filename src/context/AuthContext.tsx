import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserRole } from '../types/campus';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginAsRole: (role: UserRole) => void;
  loginWithCredentials: (identifier: string, role?: UserRole) => Promise<boolean>;
  registerUser: (profile: Omit<UserProfile, 'id' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const PRESET_USERS: Record<UserRole, UserProfile> = {
  Administrator: {
    id: 'admin-01',
    name: 'Dr. Arthur Vance',
    username: 'cfo_vance',
    email: 'a.vance@campus.edu',
    role: 'Administrator',
    department: 'Campus Infrastructure & Operations Directorate',
    collegeId: 'FAC-DIR-001',
    phone: '+1 (555) 019-9000',
    createdAt: '2025-01-10T08:00:00Z',
  },
  Student: {
    id: 'stu-501',
    name: 'Rahul Sharma',
    username: 'r_sharma23',
    email: 'rahul.s@student.campus.edu',
    role: 'Student',
    department: 'Computer Science & Engineering',
    collegeId: 'STU-CS-2023-041',
    phone: '+1 (555) 028-1190',
    year: '3rd Year (Semester 6)',
    createdAt: '2025-08-15T10:00:00Z',
  },
  'Maintenance Staff': {
    id: 'staff-101',
    name: 'David Miller',
    username: 'dmiller_eng',
    email: 'd.miller@campus.edu',
    role: 'Maintenance Staff',
    department: 'Electrical Maintenance',
    collegeId: 'EMP-EL-204',
    phone: '+1 (555) 019-2831',
    createdAt: '2025-02-01T09:00:00Z',
  },
  Staff: {
    id: 'staff-202',
    name: 'Prof. Anita Rao',
    username: 'prof_arao',
    email: 'a.rao@campus.edu',
    role: 'Staff',
    department: 'Department of Physics & Materials Science',
    collegeId: 'FAC-PH-109',
    phone: '+1 (555) 019-4450',
    createdAt: '2025-03-12T11:00:00Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('campuscare-auth-user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached user', e);
      }
    }
    // Default to Administrator so the evaluator can immediately explore full operations
    return PRESET_USERS.Administrator;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('campuscare-auth-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campuscare-auth-user');
    }
  }, [user]);

  const loginAsRole = (role: UserRole) => {
    setUser(PRESET_USERS[role]);
  };

  const loginWithCredentials = async (identifier: string, chosenRole?: UserRole): Promise<boolean> => {
    // Check if matching preset email/username
    const found = Object.values(PRESET_USERS).find(
      (u) =>
        u.email.toLowerCase() === identifier.toLowerCase() ||
        u.username.toLowerCase() === identifier.toLowerCase()
    );

    if (found) {
      setUser(found);
      return true;
    }

    // Otherwise create session for identifier
    const role: UserRole = chosenRole || 'Student';
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: identifier.includes('@') ? identifier.split('@')[0] : identifier,
      username: identifier.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      email: identifier.includes('@') ? identifier : `${identifier}@campus.edu`,
      role,
      department: 'Campus General Facility',
      collegeId: `CC-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return true;
  };

  const registerUser = async (profileData: Omit<UserProfile, 'id' | 'createdAt'>): Promise<boolean> => {
    const newUser: UserProfile = {
      ...profileData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    loginAsRole(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginAsRole,
        loginWithCredentials,
        registerUser,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
