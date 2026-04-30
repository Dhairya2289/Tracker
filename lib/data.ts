export const MEALS = [
  {
    id: 1,
    name: "Breakfast",
    hindi: "Subah ka Nashta",
    time: "7-8 AM",
    icon: "sunrise",
    color: "orange",
    kcal: 943,
    pro: 48.7,
    items: ["Oats 100g", "Whole Milk 300ml", "Eggs x3 (150g)", "Peanuts 30g"],
    note: "Cook oats in milk. Scramble/boil eggs. Peanuts on the side"
  },
  {
    id: 2,
    name: "Lunch",
    hindi: "Dopahar ka Khana",
    time: "12:30-1:30 PM",
    icon: "sun",
    color: "amber",
    kcal: 1053,
    pro: 77.1,
    items: ["Soya Granules 100g dry", "Rice 80g raw", "Masoor Dal 150g cooked", "Roti x1 (40g atta)", "Ghee 10g", "Mixed Sabzi 100g"],
    note: "Soak soya 15 min in hot water, drain, cook as sabzi or keema-style"
  },
  {
    id: 3,
    name: "Evening Snack",
    hindi: "Sham ka Nashta",
    time: "4:30-5:30 PM",
    icon: "sunset",
    color: "violet",
    kcal: 842,
    pro: 41.8,
    items: ["Roti x3 (120g atta)", "Paneer 100g", "Peanuts 20g"],
    note: "Paneer bhurji or sabzi with rotis. Peanuts as side chaat"
  },
  {
    id: 4,
    name: "Dinner",
    hindi: "Raat ka Khana",
    time: "8-9 PM",
    icon: "moon",
    color: "cyan",
    kcal: 767,
    pro: 51.8,
    items: ["Eggs x2 (100g)", "Rajma 200g cooked", "Hung Curd 200g", "Ghee 15g", "Mixed Sabzi 150g"],
    note: "Hung curd = strain dahi 2 hrs. Casein-heavy for overnight recovery"
  },
] as const

export const TOTAL_KCAL = MEALS.reduce((s, m) => s + m.kcal, 0)
export const TOTAL_PRO = MEALS.reduce((s, m) => s + m.pro, 0)

export const NEET_BLOCKS = [
  { id: 1, subj: "BIO", tag: "NCERT", icon: "leaf", color: "lime", critical: false, rule: "Memory + Traps. Target: >70% accuracy", tip: "NCERT line by line. Diagrams + labeling. 1 topic. No rushing", mcqT: 15 },
  { id: 2, subj: "BIO MCQs", tag: "PRACTICE", icon: "check", color: "lime", critical: false, rule: "Recall + accuracy", tip: "PYQs + module MCQs. OMR filling. Accuracy > Speed", mcqT: 20 },
  { id: 3, subj: "PHYS CHEM", tag: "FORMULA+NUM", icon: "calculator", color: "amber", critical: false, rule: "Formulas + Numericals", tip: "Formula then numerical immediately. No formula without practice", mcqT: 15 },
  { id: 4, subj: "ORGANIC", tag: "REACTIONS", icon: "flask", color: "orange", critical: false, rule: "Logic + Reactions", tip: "Reaction logic first. Understand WHY then never forget. Named reactions", mcqT: 15 },
  { id: 5, subj: "INORGANIC", tag: "NCERT FACTS", icon: "atom", color: "amber", critical: false, rule: "Memory Heavy. Make MORE cards", tip: "NCERT facts + exceptions. Properties + colors. More cards than any other", mcqT: 10 },
  { id: 6, subj: "PHYSICS", tag: "CRITICAL", icon: "zap", color: "coral", critical: true, rule: "70% Practice. 30% Theory. 20 MCQs minimum", tip: "Concept chunk then 5 MCQs immediately then next chunk. NEVER separate theory from practice", mcqT: 20 },
  { id: 7, subj: "REVISION", tag: "ERROR BOOK", icon: "refresh", color: "violet", critical: false, rule: "MCQs + Mistakes = Mastery", tip: "Wrong questions. Formulas. Bio recall. Revise error book more than notes", mcqT: 0 },
] as const

