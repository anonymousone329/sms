import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit2,
  Save,
  X,
  Mail,
  User,
  Phone,
  GraduationCap,
  AlertCircle,
  Calculator,
} from 'lucide-react';
import { useStudents } from '../context/StudentContext';
import { DEFAULT_SUBJECTS, calculateAverage, isStudentPassed, getGradeLetter } from '../utils/calculations';

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudentById, updateStudent } = useStudents();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    grade: '',
    marks: {},
  });

  const [errors, setErrors] = useState({});
  const [duplicateError, setDuplicateError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const student = getStudentById(id);
    if (!student) {
      setNotFound(true);
      return;
    }

    setFormData({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      grade: student.grade || 'Senior 5 DSE',
      marks: student.marks || {
        Mathematics: 0,
        'English Language': 0,
        'Computer Science': 0,
        'Web Development': 0,
        Physics: 0,
      },
    });
  }, [id, getStudentById]);

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
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      errs.phone = 'Please provide a valid phone number';
    }

    if (!formData.grade) {
      errs.grade = 'Please select a grade/class';
    }

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
      updateStudent(id, formData);
      navigate(`/students/${id}`);
    } catch (err) {
      setDuplicateError(err.message || 'Error updating student record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 text-center">
        <h2 className="text-lg font-bold text-slate-800">Student not found</h2>
        <button
          onClick={() => navigate('/students')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-amber-500" />
            <span>Edit Student Record</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Updating details and academic scores for <span className="font-mono font-bold text-slate-700">{id}</span>
          </p>
        </div>
      </div>

      {duplicateError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Update Failed</div>
            <div>{duplicateError}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
            Student Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  className={`block w-full pl-10 pr-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                    errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
            </div>

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
                  className={`block w-full pl-10 pr-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                    errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </div>

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
                  className={`block w-full pl-10 pr-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                    errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
            </div>

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
            </div>
          </div>
        </div>

        {/* Subject Marks Section */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Update Subject Marks
              </h2>
              <p className="text-xs text-slate-400">
                Adjust scores to update the student's average and status
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Calculator className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-600">New Average:</span>
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

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/students/${id}`)}
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
            <span>{isSubmitting ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
