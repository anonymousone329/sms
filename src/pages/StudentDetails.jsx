import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  BookOpen,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useStudents } from '../context/StudentContext';
import { getGradeLetter, PASS_MARK } from '../utils/calculations';

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudentById } = useStudents();

  const student = getStudentById(id);

  if (!student) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Student Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The requested student ID <span className="font-mono font-bold">{id}</span> does not exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/students')}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students List</span>
        </button>
      </div>
    );
  }

  const gradeInfo = getGradeLetter(student.averageScore);
  const marksEntries = Object.entries(student.marks || {});
  const totalScore = marksEntries.reduce((sum, [, mark]) => sum + (Number(mark) || 0), 0);
  const maxPossible = marksEntries.length * 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/students"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students List</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report Card</span>
          </button>
          <Link
            to={`/students/${student.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Information</span>
          </Link>
        </div>
      </div>

      {/* Main Student Header Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {student.name}
                </h1>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  {student.id}
                </span>
              </div>
              <p className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 inline" />
                <span>Intango Technical Secondary School &bull; {student.grade}</span>
              </p>
            </div>
          </div>

          {/* Academic Performance Status Badge */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Average Mark
              </div>
              <div className="text-3xl font-black text-slate-900">
                {student.averageScore}%
              </div>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  student.status === 'Pass'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                {student.status === 'Pass' ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                )}
                <span>
                  {student.status.toUpperCase()} &bull; Grade {gradeInfo.letter}
                </span>
              </span>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                {gradeInfo.label} standing
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Administrative Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <Mail className="w-5 h-5 text-blue-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Email</div>
              <div className="text-xs font-medium text-slate-800 truncate" title={student.email}>
                {student.email}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <Phone className="w-5 h-5 text-indigo-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Phone</div>
              <div className="text-xs font-medium text-slate-800 truncate">
                {student.phone || 'Not recorded'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <GraduationCap className="w-5 h-5 text-purple-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Grade / Class</div>
              <div className="text-xs font-medium text-slate-800 truncate">
                {student.grade}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <Calendar className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Enrolled Date</div>
              <div className="text-xs font-medium text-slate-800 truncate">
                {student.enrollmentDate || '2026-01-15'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Marks Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Subject Marks Breakdown</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual subject assessments and performance ratings
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-500 font-medium">Cumulative Marks: </span>
            <span className="font-bold text-slate-900">
              {totalScore} / {maxPossible}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-6">Subject / Module</th>
                <th className="py-3.5 px-6 text-center">Score (Max 100)</th>
                <th className="py-3.5 px-6">Performance Gauge</th>
                <th className="py-3.5 px-6 text-center">Grade</th>
                <th className="py-3.5 px-6 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marksEntries.map(([subject, mark]) => {
                const numMark = Number(mark) || 0;
                const subjGrade = getGradeLetter(numMark);
                const isPassed = numMark >= PASS_MARK;

                return (
                  <tr key={subject} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {subject}
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-900">
                      {numMark}%
                    </td>
                    <td className="py-4 px-6 w-1/3">
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full ${
                            numMark >= 80
                              ? 'bg-emerald-500'
                              : numMark >= 70
                              ? 'bg-blue-500'
                              : numMark >= 60
                              ? 'bg-amber-500'
                              : numMark >= 50
                              ? 'bg-indigo-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, numMark)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-block w-7 h-7 leading-7 text-center font-bold text-xs rounded-lg bg-slate-100 text-slate-700">
                        {subjGrade.letter}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span
                        className={`text-xs font-semibold ${
                          isPassed ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isPassed ? 'Satisfactory' : 'Needs Remedial'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Recommendations & Summary Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Instructor Academic Assessment
          </h3>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            {student.status === 'Pass'
              ? `${student.name} has demonstrated competent understanding across front-end development and software engineering modules with an average score of ${student.averageScore}%. Continue maintaining this dedication.`
              : `${student.name} has scored below the minimum pass mark of ${PASS_MARK}% with an average of ${student.averageScore}%. Recommend targeted tutoring sessions in lower-scoring modules.`}
          </p>
        </div>
      </div>
    </div>
  );
}
