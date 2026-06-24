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

export interface Booking {
  id: string;
  student: string;
  subject: string;
  package: string;
  date: string;
  time: string;
  mode: "Online" | "Offline";
  status: "Upcoming" | "Completed" | "Pending Confirmation" | "Cancelled";
  amount: number;
}

export interface AvailabilitySlot {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  slots: string[];
}

export interface Verification {
  emailVerified: boolean;
  collegeIdVerified: boolean;
  gradesVerified: boolean;
  payoutSetup: boolean;
  backgroundCheck: boolean;
}

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  year: "2nd Year" | "3rd Year" | "4th Year";
  branch: string;
  college: string;
  cgpa: number;
  rollNo: string;
  email: string;
  phone: string;
  city: string;
  languages: string[];
  achievements: string[];
  experience: string;
  responseTime: string;
  bio: string;
  subjects: string[];
  badge: Badge;
  rating: number;
  totalSessions: number;
  totalEarnings: number;
  startingPrice: number;
  mode: "Online" | "Offline" | "Both";
  timings: string;
  gradeProof: { subject: string; grade: string; topics: string[]; description: string }[];
  packages: Package[];
  reviews: Review[];
  ratingBreakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
  availability: AvailabilitySlot[];
  bookings: Booking[];
  verification: Verification;
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

type BaseTutor = Omit<
  Tutor,
  | "college" | "cgpa" | "rollNo" | "email" | "phone" | "city" | "languages"
  | "achievements" | "experience" | "responseTime" | "totalEarnings"
  | "availability" | "bookings" | "verification"
>;

