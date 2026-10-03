import React, { useState } from 'react';
import type { StudentRecord, Complaint } from '../../types/campus';
import { GraduationCap, Search, Mail, Phone, CheckCircle2, Clock } from 'lucide-react';

interface StudentsPageProps {
  students: StudentRecord[];
  complaints: Complaint[];
}

export const StudentsPage: React.FC<StudentsPageProps> = ({
  students,
  complaints,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-[#dce3dd] dark:border-[#24332b] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2]">
            STUDENT DIRECTORY & INCIDENT LOGS
          </h1>
          <p className="text-xs font-mono text-[#526359] dark:text-[#9cb1a5] mt-0.5">
            Registered university students, enrollment records and infrastructure ticket history
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search student ID, name or dept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-sans pl-8 pr-3 py-1.5 rounded bg-white dark:bg-[#161e1a] border border-[#dce3dd] dark:border-[#24332b] text-[#18221c] dark:text-[#f1f5f2]"
          />
          <Search className="w-4 h-4 text-[#7d8f85] absolute left-2.5 top-2" />
        </div>
      </div>

      {/* TABLE */}
      <div className="card-blueprint rounded-lg bg-white dark:bg-[#161e1a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#f0f2ef] dark:bg-[#121614] text-[10px] text-[#526359] dark:text-[#9cb1a5] uppercase border-b border-[#dce3dd] dark:border-[#24332b]">
              <tr>
                <th className="py-2.5 px-4 font-bold">Student Name</th>
                <th className="py-2.5 px-4 font-bold">Student ID</th>
                <th className="py-2.5 px-4 font-bold">Department</th>
                <th className="py-2.5 px-4 font-bold">Academic Year</th>
                <th className="py-2.5 px-4 font-bold">Email</th>
                <th className="py-2.5 px-4 font-bold text-center">Total Complaints</th>
                <th className="py-2.5 px-4 font-bold text-center">Resolved</th>
                <th className="py-2.5 px-4 font-bold">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce3dd] dark:divide-[#24332b]">
              {filteredStudents.map((stu) => {
                // Real-time count of complaints for this student
                const studentComplaints = complaints.filter(
                  (c) => c.userId === stu.id || c.userName.toLowerCase() === stu.name.toLowerCase()
                );
                const realTotal = studentComplaints.length > 0 ? studentComplaints.length : stu.totalComplaints;
                const realResolved = studentComplaints.length > 0 
                  ? studentComplaints.filter((c) => c.status === 'RESOLVED').length
                  : stu.resolvedComplaints;

                return (
                  <tr key={stu.id} className="hover:bg-[#f7f8f6] dark:hover:bg-[#1c2722] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#18221c] dark:text-[#f1f5f2]">
                      {stu.name}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-900 dark:text-emerald-400">
                      {stu.studentId}
                    </td>
                    <td className="py-3 px-4 text-[#526359] dark:text-[#9cb1a5]">
                      {stu.department}
                    </td>
                    <td className="py-3 px-4 text-[#526359] dark:text-[#9cb1a5]">
                      {stu.year}
                    </td>
                    <td className="py-3 px-4 text-[#526359] dark:text-[#9cb1a5] font-sans">
                      {stu.email}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-[#18221c] dark:text-[#f1f5f2]">
                      {realTotal}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-800 dark:text-emerald-400">
                      {realResolved}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                        {stu.accountStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
