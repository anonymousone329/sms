import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Toast from './Toast';
import { useStudents } from '../context/StudentContext';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast, hideToast } = useStudents();
  const location = useLocation();

  const getPageMeta = () => {
    switch (location.pathname) {
      case '/dashboard':
        return {
          title: 'Welcome, Teacher!',
          subtitle: 'Academic Dashboard & Student Performance Overview',
        };
      case '/add-student':
        return {
          title: 'Add New Student',
          subtitle: 'Enroll a new student and record academic performance',
        };
      case '/students':
        return {
          title: 'Students List',
          subtitle: 'Manage, search, edit and review student academic records',
        };
      case '/reports':
        return {
          title: 'Academic Reports & Analytics',
          subtitle: 'Performance distribution, pass rates and grade statistics',
        };
      default:
        if (location.pathname.startsWith('/students/') && location.pathname.includes('/edit')) {
          return {
            title: 'Edit Student Details',
            subtitle: 'Update student record, contact info and subject marks',
          };
        }
        if (location.pathname.startsWith('/students/')) {
          return {
            title: 'Student Details Profile',
            subtitle: 'Comprehensive student academic report card and details',
          };
        }
        return {
          title: 'Intango Technical Secondary School',
          subtitle: 'Student Management System Web Application',
        };
    }
  };

  const { title, subtitle } = getPageMeta();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={title}
          subtitle={subtitle}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}
