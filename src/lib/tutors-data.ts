export type Badge = "New Tutor" | "Rising Tutor" | "Top Tutor" | "Elite Tutor";

export interface Package {
  id: string;
  name: string;
  type: "Quick Session" | "Exam Rescue" | "Monthly Plan" | "Full Semester";
  duration: string;
  sessions: number;
  price: number;
  description: string;
}

export interface Review {
  id: string;
  student: string;
  rating: number;
  text: string;
  date: string;
}

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  year: "2nd Year" | "3rd Year" | "4th Year";
  branch: string;
  bio: string;
  subjects: string[];
  badge: Badge;
  rating: number;
  totalSessions: number;
  startingPrice: number;
  mode: "Online" | "Offline" | "Both";
  timings: string;
  gradeProof: { subject: string; grade: string }[];
  packages: Package[];
  reviews: Review[];
  ratingBreakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
}

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

export const avatarFor = (name: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=1B2B5E,00C6FF&backgroundType=gradientLinear&fontFamily=Inter&fontWeight=600&chars=2`;

const mkPkgs = (base: number): Package[] => [
  { id: "p1", name: "Quick Doubt Clearing", type: "Quick Session", duration: "1 hour", sessions: 1, price: base, description: "Clear urgent doubts in a focused 1-hour session." },
  { id: "p2", name: "Exam Rescue Sprint", type: "Exam Rescue", duration: "2 weeks", sessions: 6, price: Math.round(base * 5.5), description: "Intensive 2-week prep covering the entire syllabus before exams." },
  { id: "p3", name: "Monthly Mastery", type: "Monthly Plan", duration: "1 month", sessions: 12, price: Math.round(base * 10), description: "12 sessions a month — consistent guidance and weekly checkpoints." },
  { id: "p4", name: "Full Semester Plan", type: "Full Semester", duration: "4 months", sessions: 40, price: Math.round(base * 32), description: "End-to-end semester ownership: syllabus, assignments, vivas, finals." },
];

const reviews1: Review[] = [
  { id: "r1", student: "Ananya R.", rating: 5, text: "Aarav broke down DSA recursion so clearly. Went from clueless to confident in 3 sessions.", date: "2 weeks ago" },
  { id: "r2", student: "Karthik M.", rating: 5, text: "Best decision before finals. Crisp explanations, real interview-level questions.", date: "1 month ago" },
  { id: "r3", student: "Priya S.", rating: 4, text: "Patient and knows the syllabus inside out. Highly recommend.", date: "1 month ago" },
];

export const tutors: Tutor[] = [
  {
    id: "aarav-sharma",
    name: "Aarav Sharma",
    avatar: avatarFor("Aarav Sharma"),
    year: "4th Year",
    branch: "CSE",
    bio: "DSA addict and ex-intern at a unicorn. I teach the way I wish I was taught — first principles, then patterns, then speed.",
    subjects: ["DSA", "DBMS", "Operating Systems"],
    badge: "Elite Tutor",
    rating: 4.9,
    totalSessions: 142,
    startingPrice: 299,
    mode: "Both",
    timings: "Weekdays 7–10 PM, Weekends 11 AM – 6 PM",
    gradeProof: [{ subject: "DSA", grade: "O" }, { subject: "DBMS", grade: "A+" }],
    packages: mkPkgs(299),
    reviews: reviews1,
    ratingBreakdown: { 5: 120, 4: 18, 3: 3, 2: 1, 1: 0 },
  },
  {
    id: "diya-patel",
    name: "Diya Patel",
    avatar: avatarFor("Diya Patel"),
    year: "3rd Year",
    branch: "ECE",
    bio: "Signals, circuits and a soft spot for shaky first-years. I make the analog feel digital.",
    subjects: ["Signals & Systems", "Digital Electronics", "Mathematics"],
    badge: "Top Tutor",
    rating: 4.8,
    totalSessions: 96,
    startingPrice: 249,
    mode: "Online",
    timings: "Daily 6–9 PM",
    gradeProof: [{ subject: "Signals", grade: "O" }, { subject: "Maths", grade: "O" }],
    packages: mkPkgs(249),
    reviews: reviews1,
    ratingBreakdown: { 5: 78, 4: 15, 3: 3, 2: 0, 1: 0 },
  },
  {
    id: "rohan-iyer",
    name: "Rohan Iyer",
    avatar: avatarFor("Rohan Iyer"),
    year: "4th Year",
    branch: "CSE",
    bio: "Backend nerd. I teach DBMS and OS like a story — query plans, schedulers, page tables and all.",
    subjects: ["DBMS", "Operating Systems", "Computer Networks"],
    badge: "Top Tutor",
    rating: 4.7,
    totalSessions: 84,
    startingPrice: 279,
    mode: "Both",
    timings: "Weekends only, 10 AM – 8 PM",
    gradeProof: [{ subject: "DBMS", grade: "O" }, { subject: "OS", grade: "A+" }],
    packages: mkPkgs(279),
    reviews: reviews1,
    ratingBreakdown: { 5: 64, 4: 17, 3: 3, 2: 0, 1: 0 },
  },
  {
    id: "meera-nair",
    name: "Meera Nair",
    avatar: avatarFor("Meera Nair"),
    year: "3rd Year",
    branch: "CSE",
    bio: "Physics for engineers + Maths foundations. Cracked GATE-level questions in 2nd year.",
    subjects: ["Physics", "Engineering Mathematics", "Discrete Maths"],
    badge: "Rising Tutor",
    rating: 4.6,
    totalSessions: 41,
    startingPrice: 199,
    mode: "Online",
    timings: "Weekdays 8–10 PM",
    gradeProof: [{ subject: "Physics", grade: "O" }, { subject: "Maths-II", grade: "O" }],
    packages: mkPkgs(199),
    reviews: reviews1,
    ratingBreakdown: { 5: 30, 4: 9, 3: 2, 2: 0, 1: 0 },
  },
  {
    id: "vikram-rao",
    name: "Vikram Rao",
    avatar: avatarFor("Vikram Rao"),
    year: "4th Year",
    branch: "IT",
    bio: "Web dev + DSA. I’ve mentored 30+ juniors into their first internships. Practical > theoretical.",
    subjects: ["DSA", "Web Development", "System Design Basics"],
    badge: "Elite Tutor",
    rating: 4.9,
    totalSessions: 158,
    startingPrice: 349,
    mode: "Both",
    timings: "Weekdays 7–11 PM",
    gradeProof: [{ subject: "DSA", grade: "O" }, { subject: "Web Tech", grade: "O" }],
    packages: mkPkgs(349),
    reviews: reviews1,
    ratingBreakdown: { 5: 135, 4: 20, 3: 3, 2: 0, 1: 0 },
  },
  {
    id: "sneha-kulkarni",
    name: "Sneha Kulkarni",
    avatar: avatarFor("Sneha Kulkarni"),
    year: "2nd Year",
    branch: "CSE",
    bio: "Just cleared 1st year with top rank. I remember every confusion you’re having right now.",
    subjects: ["C Programming", "Mathematics", "Basic Electronics"],
    badge: "Rising Tutor",
    rating: 4.5,
    totalSessions: 22,
    startingPrice: 149,
    mode: "Online",
    timings: "Daily 5–8 PM",
    gradeProof: [{ subject: "C Prog", grade: "O" }, { subject: "Maths-I", grade: "O" }],
    packages: mkPkgs(149),
    reviews: reviews1,
    ratingBreakdown: { 5: 15, 4: 6, 3: 1, 2: 0, 1: 0 },
  },
];

export const allSubjects = Array.from(new Set(tutors.flatMap((t) => t.subjects))).sort();

export const getTutor = (id: string) => tutors.find((t) => t.id === id);
