# INTANGO TECHNICAL SECONDARY SCHOOL - DSE
## ReactJS Group Practical Assignment: Student Management System (SMS)

**Project Title:** Student Management System Web Application  
**Module:** Front-End Application Development with ReactJS  
**Assignment Type:** Group Practical Project (100 Marks)  
**Academic Year:** 2026  

---

## 1. Project Overview
A modern, responsive, and feature-rich front-end web application developed using **ReactJS** for **Intango Technical Secondary School - Department of Software Development (DSE)**. 

The application streamlines student administration by replacing manual record-keeping with real-time academic performance monitoring, instant search capabilities, dynamic grade calculation, interactive charts, and persistent local storage.

---

## 2. Six Implemented Screens

### 📱 Screen 1: Login & Registration Page (`/login`)
- **Email & Password Fields:** Validated with regex and password length constraints.
- **Simulated Authentication:** Safe credential encoding stored in `localStorage` without plain text passwords.
- **Dual Mode (Sign In / Register):** Allows registering new teachers/administrators or logging into existing accounts.
- **Helpful Error Feedback:** Displays clear validation messages for invalid format, wrong credentials, or duplicates.
- **1-Click Quick Demo Access:** Pre-configured buttons to instantly test with **Teacher** (`teacher@intango.ac.rw` / `teacher123`) or **Admin** (`admin@intango.ac.rw` / `admin123`) credentials.

### 📊 Screen 2: Dashboard (`/dashboard`)
- **Real-Time Calculated Statistics:**
  - Total number of registered students.
  - Number of students who passed (Score ≥ 50%).
  - Number of students who failed (Score < 50%).
  - Cohort average student score.
- **Dynamic Grade Distribution Chart:** Interactive Bar chart rendering student counts across Grades A (80-100%), B (70-79%), C (60-69%), D (50-59%), and F (<50%).
- **Pass vs. Fail Ratio:** Doughnut chart visualizing the overall success rate.
- **Recently Registered Students Table:** Displays the 5 latest enrolled students with quick links to their full academic details.

### 📝 Screen 3: Add Student (`/add-student`)
- **Comprehensive Student Form:**
  - Full Name (required, min 3 chars)
  - Email Address (validated email format)
  - Phone Number (validated phone format)
  - Grade / Class dropdown (e.g. Senior 4 DSE, Senior 5 DSE, Senior 6 DSE)
  - Subject Marks (0 - 100 for Mathematics, English, Computer Science, Web Development, Physics)
- **Live Score Preview:** Automatically computes average score and pass/fail status as marks are typed.
- **Duplicate Prevention:** Prevents saving records with duplicate emails or IDs.
- **Auto-Fill Sample Data:** Quick button for testers to populate realistic values in one click.
- **Save & Cancel Actions:** Redirects back to student list with feedback toast on success.

### 👥 Screen 4: Student List (`/students`)
- **Student Records Table:**
  - Student ID (e.g., `INT-2026-001`)
  - Full Name with avatar initials
  - Email address & phone number
  - Grade / Class badge
  - Performance status badge (Pass / Fail) with grade letter
  - Action buttons: **View Details** (Eye), **Edit** (Pencil), **Delete** (Trash)
- **Real-Time Instant Search:** Filters live across name, email, or student ID.
- **Multi-Level Filters:** Filter by Class/Grade and academic Pass/Fail status.
- **Safe Deletion Confirmation:** Custom modal dialog warning the user before deleting a student.
- **Empty State Display:** User-friendly message and reset action when no students match the query.

### 🎓 Screen 5: Student Details (`/students/:id`)
- **Full Academic Profile:** Displays student name, ID, class, enrollment date, and contact details.
- **Subject Marks Breakdown:** Detailed table with score out of 100, visual progress bar gauges, letter grades, and qualitative remarks.
- **Cumulative Summary:** Total marks earned, overall percentage, and pass/fail standing.
- **Instructor Academic Assessment:** Context-aware academic recommendations based on performance.
- **Actions:** Quick links to **Edit Student Information**, **Back to List**, and **Print Report Card**.

### 📈 Screen 6: Reports & Analytics (`/reports`)
- **Institutional Analytics:**
  - Total enrolled students.
  - Institution-wide average score and cohort standing.
  - Pass rate percentage and fail rate.
  - Top academic performer.
- **Interactive Visualizations (Chart.js):**
  - Doughnut chart for Grade Distribution (A through F).
  - Bar chart comparing average scores across all subjects.
