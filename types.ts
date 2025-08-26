
export type Theme = 'light' | 'dark';

export enum Mood {
  Happy = 'Happy',
  Sad = 'Sad',
  Anxious = 'Anxious',
  Calm = 'Calm',
  Neutral = 'Neutral',
  Excited = 'Excited',
  Stressed = 'Stressed',
  Grateful = 'Grateful' // Can be used as a mood for Journal
}

export interface MoodEntry { // For Journal feature
  id: string;
  userId: string;
  date: string; // ISO string
  mood: Mood;
  text: string;
  aiReflection?: string; // Optional AI analysis
}

export interface ChatMessage {
  id:string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

// For mock dashboard data
export interface MoodTrendData {
  date: string;
  moodScore: number; // e.g., Happy=5, Neutral=3, Sad=1
}

export interface AcademicData { // Used in Dashboard Snapshot
  metric: string;
  value: number | string;
  trend?: 'up' | 'down' | 'stable';
}

// --- New Types for Academic Performance View ---
export interface SubjectGrade {
  id: string;
  name: string;
  grade: number; // Percentage or score
  term: string; // e.g., "Fall 2023", "Spring 2024"
  credits?: number;
}

export interface OverallPerformance {
  gpa: number;
  totalCredits: number;
  alerts: string[];
}

// --- Updated Types for Assignment Feature ---
export interface Assignment {
  id: string;
  title: string;
  dueDate: string; // ISO string
  instituteName: string; // Added: To scope assignments
  createdBy: string; // User ID of creator (Teacher or SuperAdmin)
  createdAt: string; // Added: ISO string timestamp
}

export interface StudentAssignmentSubmission {
  id: string; // Unique ID for the submission record
  assignmentId: string;
  studentId: string;
  instituteName: string;
  submittedAt: string; // ISO string timestamp of when student marked as submitted
  status: 'On-Time' | 'Late'; // Calculated at time of submission
}

// For displaying assignments to students, including their specific submission status
export interface StudentDisplayableAssignment extends Assignment {
  studentSubmissionStatus: 'Pending' | 'On-Time' | 'Late' | 'Missed';
  studentSubmittedAt?: string; // When the student submitted this specific assignment
}

// For student assignment notifications
export interface AssignmentAlert {
  id: string; // Unique ID for the alert
  assignmentId: string;
  title: string; // Assignment title for quick reference in alert
  message: string;
  type: 'warning' | 'info' | 'success' | 'error'; // For styling alerts
  dueDate?: string; // Optional, for upcoming alerts
}

export enum UserType {
  Student = 'Student',
  Teacher = 'Teacher',
  SuperAdmin = 'SuperAdmin'
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  userType: UserType;
  instituteName: string;
  isActivated?: boolean;
  isPreRegisteredByAdmin?: boolean; // For students by Teacher/SuperAdmin, for Teachers by SuperAdmin
}

export interface CurrentUser extends Omit<User, 'password'> {
}


export interface SubscriptionTier {
  name: string;
  students: string; // e.g., "Up to 200 students"
  price: string; // e.g., "₹25 / student / month", "Contact Us"
  features: string[];
  highlight?: boolean;
}

export interface AddStudentFormData { // Used by Teacher/SuperAdmin
  firstName: string;
  lastName: string;
  email: string;
}

export interface AddTeacherFormData { // Used by SuperAdmin
  firstName: string;
  lastName: string;
  email: string;
}


export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  userType: UserType; // Will be SuperAdmin, Teacher, or Student
  instituteName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AdminInstituteAcademicStats { // Name can be kept, or changed to InstituteAcademicStats
  totalStudents: number;
  assignmentsOnTimePercent: number;
  assignmentsLatePercent: number;
  assignmentsMissedPercent: number;
}

export interface AdminAcademicInsights { // Name can be kept, or changed to InstituteAcademicInsights
  academicPressureAnalysis: string;
  studentRetentionTips: string[];
}

// --- New Types for Admin Dashboard Analytics ---
export interface StudentAttitudeStats {
  positivePercent: number;
  negativePercent: number;
  neutralPercent: number; // Added for completeness
  analyzedStudentCount: number; // Number of students with enough journal data
  totalStudentsInInstitute: number;
}

export interface DropoutRiskAnalysis {
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Unavailable';
  analysisText: string;
  contributingFactors: string[];
  proactiveSuggestions: string[];
}

export interface AdminDashboardData { // Now applies to Teacher and SuperAdmin for their institute
  attitudeStats?: StudentAttitudeStats;
  dropoutRisk?: DropoutRiskAnalysis;
  // other institute-level dashboard data can be added here
}
