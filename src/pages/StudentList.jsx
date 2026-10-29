import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  Filter,
  Users,
  AlertCircle,
  X,
  GraduationCap,
} from 'lucide-react';
import { useStudents } from '../context/StudentContext';
import ConfirmModal from '../components/ConfirmModal';
import { getGradeLetter } from '../utils/calculations';

export default function StudentList() {
  const navigate = useNavigate();
  const { students, deleteStudent } = useStudents();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Deletion modal state
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Filter students based on search and dropdown filters
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchGrade =
        gradeFilter === 'All' || student.grade === gradeFilter;

      const matchStatus =
        statusFilter === 'All' || student.status === statusFilter;

      return matchSearch && matchGrade && matchStatus;
    });
  }, [students, searchTerm, gradeFilter, statusFilter]);

  // Extract unique classes for filter dropdown
  const uniqueGrades = useMemo(() => {
    const set = new Set(students.map((s) => s.grade));
    return ['All', ...Array.from(set)];
  }, [students]);

  const handleDeleteConfirm = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Controls Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Students Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Displaying {filteredStudents.length} of {students.length} registered students in Intango TSS.
          </p>
        </div>

        <Link
          to="/add-student"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Student</span>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name, email, or student ID..."
            className="block w-full pl-10 pr-10 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50/50 focus:bg-white transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter by Grade */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="block w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              {uniqueGrades.map((g) => (
                <option key={g} value={g}>
                  {g === 'All' ? 'All Classes' : g}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Pass/Fail */}
          <div className="relative w-full md:w-36">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="All">All Status</option>
              <option value="Pass">Passed Only</option>
              <option value="Fail">Failed Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          /* Empty State as required by Screen 4 */
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No students found
            </h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
              {searchTerm || gradeFilter !== 'All' || statusFilter !== 'All'
                ? 'No student matches your selected search criteria or filter options. Try adjusting your query.'
                : 'There are currently no students registered in the database.'}
            </p>
            {(searchTerm || gradeFilter !== 'All' || statusFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setGradeFilter('All');
                  setStatusFilter('All');
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/90 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-3.5 px-6">Student ID</th>
                  <th className="py-3.5 px-6">Full Name</th>
                  <th className="py-3.5 px-6">Email Address</th>
                  <th className="py-3.5 px-6">Phone Number</th>
                  <th className="py-3.5 px-6">Grade / Class</th>
                  <th className="py-3.5 px-6">Performance</th>
                  <th className="py-3.5 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const gradeInfo = getGradeLetter(student.averageScore);
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition duration-150 group"
                    >
                      <td className="py-4 px-6 font-mono text-xs font-bold text-slate-700 whitespace-nowrap">
                        {student.id}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition">
                            {student.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-xs whitespace-nowrap">
                        {student.email}
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-xs font-mono whitespace-nowrap">
                        {student.phone || '—'}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                          {student.grade}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            {student.averageScore}%
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              student.status === 'Pass'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {student.status} ({gradeInfo.letter})
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* View details */}
                          <Link
                            to={`/students/${student.id}`}
                            title="View Student Details (Screen 5)"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {/* Edit student */}
                          <Link
                            to={`/students/${student.id}/edit`}
                            title="Edit Student Information"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          {/* Delete student */}
                          <button
                            type="button"
                            onClick={() => setStudentToDelete(student)}
                            title="Delete Student (with confirmation)"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Student Deletion */}
      <ConfirmModal
        isOpen={!!studentToDelete}
        title="Confirm Student Removal"
        message="Are you sure you want to delete this student record from Intango TSS database? All associated marks and performance metrics will be permanently erased."
        studentName={studentToDelete?.name}
        studentId={studentToDelete?.id}
        confirmText="Yes, Delete Record"
        cancelText="Keep Record"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setStudentToDelete(null)}
      />
    </div>
  );
}