const baseTutors: BaseTutor[] = [
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
    gradeProof: [
      {
        subject: "DSA",
        grade: "O",
        topics: ["Arrays & Strings", "Recursion & Backtracking", "Trees & Graphs", "Dynamic Programming", "Interview Patterns"],
        description: "Crack coding rounds with first-principles problem solving. From LeetCode Easy to Hard, taught the way top product companies expect.",
      },
      {
        subject: "DBMS",
        grade: "A+",
        topics: ["ER Modeling", "SQL & Queries", "Normalization", "Transactions & ACID", "Indexing & Query Optimization"],
        description: "Master relational databases with real-world schemas, write complex SQL, and understand what happens under the hood.",
      },
      {
        subject: "Operating Systems",
        grade: "A",
        topics: ["Processes & Threads", "CPU Scheduling", "Memory Management", "File Systems", "Concurrency"],
        description: "Build a solid OS foundation with visuals and hands-on examples — perfect for interviews and semester exams.",
      },
    ],
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
    gradeProof: [
      { subject: "Signals & Systems", grade: "O", topics: ["Fourier Series & Transform", "Laplace Transform", "Z-Transform", "Sampling & DT Signals", "LTI Systems"], description: "Make signals intuitive with visual explanations, solved problems and exam-focused shortcuts." },
      { subject: "Digital Electronics", grade: "A+", topics: ["Boolean Algebra", "Combinational Circuits", "Sequential Circuits", "Flip-Flops", "FSM Design"], description: "From logic gates to finite state machines — build digital design confidence step by step." },
      { subject: "Mathematics", grade: "O", topics: ["Linear Algebra", "Calculus", "Differential Equations", "Probability", "Transform Techniques"], description: "Engineering maths made concrete with applications in circuits, signals and computing." },
    ],
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
    gradeProof: [
      { subject: "DBMS", grade: "O", topics: ["Relational Algebra", "SQL Mastery", "Normalization", "Transactions", "Database Design"], description: "Learn to model, query and optimize databases like a backend engineer." },
      { subject: "Operating Systems", grade: "A+", topics: ["Process Management", "Memory Management", "Synchronization", "Deadlocks", "File Systems"], description: "Demystify OS internals with diagrams, code snippets and interview questions." },
      { subject: "Computer Networks", grade: "A", topics: ["OSI/TCP-IP", "Routing", "Transport Layer", "DNS/DHCP", "Network Security"], description: "From packets to protocols — build networking intuition for exams and interviews." },
    ],
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

const extras: Record<string, Pick<Tutor,
  "college" | "cgpa" | "rollNo" | "email" | "phone" | "city" | "languages"
  | "achievements" | "experience" | "responseTime"
>> = {
  "aarav-sharma": {
    college: "IIT Bombay", cgpa: 9.4, rollNo: "20CS10042", email: "aarav.sharma@iitb.ac.in",
    phone: "+91 98765 43210", city: "Mumbai",
    languages: ["English", "Hindi", "Marathi"],
    achievements: ["SDE Intern @ Razorpay '24", "ACM-ICPC Regionalist", "GSoC '23 Contributor"],
    experience: "2+ years tutoring juniors", responseTime: "Replies in ~30 min",
  },
  "diya-patel": {
    college: "BITS Pilani", cgpa: 9.1, rollNo: "2021A3PS0123P", email: "diya.patel@pilani.bits-pilani.ac.in",
    phone: "+91 98123 45678", city: "Pilani",
    languages: ["English", "Hindi", "Gujarati"],
    achievements: ["IEEE Best Paper '23", "Texas Instruments Innovation Challenge — Finalist"],
    experience: "1.5 years tutoring", responseTime: "Replies in ~1 hr",
  },
  "rohan-iyer": {
    college: "NIT Trichy", cgpa: 8.9, rollNo: "108120087", email: "rohan.iyer@nitt.edu",
    phone: "+91 99887 12345", city: "Tiruchirappalli",
    languages: ["English", "Tamil", "Hindi"],
    achievements: ["Backend Intern @ Postman '24", "Smart India Hackathon Winner '23"],
    experience: "2 years tutoring", responseTime: "Replies in ~2 hrs",
  },
  "meera-nair": {
    college: "VIT Vellore", cgpa: 9.2, rollNo: "21BCE2034", email: "meera.nair@vitstudent.ac.in",
    phone: "+91 98401 22334", city: "Vellore",
    languages: ["English", "Malayalam", "Hindi"],
    achievements: ["Dean's List 2022, 2023", "GATE Aspirant — Mock AIR 412"],
    experience: "1 year tutoring", responseTime: "Replies in ~45 min",
  },
  "vikram-rao": {
    college: "IIIT Hyderabad", cgpa: 9.5, rollNo: "2021101055", email: "vikram.rao@students.iiit.ac.in",
    phone: "+91 90030 11122", city: "Hyderabad",
    languages: ["English", "Hindi", "Kannada", "Telugu"],
    achievements: ["SDE Intern @ Atlassian '24", "Codeforces Expert (1700+)", "Open-source maintainer (2.1k ★)"],
    experience: "3 years tutoring 30+ juniors", responseTime: "Replies in ~20 min",
  },
  "sneha-kulkarni": {
    college: "COEP Pune", cgpa: 9.0, rollNo: "112315067", email: "sneha.kulkarni@coep.ac.in",
    phone: "+91 89999 76543", city: "Pune",
    languages: ["English", "Marathi", "Hindi"],
    achievements: ["1st-year branch topper", "Hackathon — Best UI award"],
    experience: "6 months tutoring", responseTime: "Replies in ~15 min",
  },
};

const defaultAvailability: AvailabilitySlot[] = [
  { day: "Mon", slots: ["7:00 PM", "8:00 PM", "9:00 PM"] },
  { day: "Tue", slots: ["7:00 PM", "8:00 PM"] },
  { day: "Wed", slots: ["7:00 PM", "9:00 PM"] },
  { day: "Thu", slots: ["8:00 PM", "9:00 PM"] },
  { day: "Fri", slots: ["7:00 PM"] },
  { day: "Sat", slots: ["11:00 AM", "2:00 PM", "5:00 PM"] },
  { day: "Sun", slots: ["11:00 AM", "3:00 PM"] },
];

const defaultBookings = (tutorName: string): Booking[] => [
  { id: "b1", student: "Ananya R.", subject: "DSA", package: "Quick Doubt Clearing", date: "Tomorrow", time: "8:00 PM", mode: "Online", status: "Upcoming", amount: 299 },
  { id: "b2", student: "Karthik M.", subject: "DBMS", package: "Exam Rescue Sprint", date: "In 3 days", time: "7:00 PM", mode: "Online", status: "Upcoming", amount: 1645 },
  { id: "b3", student: "Priya S.", subject: "OS", package: "Quick Doubt Clearing", date: "Next Sat", time: "11:00 AM", mode: "Offline", status: "Pending Confirmation", amount: 299 },
  { id: "b4", student: "Rohit K.", subject: "DSA", package: "Monthly Mastery", date: "Last Sunday", time: "5:00 PM", mode: "Online", status: "Completed", amount: 2990 },
  { id: "b5", student: "Neha G.", subject: "DBMS", package: "Quick Doubt Clearing", date: "2 days ago", time: "8:00 PM", mode: "Online", status: "Completed", amount: 299 },
  { id: "b6", student: "Aman T.", subject: "DSA", package: "Quick Doubt Clearing", date: "Last week", time: "9:00 PM", mode: "Online", status: "Cancelled", amount: 0 },
].map((b) => ({ ...b, student: b.student })) as Booking[];

const defaultVerification = (badge: Badge): Verification => ({
  emailVerified: true,
  collegeIdVerified: true,
  gradesVerified: true,
  payoutSetup: badge !== "New Tutor",
  backgroundCheck: badge === "Top Tutor" || badge === "Elite Tutor",
});

export const tutors: Tutor[] = baseTutors.map((b) => ({
  ...b,
  ...extras[b.id],
  totalEarnings: b.totalSessions * Math.round(b.startingPrice * 1.6),
  availability: defaultAvailability,
  bookings: defaultBookings(b.name),
  verification: defaultVerification(b.badge),
}));

export const allSubjects = Array.from(new Set(tutors.flatMap((t) => t.subjects))).sort();

export const getTutor = (id: string) => tutors.find((t) => t.id === id);
