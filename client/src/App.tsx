import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// General Pages
import LogoutPage from './pages/Logout';
import LandingPage from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Register';
import ErrorPage from './pages/NotFound';
import TakeExam from './pages/TakeExam';

// Dashboard Layouts
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';

// Student Pages
import StudentOverview from './pages/dashboards/student/Overview';
import AvailableExams from './pages/dashboards/student/AvailableExams';
import CompletedExams from './pages/dashboards/student/CompletedExams';
import StudentProfile from './pages/dashboards/student/Profile';
import StudentSettings from './pages/dashboards/student/Settings';
import StudentHelp from './pages/dashboards/student/Help';
import ExamResult from './pages/ExamResult';
import JoinExam from './pages/dashboards/student/JoinExam';

// Teacher Pages
import TeacherOverview from './pages/dashboards/teacher/TeacherOverview';
import CreateExam from './pages/dashboards/teacher/CreateExam';
import ManageExams from './pages/dashboards/teacher/ManageExams';
import EditExam from './pages/dashboards/teacher/EditExam';
import ExamDetails from './pages/dashboards/teacher/ExamDetails';
import QuestionBank from './pages/dashboards/teacher/QuestionBank';
import ManageStudents from './pages/dashboards/teacher/ManageStudents';
import LiveProctoring from './pages/dashboards/teacher/LiveProctoring';
import ResultsAnalysis from './pages/dashboards/teacher/ResultsAnalysis';
import Profile from './pages/dashboards/teacher/Profile';
import Settings from './pages/dashboards/teacher/Settings';
import TeacherHelp from './pages/dashboards/teacher/Help';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import TeacherPendingApproval from './pages/TeacherPendingApproval';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/register',
    element: <Signup />,
  },
  {
    path: '/logout',
    element: <LogoutPage />,
  },
  {
    path: '/student-dashboard',
    element: <StudentDashboard />,
    children: [
      { path: '', element: <StudentOverview /> },
      { path: 'available-exams', element: <AvailableExams /> },
      { path: 'join-exam', element: <JoinExam /> },
      { path: 'completed-exams', element: <CompletedExams /> },
      { path: 'exam-result/:registrationId', element: <ExamResult /> },
      { path: 'profile', element: <StudentProfile /> },
      { path: 'settings', element: <StudentSettings /> },
      { path: 'help', element: <StudentHelp /> },
    ],
  },
  {
    path: '/teacher-dashboard',
    element: <TeacherDashboard />,
    children: [
      { path: '', element: <TeacherOverview /> },
      { path: 'create-exam', element: <CreateExam /> },
      { path: 'manage-exams', element: <ManageExams /> },
      { path: 'edit-exam/:id', element: <EditExam /> },
      { path: 'exam-details/:id', element: <ExamDetails /> },
      { path: 'question-bank', element: <QuestionBank /> },
      { path: 'manage-students', element: <ManageStudents /> },
      { path: 'live-proctoring', element: <LiveProctoring /> },
      { path: 'results-analysis', element: <ResultsAnalysis /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'help', element: <TeacherHelp /> },
    ],
  },
  {
    path: '/admin-dashboard',
    element: <AdminDashboard />,
  },
  {
    path: '/teacher-pending-approval',
    element: <TeacherPendingApproval />,
  },
  {
    path: '/take-exam/:id',
    element: <TakeExam />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;