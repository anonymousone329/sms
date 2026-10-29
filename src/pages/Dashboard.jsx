import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckCircle,
  XCircle,
  Award,
  ArrowRight,
  UserPlus,
  TrendingUp,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useStudents } from '../context/StudentContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { getGradeLetter } from '../utils/calculations';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const { students, statistics } = useStudents();
  const { user } = useAuth();

  // Recent 5 students
  const recentStudents = students.slice(0, 5);

  // Grade Distribution Bar Chart Data
  const gradeDistributionData = {
    labels: ['Grade A (80-100)', 'Grade B (70-79)', 'Grade C (60-69)', 'Grade D (50-59)', 'Grade F (<50)'],
    datasets: [
      {
        label: 'Number of Students',
        data: [
          statistics.gradeDistribution.A || 0,
          statistics.gradeDistribution.B || 0,
          statistics.gradeDistribution.C || 0,
          statistics.gradeDistribution.D || 0,
          statistics.gradeDistribution.F || 0,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)', // emerald
          'rgba(59, 130, 246, 0.85)',  // blue
          'rgba(245, 158, 11, 0.85)',  // amber
          'rgba(99, 102, 241, 0.85)',  // indigo
          'rgba(244, 63, 94, 0.85)',   // rose
        ],
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#64748b',
          font: { family: 'inherit', size: 12 },
        },
        grid: { color: '#f1f5f9' },
      },
      x: {
        ticks: {
          color: '#64748b',
          font: { family: 'inherit', size: 11 },
        },
        grid: { display: false },
      },
    },
  };

  // Pass vs Fail Doughnut Chart Data
  const passFailData = {
    labels: ['Passed', 'Failed'],
    datasets: [
      {
        data: [statistics.passedCount, statistics.failedCount],
        backgroundColor: ['rgba(16, 185, 129, 0.9)', 'rgba(244, 63, 94, 0.9)'],
        hoverBackgroundColor: ['#10b981', '#f43f5e'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 16,
          color: '#475569',
          font: { family: 'inherit', size: 12, weight: 500 },
        },
      },
    },
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-blue-200 mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Intango TSS Academic Year 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Teacher'}! 👋
            </h1>
            <p className="mt-1 text-sm text-blue-100 max-w-2xl leading-relaxed">
              Real-time student academic performance overview, dynamic grade distribution, and institutional statistics for Software Development (DSE).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/add-student"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-semibold text-sm transition shadow-md shadow-black/10"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Student</span>
            </Link>
            <Link
              to="/reports"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/60 hover:bg-blue-600 border border-white/20 text-white font-semibold text-sm transition"
            >
              <span>View Reports</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />
      </div>

      {/* 4 Stat Cards: Dynamically calculated */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={statistics.totalStudents}
          subtitle="Enrolled active learners"
          icon={Users}
          color="blue"
          badgeText="Active"
        />
        <StatCard
          title="Passed Students"
          value={statistics.passedCount}
          subtitle={`${statistics.passRate}% overall success rate`}
          icon={CheckCircle}
          color="emerald"
          badgeText="Score ≥ 50%"
        />
        <StatCard
          title="Failed Students"
          value={statistics.failedCount}
          subtitle={`${statistics.failRate}% need academic support`}
          icon={XCircle}
          color="rose"
          badgeText="Score < 50%"
        />
        <StatCard
          title="Average Student Score"
          value={`${statistics.averageScore}%`}
          subtitle="Cohort mean performance"
          icon={Award}
          color="purple"
          badgeText={getGradeLetter(statistics.averageScore).label}
        />
      </div>

      {/* Charts Section: Grade Distribution & Pass/Fail Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade Distribution Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Grade Distribution
              </h2>
              <p className="text-xs text-slate-500">
                Calculated live from individual student marks (A to F)
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              Live Data
            </span>
          </div>

          <div className="h-64 w-full relative">
            <Bar data={gradeDistributionData} options={barChartOptions} />
          </div>
        </div>

        {/* Pass vs Fail Ratio Doughnut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pass / Fail Ratio
              </h2>
              <p className="text-xs text-slate-500">
                Academic pass rate threshold (50%)
              </p>
            </div>
          </div>

          <div className="h-56 w-full relative mt-2">
            {statistics.totalStudents > 0 ? (
              <Doughnut data={passFailData} options={doughnutOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No students enrolled yet
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 text-center">
            <div>
              <div className="text-xs text-slate-500">Pass Rate</div>
              <div className="text-lg font-bold text-emerald-600">
                {statistics.passRate}%
              </div>
            </div>
            <div className="border-l border-slate-100">
              <div className="text-xs text-slate-500">Fail Rate</div>
              <div className="text-lg font-bold text-rose-600">
                {statistics.failRate}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Registered Students */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Recently Registered Students
            </h2>
            <p className="text-xs text-slate-500">
              Latest enrolments in the school database
            </p>
          </div>
          <Link
            to="/students"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
          >
            <span>View All ({students.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentStudents.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No registered students found. Click "Add Student" to enroll one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3 px-6">Student ID</th>
                  <th className="py-3 px-6">Full Name</th>
                  <th className="py-3 px-6">Class / Grade</th>
                  <th className="py-3 px-6">Average Score</th>
                  <th className="py-3 px-6">Academic Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentStudents.map((student) => {
                  const gradeInfo = getGradeLetter(student.averageScore);
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/60 transition duration-150"
                    >
                      <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-600">
                        {student.id}
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-900">
                        {student.name}
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-xs">
                        {student.grade}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-800">
                        {student.averageScore}%
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            student.status === 'Pass'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              student.status === 'Pass' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {student.status} ({gradeInfo.letter})
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/students/${student.id}`}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View Details &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
