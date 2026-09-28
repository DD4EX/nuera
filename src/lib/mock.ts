export const courses = [
  { id: "ai-foundations", title: "AI Foundations", category: "Artificial Intelligence", level: "Beginner", lessons: 12, hours: 8, progress: 65, instructor: "Dr. Meera Rao", desc: "Understand how modern AI systems learn, reason and make predictions." },
  { id: "data-science", title: "Practical Data Science", category: "Data", level: "Intermediate", lessons: 16, hours: 12, progress: 30, instructor: "Arjun Nair", desc: "Clean, analyse and visualise real-world datasets with confidence." },
  { id: "neural-networks", title: "Neural Networks Deep Dive", category: "Artificial Intelligence", level: "Advanced", lessons: 20, hours: 15, progress: 0, instructor: "Dr. Meera Rao", desc: "Build intuition for layers, activations, backprop and training." },
  { id: "python", title: "Python for Beginners", category: "Programming", level: "Beginner", lessons: 10, hours: 6, progress: 100, instructor: "Kavya S.", desc: "Write your first programs and build a strong coding foundation." },
  { id: "ml-ops", title: "Machine Learning in Production", category: "Engineering", level: "Advanced", lessons: 14, hours: 10, progress: 0, instructor: "Rahul Iyer", desc: "Deploy, monitor and maintain models that serve real users." },
  { id: "prompting", title: "Prompt Engineering", category: "Artificial Intelligence", level: "Beginner", lessons: 8, hours: 4, progress: 0, instructor: "Kavya S.", desc: "Get reliable, high-quality results from large language models." },
];

export const lessons = [
  { id: "l1", title: "What is Artificial Intelligence?", duration: "12 min", done: true },
  { id: "l2", title: "A Brief History of AI", duration: "15 min", done: true },
  { id: "l3", title: "How Machines Learn", duration: "18 min", done: true },
  { id: "l4", title: "Supervised vs Unsupervised Learning", duration: "20 min", done: false },
  { id: "l5", title: "Evaluating Models", duration: "16 min", done: false },
  { id: "l6", title: "Ethics & Responsible AI", duration: "14 min", done: false },
];

export const questions = [
  { q: "Which type of learning uses labelled data?", options: ["Unsupervised", "Supervised", "Reinforcement", "Transfer"], answer: 1 },
  { q: "What does a model's accuracy measure?", options: ["Training speed", "Share of correct predictions", "Dataset size", "Number of layers"], answer: 1 },
  { q: "Which is an example of AI in daily life?", options: ["A calculator", "A light switch", "Email spam filtering", "A printed map"], answer: 2 },
  { q: "Overfitting means the model…", options: ["Learns training data too closely", "Is too simple", "Has no data", "Runs too fast"], answer: 0 },
];

export const results = [
  { test: "AI Foundations — Module 1", date: "12 Sep 2026", score: 90, passed: true },
  { test: "Python for Beginners — Final", date: "02 Sep 2026", score: 84, passed: true },
  { test: "Data Science — Module 1", date: "20 Aug 2026", score: 58, passed: false },
];

export const certificates = [
  { id: "NEU-2026-0142", course: "Python for Beginners", date: "02 Sep 2026" },
  { id: "NEU-2026-0098", course: "Intro to Statistics", date: "14 Jul 2026" },
];

export const students = [
  { name: "Divya D", email: "divya@example.com", courses: 3, avg: 86, joined: "Jun 2026" },
  { name: "Rohan Mehta", email: "rohan@example.com", courses: 2, avg: 74, joined: "Jul 2026" },
  { name: "Ananya Gupta", email: "ananya@example.com", courses: 5, avg: 91, joined: "Mar 2026" },
  { name: "Vikram Singh", email: "vikram@example.com", courses: 1, avg: 62, joined: "Aug 2026" },
  { name: "Sneha Pillai", email: "sneha@example.com", courses: 4, avg: 88, joined: "May 2026" },
];
