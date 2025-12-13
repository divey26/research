export type Skill = {
  name: string;
  level: number;
  demand: number;
  trend: number;
  focus: string;
};

export type RolePrediction = {
  role: string;
  keySkills: string[];
  velocity: "steady" | "rapid" | "explosive";
  salaryRange: string;
};

export type CareerPath = {
  title: string;
  probability: number;
  steps: string[];
  salary: string;
};

export type Profile = {
  fullName: string;
  email: string;
  title: string;
  location: string;
  yearsExperience: string;
  skills: string;
};

export const defaultProfile: Profile = {
  fullName: "Alex Rivera",
  email: "alex.rivera@example.com",
  title: "Product-minded Software Engineer",
  location: "Remote / SF Bay Area",
  yearsExperience: "5-7 years",
  skills: "TypeScript, React, Next.js, Python, MLOps",
};

export const studentSkills: Skill[] = [
  { name: "TypeScript", level: 78, demand: 92, trend: 9, focus: "Frontend Systems" },
  { name: "React / Next.js", level: 82, demand: 94, trend: 8, focus: "Product Engineering" },
  { name: "Python", level: 74, demand: 88, trend: 7, focus: "Data + AI" },
  { name: "Machine Learning Ops", level: 58, demand: 86, trend: 10, focus: "AI Delivery" },
  { name: "System Design", level: 62, demand: 84, trend: 6, focus: "Architecture" },
  { name: "Cloud (AWS)", level: 70, demand: 83, trend: 5, focus: "Reliability" },
  { name: "Product Sense", level: 66, demand: 79, trend: 4, focus: "Strategy" },
];

export const trendingSkills = [
  { name: "AI Engineering", demand: 96, change: 14 },
  { name: "Edge AI / RAG", demand: 91, change: 12 },
  { name: "TypeScript", demand: 92, change: 7 },
  { name: "Design Systems", demand: 88, change: 6 },
  { name: "MLOps", demand: 86, change: 10 },
];

export const inDemandRoles = [
  { name: "AI Product Engineer", openings: 1280, growth: 18 },
  { name: "Full-stack Staff Engineer", openings: 940, growth: 11 },
  { name: "ML Ops Engineer", openings: 820, growth: 16 },
  { name: "Data Product Manager", openings: 610, growth: 9 },
];

export const marketEvolution = [
  { label: "Q1", ai: 62, web: 54, data: 48 },
  { label: "Q2", ai: 68, web: 57, data: 52 },
  { label: "Q3", ai: 74, web: 60, data: 56 },
  { label: "Q4", ai: 81, web: 64, data: 59 },
];

export const rolePredictions: RolePrediction[] = [
  {
    role: "AI Product Engineer",
    keySkills: ["React / Next.js", "TypeScript", "Machine Learning Ops", "Product Sense"],
    velocity: "explosive",
    salaryRange: "$130k-$165k",
  },
  {
    role: "Full-stack Staff Engineer",
    keySkills: ["React / Next.js", "System Design", "Cloud (AWS)", "TypeScript"],
    velocity: "rapid",
    salaryRange: "$140k-$185k",
  },
  {
    role: "ML Ops Engineer",
    keySkills: ["Machine Learning Ops", "Python", "Cloud (AWS)", "System Design"],
    velocity: "rapid",
    salaryRange: "$125k-$155k",
  },
];

export const careerPaths: CareerPath[] = [
  {
    title: "AI Product Engineer",
    probability: 86,
    steps: ["Ship a GenAI feature using RAG", "Harden MLOps with CI/CD", "Showcase product impact"],
    salary: "$130k-$165k",
  },
  {
    title: "Full-stack Staff Engineer",
    probability: 82,
    steps: ["Own design system performance", "Lead system design doc", "Mentor on cloud reliability"],
    salary: "$140k-$185k",
  },
  {
    title: "ML Ops Engineer",
    probability: 78,
    steps: ["Productionize a model pipeline", "Set up feature store", "Automate drift monitoring"],
    salary: "$125k-$155k",
  },
];

export const formatTimestamp = () =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date());

export const computeGapPriority = (gap: number) => {
  if (gap >= 18) return "Critical";
  if (gap >= 12) return "High";
  if (gap >= 7) return "Medium";
  return "Low";
};

export const badgeColor = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "bg-rose-500/10 text-rose-200 border border-rose-500/40";
    case "High":
      return "bg-amber-500/10 text-amber-200 border border-amber-400/40";
    case "Medium":
      return "bg-emerald-500/10 text-emerald-200 border border-emerald-400/40";
    default:
      return "bg-sky-500/10 text-sky-200 border border-sky-400/40";
  }
};

export const velocityCopy: Record<RolePrediction["velocity"], string> = {
  steady: "steady demand",
  rapid: "rapid growth",
  explosive: "explosive growth",
};

export const getSkillLevel = (skillName: string) =>
  studentSkills.find((skill) => skill.name === skillName)?.level ?? 45;

export const buildSkillGaps = (skills: Skill[]) =>
  skills.map((skill) => {
    const gap = Math.max(0, skill.demand - skill.level);
    return {
      ...skill,
      gap,
      priority: computeGapPriority(gap),
    };
  });

export const buildRecommendations = (skillGaps: ReturnType<typeof buildSkillGaps>) =>
  [...skillGaps]
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 4)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
      action:
        item.name === "Machine Learning Ops"
          ? "Build a monitored RAG pipeline with CI/CD hooks."
          : item.name === "System Design"
            ? "Run a 45-minute design review on a scalable API gateway."
            : item.name === "Product Sense"
              ? "Ship a feature doc that ties metrics to user journeys."
              : "Pair program to close TypeScript edge cases and typing debt.",
    }));

export const buildEnrichedPredictions = (preds: RolePrediction[]) =>
  preds.map((role) => {
    const score =
      role.keySkills.reduce((acc, skill) => acc + getSkillLevel(skill), 0) /
      role.keySkills.length;
    const probability = Math.min(98, Math.round(score * 0.95));
    const gaps = role.keySkills.filter((skill) => getSkillLevel(skill) < 75);
    return {
      ...role,
      probability,
      gaps,
      strengths: role.keySkills.filter((skill) => getSkillLevel(skill) >= 80),
    };
  });

export const getAvgFit = (skillGaps: ReturnType<typeof buildSkillGaps>) =>
  Math.round(skillGaps.reduce((sum, skill) => sum + skill.level, 0) / skillGaps.length);