- **Filter by Class / Grade:** Dynamically recalculates all report figures and charts for a specific class cohort.
- **Class-wise Comparative Summary Table:** Side-by-side comparison of Enrolled, Passed, Failed, Pass Rate, and Class Average.
- **Print / Export:** One-click print-ready reporting format.

---

## 3. Technical Requirements Met

| Requirement | Implementation Details |
|---|---|
| **Functional Components** | 100% functional React components with clean JSX |
| **State Management** | `useState`, `useEffect`, `useMemo`, and React Context (`AuthContext`, `StudentContext`) |
| **Routing** | `react-router-dom` v7 with protected routes and navigation guards |
| **Styling** | Modern Tailwind CSS v4 with custom responsive design & typography |
| **Charts** | `chart.js` + `react-chartjs-2` for interactive bar and doughnut charts |
| **Icons** | `lucide-react` for clean UI icons |
| **Data Persistence** | HTML5 `localStorage` with fallback and sample database seed |
| **Form Validation** | Client-side validation with real-time error messages and duplicate checking |
| **Responsive Design** | Fluid layouts optimized for desktop, tablet, and mobile (collapsible sidebar) |

---

## 4. Group Member Responsibilities (Section 5)

As required by the assignment guidelines, the work was distributed across the team:

- **Member 1: Application Architecture, Routing, Login & Dashboard**
  - Configured Vite, React Router, Tailwind CSS, and base project structure.
  - Implemented `AuthContext` with authentication state, session storage, and route guards.
  - Designed Screen 1 (Login & Registration Page) with validation and quick demo login.
  - Developed Screen 2 (Dashboard) with dynamically calculated statistics and charts.

- **Member 2: Student Registration, Student List, Search, Edit & Delete**
  - Developed `StudentContext` for state management and `localStorage` CRUD operations.
  - Implemented Screen 3 (Add Student Form) with duplicate checking and live mark calculations.
  - Built Screen 4 (Student List Table) with instant search, class/status filters, and empty state.
  - Implemented the edit student module (`EditStudent`) and the deletion confirmation modal (`ConfirmModal`).

- **Member 3: Student Details, Reports, Testing & Documentation**
  - Designed Screen 5 (Student Details Profile) with marks breakdown, visual score progress, and print report card view.
  - Built Screen 6 (Reports & Analytics) with class-filtering, grade distribution charts, and comparative tables.
  - Executed the practical testing checklist across desktop and mobile screen viewports.
  - Prepared project documentation, screenshots, and submission artifacts.

---

## 5. Installation & Execution Guide

### Prerequisites
- **Node.js** (v18.0 or higher recommended, tested on Node v24)
- **npm** (v9.0 or higher)

### Setup Steps
1. Open a terminal inside the project directory:
   ```bash
   cd c:\Users\user\Desktop\sms
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

5. Log in using the simulated credentials:
   - **Teacher Account:** `teacher@intango.ac.rw` / `teacher123`
   - **Admin Account:** `admin@intango.ac.rw` / `admin123`
   - *Or click "Teacher Login" / "Admin Login" in the Quick Demo Access box.*

6. Build for production:
   ```bash
   npm run build
   ```

---

## 6. Practical Testing Checklist

| Test Item | Status | Verified Behavior |
|---|:---:|---|
| Application starts without errors | ✅ Passed | Vite dev and production builds compile cleanly in 2.4s |
| All six screens accessible via navigation | ✅ Passed | Login, Dashboard, Add Student, Student List, Details, and Reports all route correctly |
| Invalid form entries produce helpful messages | ✅ Passed | Name, email format, phone format, and marks (0-100) are rigorously validated |
| New students appear in the student list | ✅ Passed | Added students immediately reflect in list, dashboard, and reports |
| Search returns correct records | ✅ Passed | Live case-insensitive search by student name, email, or ID |
| Editing updates the selected student | ✅ Passed | Updating details/marks recalculates student average and updates UI |
| Deleting removes student after confirmation | ✅ Passed | Confirmation modal prevents accidental deletion; record is erased upon confirmation |
| Dashboard figures update when records change | ✅ Passed | Statistics are dynamically computed using `useMemo` from live state |
| Data persists after refreshing browser | ✅ Passed | All changes persist in `localStorage` under `intango_students_records` |
| Interface works on desktop and mobile | ✅ Passed | Fully responsive layout with mobile drawer navigation and responsive data tables |

---

## 7. Known Limitations
- Authentication is simulated locally using client-side `localStorage` as specified in the educational project requirements (no remote server required).
- Password hashing is simulated using base64 encoding rather than bcrypt, adhering to front-end-only constraints.

---

*Intango Technical Secondary School &bull; Front-End Application Development with ReactJS &bull; 2026*
# sms
