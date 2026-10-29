import React from 'react';
import { Menu, RotateCcw, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStudents } from '../context/StudentContext';

export default function Navbar({ onToggleSidebar, title, subtitle }) {
  const { user } = useAuth();
  const { resetData } = useStudents();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug">
            {title || 'Student Management System'}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Reset Demo Data Button */}
        <button
          onClick={resetData}
          title="Restore sample students data"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200/80"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset Sample Data</span>
        </button>

        {/* User Info Capsule */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-4 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-tight">
              {user?.name || 'Instructor'}
            </div>
            <div className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 inline" />
              {user?.role || 'Teacher'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
