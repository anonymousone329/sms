import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  getStoredStudents,
  saveStoredStudents,
  resetStoredStudents,
  generateStudentId,
} from '../utils/storage';
import {
  calculateAverage,
  isStudentPassed,
  calculateStatistics,
} from '../utils/calculations';

const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' | 'info' }

  // Load students on mount
  useEffect(() => {
    const loaded = getStoredStudents();
    setStudents(loaded);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  /**
   * Add a new student
   */
  const addStudent = (studentData) => {
    const trimmedEmail = studentData.email.trim().toLowerCase();

    // Check for duplicate email
    const emailExists = students.some(
      (s) => s.email.toLowerCase() === trimmedEmail
    );
    if (emailExists) {
      throw new Error(`A student with email "${studentData.email}" already exists.`);
    }

    const marks = studentData.marks || {};
    const averageScore = calculateAverage(marks);
    const status = isStudentPassed(averageScore) ? 'Pass' : 'Fail';
    const id = studentData.id || generateStudentId(students);
    const enrollmentDate = studentData.enrollmentDate || new Date().toISOString().split('T')[0];

    const newStudent = {
      ...studentData,
      id,
      name: studentData.name.trim(),
      email: trimmedEmail,
      phone: studentData.phone ? studentData.phone.trim() : '',
      grade: studentData.grade,
      enrollmentDate,
      marks,
      averageScore,
      status,
    };

    const updated = [newStudent, ...students];
    setStudents(updated);
    saveStoredStudents(updated);
    showToast(`Student "${newStudent.name}" (${newStudent.id}) added successfully!`, 'success');
    return newStudent;
  };

  /**
   * Update an existing student
   */
  const updateStudent = (id, studentData) => {
    const trimmedEmail = studentData.email.trim().toLowerCase();

    // Check for duplicate email with OTHER students
    const emailExists = students.some(
      (s) => s.id !== id && s.email.toLowerCase() === trimmedEmail
    );
    if (emailExists) {
      throw new Error(`Another student already uses email "${studentData.email}".`);
    }

    const marks = studentData.marks || {};
    const averageScore = calculateAverage(marks);
    const status = isStudentPassed(averageScore) ? 'Pass' : 'Fail';

    const updated = students.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          ...studentData,
          id, // ensure ID doesn't change
          name: studentData.name.trim(),
          email: trimmedEmail,
          phone: studentData.phone ? studentData.phone.trim() : '',
          grade: studentData.grade,
          marks,
          averageScore,
          status,
        };
      }
      return s;
    });

    setStudents(updated);
    saveStoredStudents(updated);
    showToast(`Student "${studentData.name}" updated successfully!`, 'success');
  };

  /**
   * Delete a student by ID
   */
  const deleteStudent = (id) => {
    const studentToDelete = students.find((s) => s.id === id);
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    saveStoredStudents(updated);
    showToast(
      studentToDelete
        ? `Student "${studentToDelete.name}" was removed.`
        : 'Student record removed.',
      'info'
    );
  };

  /**
   * Get student by ID
   */
  const getStudentById = (id) => {
    return students.find((s) => s.id === id) || null;
  };

  /**
   * Reset data to default initial seed
   */
  const resetData = () => {
    const defaults = resetStoredStudents();
    setStudents(defaults);
    showToast('Student database reset to default demo records.', 'info');
  };

  /**
   * Calculate statistics dynamically from student data
   */
  const statistics = useMemo(() => {
    return calculateStatistics(students);
  }, [students]);

  const value = {
    students,
    statistics,
    toast,
    showToast,
    hideToast,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    resetData,
  };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudents() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
}
