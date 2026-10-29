// Academic calculation utilities for Intango Technical Secondary School

export const PASS_MARK = 50;

export const DEFAULT_SUBJECTS = [
  { name: 'Mathematics', code: 'MATH' },
  { name: 'English Language', code: 'ENG' },
  { name: 'Computer Science', code: 'CS' },
  { name: 'Web Development', code: 'WEB' },
  { name: 'Physics', code: 'PHY' },
];

/**
 * Get letter grade based on percentage score
 */
export function getGradeLetter(score) {
  const numeric = Number(score) || 0;
  if (numeric >= 80) return { letter: 'A', label: 'Distinction', color: 'emerald' };
  if (numeric >= 70) return { letter: 'B', label: 'Very Good', color: 'blue' };
  if (numeric >= 60) return { letter: 'C', label: 'Credit', color: 'amber' };
  if (numeric >= 50) return { letter: 'D', label: 'Pass', color: 'indigo' };
  return { letter: 'F', label: 'Fail', color: 'rose' };
}

/**
 * Calculate average score from subject marks object or array
 * Example: { Mathematics: 85, English: 72, ... }
 */
export function calculateAverage(marks) {
  if (!marks) return 0;
  const values = Object.values(marks).map(m => Number(m) || 0);
  if (values.length === 0) return 0;
  const total = values.reduce((sum, v) => sum + v, 0);
  return Math.round((total / values.length) * 10) / 10;
}

/**
 * Determine if a student passed based on average score
 */
export function isStudentPassed(averageScore) {
  return Number(averageScore) >= PASS_MARK;
}

/**
 * Compute key statistics for dashboard and reports
 */
export function calculateStatistics(students = []) {
  const totalStudents = students.length;
  if (totalStudents === 0) {
    return {
      totalStudents: 0,
      passedCount: 0,
      failedCount: 0,
      passRate: 0,
      failRate: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
      subjectAverages: {},
    };
  }

  let passedCount = 0;
  let totalScoreSum = 0;
  let highestScore = -Infinity;
  let lowestScore = Infinity;

  const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  const subjectSums = {};
  const subjectCounts = {};

  students.forEach(student => {
    const avg = Number(student.averageScore) || calculateAverage(student.marks);
    totalScoreSum += avg;

    if (avg >= highestScore) highestScore = avg;
    if (avg <= lowestScore) lowestScore = avg;

    if (avg >= PASS_MARK) {
      passedCount++;
    }

    const { letter } = getGradeLetter(avg);
    if (gradeDistribution[letter] !== undefined) {
      gradeDistribution[letter]++;
    }

    // Subject breakdown
    if (student.marks) {
      Object.entries(student.marks).forEach(([subject, mark]) => {
        const val = Number(mark) || 0;
        subjectSums[subject] = (subjectSums[subject] || 0) + val;
        subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
      });
    }
  });

  const failedCount = totalStudents - passedCount;
  const passRate = Math.round((passedCount / totalStudents) * 100);
  const failRate = Math.round((failedCount / totalStudents) * 100);
  const overallAverage = Math.round((totalScoreSum / totalStudents) * 10) / 10;

  const subjectAverages = {};
  Object.keys(subjectSums).forEach(subj => {
    const count = subjectCounts[subj] || 1;
    subjectAverages[subj] = Math.round((subjectSums[subj] / count) * 10) / 10;
  });

  return {
    totalStudents,
    passedCount,
    failedCount,
    passRate,
    failRate,
    averageScore: overallAverage,
    highestScore: highestScore === -Infinity ? 0 : highestScore,
    lowestScore: lowestScore === Infinity ? 0 : lowestScore,
    gradeDistribution,
    subjectAverages,
  };
}
