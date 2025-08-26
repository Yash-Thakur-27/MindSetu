
import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPageView } from './components/LandingPageView';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { DashboardView } from './components/DashboardView';
import { ChatbotView } from './components/ChatbotView';
import { JournalView } from './components/JournalView';
import { AcademicPerformanceView } from './components/AcademicPerformanceView';
import { AssignmentSubmissionView } from './components/AssignmentSubmissionView';
import { SubscriptionPageView } from './components/SubscriptionPageView';
import { AddStudentView } from './components/AddStudentView';
import { AddTeacherView } from './components/AddTeacherView'; // Import new component
import { EmergencySOSButton } from './components/EmergencySOSButton';
import { Theme, UserType, CurrentUser } from './types';
import { THEME_KEY, APP_NAME, APP_TAGLINE } from './constants';
import { clearActiveChat } from './services/geminiService';


const CURRENT_USER_KEY = 'mindsetu-currentUser';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    return storedTheme || 'light';
  });

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('color-scheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('color-scheme', 'light');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);


  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLoginSuccess = (user: CurrentUser) => {
    setCurrentUser(user);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    clearActiveChat();
    navigate('/login');
  };

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    if (path === '/') return `${APP_NAME} - ${APP_TAGLINE}`;
    if (path === '/login') return `Login - ${APP_NAME}`;
    if (path === '/signup') return `Sign Up - ${APP_NAME}`;
    if (path === '/subscription') return `Subscription Plans - ${APP_NAME}`;
    if (path === '/add-student') return `Add Student - ${APP_NAME}`;
    if (path === '/add-teacher') return `Add Teacher - ${APP_NAME}`; // New page title

    if (currentUser) {
      if (path === '/dashboard') return `Dashboard - ${currentUser.firstName}`;
      if (path === '/journal') return `Mood Journal - ${APP_NAME}`;
      if (path === '/academics') return `Academic Performance - ${APP_NAME}`;
      if (path === '/assignments') return `Assignment Submissions - ${APP_NAME}`;
      if (path === '/chatbot') return `AI Chatbot - ${APP_NAME}`;
    }
    return APP_NAME;
  }, [location.pathname, currentUser]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const showPageHeader = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/subscription';
  const mainBgColor = theme === 'dark' ? 'bg-base-100-dark text-base-content-dark' : 'bg-base-100-light text-base-content-light';

  return (
    <div className={`flex flex-col min-h-screen font-sans transition-colors duration-300 ${mainBgColor}`}>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {showPageHeader && currentUser && (
            <h1 className="text-3xl font-bold mb-6 text-brand-primary dark:text-brand-primary-light">
                {pageTitle.includes(" - ") ? pageTitle.split(' - ')[0] : pageTitle}
            </h1>
        )}
        <Routes>
          <Route path="/" element={<LandingPageView onLoginRedirect={() => navigate('/login')} />} />
          <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={currentUser ? <Navigate to="/dashboard" /> : <SignupPage />} />
          <Route path="/subscription" element={<SubscriptionPageView />} />

          {/* Protected Routes: Redirect to /login if not authenticated */}
          <Route path="/dashboard" element={currentUser ? <DashboardView currentUser={currentUser} /> : <Navigate to="/login" />} />
          <Route path="/journal" element={
            currentUser && currentUser.userType === UserType.Student
            ? <JournalView currentUser={currentUser} />
            : <Navigate to={currentUser ? "/dashboard" : "/login"} />
          } />
          <Route path="/academics" element={currentUser ? <AcademicPerformanceView currentUser={currentUser} /> : <Navigate to="/login" />} />
          <Route path="/assignments" element={currentUser ? <AssignmentSubmissionView currentUser={currentUser} /> : <Navigate to="/login" />} />
          <Route path="/chatbot" element={currentUser ? <ChatbotView /> : <Navigate to="/login" />} />

          <Route
            path="/add-student"
            element={
              currentUser && (currentUser.userType === UserType.Teacher || currentUser.userType === UserType.SuperAdmin)
              ? <AddStudentView currentUser={currentUser} />
              : <Navigate to={currentUser ? "/dashboard" : "/login"} />
            }
          />
          <Route
            path="/add-teacher"
            element={
              currentUser && currentUser.userType === UserType.SuperAdmin
              ? <AddTeacherView currentUser={currentUser} />
              : <Navigate to={currentUser ? "/dashboard" : "/login"} />
            }
          />

          <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/"} />} />
        </Routes>
      </main>
      {currentUser && <EmergencySOSButton />}
      <footer className={`text-center p-6 text-sm ${theme === 'dark' ? 'text-brand-accent-dark/80 border-brand-primary-dark/30' : 'text-brand-primary/80 border-brand-primary-light/30'} border-t`}>
        {APP_NAME} - {APP_TAGLINE} &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