export const FIT_PHASES = [
  { id: 0, name: "Pre-Start", sub: "Right now - 2 weeks", color: "slate", icon: "book", weight: "~120 kg", steps: 5000, cardio: 0, goal: "5,000 steps daily. Follow 4-meal diet. No gym yet" },
  { id: 1, name: "Activity Build", sub: "Weeks 1-10 (Post-NEET)", color: "orange", icon: "footprints", weight: "120 to 112 kg", steps: 15000, cardio: 0, goal: "Steps 5k to 15k. Strength 5x/week. Diet 3600 kcal" },
  { id: 2, name: "Add Cardio", sub: "Weeks 11-16", color: "amber", icon: "bike", weight: "112 to 105 kg", steps: 15000, cardio: 20, goal: "Maintain 15k steps. Cardio 5 to 20 min. Stationary bike" },
  { id: 3, name: "Fat Loss Lock-in", sub: "Weeks 17+", color: "lime", icon: "flame", weight: "105 to 85 kg", steps: 15000, cardio: 20, goal: "All activity maintained. Cut carbs only on 3-week plateau" },
  { id: 4, name: "Final Cut", sub: "85 to 75 kg", color: "cyan", icon: "target", weight: "85 to 75 kg", steps: 15000, cardio: 20, goal: "~2800-3000 kcal. 180g+ protein. 0.5 kg/week pace" },
  { id: 5, name: "Muscle Build", sub: "After goal weight", color: "violet", icon: "dumbbell", weight: "75-77 kg+", steps: 15000, cardio: 20, goal: "Reverse diet 3200-3600 kcal. Hypertrophy. 2g/kg protein" },
] as const

export const FIT_RULES = [
  ["coral", "Follow this exact plan", "Don't freelance. Phases are ordered for a reason."],
  ["lime", "Track weight weekly", "First thing in morning, after toilet, same day each week"],
  ["cyan", "Weigh weekly, not daily", "Daily fluctuations mess with your head"],
  ["amber", "3+ week plateau before cutting food", "Give body time to adapt"],
  ["orange", "No jogging in Phase 1-3", "Knee load at 100 kg+ is too high"],
  ["slate", "Lift numbers must go up over time", "If they stall, check recovery"],
] as const

export const SYSTEM_RULES = [
  { num: "01", title: "STARTING SYSTEM", body: "Sit. Start ANYTHING. 5 min. Momentum > perfection. Delay = lose.", color: "lime" },
  { num: "02", title: "NO ZERO DAY", body: "Worst day? 20 MCQs + Anki review. Zero days = system collapse.", color: "amber" },
  { num: "03", title: "MCQs + MISTAKES", body: "MCQs + Mistakes = Mastery. Test while learning, not after.", color: "cyan" },
  { num: "04", title: "REVISION SYSTEM", body: "Same day then next day then 3-5 day revisit. No revision = just consuming.", color: "orange" },
  { num: "05", title: "ERROR NOTEBOOK", body: "Log every mistake immediately. Revise this more than your notes.", color: "violet" },
  { num: "06", title: "NO PASSIVE READING", body: "NotebookLM to understand. Gem to analyze. MCQs to apply. Never read without output.", color: "coral" },
  { num: "07", title: "SLEEP = MULTIPLIER", body: "Fixed wake-up non-negotiable. Bad sleep = bad focus = wasted day.", color: "cyan" },
  { num: "08", title: "PHYSICS RULE", body: "Concept chunk then 5 MCQs immediately. 70% practice, 30% theory. Daily touch minimum.", color: "coral" },
  { num: "09", title: "CHEMISTRY RULE", body: "3 different games: Physical=formula+numericals, Organic=logic+reactions, Inorganic=memory+NCERT", color: "amber" },
  { num: "10", title: "BIO RULE", body: "NCERT repeated. PYQs. Diagrams + exact lines. Traps > theory. NCERT is the exam.", color: "lime" },
  { num: "11", title: "TEST SYSTEM", body: "Micro test after chapter. Weekly test. Monthly full test. Analyze MORE than you attempted.", color: "cyan" },
  { num: "12", title: "TRACK OUTPUT", body: "'Did 80 MCQs' > 'studied 8 hours'. Output = truth. Time = lie.", color: "violet" },
] as const

export const NEET_SCHEDULE = [
  { start: [6, 0], end: [9, 0] },
  { start: [9, 15], end: [11, 15] },
  { start: [11, 30], end: [14, 30] },
  { start: [15, 0], end: [17, 0] },
  { start: [17, 15], end: [19, 15] },
  { start: [19, 30], end: [21, 30] },
] as const

export const NEET_SCHEDULE_INFO = [
  { n: 1, dur: "3H", task: "Biology Lecture + Notes", time: "06:00-09:00" },
  { n: 2, dur: "2H", task: "Biology NCERT + PYQs", time: "09:15-11:15" },
  { n: 3, dur: "3H", task: "Chemistry Lecture", time: "11:30-14:30" },
  { n: 4, dur: "2H", task: "Chemistry NCERT + PYQs", time: "15:00-17:00" },
  { n: 5, dur: "2H", task: "English / GAT", time: "17:15-19:15" },
  { n: 6, dur: "2H", task: "Revision (Same Day Topics)", time: "19:30-21:30" },
] as const

