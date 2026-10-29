import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Save,
  X,
  Mail,
  User,
  Phone,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Calculator,
} from 'lucide-react';
import { useStudents } from '../context/StudentContext';
import { DEFAULT_SUBJECTS, calculateAverage, isStudentPassed, getGradeLetter } from '../utils/calculations';

export default function AddStudent() {
  const navigate = useNavigate();
  const { addStudent } = useStudents();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    grade: 'Senior 5 DSE',
    marks: {
      Mathematics: '',
      'English Language': '',
      'Computer Science': '',
      'Web Development': '',
      Physics: '',
    },
  });

  const [errors, setErrors] = useState({});
  const [duplicateError, setDuplicateError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute live average and pass status
  const currentAverage = calculateAverage(formData.marks);
  const currentPass = isStudentPassed(currentAverage);
  const gradeInfo = getGradeLetter(currentAverage);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s-]{8,20}$/;

    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      errs.name = 'Full name must be at least 3 characters long';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      errs.phone = 'Please provide a valid phone number (e.g. +250 788 123 456)';
    }

    if (!formData.grade) {
      errs.grade = 'Please select a grade/class';
    }

    // Validate marks (must be between 0 and 100)
    const markErrors = {};
    Object.entries(formData.marks).forEach(([subject, mark]) => {
      if (mark === '' || mark === null || mark === undefined) {
        markErrors[subject] = 'Mark is required';
      } else {
        const num = Number(mark);
        if (isNaN(num) || num < 0 || num > 100) {
          markErrors[subject] = 'Mark must be between 0 and 100';
        }
      }
    });

    if (Object.keys(markErrors).length > 0) {
      errs.marks = markErrors;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleMarkChange = (subject, value) => {
    setFormData((prev) => ({
      ...prev,
      marks: {
        ...prev.marks,
        [subject]: value === '' ? '' : Math.min(100, Math.max(0, Number(value))),
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDuplicateError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      addStudent(formData);
      navigate('/students');
    } catch (err) {
      setDuplicateError(err.message || 'Error saving student record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillSample = () => {
    setFormData({
      name: 'Sandrine Uwamahoro',
      email: `sandrine.${Date.now().toString().slice(-4)}@intango.ac.rw`,
      phone: '+250 788 456 123',
      grade: 'Senior 5 DSE',
      marks: {
        Mathematics: 85,
        'English Language': 78,
        'Computer Science': 92,
        'Web Development': 89,
        Physics: 80,
      },
    });
    setErrors({});
    setDuplicateError('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <span>Add New Student</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enroll a student into Intango TSS records and enter subject performance marks.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillSample}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-fill Sample Student</span>
        </button>
      </div>

      {duplicateError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Duplicate Record Detected</div>
            <div>{duplicateError}</div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Personal & Academic Information Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
            Student Personal &amp; Class Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Marie Claire Uwase"
                  className={`block w-full pl-10 pr-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition ${
                    errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. marie.uwase@intango.ac.rw"
                  className={`block w-full pl-10 pr-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition ${
                    errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+250 788 123 456"
                  className={`block w-full pl-10 pr-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition ${
                    errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
            </div>

            {/* Grade / Class */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Class / Grade <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                >
                  <option value="Senior 4 DSE">Senior 4 DSE (Software Dev)</option>
                  <option value="Senior 5 DSE">Senior 5 DSE (Software Dev)</option>
                  <option value="Senior 6 DSE">Senior 6 DSE (Software Dev)</option>
                  <option value="Grade 10-A">Grade 10-A</option>
                  <option value="Grade 11-B">Grade 11-B</option>
                  <option value="Grade 12-A">Grade 12-A</option>
                </select>
              </div>
              {errors.grade && <p className="mt-1 text-xs text-rose-600">{errors.grade}</p>}
            </div>
          </div>
        </div>

        {/* Subject Marks Section with Live Preview */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Academic Subject Marks (0 - 100)
              </h2>
              <p className="text-xs text-slate-400">
                Enter numerical scores for each module to calculate student performance.
              </p>
            </div>

            {/* Live Calculation Badge */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Calculator className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-600">Calculated Average:</span>
              <span className="text-sm font-extrabold text-blue-700">{currentAverage}%</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  currentPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {currentPass ? 'Pass' : 'Fail'} ({gradeInfo.letter})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEFAULT_SUBJECTS.map((subj) => {
              const markError = errors.marks && errors.marks[subj.name];
              return (
                <div key={subj.name} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-800">
                      {subj.name}
                    </label>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      {subj.code}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.marks[subj.name] ?? ''}
                      onChange={(e) => handleMarkChange(subj.name, e.target.value)}
                      placeholder="0 - 100"
                      className={`block w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white ${
                        markError ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    <span className="absolute right-3 top-2 text-xs font-semibold text-slate-400">
                      /100
                    </span>
                  </div>
                  {markError && (
                    <p className="mt-1 text-[11px] text-rose-600">{markError}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons: Save Student & Cancel */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/students')}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition shadow-xs flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-500/20 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving Student...' : 'Save Student'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
