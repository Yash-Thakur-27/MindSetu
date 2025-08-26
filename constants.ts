
import { Mood, UserType, SubscriptionTier } from './types';

export const APP_NAME = "Mindsetu";
export const APP_TAGLINE = "Bridge to Your Mind Wellness";
export const THEME_KEY = 'mindsetu-theme';

export const MOOD_OPTIONS: Mood[] = [
  Mood.Happy,
  Mood.Excited,
  Mood.Grateful,
  Mood.Calm,
  Mood.Neutral,
  Mood.Anxious,
  Mood.Stressed,
  Mood.Sad,
];

// For classifying student attitude from journal entries
export const POSITIVE_MOODS: Mood[] = [Mood.Happy, Mood.Excited, Mood.Grateful, Mood.Calm];
export const NEGATIVE_MOODS: Mood[] = [Mood.Sad, Mood.Anxious, Mood.Stressed];
// Neutral mood (Mood.Neutral) can be handled separately or grouped as needed.


export const MOOD_EMOJI_MAP: Record<Mood, string> = {
  [Mood.Happy]: '😊',
  [Mood.Sad]: '😢',
  [Mood.Anxious]: '😟',
  [Mood.Calm]: '😌',
  [Mood.Neutral]: '😐',
  [Mood.Excited]: '🤩',
  [Mood.Stressed]: '😫',
  [Mood.Grateful]: '🙏',
};

export const GEMINI_CHAT_MODEL = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';

export const EMERGENCY_CONTACTS = [
  { name: "National Suicide Prevention Lifeline", number: "988" },
  { name: "Crisis Text Line", number: "Text HOME to 741741" },
  { name: "University Counseling (Example)", number: "XXX-XXX-XXXX (Update this)" }
];

export const NAV_LINKS_LOGGED_IN = [
  { name: 'Home', path: '/', icon: 'HomeIcon' }, // Stays for all logged-in
  { name: 'Dashboard', path: '/dashboard', icon: 'DashboardIcon' }, // Stays for all
  { name: 'Journal', path: '/journal', icon: 'JournalIcon' }, // Student only
  { name: 'Academics', path: '/academics', icon: 'AcademicCapIcon' }, // All logged in
  { name: 'Assignments', path: '/assignments', icon: 'ClipboardDocumentListIcon' }, // All logged in
  { name: 'Chatbot', path: '/chatbot', icon: 'ChatIcon' }, // All logged in
  { name: 'Subscription', path: '/subscription', icon: 'SubscriptionIcon' }, // Potentially SuperAdmin only or hidden
  // "Add Student" and "Add Teacher" will be on dashboards, not direct nav links.
];

export const NAV_LINKS_LOGGED_OUT = [
  { name: 'Home', path: '/', icon: 'HomeIcon' },
  { name: 'Subscription', path: '/subscription', icon: 'SubscriptionIcon' },
];

export const USER_TYPES: UserType[] = [
  UserType.SuperAdmin,
  UserType.Teacher,
  UserType.Student,
];

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    name: "Starter",
    students: "Up to 200 students",
    price: "₹5,000 / month", // Updated price
    features: [
      "Mood Journaling",
      "Basic AI Chatbot",
      "Assignment Tracking (Student View)",
      "Basic Admin Dashboard",
      "Email Support",
    ],
  },
  {
    name: "Pro",
    students: "Up to 1000 students",
    price: "₹10,000 / month", // Updated price
    features: [
      "All Starter features",
      "Academic Performance Analytics",
      "Advanced AI Chatbot",
      "Teacher Assignment Management",
      "Institute-level Analytics",
      "Priority Email Support",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    students: "Unlimited students",
    price: "₹20,000 / month", // Updated price
    features: [
      "All Pro features",
      "AI Dropout Risk Analysis",
      "Dedicated Account Manager",
      "Custom Integrations & API Access",
      "SLA & Advanced Security Options",
      "Onboarding & Training",
    ],
  }
];
