import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Filter,
  PieChart as PieIcon,
  Award,
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  Download,
  Printer,
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
import { calculateStatistics, getGradeLetter } from '../utils/calculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Reports() {
  const { students } = useStudents();
  const [selectedClass, setSelectedClass] = useState('All');

  // Extract distinct classes
  const classesList = useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.grade))).filter(Boolean);
    return ['All', ...list];
  }, [students]);

  // Filter students based on chosen class
  const filteredStudents = useMemo(() => {
    if (selectedClass === 'All') return students;
    return students.filter((s) => s.grade === selectedClass);
  }, [students, selectedClass]);

  // Dynamically compute report statistics based on filtered students
  const stats = useMemo(() => {
    return calculateStatistics(filteredStudents);
  }, [filteredStudents]);

  // Find top performer in filtered subset
  const topStudent = useMemo(() => {
    if (filteredStudents.length === 0) return null;
    return [...filteredStudents].sort((a, b) => b.averageScore - a.averageScore)[0];
  }, [filteredStudents]);

  // Class-by-class comparison summary
  const classBreakdown = useMemo(() => {
    const groups = {};
    students.forEach((s) => {
      const cls = s.grade || 'Unknown';
      if (!groups[cls]) {
        groups[cls] = [];
      }
      groups[cls].push(s);
    });

    return Object.entries(groups).map(([className, classStudents]) => {
      const classStats = calculateStatistics(classStudents);
      const topInClass = [...classStudents].sort((a, b) => b.averageScore - a.averageScore)[0];
      return {
        className,
        total: classStats.totalStudents,
        passed: classStats.passedCount,
        failed: classStats.failedCount,
        average: classStats.averageScore,
        passRate: classStats.passRate,
        topStudent: topInClass ? `${topInClass.name} (${topInClass.averageScore}%)` : '—',
      };
    });
  }, [students]);

  // Grade Distribution Chart (Doughnut)
  const gradeChartData = {
    labels: ['Grade A (80-100%)', 'Grade B (70-79%)', 'Grade C (60-69%)', 'Grade D (50-59%)', 'Grade F (<50%)'],
    datasets: [
      {
        data: [
          stats.gradeDistribution.A || 0,
          stats.gradeDistribution.B || 0,
          stats.gradeDistribution.C || 0,
          stats.gradeDistribution.D || 0,
          stats.gradeDistribution.F || 0,
        ],
        backgroundColor: [
          '#10b981', // emerald
          '#3b82f6', // blue
          '#f59e0b', // amber
          '#6366f1', // indigo
          '#f43f5e', // rose
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Subject Averages Bar Chart
  const subjectLabels = Object.keys(stats.subjectAverages || {});
  const subjectScores = Object.values(stats.subjectAverages || {});

  const subjectChartData = {
    labels: subjectLabels,
    datasets: [
      {
        label: 'Subject Average (%)',
        data: subjectScores,
        backgroundColor: 'rgba(59, 130, 246, 0.85)',
        hoverBackgroundColor: '#2563eb',
        borderRadius: 8,
      },
    ],
  };

  const subjectChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20, color: '#64748b' },
        grid: { color: '#f1f5f9' },
      },
      x: {
        ticks: { color: '#64748b', font: { size: 11 } },
        grid: { display: false },
      },
    },
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Filters */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Academic Performance Reports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional metrics, grade distributions, and pass/fail analytics for Intango TSS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Class Filter Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Filter className="w-4 h-4 text-slate-500" />
            <label className="text-xs font-semibold text-slate-600">Filter by Class:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs font-bold text-blue-700 bg-transparent border-none focus:outline-hidden cursor-pointer"
            >
              {classesList.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Classes (Institution-wide)' : c}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Registered</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">
            {stats.totalStudents}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {selectedClass === 'All' ? 'Across all cohorts' : `In ${selectedClass}`}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Overall Average</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">
            {stats.averageScore}%
          </div>
          <p className="text-[11px] text-indigo-600 font-medium mt-1">
            Grade {getGradeLetter(stats.averageScore).letter} Standing
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pass Rate</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-3">
            {stats.passRate}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {stats.passedCount} of {stats.totalStudents} passed (≥50%)
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Top Performer</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 mt-3 truncate">
            {topStudent ? topStudent.name : '—'}
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">
            {topStudent ? `${topStudent.averageScore}% Average Score` : 'No records'}
          </p>
        </div>
      </div>

      {/* Visual Charts: Grade Distribution & Subject Averages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution Doughnut */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Grade Distribution Breakdown
              </h2>
              <p className="text-xs text-slate-500">
                Visual proportion of students achieving grades A through F
              </p>
            </div>
            <PieIcon className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-64 w-full relative">
            {stats.totalStudents > 0 ? (
              <Doughnut
                data={gradeChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 12,
                        padding: 12,
                        font: { size: 11, family: 'inherit' },
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No students in this class selection
              </div>
            )}
          </div>
        </div>

        {/* Subject Performance Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Average Score by Subject
              </h2>
              <p className="text-xs text-slate-500">
                Comparing mean scores across all 5 curriculum modules
              </p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-64 w-full relative">
            {subjectLabels.length > 0 ? (
              <Bar data={subjectChartData} options={subjectChartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No subject data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Class-wise Comparative Analysis Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Class-wise Performance Comparison
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional overview broken down by class cohort
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <th className="py-3 px-6">Class / Grade</th>
                <th className="py-3 px-6 text-center">Enrolled</th>
                <th className="py-3 px-6 text-center">Passed</th>
                <th className="py-3 px-6 text-center">Failed</th>
                <th className="py-3 px-6 text-center">Pass Rate</th>
                <th className="py-3 px-6 text-center">Class Average</th>
                <th className="py-3 px-6">Top Student in Cohort</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classBreakdown.map((row) => (
                <tr key={row.className} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    {row.className}
                  </td>
                  <td className="py-4 px-6 text-center text-slate-700">
                    {row.total}
                  </td>
                  <td className="py-4 px-6 text-center text-emerald-600 font-bold">
                    {row.passed}
                  </td>
                  <td className="py-4 px-6 text-center text-rose-600 font-bold">
                    {row.failed}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                      {row.passRate}%
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-extrabold text-blue-700">
                    {row.average}%
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                    {row.topStudent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
