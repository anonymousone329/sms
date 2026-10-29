// Local storage management and seed data for Intango Technical Secondary School

const STORAGE_KEYS = {
  STUDENTS: 'intango_students_records',
  AUTH_USER: 'intango_auth_user',
  REGISTERED_USERS: 'intango_registered_accounts',
};

export const INITIAL_STUDENTS = [
  {
    id: 'INT-2026-001',
    name: 'Aline Mutangana',
    email: 'aline.mutangana@intango.ac.rw',
    phone: '+250 788 123 456',
    grade: 'Senior 5 DSE',
    enrollmentDate: '2026-01-15',
    marks: {
      Mathematics: 88,
      'English Language': 82,
      'Computer Science': 94,
      'Web Development': 91,
      Physics: 79,
    },
    averageScore: 86.8,
    status: 'Pass',
  },
  {
    id: 'INT-2026-002',
    name: 'Jean Claude Habimana',
    email: 'jc.habimana@intango.ac.rw',
    phone: '+250 788 234 567',
    grade: 'Senior 5 DSE',
    enrollmentDate: '2026-01-18',
    marks: {
      Mathematics: 74,
      'English Language': 68,
      'Computer Science': 85,
      'Web Development': 88,
      Physics: 70,
    },
    averageScore: 77.0,
    status: 'Pass',
  },
  {
    id: 'INT-2026-003',
    name: 'Diane Uwase',
    email: 'diane.uwase@intango.ac.rw',
    phone: '+250 788 345 678',
    grade: 'Senior 4 DSE',
    enrollmentDate: '2026-02-01',
    marks: {
      Mathematics: 92,
      'English Language': 89,
      'Computer Science': 96,
      'Web Development': 95,
      Physics: 87,
    },
    averageScore: 91.8,
    status: 'Pass',
  },
  {
    id: 'INT-2026-004',
    name: 'Patrick Ndayisaba',
    email: 'patrick.ndayisaba@intango.ac.rw',
    phone: '+250 788 456 789',
    grade: 'Senior 4 DSE',
    enrollmentDate: '2026-02-05',
    marks: {
      Mathematics: 42,
      'English Language': 48,
      'Computer Science': 52,
      'Web Development': 45,
      Physics: 40,
    },
    averageScore: 45.4,
    status: 'Fail',
  },
  {
    id: 'INT-2026-005',
    name: 'Grace Mukamana',
    email: 'grace.mukamana@intango.ac.rw',
    phone: '+250 788 567 890',
    grade: 'Senior 6 DSE',
    enrollmentDate: '2026-02-10',
    marks: {
      Mathematics: 65,
      'English Language': 71,
      'Computer Science': 78,
      'Web Development': 75,
      Physics: 64,
    },
    averageScore: 70.6,
    status: 'Pass',
  },
  {
    id: 'INT-2026-006',
    name: 'Eric Kwizera',
    email: 'eric.kwizera@intango.ac.rw',
    phone: '+250 788 678 901',
    grade: 'Senior 6 DSE',
    enrollmentDate: '2026-02-14',
    marks: {
      Mathematics: 45,
      'English Language': 50,
      'Computer Science': 46,
      'Web Development': 54,
      Physics: 42,
    },
    averageScore: 47.4,
    status: 'Fail',
  },
  {
    id: 'INT-2026-007',
    name: 'Sonia Umutoni',
    email: 'sonia.umutoni@intango.ac.rw',
    phone: '+250 788 789 012',
    grade: 'Senior 5 DSE',
    enrollmentDate: '2026-02-20',
    marks: {
      Mathematics: 81,
      'English Language': 79,
      'Computer Science': 83,
      'Web Development': 85,
      Physics: 76,
    },
    averageScore: 80.8,
    status: 'Pass',
  },
  {
    id: 'INT-2026-008',
    name: 'Cedric Mugisha',
    email: 'cedric.mugisha@intango.ac.rw',
    phone: '+250 788 890 123',
    grade: 'Senior 4 DSE',
    enrollmentDate: '2026-02-25',
    marks: {
      Mathematics: 61,
      'English Language': 58,
      'Computer Science': 67,
      'Web Development': 64,
      Physics: 59,
    },
    averageScore: 61.8,
    status: 'Pass',
  },
];

export const INITIAL_DEMO_USERS = [
  {
    id: 'usr-1',
    name: 'Mr. Emmanuel Mugabo',
    email: 'teacher@intango.ac.rw',
    role: 'Lead DSE Instructor',
    passwordHash: 'dGVhY2hlcjEyMw==', // teacher123
  },
  {
    id: 'usr-2',
    name: 'Academic Administrator',
    email: 'admin@intango.ac.rw',
    role: 'Administrator',
    passwordHash: 'YWRtaW4xMjM=', // admin123
  },
];

/**
 * Load students from localStorage or initialize with seed data
 */
export function getStoredStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STUDENTS;
  } catch (err) {
    console.error('Failed reading students from localStorage:', err);
    return INITIAL_STUDENTS;
  }
}

/**
 * Save students array to localStorage
 */
export function saveStoredStudents(students) {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (err) {
    console.error('Failed saving students to localStorage:', err);
  }
}

/**
 * Reset students back to default seed data
 */
export function resetStoredStudents() {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  } catch (err) {
    console.error('Failed resetting students:', err);
    return INITIAL_STUDENTS;
  }
}

/**
 * Load current authenticated user from localStorage
 */
export function getStoredAuthUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Save current authenticated user
 */
export function saveStoredAuthUser(user) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  } catch (err) {
    console.error('Failed saving auth user:', err);
  }
}

/**
 * Load registered accounts
 */
export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_USERS;
  }
}

/**
 * Save registered accounts
 */
export function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed saving users:', err);
  }
}

/**
 * Helper to generate an ID like INT-2026-009
 */
export function generateStudentId(students = []) {
  const year = new Date().getFullYear();
  const maxNumber = students.reduce((max, s) => {
    const match = s.id && s.id.match(/INT-\d{4}-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      return num > max ? num : max;
    }
    return max;
  }, 0);
  const nextNum = String(maxNumber + 1).padStart(3, '0');
  return `INT-${year}-${nextNum}`;
}