// Generate PLAN dates dynamically starting from today
function generatePlanDates() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const basePlan = [
    { day: 1, phase: "PHASE 1", section: "GENETICS", tasks: [{ id: "1a", text: "Genetics Part 1 - 3h lecture", subj: "bio" }, { id: "1b", text: "NCERT + PYQs - Genetics basics", subj: "bio" }, { id: "1c", text: "Chemistry: Solutions (start)", subj: "chem" }, { id: "1d", text: "English: Prepositions / basic grammar", subj: "eng" }, { id: "1e", text: "Revision: Same-day topics", subj: "rev" }] },
    { day: 2, phase: "PHASE 1", section: "GENETICS", tasks: [{ id: "2a", text: "Genetics Part 2", subj: "bio" }, { id: "2b", text: "PYQs - Genetics", subj: "bio" }, { id: "2c", text: "Chemistry: Solutions continue", subj: "chem" }, { id: "2d", text: "English: Idioms + vocab", subj: "eng" }, { id: "2e", text: "Revision: Same-day topics", subj: "rev" }] },
    { day: 3, phase: "PHASE 1", section: "GENETICS", tasks: [{ id: "3a", text: "Genetics Part 3", subj: "bio" }, { id: "3b", text: "Full Genetics PYQs", subj: "bio" }, { id: "3c", text: "Chemistry: Electrochemistry (start)", subj: "chem" }, { id: "3d", text: "English: Sentence rearrangement", subj: "eng" }, { id: "3e", text: "Revision: Same-day topics", subj: "rev" }] },
    { day: 4, phase: "PHASE 1", section: "GENETICS", tasks: [{ id: "4a", text: "Genetics FULL revision - Very Important", subj: "bio" }, { id: "4b", text: "Chemistry: Electrochemistry continue", subj: "chem" }, { id: "4c", text: "English: One word substitution", subj: "eng" }, { id: "4d", text: "Revision: Same-day topics", subj: "rev" }] },
    { day: 5, phase: "PHASE 1", section: "ECOLOGY", tasks: [{ id: "5a", text: "Ecology lecture", subj: "bio" }, { id: "5b", text: "NCERT line by line - VERY IMPORTANT", subj: "bio" }, { id: "5c", text: "Chemistry: Electrochemistry finish", subj: "chem" }, { id: "5d", text: "English: Voice", subj: "eng" }, { id: "5e", text: "Revision: Same-day topics", subj: "rev" }] },
    { day: 6, phase: "PHASE 1", section: "ECOLOGY", tasks: [{ id: "6a", text: "Ecology PYQs + revision", subj: "bio" }, { id: "6b", text: "Chemistry: Chemical Kinetics (start)", subj: "chem" }, { id: "6c", text: "English: Tenses", subj: "eng" }, { id: "6d", text: "Revision: Same-day topics", subj: "rev" }] },
    { day: 7, phase: "PHASE 1", section: "BIOTECH", tasks: [{ id: "7a", text: "Biotech lecture", subj: "bio" }, { id: "7b", text: "NCERT + diagrams", subj: "bio" }, { id: "7c", text: "Chemistry: Chemical Kinetics continue", subj: "chem" }, { id: "7d", text: "English: Synonyms / antonyms", subj: "eng" }, { id: "7e", text: "Revision: Same-day topics", subj: "rev" }] },
    { day: 8, phase: "PHASE 1", section: "BIOTECH", tasks: [{ id: "8a", text: "Biotech PYQs + revision", subj: "bio" }, { id: "8b", text: "Chemistry: Biomolecules (easy scoring)", subj: "chem" }, { id: "8c", text: "GAT: Logical reasoning start", subj: "gat" }, { id: "8d", text: "Revision: Same-day topics", subj: "rev" }] },
    { day: 9, phase: "PHASE 1", section: "HUMAN WELFARE", tasks: [{ id: "9a", text: "Full lecture + NCERT", subj: "bio" }, { id: "9b", text: "PYQs same day", subj: "bio" }, { id: "9c", text: "Chemistry: Biomolecules finish", subj: "chem" }, { id: "9d", text: "GAT: Quant basics (percentage, ratio)", subj: "gat" }, { id: "9e", text: "Revision: Same-day topics", subj: "rev" }] },
    { day: 10, phase: "PHASE 1", section: "ORGANIC BLOCK", tasks: [{ id: "10a", text: "Chemistry: Alcohol Phenol Ether", subj: "chem" }, { id: "10b", text: "English: Revision", subj: "eng" }, { id: "10c", text: "Revision: Same-day topics", subj: "rev" }] },
    { day: 11, phase: "PHASE 1", section: "ORGANIC BLOCK", tasks: [{ id: "11a", text: "Chemistry: Aldehyde Ketone", subj: "chem" }, { id: "11b", text: "GAT: Profit / Loss", subj: "gat" }, { id: "11c", text: "Revision: Same-day topics", subj: "rev" }] },
    { day: 12, phase: "PHASE 1", section: "ORGANIC BLOCK", tasks: [{ id: "12a", text: "Chemistry: Amines", subj: "chem" }, { id: "12b", text: "English mock", subj: "eng" }, { id: "12c", text: "Revision: Same-day topics", subj: "rev" }] },
    { day: 13, phase: "PHASE 1", section: "ORGANIC BLOCK", tasks: [{ id: "13a", text: "Chemistry: Haloalkanes", subj: "chem" }, { id: "13b", text: "GAT: SI / CI", subj: "gat" }, { id: "13c", text: "Revision: Same-day topics", subj: "rev" }] },
    { day: 14, phase: "PHASE 1", section: "INORGANIC", tasks: [{ id: "14a", text: "Chemistry: d&f block (selective)", subj: "chem" }, { id: "14b", text: "Biology: Full revision start", subj: "bio" }, { id: "14c", text: "Revision: Same-day topics", subj: "rev" }] },
    { day: 15, phase: "PHASE 1", section: "INORGANIC", tasks: [{ id: "15a", text: "Chemistry: Coordination (important parts)", subj: "chem" }, { id: "15b", text: "Chemistry: Full revision", subj: "chem" }, { id: "15c", text: "Revision: All covered topics", subj: "rev" }] },
    { day: 16, phase: "PHASE 2", section: "FINAL PUSH", tasks: [{ id: "16a", text: "Biology FULL revision (all chapters)", subj: "bio" }, { id: "16b", text: "PYQs mixed", subj: "bio" }, { id: "16c", text: "Revision: All biology", subj: "rev" }] },
    { day: 17, phase: "PHASE 2", section: "FINAL PUSH", tasks: [{ id: "17a", text: "Chemistry FULL revision", subj: "chem" }, { id: "17b", text: "English mocks (2-3)", subj: "eng" }, { id: "17c", text: "Revision: All chemistry", subj: "rev" }] },
    { day: 18, phase: "PHASE 2", section: "BEFORE EXAM", tasks: [{ id: "18a", text: "Light revision only - no new topics", subj: "rev" }, { id: "18b", text: "NCERT skim", subj: "bio" }, { id: "18c", text: "Rest & mental prep", subj: "rev" }] },
    { day: 19, phase: "PHASE 3", section: "PHYSICS + GAT", tasks: [{ id: "19a", text: "Physics: Current Electricity", subj: "phys" }, { id: "19b", text: "GAT: Weak area review", subj: "gat" }] },
    { day: 20, phase: "PHASE 3", section: "PHYSICS + GAT", tasks: [{ id: "20a", text: "Physics: Optics", subj: "phys" }, { id: "20b", text: "GAT: Practice set", subj: "gat" }] },
    { day: 21, phase: "PHASE 3", section: "PHYSICS + GAT", tasks: [{ id: "21a", text: "Physics: Modern Physics", subj: "phys" }, { id: "21b", text: "GAT: Full mock", subj: "gat" }] },
    { day: 22, phase: "PHASE 3", section: "PHYSICS + GAT", tasks: [{ id: "22a", text: "Physics PYQs", subj: "phys" }, { id: "22b", text: "Weak areas review", subj: "rev" }] },
    { day: 23, phase: "PHASE 3", section: "PHYSICS + GAT", tasks: [{ id: "23a", text: "Physics PYQs continued", subj: "phys" }, { id: "23b", text: "Final weak areas", subj: "rev" }] },
    { day: 24, phase: "PHASE 3", section: "FULL MOCK", tasks: [{ id: "24a", text: "Full mock test", subj: "rev" }, { id: "24b", text: "Analysis & correction session", subj: "rev" }] },
  ]
  
  return basePlan.map((item, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    return { ...item, date: dateStr }
  })
}

export const PLAN = generatePlanDates()

// Exam date is 19 days from start (Day 19 in the plan)
export const EXAM_DATE = (() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  today.setDate(today.getDate() + 18) // Day 19 = index 18
  return today
})()

export const SUBJ_COLOR: Record<string, string> = {
  bio: "lime",
  chem: "cyan",
  eng: "amber",
  gat: "violet",
  rev: "orange",
  phys: "coral"
}

export const SUBJ_LBL: Record<string, string> = {
  bio: "BIO",
  chem: "CHEM",
  eng: "ENG",
  gat: "GAT",
  rev: "REV",
  phys: "PHYS"
}

export const STEP_MS = [2500, 5000, 7500, 10000, 12500, 15000] as const
export const CARDIO_MS = [5, 10, 15, 20] as const
