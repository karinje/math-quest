// ============================================================
// MATH QUEST RPG — Problem Bank
// ~330 curated problems + algorithmic generators
// ============================================================

// Problem shape:
// {
//   id: "A1-01",
//   topic: "A" | "B" | "C",
//   subtopic: "A1" ... "C10",
//   difficulty: 1 | 2 | 3,          // 1=easy, 2=medium, 3=hard
//   type: "numeric" | "mc" | "fill", // answer type
//   question: "What is 1/2 as a decimal?",
//   display: null | { type: "fraction", num, den } | { type: "division", dividend, divisor } | { type: "multiply", a, b },
//   answer: "0.5",                   // string, trimmed for comparison
//   answerAlt: ["0.50", ".5"],       // acceptable alternates
//   choices: null | ["0.5","0.25","0.75","1.5"],  // for mc type
//   hint: "Divide the top number by the bottom number.",
//   explanation: { ... },            // see explainFraction() etc. below
//   mnemonic: null | "string",
//   commonMistake: "Don't forget the decimal point in the answer.",
// }

// ============================================================
// TOPIC A: FRACTIONS → DECIMALS
// ============================================================

const TOPIC_A = [

  // ── A1: Terminating — denominators 2, 4, 5, 8, 10 ──────
  { id:"A1-01", topic:"A", subtopic:"A1", difficulty:1, type:"numeric",
    question:"What is 1/2 as a decimal?", display:{type:"fraction",num:1,den:2},
    answer:"0.5", answerAlt:[".5","0.50"],
    hint:"Divide 1 ÷ 2. Think: half of 1 dollar = 50 cents = $0.50",
    mnemonic:null, commonMistake:"Write 0.5, not 5 or .50 (both fine too)" },

  { id:"A1-02", topic:"A", subtopic:"A1", difficulty:1, type:"numeric",
    question:"What is 1/4 as a decimal?", display:{type:"fraction",num:1,den:4},
    answer:"0.25", answerAlt:[".25","0.250"],
    hint:"Divide 1 ÷ 4. 4 goes into 1.00 → 0.25",
    mnemonic:null, commonMistake:"Not 0.4 — the denominator is 4, not 10" },

  { id:"A1-03", topic:"A", subtopic:"A1", difficulty:1, type:"numeric",
    question:"What is 3/4 as a decimal?", display:{type:"fraction",num:3,den:4},
    answer:"0.75", answerAlt:[".75","0.750"],
    hint:"3 × (1/4) = 3 × 0.25 = 0.75",
    mnemonic:null, commonMistake:"Not 0.3 — multiply 3 by 0.25" },

  { id:"A1-04", topic:"A", subtopic:"A1", difficulty:1, type:"numeric",
    question:"What is 1/5 as a decimal?", display:{type:"fraction",num:1,den:5},
    answer:"0.2", answerAlt:[".2","0.20"],
    hint:"Divide 1 ÷ 5. 5 × 2 = 10, so 1/5 = 2/10 = 0.2",
    mnemonic:null, commonMistake:"Not 0.5 — that's 1/2" },

  { id:"A1-05", topic:"A", subtopic:"A1", difficulty:1, type:"numeric",
    question:"What is 2/5 as a decimal?", display:{type:"fraction",num:2,den:5},
    answer:"0.4", answerAlt:[".4","0.40"],
    hint:"2 × 0.2 = 0.4",
    mnemonic:null, commonMistake:null },

  { id:"A1-06", topic:"A", subtopic:"A1", difficulty:1, type:"numeric",
    question:"What is 3/5 as a decimal?", display:{type:"fraction",num:3,den:5},
    answer:"0.6", answerAlt:[".6","0.60"],
    hint:"3 × 0.2 = 0.6",
    mnemonic:null, commonMistake:null },

  { id:"A1-07", topic:"A", subtopic:"A1", difficulty:1, type:"numeric",
    question:"What is 4/5 as a decimal?", display:{type:"fraction",num:4,den:5},
    answer:"0.8", answerAlt:[".8","0.80"],
    hint:"4 × 0.2 = 0.8",
    mnemonic:null, commonMistake:null },

  { id:"A1-08", topic:"A", subtopic:"A1", difficulty:1, type:"numeric",
    question:"What is 1/10 as a decimal?", display:{type:"fraction",num:1,den:10},
    answer:"0.1", answerAlt:[".1","0.10"],
    hint:"Tenths place! 1 tenth = 0.1",
    mnemonic:null, commonMistake:null },

  { id:"A1-09", topic:"A", subtopic:"A1", difficulty:1, type:"numeric",
    question:"What is 7/10 as a decimal?", display:{type:"fraction",num:7,den:10},
    answer:"0.7", answerAlt:[".7","0.70"],
    hint:"7 tenths = 0.7",
    mnemonic:null, commonMistake:null },

  { id:"A1-10", topic:"A", subtopic:"A1", difficulty:2, type:"numeric",
    question:"What is 1/8 as a decimal?", display:{type:"fraction",num:1,den:8},
    answer:"0.125", answerAlt:[".125"],
    hint:"Divide 1 ÷ 8. 8 × 1 = 8, bring down 20 → 8×2=16, bring down 40 → 8×5=40. Answer: 0.125",
    mnemonic:null, commonMistake:"Not 0.8 — 1/8 is much smaller than 1" },

  { id:"A1-11", topic:"A", subtopic:"A1", difficulty:2, type:"numeric",
    question:"What is 3/8 as a decimal?", display:{type:"fraction",num:3,den:8},
    answer:"0.375", answerAlt:[".375"],
    hint:"3 × 0.125 = 0.375",
    mnemonic:null, commonMistake:null },

  { id:"A1-12", topic:"A", subtopic:"A1", difficulty:2, type:"numeric",
    question:"What is 5/8 as a decimal?", display:{type:"fraction",num:5,den:8},
    answer:"0.625", answerAlt:[".625"],
    hint:"5 × 0.125 = 0.625",
    mnemonic:null, commonMistake:null },

  { id:"A1-13", topic:"A", subtopic:"A1", difficulty:2, type:"numeric",
    question:"What is 7/8 as a decimal?", display:{type:"fraction",num:7,den:8},
    answer:"0.875", answerAlt:[".875"],
    hint:"7 × 0.125 = 0.875",
    mnemonic:null, commonMistake:null },

  // ── A2: Terminating hundredths ────────────────────────────
  { id:"A2-01", topic:"A", subtopic:"A2", difficulty:2, type:"numeric",
    question:"What is 1/20 as a decimal?", display:{type:"fraction",num:1,den:20},
    answer:"0.05", answerAlt:[".05","0.050"],
    hint:"1/20 = 5/100 = 0.05",
    mnemonic:null, commonMistake:"Not 0.5 — that's 1/2. 1/20 is ten times smaller." },

  { id:"A2-02", topic:"A", subtopic:"A2", difficulty:2, type:"numeric",
    question:"What is 3/20 as a decimal?", display:{type:"fraction",num:3,den:20},
    answer:"0.15", answerAlt:[".15","0.150"],
    hint:"3/20 = 15/100 = 0.15",
    mnemonic:null, commonMistake:null },

  { id:"A2-03", topic:"A", subtopic:"A2", difficulty:2, type:"numeric",
    question:"What is 1/25 as a decimal?", display:{type:"fraction",num:1,den:25},
    answer:"0.04", answerAlt:[".04","0.040"],
    hint:"1/25 = 4/100 = 0.04",
    mnemonic:null, commonMistake:"Not 0.4 — 1/25 is very small" },

  { id:"A2-04", topic:"A", subtopic:"A2", difficulty:2, type:"numeric",
    question:"What is 3/25 as a decimal?", display:{type:"fraction",num:3,den:25},
    answer:"0.12", answerAlt:[".12"],
    hint:"3/25 = 12/100 = 0.12",
    mnemonic:null, commonMistake:null },

  { id:"A2-05", topic:"A", subtopic:"A2", difficulty:2, type:"numeric",
    question:"What is 7/25 as a decimal?", display:{type:"fraction",num:7,den:25},
    answer:"0.28", answerAlt:[".28"],
    hint:"7/25 = 28/100 = 0.28",
    mnemonic:null, commonMistake:null },

  { id:"A2-06", topic:"A", subtopic:"A2", difficulty:2, type:"numeric",
    question:"What is 9/20 as a decimal?", display:{type:"fraction",num:9,den:20},
    answer:"0.45", answerAlt:[".45"],
    hint:"9/20 = 45/100 = 0.45",
    mnemonic:null, commonMistake:null },

  { id:"A2-07", topic:"A", subtopic:"A2", difficulty:2, type:"numeric",
    question:"What is 1/100 as a decimal?", display:{type:"fraction",num:1,den:100},
    answer:"0.01", answerAlt:[".01"],
    hint:"Hundredths place! 1 hundredth = 0.01",
    mnemonic:null, commonMistake:null },

  { id:"A2-08", topic:"A", subtopic:"A2", difficulty:2, type:"numeric",
    question:"What is 37/100 as a decimal?", display:{type:"fraction",num:37,den:100},
    answer:"0.37", answerAlt:[".37"],
    hint:"37 hundredths = 0.37",
    mnemonic:null, commonMistake:null },

  // ── A3: Repeating decimals ────────────────────────────────
  { id:"A3-01", topic:"A", subtopic:"A3", difficulty:2, type:"mc",
    question:"What is 1/3 as a decimal? (Choose the best answer)",
    display:{type:"fraction",num:1,den:3},
    answer:"0.333...", answerAlt:["0.3 repeating","0.33"],
    choices:["0.333...","0.3","0.13","0.3333 exact"],
    hint:"Divide 1 ÷ 3. It never ends — 0.333... (the 3 repeats forever)",
    mnemonic:null, commonMistake:"Not 0.3 — the 3 repeats without end" },

  { id:"A3-02", topic:"A", subtopic:"A3", difficulty:2, type:"mc",
    question:"What is 2/3 as a decimal?", display:{type:"fraction",num:2,den:3},
    answer:"0.666...", answerAlt:["0.6 repeating","0.67"],
    choices:["0.666...","0.6","0.23","0.67"],
    hint:"2 × (1/3) = 2 × 0.333... = 0.666...",
    mnemonic:null, commonMistake:"0.67 is close but not exact — the 6 repeats forever" },

  { id:"A3-03", topic:"A", subtopic:"A3", difficulty:2, type:"mc",
    question:"What is 1/6 as a decimal?", display:{type:"fraction",num:1,den:6},
    answer:"0.1666...", answerAlt:["0.167","0.16 repeating"],
    choices:["0.1666...","0.16","0.6","0.17"],
    hint:"Divide 1 ÷ 6 = 0.1666... (6 repeats)",
    mnemonic:null, commonMistake:null },

  { id:"A3-04", topic:"A", subtopic:"A3", difficulty:2, type:"mc",
    question:"What is 1/9 as a decimal?", display:{type:"fraction",num:1,den:9},
    answer:"0.111...", answerAlt:["0.1 repeating"],
    choices:["0.111...","0.1","0.9","0.19"],
    hint:"Divide 1 ÷ 9 = 0.111... (1 repeats)",
    mnemonic:null, commonMistake:null },

  { id:"A3-05", topic:"A", subtopic:"A3", difficulty:3, type:"mc",
    question:"What is 5/9 as a decimal?", display:{type:"fraction",num:5,den:9},
    answer:"0.555...", answerAlt:["0.5 repeating"],
    choices:["0.555...","0.5","0.56","0.59"],
    hint:"5 × (1/9) = 5 × 0.111... = 0.555...",
    mnemonic:null, commonMistake:null },

  { id:"A3-06", topic:"A", subtopic:"A3", difficulty:3, type:"mc",
    question:"What is 1/11 as a decimal?", display:{type:"fraction",num:1,den:11},
    answer:"0.0909...", answerAlt:["0.09 repeating"],
    choices:["0.0909...","0.09","0.11","0.1"],
    hint:"Divide 1 ÷ 11 = 0.090909... (09 repeats)",
    mnemonic:null, commonMistake:null },

  // ── A4: Improper fractions ───────────────────────────────
  { id:"A4-01", topic:"A", subtopic:"A4", difficulty:2, type:"numeric",
    question:"What is 5/4 as a decimal?", display:{type:"fraction",num:5,den:4},
    answer:"1.25", answerAlt:["1.250"],
    hint:"5 ÷ 4 = 1 remainder 1. Then 1.00 ÷ 4 → 0.25. Total: 1.25",
    mnemonic:null, commonMistake:"Improper fraction > 1. Answer must be > 1." },

  { id:"A4-02", topic:"A", subtopic:"A4", difficulty:2, type:"numeric",
    question:"What is 7/2 as a decimal?", display:{type:"fraction",num:7,den:2},
    answer:"3.5", answerAlt:["3.50"],
    hint:"7 ÷ 2 = 3 remainder 1. Then 1.0 ÷ 2 = 0.5. Total: 3.5",
    mnemonic:null, commonMistake:null },

  { id:"A4-03", topic:"A", subtopic:"A4", difficulty:2, type:"numeric",
    question:"What is 9/4 as a decimal?", display:{type:"fraction",num:9,den:4},
    answer:"2.25", answerAlt:["2.250"],
    hint:"9 ÷ 4 = 2 remainder 1. 1.00 ÷ 4 = 0.25. Total: 2.25",
    mnemonic:null, commonMistake:null },

  { id:"A4-04", topic:"A", subtopic:"A4", difficulty:2, type:"numeric",
    question:"What is 11/5 as a decimal?", display:{type:"fraction",num:11,den:5},
    answer:"2.2", answerAlt:["2.20"],
    hint:"11 ÷ 5 = 2 remainder 1. 1.0 ÷ 5 = 0.2. Total: 2.2",
    mnemonic:null, commonMistake:null },

  { id:"A4-05", topic:"A", subtopic:"A4", difficulty:3, type:"numeric",
    question:"What is 13/8 as a decimal?", display:{type:"fraction",num:13,den:8},
    answer:"1.625", answerAlt:["1.6250"],
    hint:"13 ÷ 8 = 1 remainder 5. Divide 5.000 ÷ 8 = 0.625. Total: 1.625",
    mnemonic:null, commonMistake:null },

  { id:"A4-06", topic:"A", subtopic:"A4", difficulty:2, type:"numeric",
    question:"What is 3/2 as a decimal?", display:{type:"fraction",num:3,den:2},
    answer:"1.5", answerAlt:["1.50"],
    hint:"3 ÷ 2 = 1 remainder 1. 1.0 ÷ 2 = 0.5. Total: 1.5",
    mnemonic:null, commonMistake:null },

  // ── A5: Mixed numbers ────────────────────────────────────
  { id:"A5-01", topic:"A", subtopic:"A5", difficulty:2, type:"numeric",
    question:"What is 1 and 1/2 (1½) as a decimal?", display:{type:"fraction",num:1,den:2,whole:1},
    answer:"1.5", answerAlt:["1.50"],
    hint:"The whole part (1) stays, convert 1/2 = 0.5. So 1 + 0.5 = 1.5",
    mnemonic:null, commonMistake:null },

  { id:"A5-02", topic:"A", subtopic:"A5", difficulty:2, type:"numeric",
    question:"What is 2 and 1/4 (2¼) as a decimal?", display:{type:"fraction",num:1,den:4,whole:2},
    answer:"2.25", answerAlt:["2.250"],
    hint:"2 + 0.25 = 2.25",
    mnemonic:null, commonMistake:null },

  { id:"A5-03", topic:"A", subtopic:"A5", difficulty:2, type:"numeric",
    question:"What is 3 and 3/4 as a decimal?", display:{type:"fraction",num:3,den:4,whole:3},
    answer:"3.75", answerAlt:["3.750"],
    hint:"3 + 0.75 = 3.75",
    mnemonic:null, commonMistake:null },

  { id:"A5-04", topic:"A", subtopic:"A5", difficulty:3, type:"mc",
    question:"What is 2 and 2/3 as a decimal?", display:{type:"fraction",num:2,den:3,whole:2},
    answer:"2.666...", answerAlt:["2.67"],
    choices:["2.666...","2.23","2.6","2.33"],
    hint:"2 + 0.666... = 2.666...",
    mnemonic:null, commonMistake:null },

  { id:"A5-05", topic:"A", subtopic:"A5", difficulty:2, type:"numeric",
    question:"What is 4 and 1/8 as a decimal?", display:{type:"fraction",num:1,den:8,whole:4},
    answer:"4.125", answerAlt:["4.1250"],
    hint:"4 + 0.125 = 4.125",
    mnemonic:null, commonMistake:null },

  // ── A6: Decimal → fraction ───────────────────────────────
  { id:"A6-01", topic:"A", subtopic:"A6", difficulty:2, type:"mc",
    question:"0.5 as a fraction in simplest form is:", display:null,
    answer:"1/2", answerAlt:["1 / 2"],
    choices:["1/2","5/10","1/5","0.5/1"],
    hint:"0.5 = 5/10. Simplify: divide top and bottom by 5 → 1/2",
    mnemonic:null, commonMistake:"5/10 is correct but not simplified" },

  { id:"A6-02", topic:"A", subtopic:"A6", difficulty:2, type:"mc",
    question:"0.25 as a fraction in simplest form is:", display:null,
    answer:"1/4", answerAlt:[],
    choices:["1/4","25/100","2/5","1/25"],
    hint:"0.25 = 25/100. Simplify: ÷25 → 1/4",
    mnemonic:null, commonMistake:null },

  { id:"A6-03", topic:"A", subtopic:"A6", difficulty:2, type:"mc",
    question:"0.75 as a fraction in simplest form is:", display:null,
    answer:"3/4", answerAlt:[],
    choices:["3/4","75/100","7/5","3/5"],
    hint:"0.75 = 75/100 = 3/4",
    mnemonic:null, commonMistake:null },

  { id:"A6-04", topic:"A", subtopic:"A6", difficulty:3, type:"mc",
    question:"0.375 as a fraction in simplest form is:", display:null,
    answer:"3/8", answerAlt:[],
    choices:["3/8","375/1000","3/80","37/100"],
    hint:"0.375 = 375/1000. Divide by 125 → 3/8",
    mnemonic:null, commonMistake:null },

  { id:"A6-05", topic:"A", subtopic:"A6", difficulty:2, type:"mc",
    question:"0.2 as a fraction in simplest form is:", display:null,
    answer:"1/5", answerAlt:[],
    choices:["1/5","2/10","2/5","1/2"],
    hint:"0.2 = 2/10 = 1/5",
    mnemonic:null, commonMistake:null },

  // ── A7: Number line / comparison ─────────────────────────
  { id:"A7-01", topic:"A", subtopic:"A7", difficulty:2, type:"mc",
    question:"Which is LARGER: 0.6 or 2/3?", display:null,
    answer:"2/3", answerAlt:["0.666..."],
    choices:["0.6","2/3","They are equal","Cannot tell"],
    hint:"Convert 2/3 = 0.666... Compare: 0.666... > 0.6",
    mnemonic:null, commonMistake:"0.6 looks like it should equal 2/3 but 2/3 = 0.666..." },

  { id:"A7-02", topic:"A", subtopic:"A7", difficulty:2, type:"mc",
    question:"Which is LARGER: 0.5 or 1/3?", display:null,
    answer:"0.5", answerAlt:["1/2"],
    choices:["0.5","1/3","They are equal","Cannot tell"],
    hint:"1/3 = 0.333... Compare: 0.5 > 0.333...",
    mnemonic:null, commonMistake:null },

  { id:"A7-03", topic:"A", subtopic:"A7", difficulty:2, type:"mc",
    question:"Order from SMALLEST to LARGEST: 3/4, 0.7, 7/10", display:null,
    answer:"0.7, 7/10, 3/4", answerAlt:["0.7 = 7/10, then 3/4"],
    choices:["0.7 = 7/10 (same), then 3/4","3/4, 0.7, 7/10","7/10, 0.7, 3/4","They are all equal"],
    hint:"7/10 = 0.7 exactly. 3/4 = 0.75 > 0.7. So 0.7 = 7/10 < 3/4",
    mnemonic:null, commonMistake:null },

  // ── A8: Edge cases ───────────────────────────────────────
  { id:"A8-01", topic:"A", subtopic:"A8", difficulty:1, type:"numeric",
    question:"What is 0/5 as a decimal?", display:{type:"fraction",num:0,den:5},
    answer:"0", answerAlt:["0.0"],
    hint:"Zero divided by anything = 0",
    mnemonic:null, commonMistake:null },

  { id:"A8-02", topic:"A", subtopic:"A8", difficulty:1, type:"numeric",
    question:"What is 5/5 as a decimal?", display:{type:"fraction",num:5,den:5},
    answer:"1", answerAlt:["1.0"],
    hint:"Any number divided by itself = 1",
    mnemonic:null, commonMistake:null },

  { id:"A8-03", topic:"A", subtopic:"A8", difficulty:2, type:"numeric",
    question:"What is 10/4 as a decimal?", display:{type:"fraction",num:10,den:4},
    answer:"2.5", answerAlt:["2.50"],
    hint:"10 ÷ 4 = 2 remainder 2. 2.0 ÷ 4 = 0.5. Total: 2.5",
    mnemonic:null, commonMistake:null },

  { id:"A8-04", topic:"A", subtopic:"A8", difficulty:3, type:"numeric",
    question:"What is 22/8 in simplest decimal form?", display:{type:"fraction",num:22,den:8},
    answer:"2.75", answerAlt:["2.750"],
    hint:"22 ÷ 8 = 2 remainder 6. 6.000 ÷ 8 = 0.75. Total: 2.75",
    mnemonic:null, commonMistake:null },
];

// ============================================================
// TOPIC B: LONG DIVISION
// ============================================================

const TOPIC_B = [

  // ── B1: 2-digit ÷ 1-digit, no remainder ─────────────────
  { id:"B1-01", topic:"B", subtopic:"B1", difficulty:1, type:"numeric",
    question:"84 ÷ 4 = ?", display:{type:"division",dividend:84,divisor:4},
    answer:"21", answerAlt:[],
    hint:"4 × 2 = 8 (tens digit), 4 × 1 = 4 (ones digit). Answer: 21",
    mnemonic:"Divide → Multiply → Subtract → Bring down", commonMistake:null },

  { id:"B1-02", topic:"B", subtopic:"B1", difficulty:1, type:"numeric",
    question:"96 ÷ 3 = ?", display:{type:"division",dividend:96,divisor:3},
    answer:"32", answerAlt:[],
    hint:"3 × 3 = 9 (tens), 3 × 2 = 6 (ones). Answer: 32",
    mnemonic:"Divide → Multiply → Subtract → Bring down", commonMistake:null },

  { id:"B1-03", topic:"B", subtopic:"B1", difficulty:1, type:"numeric",
    question:"72 ÷ 6 = ?", display:{type:"division",dividend:72,divisor:6},
    answer:"12", answerAlt:[],
    hint:"6 × 1 = 6 (tens), bring down 2, 6 × 2 = 12",
    mnemonic:null, commonMistake:null },

  { id:"B1-04", topic:"B", subtopic:"B1", difficulty:1, type:"numeric",
    question:"56 ÷ 8 = ?", display:{type:"division",dividend:56,divisor:8},
    answer:"7", answerAlt:[],
    hint:"8 × 7 = 56",
    mnemonic:null, commonMistake:null },

  { id:"B1-05", topic:"B", subtopic:"B1", difficulty:1, type:"numeric",
    question:"90 ÷ 9 = ?", display:{type:"division",dividend:90,divisor:9},
    answer:"10", answerAlt:[],
    hint:"9 × 1 = 9, bring down 0, 9 × 0 = 0. Answer: 10",
    mnemonic:null, commonMistake:"Not 9 — don't forget the 0 in the ones place" },

  { id:"B1-06", topic:"B", subtopic:"B1", difficulty:1, type:"numeric",
    question:"48 ÷ 4 = ?", display:{type:"division",dividend:48,divisor:4},
    answer:"12", answerAlt:[],
    hint:"4 × 1 = 4 (tens), bring down 8, 4 × 2 = 8",
    mnemonic:null, commonMistake:null },

  // ── B2: 2-digit ÷ 1-digit, with remainder ───────────────
  { id:"B2-01", topic:"B", subtopic:"B2", difficulty:1, type:"numeric",
    question:"73 ÷ 3 = ? (write answer as quotient R remainder)", display:{type:"division",dividend:73,divisor:3},
    answer:"24 R1", answerAlt:["24R1","24 r 1","24 remainder 1"],
    hint:"3 × 2 = 6 (tens), 73-60=13, 3×4=12, 13-12=1. Answer: 24 R1",
    mnemonic:null, commonMistake:"Don't forget the remainder!" },

  { id:"B2-02", topic:"B", subtopic:"B2", difficulty:1, type:"numeric",
    question:"85 ÷ 6 = ? (quotient R remainder)", display:{type:"division",dividend:85,divisor:6},
    answer:"14 R1", answerAlt:["14R1"],
    hint:"6×1=6 (tens), 85-60=25. 6×4=24. 25-24=1. Answer: 14 R1",
    mnemonic:null, commonMistake:null },

  { id:"B2-03", topic:"B", subtopic:"B2", difficulty:1, type:"numeric",
    question:"77 ÷ 5 = ? (quotient R remainder)", display:{type:"division",dividend:77,divisor:5},
    answer:"15 R2", answerAlt:["15R2"],
    hint:"5×1=5, 77-50=27, 5×5=25, 27-25=2. Answer: 15 R2",
    mnemonic:null, commonMistake:null },

  { id:"B2-04", topic:"B", subtopic:"B2", difficulty:2, type:"numeric",
    question:"67 ÷ 8 = ? (quotient R remainder)", display:{type:"division",dividend:67,divisor:8},
    answer:"8 R3", answerAlt:["8R3"],
    hint:"8×8=64, 67-64=3. Answer: 8 R3",
    mnemonic:null, commonMistake:null },

  // ── B3: 3-digit ÷ 1-digit, no remainder ─────────────────
  { id:"B3-01", topic:"B", subtopic:"B3", difficulty:2, type:"numeric",
    question:"396 ÷ 4 = ?", display:{type:"division",dividend:396,divisor:4},
    answer:"99", answerAlt:[],
    hint:"4 into 3? No. 4 into 39 = 9 (4×9=36), bring 6 down, 36÷4=9. Answer: 99",
    mnemonic:null, commonMistake:null },

  { id:"B3-02", topic:"B", subtopic:"B3", difficulty:2, type:"numeric",
    question:"248 ÷ 8 = ?", display:{type:"division",dividend:248,divisor:8},
    answer:"31", answerAlt:[],
    hint:"8 into 24 = 3, bring down 8, 8 into 8 = 1. Answer: 31",
    mnemonic:null, commonMistake:null },

  { id:"B3-03", topic:"B", subtopic:"B3", difficulty:2, type:"numeric",
    question:"735 ÷ 5 = ?", display:{type:"division",dividend:735,divisor:5},
    answer:"147", answerAlt:[],
    hint:"5 into 7 = 1 rem 2, bring down 3 → 23, 5×4=20 rem 3, bring down 5 → 35, 5×7=35. Answer: 147",
    mnemonic:null, commonMistake:null },

  { id:"B3-04", topic:"B", subtopic:"B3", difficulty:2, type:"numeric",
    question:"648 ÷ 9 = ?", display:{type:"division",dividend:648,divisor:9},
    answer:"72", answerAlt:[],
    hint:"9 into 64 = 7 rem 1, bring down 8 → 18, 9×2=18. Answer: 72",
    mnemonic:null, commonMistake:null },

  { id:"B3-05", topic:"B", subtopic:"B3", difficulty:2, type:"numeric",
    question:"504 ÷ 7 = ?", display:{type:"division",dividend:504,divisor:7},
    answer:"72", answerAlt:[],
    hint:"7 into 50 = 7 rem 1, bring down 4 → 14, 7×2=14. Answer: 72",
    mnemonic:null, commonMistake:null },

  // ── B4: Zero in quotient ─────────────────────────────────
  { id:"B4-01", topic:"B", subtopic:"B4", difficulty:2, type:"numeric",
    question:"306 ÷ 3 = ?", display:{type:"division",dividend:306,divisor:3},
    answer:"102", answerAlt:[],
    hint:"3 into 3 = 1, bring down 0, 3 into 0 = 0 (write 0!), bring down 6, 3×2=6. Answer: 102",
    mnemonic:null, commonMistake:"Don't skip the 0 in the middle — write it!" },

  { id:"B4-02", topic:"B", subtopic:"B4", difficulty:2, type:"numeric",
    question:"420 ÷ 4 = ?", display:{type:"division",dividend:420,divisor:4},
    answer:"105", answerAlt:[],
    hint:"4 into 4 = 1, bring down 2, 4 into 2 = 0 (write 0!), bring down 0, 4×0=0 wait — 4 into 20 = 5. Answer: 105",
    mnemonic:null, commonMistake:null },

  { id:"B4-03", topic:"B", subtopic:"B4", difficulty:2, type:"numeric",
    question:"808 ÷ 8 = ?", display:{type:"division",dividend:808,divisor:8},
    answer:"101", answerAlt:[],
    hint:"8 into 8 = 1, bring down 0, 8 into 0 = 0 (write 0!), bring down 8, 8×1=8. Answer: 101",
    mnemonic:null, commonMistake:"The middle digit in the quotient is 0" },

  { id:"B4-04", topic:"B", subtopic:"B4", difficulty:3, type:"numeric",
    question:"2010 ÷ 2 = ?", display:{type:"division",dividend:2010,divisor:2},
    answer:"1005", answerAlt:[],
    hint:"2 into 2=1, bring down 0, 2 into 0=0, bring down 1, 2 into 1=0 with rem 1, bring down 0, 2 into 10=5. Answer: 1005",
    mnemonic:null, commonMistake:"Two zeros in the quotient!" },

  // ── B5: Fraction to decimal via division ─────────────────
  { id:"B5-01", topic:"B", subtopic:"B5", difficulty:2, type:"numeric",
    question:"Divide to convert 3/4 to a decimal: 3 ÷ 4 = ?", display:{type:"division",dividend:3,divisor:4},
    answer:"0.75", answerAlt:[".75"],
    hint:"4 doesn't go into 3, so write 0. and divide 30÷4=7 rem 2, bring 20÷4=5. Answer: 0.75",
    mnemonic:null, commonMistake:"Add the decimal point before dividing after the 0" },

  { id:"B5-02", topic:"B", subtopic:"B5", difficulty:2, type:"numeric",
    question:"Divide to convert 1/8 to a decimal: 1 ÷ 8 = ?", display:{type:"division",dividend:1,divisor:8},
    answer:"0.125", answerAlt:[".125"],
    hint:"8 into 10=1 rem 2, 20÷8=2 rem 4, 40÷8=5. Answer: 0.125",
    mnemonic:null, commonMistake:null },

  { id:"B5-03", topic:"B", subtopic:"B5", difficulty:2, type:"numeric",
    question:"Divide to convert 7/8 to a decimal: 7 ÷ 8 = ?", display:{type:"division",dividend:7,divisor:8},
    answer:"0.875", answerAlt:[".875"],
    hint:"8 into 70=8 rem 6, 60÷8=7 rem 4, 40÷8=5. Answer: 0.875",
    mnemonic:null, commonMistake:null },

  { id:"B5-04", topic:"B", subtopic:"B5", difficulty:2, type:"numeric",
    question:"Divide to convert 2/5 to a decimal: 2 ÷ 5 = ?", display:{type:"division",dividend:2,divisor:5},
    answer:"0.4", answerAlt:[".4","0.40"],
    hint:"5 into 20=4. Answer: 0.4",
    mnemonic:null, commonMistake:null },

  // ── B6: Division with decimal result ─────────────────────
  { id:"B6-01", topic:"B", subtopic:"B6", difficulty:2, type:"numeric",
    question:"7 ÷ 2 = ?", display:{type:"division",dividend:7,divisor:2},
    answer:"3.5", answerAlt:["3.50"],
    hint:"2 into 7 = 3 rem 1. Add decimal: 10 ÷ 2 = 5. Answer: 3.5",
    mnemonic:null, commonMistake:"Don't write 3 R1 — use decimal division instead" },

  { id:"B6-02", topic:"B", subtopic:"B6", difficulty:2, type:"numeric",
    question:"9 ÷ 4 = ?", display:{type:"division",dividend:9,divisor:4},
    answer:"2.25", answerAlt:["2.250"],
    hint:"4 into 9 = 2 rem 1. 10÷4=2 rem 2. 20÷4=5. Answer: 2.25",
    mnemonic:null, commonMistake:null },

  { id:"B6-03", topic:"B", subtopic:"B6", difficulty:2, type:"numeric",
    question:"5 ÷ 4 = ?", display:{type:"division",dividend:5,divisor:4},
    answer:"1.25", answerAlt:["1.250"],
    hint:"4 into 5 = 1 rem 1. 10÷4=2 rem 2. 20÷4=5. Answer: 1.25",
    mnemonic:null, commonMistake:null },

  { id:"B6-04", topic:"B", subtopic:"B6", difficulty:2, type:"numeric",
    question:"11 ÷ 4 = ?", display:{type:"division",dividend:11,divisor:4},
    answer:"2.75", answerAlt:["2.750"],
    hint:"4 into 11 = 2 rem 3. 30÷4=7 rem 2. 20÷4=5. Answer: 2.75",
    mnemonic:null, commonMistake:null },

  { id:"B6-05", topic:"B", subtopic:"B6", difficulty:3, type:"numeric",
    question:"13 ÷ 8 = ?", display:{type:"division",dividend:13,divisor:8},
    answer:"1.625", answerAlt:["1.6250"],
    hint:"8 into 13 = 1 rem 5. 50÷8=6 rem 2. 20÷8=2 rem 4. 40÷8=5. Answer: 1.625",
    mnemonic:null, commonMistake:null },

  // ── B7: Decimal dividend ──────────────────────────────────
  { id:"B7-01", topic:"B", subtopic:"B7", difficulty:2, type:"numeric",
    question:"4.8 ÷ 4 = ?", display:{type:"division",dividend:4.8,divisor:4},
    answer:"1.2", answerAlt:["1.20"],
    hint:"4 into 4 = 1, bring decimal, 4 into 8 = 2. Answer: 1.2",
    mnemonic:null, commonMistake:"Keep the decimal point in the same position" },

  { id:"B7-02", topic:"B", subtopic:"B7", difficulty:2, type:"numeric",
    question:"3.6 ÷ 3 = ?", display:{type:"division",dividend:3.6,divisor:3},
    answer:"1.2", answerAlt:["1.20"],
    hint:"3 into 3 = 1, 3 into 6 = 2. Answer: 1.2",
    mnemonic:null, commonMistake:null },

  { id:"B7-03", topic:"B", subtopic:"B7", difficulty:2, type:"numeric",
    question:"7.5 ÷ 5 = ?", display:{type:"division",dividend:7.5,divisor:5},
    answer:"1.5", answerAlt:["1.50"],
    hint:"5 into 7 = 1 rem 2, bring decimal, 5 into 25 = 5. Answer: 1.5",
    mnemonic:null, commonMistake:null },

  { id:"B7-04", topic:"B", subtopic:"B7", difficulty:3, type:"numeric",
    question:"9.6 ÷ 8 = ?", display:{type:"division",dividend:9.6,divisor:8},
    answer:"1.2", answerAlt:["1.20"],
    hint:"8 into 9 = 1 rem 1, bring decimal, 8 into 16 = 2. Answer: 1.2",
    mnemonic:null, commonMistake:null },

  // ── B8: 2-digit divisor ──────────────────────────────────
  { id:"B8-01", topic:"B", subtopic:"B8", difficulty:3, type:"numeric",
    question:"96 ÷ 12 = ?", display:{type:"division",dividend:96,divisor:12},
    answer:"8", answerAlt:[],
    hint:"12 × 8 = 96. Answer: 8",
    mnemonic:null, commonMistake:null },

  { id:"B8-02", topic:"B", subtopic:"B8", difficulty:3, type:"numeric",
    question:"144 ÷ 12 = ?", display:{type:"division",dividend:144,divisor:12},
    answer:"12", answerAlt:[],
    hint:"12 × 12 = 144. Answer: 12",
    mnemonic:null, commonMistake:null },

  { id:"B8-03", topic:"B", subtopic:"B8", difficulty:3, type:"numeric",
    question:"225 ÷ 15 = ?", display:{type:"division",dividend:225,divisor:15},
    answer:"15", answerAlt:[],
    hint:"15 × 15 = 225. Answer: 15",
    mnemonic:null, commonMistake:null },

  { id:"B8-04", topic:"B", subtopic:"B8", difficulty:3, type:"numeric",
    question:"168 ÷ 14 = ?", display:{type:"division",dividend:168,divisor:14},
    answer:"12", answerAlt:[],
    hint:"14 × 12 = 168. Check: 14×10=140, 14×2=28. 140+28=168. Answer: 12",
    mnemonic:null, commonMistake:null },

  // ── B9: Larger dividends ──────────────────────────────────
  { id:"B9-01", topic:"B", subtopic:"B9", difficulty:3, type:"numeric",
    question:"1248 ÷ 4 = ?", display:{type:"division",dividend:1248,divisor:4},
    answer:"312", answerAlt:[],
    hint:"4 into 12=3, bring 4, 4 into 4=1, bring 8, 4×2=8. Answer: 312",
    mnemonic:null, commonMistake:null },

  { id:"B9-02", topic:"B", subtopic:"B9", difficulty:3, type:"numeric",
    question:"3600 ÷ 9 = ?", display:{type:"division",dividend:3600,divisor:9},
    answer:"400", answerAlt:[],
    hint:"9 into 36=4, bring 0 (write 0), bring 0 (write 0). Answer: 400",
    mnemonic:null, commonMistake:"Remember to write both zeros at the end" },

  { id:"B9-03", topic:"B", subtopic:"B9", difficulty:3, type:"numeric",
    question:"1000 ÷ 8 = ?", display:{type:"division",dividend:1000,divisor:8},
    answer:"125", answerAlt:[],
    hint:"8 into 10=1 rem 2, 8 into 20=2 rem 4, 8 into 40=5. Answer: 125",
    mnemonic:null, commonMistake:null },

  // ── B10: RPG word problems ────────────────────────────────
  { id:"B10-01", topic:"B", subtopic:"B10", difficulty:2, type:"numeric",
    question:"You found 144 gold coins and split them equally among 6 heroes. How much does each hero get?",
    display:null,
    answer:"24", answerAlt:[],
    hint:"144 ÷ 6 = ? Use long division.",
    mnemonic:null, commonMistake:null },

  { id:"B10-02", topic:"B", subtopic:"B10", difficulty:2, type:"numeric",
    question:"A dungeon has 252 monsters spread across 7 floors equally. How many monsters per floor?",
    display:null,
    answer:"36", answerAlt:[],
    hint:"252 ÷ 7 = 36",
    mnemonic:null, commonMistake:null },

  { id:"B10-03", topic:"B", subtopic:"B10", difficulty:3, type:"numeric",
    question:"A wizard needs 365 mana crystals and uses 8 per day. How many full days can he cast? (give quotient only)",
    display:null,
    answer:"45", answerAlt:[],
    hint:"365 ÷ 8 = 45 R5. The answer is 45 full days.",
    mnemonic:null, commonMistake:null },
];

// ============================================================
// TOPIC C: MULTI-DIGIT MULTIPLICATION
// ============================================================

const TOPIC_C = [

  // ── C1: 2-digit × 1-digit ────────────────────────────────
  { id:"C1-01", topic:"C", subtopic:"C1", difficulty:1, type:"numeric",
    question:"34 × 6 = ?", display:{type:"multiply",a:34,b:6},
    answer:"204", answerAlt:[],
    hint:"(30 × 6) + (4 × 6) = 180 + 24 = 204",
    mnemonic:null, commonMistake:"Don't forget to add the carry!" },

  { id:"C1-02", topic:"C", subtopic:"C1", difficulty:1, type:"numeric",
    question:"27 × 8 = ?", display:{type:"multiply",a:27,b:8},
    answer:"216", answerAlt:[],
    hint:"(20 × 8) + (7 × 8) = 160 + 56 = 216",
    mnemonic:null, commonMistake:null },

  { id:"C1-03", topic:"C", subtopic:"C1", difficulty:1, type:"numeric",
    question:"99 × 9 = ?", display:{type:"multiply",a:99,b:9},
    answer:"891", answerAlt:[],
    hint:"(100 × 9) - (1 × 9) = 900 - 9 = 891. Or: (90×9)+(9×9)=810+81=891",
    mnemonic:null, commonMistake:"99 × 9 is close to 900 but not quite" },

  { id:"C1-04", topic:"C", subtopic:"C1", difficulty:1, type:"numeric",
    question:"47 × 5 = ?", display:{type:"multiply",a:47,b:5},
    answer:"235", answerAlt:[],
    hint:"(40 × 5) + (7 × 5) = 200 + 35 = 235",
    mnemonic:null, commonMistake:null },

  { id:"C1-05", topic:"C", subtopic:"C1", difficulty:2, type:"numeric",
    question:"78 × 7 = ?", display:{type:"multiply",a:78,b:7},
    answer:"546", answerAlt:[],
    hint:"(70 × 7) + (8 × 7) = 490 + 56 = 546",
    mnemonic:null, commonMistake:null },

  { id:"C1-06", topic:"C", subtopic:"C1", difficulty:2, type:"numeric",
    question:"65 × 4 = ?", display:{type:"multiply",a:65,b:4},
    answer:"260", answerAlt:[],
    hint:"(60 × 4) + (5 × 4) = 240 + 20 = 260",
    mnemonic:null, commonMistake:null },

  // ── C2: 3-digit × 1-digit ────────────────────────────────
  { id:"C2-01", topic:"C", subtopic:"C2", difficulty:2, type:"numeric",
    question:"123 × 5 = ?", display:{type:"multiply",a:123,b:5},
    answer:"615", answerAlt:[],
    hint:"(100×5)+(20×5)+(3×5) = 500+100+15 = 615",
    mnemonic:null, commonMistake:null },

  { id:"C2-02", topic:"C", subtopic:"C2", difficulty:2, type:"numeric",
    question:"408 × 7 = ?", display:{type:"multiply",a:408,b:7},
    answer:"2856", answerAlt:[],
    hint:"(400×7)+(0×7)+(8×7) = 2800+0+56 = 2856",
    mnemonic:null, commonMistake:"Middle digit is 0 — 0×7=0, don't skip it" },

  { id:"C2-03", topic:"C", subtopic:"C2", difficulty:2, type:"numeric",
    question:"356 × 9 = ?", display:{type:"multiply",a:356,b:9},
    answer:"3204", answerAlt:[],
    hint:"(300×9)+(50×9)+(6×9) = 2700+450+54 = 3204",
    mnemonic:null, commonMistake:null },

  { id:"C2-04", topic:"C", subtopic:"C2", difficulty:2, type:"numeric",
    question:"204 × 6 = ?", display:{type:"multiply",a:204,b:6},
    answer:"1224", answerAlt:[],
    hint:"(200×6)+(4×6) = 1200+24 = 1224",
    mnemonic:null, commonMistake:null },

  { id:"C2-05", topic:"C", subtopic:"C2", difficulty:2, type:"numeric",
    question:"317 × 8 = ?", display:{type:"multiply",a:317,b:8},
    answer:"2536", answerAlt:[],
    hint:"(300×8)+(10×8)+(7×8) = 2400+80+56 = 2536",
    mnemonic:null, commonMistake:null },

  // ── C3: Multiply by 10/100/1000 ──────────────────────────
  { id:"C3-01", topic:"C", subtopic:"C3", difficulty:1, type:"numeric",
    question:"45 × 10 = ?", display:{type:"multiply",a:45,b:10},
    answer:"450", answerAlt:[],
    hint:"Multiply by 10: add one zero → 450",
    mnemonic:"×10: add 1 zero. ×100: add 2 zeros. ×1000: add 3 zeros.", commonMistake:null },

  { id:"C3-02", topic:"C", subtopic:"C3", difficulty:1, type:"numeric",
    question:"23 × 100 = ?", display:{type:"multiply",a:23,b:100},
    answer:"2300", answerAlt:[],
    hint:"×100: add two zeros → 2300",
    mnemonic:null, commonMistake:null },

  { id:"C3-03", topic:"C", subtopic:"C3", difficulty:1, type:"numeric",
    question:"7 × 1000 = ?", display:{type:"multiply",a:7,b:1000},
    answer:"7000", answerAlt:[],
    hint:"×1000: add three zeros → 7000",
    mnemonic:null, commonMistake:null },

  { id:"C3-04", topic:"C", subtopic:"C3", difficulty:2, type:"numeric",
    question:"30 × 40 = ?", display:{type:"multiply",a:30,b:40},
    answer:"1200", answerAlt:[],
    hint:"3 × 4 = 12, then add the two zeros: 1200",
    mnemonic:null, commonMistake:"3×4=12, then TWO zeros (one from each number)" },

  { id:"C3-05", topic:"C", subtopic:"C3", difficulty:2, type:"numeric",
    question:"500 × 60 = ?", display:{type:"multiply",a:500,b:60},
    answer:"30000", answerAlt:[],
    hint:"5 × 6 = 30, then add the three zeros (500 has 2, 60 has 1): 30000",
    mnemonic:null, commonMistake:"Count ALL the zeros: 30 + three zeros = 30000" },

  // ── C4: 2-digit × 2-digit (area model) ───────────────────
  { id:"C4-01", topic:"C", subtopic:"C4", difficulty:2, type:"numeric",
    question:"23 × 14 = ?", display:{type:"multiply",a:23,b:14},
    answer:"322", answerAlt:[],
    hint:"Area model: (20+3) × (10+4) = 200+80+30+12 = 322. Or: 23×10=230, 23×4=92, 230+92=322",
    mnemonic:null, commonMistake:null },

  { id:"C4-02", topic:"C", subtopic:"C4", difficulty:2, type:"numeric",
    question:"56 × 34 = ?", display:{type:"multiply",a:56,b:34},
    answer:"1904", answerAlt:[],
    hint:"56×30=1680, 56×4=224. 1680+224=1904",
    mnemonic:null, commonMistake:null },

  { id:"C4-03", topic:"C", subtopic:"C4", difficulty:2, type:"numeric",
    question:"25 × 12 = ?", display:{type:"multiply",a:25,b:12},
    answer:"300", answerAlt:[],
    hint:"25×10=250, 25×2=50. 250+50=300",
    mnemonic:null, commonMistake:"25×12=300 exactly — a nice round number" },

  { id:"C4-04", topic:"C", subtopic:"C4", difficulty:2, type:"numeric",
    question:"45 × 22 = ?", display:{type:"multiply",a:45,b:22},
    answer:"990", answerAlt:[],
    hint:"45×20=900, 45×2=90. 900+90=990",
    mnemonic:null, commonMistake:null },

  { id:"C4-05", topic:"C", subtopic:"C4", difficulty:3, type:"numeric",
    question:"67 × 83 = ?", display:{type:"multiply",a:67,b:83},
    answer:"5561", answerAlt:[],
    hint:"67×80=5360, 67×3=201. 5360+201=5561",
    mnemonic:null, commonMistake:null },

  { id:"C4-06", topic:"C", subtopic:"C4", difficulty:3, type:"numeric",
    question:"99 × 99 = ?", display:{type:"multiply",a:99,b:99},
    answer:"9801", answerAlt:[],
    hint:"(100-1) × (100-1) = 10000 - 100 - 100 + 1 = 9801. Or: 99×100=9900, 9900-99=9801",
    mnemonic:null, commonMistake:"Not 9999 — 99×99 is NOT 100×100" },

  // ── C5: 3-digit × 2-digit ────────────────────────────────
  { id:"C5-01", topic:"C", subtopic:"C5", difficulty:3, type:"numeric",
    question:"123 × 45 = ?", display:{type:"multiply",a:123,b:45},
    answer:"5535", answerAlt:[],
    hint:"123×40=4920, 123×5=615. 4920+615=5535",
    mnemonic:null, commonMistake:"Line up partial products correctly!" },

  { id:"C5-02", topic:"C", subtopic:"C5", difficulty:3, type:"numeric",
    question:"234 × 56 = ?", display:{type:"multiply",a:234,b:56},
    answer:"13104", answerAlt:[],
    hint:"234×50=11700, 234×6=1404. 11700+1404=13104",
    mnemonic:null, commonMistake:null },

  { id:"C5-03", topic:"C", subtopic:"C5", difficulty:3, type:"numeric",
    question:"408 × 23 = ?", display:{type:"multiply",a:408,b:23},
    answer:"9384", answerAlt:[],
    hint:"408×20=8160, 408×3=1224. 8160+1224=9384",
    mnemonic:null, commonMistake:null },

  // ── C6: Zeros in factors ──────────────────────────────────
  { id:"C6-01", topic:"C", subtopic:"C6", difficulty:2, type:"numeric",
    question:"205 × 6 = ?", display:{type:"multiply",a:205,b:6},
    answer:"1230", answerAlt:[],
    hint:"(200×6)+(0×6)+(5×6) = 1200+0+30 = 1230",
    mnemonic:null, commonMistake:null },

  { id:"C6-02", topic:"C", subtopic:"C6", difficulty:2, type:"numeric",
    question:"300 × 40 = ?", display:{type:"multiply",a:300,b:40},
    answer:"12000", answerAlt:[],
    hint:"3 × 4 = 12, then add 3 zeros (two from 300, one from 40) = 12000",
    mnemonic:null, commonMistake:null },

  { id:"C6-03", topic:"C", subtopic:"C6", difficulty:2, type:"numeric",
    question:"107 × 9 = ?", display:{type:"multiply",a:107,b:9},
    answer:"963", answerAlt:[],
    hint:"(100×9)+(0×9)+(7×9) = 900+0+63 = 963",
    mnemonic:null, commonMistake:null },

  // ── C7: Multiply decimals ─────────────────────────────────
  { id:"C7-01", topic:"C", subtopic:"C7", difficulty:2, type:"numeric",
    question:"1.5 × 4 = ?", display:{type:"multiply",a:1.5,b:4},
    answer:"6", answerAlt:["6.0"],
    hint:"15 × 4 = 60. One decimal place → 6.0 = 6",
    mnemonic:"Count decimal places in both factors, put same count in answer.", commonMistake:null },

  { id:"C7-02", topic:"C", subtopic:"C7", difficulty:2, type:"numeric",
    question:"0.25 × 8 = ?", display:{type:"multiply",a:0.25,b:8},
    answer:"2", answerAlt:["2.0","2.00"],
    hint:"25 × 8 = 200. Two decimal places → 2.00 = 2",
    mnemonic:null, commonMistake:"Not 20 — count the 2 decimal places" },

  { id:"C7-03", topic:"C", subtopic:"C7", difficulty:2, type:"numeric",
    question:"2.5 × 6 = ?", display:{type:"multiply",a:2.5,b:6},
    answer:"15", answerAlt:["15.0"],
    hint:"25 × 6 = 150. One decimal place → 15.0 = 15",
    mnemonic:null, commonMistake:null },

  { id:"C7-04", topic:"C", subtopic:"C7", difficulty:2, type:"numeric",
    question:"0.5 × 0.5 = ?", display:{type:"multiply",a:0.5,b:0.5},
    answer:"0.25", answerAlt:[".25"],
    hint:"5 × 5 = 25. Two decimal places total (1+1) → 0.25",
    mnemonic:null, commonMistake:"Not 0.5 — multiplying two halves gives a quarter" },

  { id:"C7-05", topic:"C", subtopic:"C7", difficulty:3, type:"numeric",
    question:"1.2 × 1.5 = ?", display:{type:"multiply",a:1.2,b:1.5},
    answer:"1.8", answerAlt:["1.80"],
    hint:"12 × 15 = 180. Two decimal places → 1.80 = 1.8",
    mnemonic:null, commonMistake:null },

  // ── C8: Estimation ────────────────────────────────────────
  { id:"C8-01", topic:"C", subtopic:"C8", difficulty:2, type:"mc",
    question:"ESTIMATE: 48 × 22 ≈ ?", display:null,
    answer:"1000", answerAlt:["~1000"],
    choices:["1000","880","500","2000"],
    hint:"Round: 50 × 20 = 1000",
    mnemonic:"Round to nearest 10 or friendly number, then multiply.", commonMistake:null },

  { id:"C8-02", topic:"C", subtopic:"C8", difficulty:2, type:"mc",
    question:"ESTIMATE: 197 × 4 ≈ ?", display:null,
    answer:"800", answerAlt:["~800"],
    choices:["800","700","780","1000"],
    hint:"Round 197 to 200. 200 × 4 = 800",
    mnemonic:null, commonMistake:null },

  { id:"C8-03", topic:"C", subtopic:"C8", difficulty:2, type:"mc",
    question:"ESTIMATE: 312 × 29 ≈ ?", display:null,
    answer:"9000", answerAlt:["~9000"],
    choices:["9000","6000","3000","12000"],
    hint:"Round: 300 × 30 = 9000",
    mnemonic:null, commonMistake:null },

  // ── C9: Partial products ──────────────────────────────────
  { id:"C9-01", topic:"C", subtopic:"C9", difficulty:2, type:"mc",
    question:"Using partial products, 23 × 14 = (20 × 14) + (3 × 14). What is 20 × 14?", display:null,
    answer:"280", answerAlt:[],
    choices:["280","140","200","260"],
    hint:"20 × 14 = 20 × 10 + 20 × 4 = 200 + 80 = 280",
    mnemonic:null, commonMistake:null },

  { id:"C9-02", topic:"C", subtopic:"C9", difficulty:2, type:"numeric",
    question:"Complete the partial products: 36 × 12 = (36 × 10) + (36 × 2) = 360 + ?", display:null,
    answer:"72", answerAlt:[],
    hint:"36 × 2 = 72",
    mnemonic:null, commonMistake:null },

  { id:"C9-03", topic:"C", subtopic:"C9", difficulty:3, type:"numeric",
    question:"Using partial products, what is the TOTAL of 36 × 12?", display:null,
    answer:"432", answerAlt:[],
    hint:"360 + 72 = 432",
    mnemonic:null, commonMistake:null },

  // ── C10: RPG word problems ────────────────────────────────
  { id:"C10-01", topic:"C", subtopic:"C10", difficulty:2, type:"numeric",
    question:"Your dungeon has 24 floors, each with 15 monsters. How many monsters total?",
    display:null,
    answer:"360", answerAlt:[],
    hint:"24 × 15 = 360",
    mnemonic:null, commonMistake:null },

  { id:"C10-02", topic:"C", subtopic:"C10", difficulty:2, type:"numeric",
    question:"Each hero earns 125 XP per boss. If 8 heroes defeat a boss, what's the total XP earned?",
    display:null,
    answer:"1000", answerAlt:[],
    hint:"125 × 8 = 1000",
    mnemonic:null, commonMistake:null },

  { id:"C10-03", topic:"C", subtopic:"C10", difficulty:3, type:"numeric",
    question:"A castle has 36 towers, each with 27 archers. How many archers in total?",
    display:null,
    answer:"972", answerAlt:[],
    hint:"36 × 27 = 36×20 + 36×7 = 720 + 252 = 972",
    mnemonic:null, commonMistake:null },

  // ── Edge cases ────────────────────────────────────────────
  { id:"CE-01", topic:"C", subtopic:"C1", difficulty:1, type:"numeric",
    question:"0 × 9999 = ?", display:{type:"multiply",a:0,b:9999},
    answer:"0", answerAlt:[],
    hint:"Zero times anything = zero",
    mnemonic:null, commonMistake:null },

  { id:"CE-02", topic:"C", subtopic:"C1", difficulty:1, type:"numeric",
    question:"1 × 4567 = ?", display:{type:"multiply",a:1,b:4567},
    answer:"4567", answerAlt:[],
    hint:"1 times anything = that number",
    mnemonic:null, commonMistake:null },

  { id:"CE-03", topic:"C", subtopic:"C3", difficulty:2, type:"numeric",
    question:"125 × 8 = ?", display:{type:"multiply",a:125,b:8},
    answer:"1000", answerAlt:[],
    hint:"125 × 8 = 1000 exactly. 125 is 1/8 of 1000!",
    mnemonic:null, commonMistake:null },

  { id:"CE-04", topic:"C", subtopic:"C4", difficulty:2, type:"numeric",
    question:"25 × 4 = ?", display:{type:"multiply",a:25,b:4},
    answer:"100", answerAlt:[],
    hint:"25 × 4 = 100. Four quarters make a dollar!",
    mnemonic:null, commonMistake:null },
];

// ============================================================
// DIAGNOSTIC BANK — 5 per topic, varied difficulty
// ============================================================
const DIAGNOSTIC_BANK = {
  A: [
    TOPIC_A.find(p => p.id === "A1-01"),  // 1/2 = 0.5 (easy)
    TOPIC_A.find(p => p.id === "A1-10"),  // 1/8 = 0.125 (medium)
    TOPIC_A.find(p => p.id === "A3-01"),  // 1/3 repeating (medium)
    TOPIC_A.find(p => p.id === "A4-01"),  // 5/4 improper (medium)
    TOPIC_A.find(p => p.id === "A7-01"),  // compare 0.6 vs 2/3 (medium)
  ],
  B: [
    TOPIC_B.find(p => p.id === "B1-01"),  // 84÷4 (easy)
    TOPIC_B.find(p => p.id === "B1-05"),  // 90÷9 zero in quotient (easy-med)
    TOPIC_B.find(p => p.id === "B4-01"),  // 306÷3 zero in quotient (medium)
    TOPIC_B.find(p => p.id === "B5-01"),  // 3/4 = 0.75 via division (medium)
    TOPIC_B.find(p => p.id === "B6-01"),  // 7÷2 = 3.5 (medium)
  ],
  C: [
    TOPIC_C.find(p => p.id === "C1-01"),  // 34×6 (easy)
    TOPIC_C.find(p => p.id === "C3-04"),  // 30×40 (medium)
    TOPIC_C.find(p => p.id === "C4-01"),  // 23×14 area model (medium)
    TOPIC_C.find(p => p.id === "C7-02"),  // 0.25×8 decimals (medium)
    TOPIC_C.find(p => p.id === "C5-01"),  // 123×45 (hard)
  ],
};

// ============================================================
// PROBLEM BANK — ALL PROBLEMS INDEXED
// ============================================================
const ALL_PROBLEMS = [...TOPIC_A, ...TOPIC_B, ...TOPIC_C];

function getProblemsBySubtopic(subtopic) {
  return ALL_PROBLEMS.filter(p => p.subtopic === subtopic);
}

function getProblemsByTopicAndDifficulty(topic, difficulty) {
  return ALL_PROBLEMS.filter(p => p.topic === topic && p.difficulty === difficulty);
}

// ============================================================
// ALGORITHMIC GENERATORS — for unlimited drill
// ============================================================

function generateFractionProblem() {
  const dens = [2, 4, 5, 8, 10, 20];
  const den = dens[Math.floor(Math.random() * dens.length)];
  const num = Math.floor(Math.random() * (den - 1)) + 1;
  const decimal = (num / den).toFixed(4).replace(/\.?0+$/, "");
  return {
    id: `GEN-A-${Date.now()}`,
    topic: "A", subtopic: "A1", difficulty: 2, type: "numeric",
    question: `What is ${num}/${den} as a decimal?`,
    display: { type: "fraction", num, den },
    answer: decimal,
    answerAlt: [],
    hint: `Divide ${num} ÷ ${den}`,
    mnemonic: null, commonMistake: null,
    generated: true,
  };
}

function generateDivisionProblem() {
  const divisor = Math.floor(Math.random() * 8) + 2;
  const quotient = Math.floor(Math.random() * 90) + 10;
  const dividend = divisor * quotient;
  return {
    id: `GEN-B-${Date.now()}`,
    topic: "B", subtopic: "B3", difficulty: 2, type: "numeric",
    question: `${dividend} ÷ ${divisor} = ?`,
    display: { type: "division", dividend, divisor },
    answer: String(quotient),
    answerAlt: [],
    hint: `Try: ${divisor} × ${Math.floor(quotient/10)*10} first`,
    mnemonic: null, commonMistake: null,
    generated: true,
  };
}

function generateMultiplicationProblem() {
  const a = Math.floor(Math.random() * 90) + 10;
  const b = Math.floor(Math.random() * 90) + 10;
  const product = a * b;
  return {
    id: `GEN-C-${Date.now()}`,
    topic: "C", subtopic: "C4", difficulty: 2, type: "numeric",
    question: `${a} × ${b} = ?`,
    display: { type: "multiply", a, b },
    answer: String(product),
    answerAlt: [],
    hint: `Try: ${a} × ${Math.floor(b/10)*10} first, then add ${a} × ${b % 10}`,
    mnemonic: null, commonMistake: null,
    generated: true,
  };
}

// ============================================================
// EXPLANATION BUILDER
// Each problem type gets a rich step-by-step explanation
// Returns HTML string for the explanation panel
// ============================================================

function buildExplanation(problem, userAnswer) {
  if (problem.subtopic.startsWith("A")) return buildFractionExplanation(problem);
  if (problem.subtopic.startsWith("B")) return buildDivisionExplanation(problem);
  if (problem.subtopic.startsWith("C")) return buildMultiplyExplanation(problem);
  return `<p>The correct answer is <strong>${problem.answer}</strong>.</p>`;
}

function buildFractionExplanation(p) {
  const d = p.display;
  const subtopic = p.subtopic;
  let html = `<div class="explain-block">`;

  // ── A6/A7/A8: non-display problems (comparison, decimal→fraction, edge cases) ──
  if (!d || d.type !== "fraction") {
    html += `<div class="explain-title">${p.question}</div>`;
    html += buildGenericSteps(p);
    html += `<div class="explain-answer">Answer: <strong>${p.answer}</strong></div>`;
    if (p.commonMistake) html += `<div class="explain-mistake">⚠️ Common mistake: ${p.commonMistake}</div>`;
    html += `</div>`;
    return html;
  }

  const num = d.num, den = d.den, whole = d.whole || 0;
  const label = whole ? `${whole} and ${num}/${den}` : `${num}/${den}`;
  html += `<div class="explain-title">Converting ${label} to a decimal</div>`;

  // ── What does this fraction mean? ──
  html += `<div class="explain-steps">`;
  html += `<div class="step-intro">
    <strong>What does ${label} mean?</strong><br>
    The bottom number (${den}) tells us how many equal pieces the whole is cut into.<br>
    The top number (${num}) tells us how many of those pieces we have.<br>
    ${whole ? `The whole number ${whole} stays as-is — we only need to convert the fraction part.` : ""}
    <br><br>
    <strong>The rule:</strong> To turn any fraction into a decimal, divide the top by the bottom: <strong>${num} ÷ ${den}</strong>.
  </div>`;

  // ── Fraction bar (only for small denominators) ──
  if (den <= 12) {
    html += `<div class="step-block">
      <div class="step-num">Picture it</div>
      <div class="step-body">
        Imagine a chocolate bar with <strong>${den}</strong> equal pieces.<br>
        You have <strong>${num}</strong> of them shaded:<br>
        <div class="fraction-bar" style="margin-top:8px;">`;
    for (let i = 0; i < den; i++) {
      html += `<div class="fraction-cell ${i < num ? "filled" : ""}"></div>`;
    }
    html += `</div></div></div>`;
  }

  // ── Is it a repeating decimal? ──
  const actualNum = whole * den + num;
  const decimalVal = actualNum / den;
  const decStr = String(decimalVal);
  const isRepeating = subtopic === "A3" || (decStr.length > 8);

  if (isRepeating) {
    html += `<div class="step-block">
      <div class="step-num">Step 1</div>
      <div class="step-body">
        Divide <strong>${actualNum} ÷ ${den}</strong>.<br>
        Watch what happens — the remainder keeps coming back, so the decimal <strong>repeats forever</strong>.<br>
        For example, 1 ÷ 3: 10 ÷ 3 = 3 remainder 1 → 10 ÷ 3 = 3 remainder 1 → it never ends.<br>
        We write this with "..." to show it repeats: <strong>${p.answer}</strong>
      </div>
    </div>`;
  } else {
    // Walk through the actual division
    html += `<div class="step-block">
      <div class="step-num">Step 1</div>
      <div class="step-body">
        We divide <strong>${actualNum} ÷ ${den}</strong> using long division.<br>
        Since ${actualNum} is smaller than ${den}${actualNum < den ? "" : " or equal"}, we${actualNum < den ? " write 0. first, then work with " + actualNum + "0" : " start dividing directly"}.<br>
        Work through each digit — here are the steps:
      </div>
    </div>`;
    html += buildLongDivisionSteps(actualNum, den);
  }

  if (whole) {
    html += `<div class="step-block">
      <div class="step-num">Final step</div>
      <div class="step-body">
        We found that ${num}/${den} = ${(num/den).toFixed(4).replace(/0+$/,"") || "0"}.<br>
        Now add the whole number back: <strong>${whole} + ${(num/den).toFixed(4).replace(/0+$/,"")} = ${p.answer}</strong>.
      </div>
    </div>`;
  }

  html += `</div>`; // close explain-steps
  html += `<div class="explain-answer">Answer: <strong>${p.answer}</strong></div>`;
  if (p.commonMistake) html += `<div class="explain-mistake">⚠️ Common mistake: ${p.commonMistake}</div>`;
  html += `</div>`;
  return html;
}

function buildDivisionExplanation(p) {
  const d = p.display;
  let html = `<div class="explain-block">`;
  html += `<div class="explain-title">Long Division: ${d ? d.dividend + " ÷ " + d.divisor : p.question}</div>`;

  html += `<div class="explain-mnemonic">
    The 4-step cycle (repeat until done):<br>
    <strong>① Divide</strong> — how many times does ${d ? d.divisor : "the divisor"} fit?<br>
    <strong>② Multiply</strong> — write the product below<br>
    <strong>③ Subtract</strong> — find what's left over<br>
    <strong>④ Bring down</strong> — pull the next digit down<br>
    Then repeat from ① with the new number.
  </div>`;

  if (d && d.type === "division") {
    html += buildLongDivisionSteps(d.dividend, d.divisor);
  }

  html += `<div class="explain-answer">Answer: <strong>${p.answer}</strong></div>`;
  if (p.commonMistake) html += `<div class="explain-mistake">⚠️ Common mistake: ${p.commonMistake}</div>`;
  html += `</div>`;
  return html;
}

function buildMultiplyExplanation(p) {
  const d = p.display;
  let html = `<div class="explain-block">`;

  // ── No display (word problem, estimation, partial products quiz) ──
  if (!d || d.type !== "multiply") {
    html += `<div class="explain-title">${p.question}</div>`;
    html += buildGenericSteps(p);
    html += `<div class="explain-answer">Answer: <strong>${p.answer}</strong></div>`;
    if (p.commonMistake) html += `<div class="explain-mistake">⚠️ Common mistake: ${p.commonMistake}</div>`;
    html += `</div>`;
    return html;
  }

  html += `<div class="explain-title">Multiplication: ${d.a} × ${d.b}</div>`;
  html += `<div class="explain-steps">`;

  const hasDecA = String(d.a).includes(".");
  const hasDecB = String(d.b).includes(".");

  if (hasDecA || hasDecB) {
    // ── DECIMAL MULTIPLICATION ──────────────────────────────────────
    const strA = String(d.a), strB = String(d.b);
    const decA = hasDecA ? strA.split(".")[1].length : 0;
    const decB = hasDecB ? strB.split(".")[1].length : 0;
    const totalDec = decA + decB;
    const intA = Math.round(Number(d.a) * Math.pow(10, decA));
    const intB = Math.round(Number(d.b) * Math.pow(10, decB));
    const rawProduct = intA * intB;

    html += `<div class="step-intro">
      When multiplying decimals, we use a 3-step trick:<br>
      <strong>① Ignore the decimal points and multiply as whole numbers.</strong><br>
      <strong>② Count the total decimal places in both numbers.</strong><br>
      <strong>③ Put the decimal point back that many places from the right.</strong>
    </div>`;

    html += `<div class="step-block">
      <div class="step-num">Step 1</div>
      <div class="step-body">
        Ignore decimal points: ${d.a} becomes <strong>${intA}</strong>, ${d.b} becomes <strong>${intB}</strong>.<br>
        Now multiply: <strong>${intA} × ${intB} = ${rawProduct}</strong>.<br>
        ${intA < 10 && intB < 10 ? "(That's just a times table fact!)" : buildMultiplyStepsText(intA, intB)}
      </div>
    </div>`;

    html += `<div class="step-block">
      <div class="step-num">Step 2</div>
      <div class="step-body">
        Count decimal places in the original numbers:<br>
        • <strong>${d.a}</strong> has <strong>${decA}</strong> decimal place${decA !== 1 ? "s" : ""}
          ${decA > 0 ? `(the digits after the dot: ${strA.split(".")[1]})` : "(no decimal point)"}<br>
        • <strong>${d.b}</strong> has <strong>${decB}</strong> decimal place${decB !== 1 ? "s" : ""}
          ${decB > 0 ? `(the digits after the dot: ${strB.split(".")[1]})` : "(no decimal point)"}<br>
        Total decimal places: ${decA} + ${decB} = <strong>${totalDec}</strong>
      </div>
    </div>`;

    html += `<div class="step-block">
      <div class="step-num">Step 3</div>
      <div class="step-body">
        Take our product <strong>${rawProduct}</strong> and count <strong>${totalDec}</strong> place${totalDec !== 1 ? "s" : ""} from the right.<br>
        ${rawProduct} → put decimal ${totalDec} from right → <strong>${p.answer}</strong><br>
        <span class="step-note">Think of it this way: multiplying by 0.5 (half) makes things smaller, not bigger.
        So if your answer looks too big, you may have forgotten the decimal point!</span>
      </div>
    </div>`;

  } else {
    const a = Number(d.a), b = Number(d.b);

    // ── ZERO or ONE edge case ──────────────────────────────────────
    if (a === 0 || b === 0) {
      html += `<div class="step-intro">
        Any number multiplied by <strong>zero</strong> is always <strong>zero</strong>.<br>
        Why? Multiplication means "this many groups of that many things."<br>
        Zero groups of anything = nothing at all. So ${a} × ${b} = <strong>0</strong>.
      </div>`;
    } else if (a === 1 || b === 1) {
      const other = a === 1 ? b : a;
      html += `<div class="step-intro">
        Any number multiplied by <strong>1</strong> stays the same.<br>
        Why? One group of ${other} things is just ${other} things.<br>
        So ${a} × ${b} = <strong>${other}</strong>.
      </div>`;
    } else if (b < 10) {
      // ── MULTI-DIGIT × SINGLE DIGIT ────────────────────────────────
      html += buildMultiByOneDigit(a, b);
    } else if (a < 10) {
      html += buildMultiByOneDigit(b, a);
    } else {
      // ── MULTI-DIGIT × MULTI-DIGIT ─────────────────────────────────
      html += buildMultiByMultiDigit(a, b);
    }
  }

  html += `</div>`; // close explain-steps
  html += `<div class="explain-answer">Answer: <strong>${p.answer}</strong></div>`;
  if (p.commonMistake) html += `<div class="explain-mistake">⚠️ Common mistake: ${p.commonMistake}</div>`;
  html += `</div>`;
  return html;
}

function buildMultiByOneDigit(topNum, oneDigit) {
  // Walk through standard algorithm right-to-left with carry narration
  const digits = String(topNum).split("").reverse(); // ones first
  const placeNames = ["ones","tens","hundreds","thousands"];
  let html = "";
  let carry = 0;
  let resultDigits = [];

  html += `<div class="step-intro">
    We multiply <strong>${topNum} × ${oneDigit}</strong> one column at a time, right to left.<br>
    If any column gives us a number ≥ 10, we "carry" the tens digit to the next column.
  </div>`;

  digits.forEach((dStr, i) => {
    const d = parseInt(dStr);
    const place = placeNames[i] || `position ${i+1}`;
    const product = d * oneDigit + carry;
    const writeDigit = product % 10;
    const newCarry = Math.floor(product / 10);

    let body = `Multiply the <strong>${place}</strong> digit: <strong>${d} × ${oneDigit}</strong> = ${d * oneDigit}.`;
    if (carry > 0) body += ` Add the carry from last step: ${d * oneDigit} + ${carry} = <strong>${product}</strong>.`;
    body += `<br>Write down <strong>${writeDigit}</strong>`;
    if (newCarry > 0) {
      body += ` and carry <strong>${newCarry}</strong> to the next column.`;
    } else {
      body += `.`;
    }
    carry = newCarry;
    resultDigits.unshift(writeDigit);

    html += `<div class="step-block">
      <div class="step-num">Step ${i+1}</div>
      <div class="step-body">${body}</div>
    </div>`;
  });

  if (carry > 0) {
    resultDigits.unshift(carry);
    html += `<div class="step-block">
      <div class="step-num">Final carry</div>
      <div class="step-body">We still have a carry of <strong>${carry}</strong>. Write it at the front.</div>
    </div>`;
  }

  html += `<div class="step-result">Reading left to right: ${resultDigits.join("")} = <strong>${topNum * oneDigit}</strong></div>`;
  return html;
}

function buildMultiByMultiDigit(a, b) {
  // Two-pass: partial products with full narration
  const bDigits = String(b).split("").reverse();
  const placeValues = [1, 10, 100, 1000];
  const placeNames = ["ones","tens","hundreds","thousands"];
  let html = "";
  let partials = [];

  html += `<div class="step-intro">
    We multiply <strong>${a} × ${b}</strong> using <strong>partial products</strong>.<br>
    The idea: break ${b} into its place values, multiply each one by ${a}, then add them all up.<br>
    ${b} = ${bDigits.map((d,i) => parseInt(d) * placeValues[i]).filter(v=>v>0).reverse().join(" + ")}
  </div>`;

  bDigits.forEach((dStr, i) => {
    const digit = parseInt(dStr);
    if (digit === 0) return;
    const placeVal = placeValues[i];
    const partial = a * digit * placeVal;
    partials.push(partial);

    html += `<div class="step-block">
      <div class="step-num">Part ${partials.length}</div>
      <div class="step-body">
        Multiply by the <strong>${placeNames[i]}s digit</strong> of ${b}, which is <strong>${digit}</strong>.<br>
        ${a} × ${digit} = ${a * digit}.<br>
        But this digit is in the <strong>${placeNames[i]}s place</strong>, so it's really ${digit} × ${placeVal} = ${digit * placeVal}.<br>
        So: ${a} × ${digit * placeVal} = <strong>${partial}</strong>.
        ${i > 0 ? `<span class="step-note">Shortcut: write ${a * digit} then add ${i} zero${i>1?"s":""} to the right → ${partial}</span>` : ""}
      </div>
    </div>`;
  });

  html += `<div class="step-block">
    <div class="step-num">Add them up</div>
    <div class="step-body">
      Add all partial products:<br>
      ${partials.join(" + ")} = <strong>${a * b}</strong>
    </div>
  </div>`;

  html += buildAreaModel(a, b);
  return html;
}

function buildMultiplyStepsText(a, b) {
  if (b < 10) return `(${a} × ${b}: multiply each digit of ${a} by ${b}, right to left.)`;
  return `(Break it up: ${a} × ${Math.floor(b/10)*10} + ${a} × ${b%10} = ${a * Math.floor(b/10)*10} + ${a*(b%10)} = ${a*b})`;
}

// ── Generic step explainer for word problems / comparison / estimation ──
function buildGenericSteps(p) {
  let html = `<div class="explain-steps">`;
  html += `<div class="step-intro">Let's work through this step by step.</div>`;

  if (p.hint) {
    html += `<div class="step-block">
      <div class="step-num">Approach</div>
      <div class="step-body">${p.hint}</div>
    </div>`;
  }

  // Subtopic-specific elaboration
  if (p.subtopic === "A7" || p.subtopic === "A8") {
    html += `<div class="step-block">
      <div class="step-num">Key idea</div>
      <div class="step-body">
        To compare a fraction and a decimal, <strong>convert the fraction to a decimal first</strong>
        (divide top ÷ bottom), then compare the two decimal numbers.<br>
        Decimals are easy to compare: just line up the decimal points and look at each digit left to right.
      </div>
    </div>`;
  }
  if (p.subtopic === "A6") {
    html += `<div class="step-block">
      <div class="step-num">Key idea</div>
      <div class="step-body">
        To convert a decimal to a fraction:<br>
        • Count the decimal places (e.g., 0.75 has 2 decimal places)<br>
        • Write it over a power of 10 (0.75 = 75/100)<br>
        • Simplify: find the GCF of top and bottom and divide both by it<br>
        (75/100 ÷ 25/25 = 3/4)
      </div>
    </div>`;
  }
  if (p.subtopic === "C8") {
    html += `<div class="step-block">
      <div class="step-num">Key idea</div>
      <div class="step-body">
        Estimation means rounding to a friendly number first, then multiplying.<br>
        Round to the nearest 10: 48 → 50, 22 → 20.<br>
        Then: 50 × 20 = 1000. Much easier than the exact answer, and close enough!
      </div>
    </div>`;
  }
  if (p.subtopic === "B10" || p.subtopic === "C10") {
    html += `<div class="step-block">
      <div class="step-num">Key idea</div>
      <div class="step-body">
        Read the problem carefully and identify:<br>
        • What numbers are you working with?<br>
        • Are you sharing equally (division) or finding a total (multiplication)?<br>
        • Write out the equation, then solve step by step.
      </div>
    </div>`;
  }

  html += `</div>`;
  return html;
}

function buildLongDivisionSteps(dividend, divisor) {
  // Build a numbered plain-English step-by-step walkthrough
  const divStr = String(dividend).replace(".", "");
  const hasDecimalInDividend = String(dividend).includes(".");
  const divisorNum = Number(divisor);

  let steps = [];
  let current = 0;
  let quotientDigits = [];
  let addedDecimal = false;
  let maxIter = divStr.length + 4;

  for (let i = 0; i < maxIter; i++) {
    let broughtDown;
    if (i < divStr.length) {
      current = current * 10 + parseInt(divStr[i]);
      broughtDown = divStr[i];
    } else {
      if (current === 0) break;
      current = current * 10;
      broughtDown = "0";
      if (!addedDecimal) {
        quotientDigits.push(".");
        addedDecimal = true;
      }
    }

    const q = Math.floor(current / divisorNum);
    const product = q * divisorNum;
    const remainder = current - product;
    quotientDigits.push(String(q));
    steps.push({ i, current, broughtDown, q, product, remainder, addedDecimal: addedDecimal && i >= divStr.length });
    current = remainder;
    if (remainder === 0 && i >= divStr.length - 1) break;
  }

  const quotient = quotientDigits.join("");
  let html = `<div class="explain-steps">`;

  // Opening context
  html += `<div class="step-intro">We want to divide <strong>${dividend}</strong> by <strong>${divisor}</strong>.<br>
    We'll work through it one digit at a time, left to right.</div>`;

  steps.forEach((s, idx) => {
    const stepNum = idx + 1;
    let explanation = "";

    if (s.addedDecimal) {
      explanation += `<span class="step-note">⚠️ We've used all the digits of ${dividend} but still have a remainder of ${s.current / 10}.
        We write a <strong>decimal point</strong> in our answer and add a zero — now we have <strong>${s.current}</strong> to work with.</span><br>`;
    } else if (idx === 0 && s.current < divisorNum) {
      explanation += `<span class="step-note">The first digit (${s.broughtDown}) is smaller than ${divisor}, so ${divisor} doesn't fit yet.
        We look at the first TWO digits together: <strong>${s.current}</strong>.</span><br>`;
    }

    if (s.q === 0) {
      explanation += `<strong>① Divide:</strong> Does ${divisorNum} go into ${s.current}?
        No — ${s.current} is less than ${divisorNum}. So we write <strong>0</strong> in the answer.<br>`;
    } else {
      explanation += `<strong>① Divide:</strong> How many times does ${divisorNum} go into ${s.current}?
        <strong>${s.q} times</strong> (because ${divisorNum} × ${s.q} = ${s.product}, which fits inside ${s.current}).<br>`;
    }

    explanation += `<strong>② Multiply:</strong> ${divisorNum} × ${s.q} = <strong>${s.product}</strong>. Write ${s.product} below ${s.current}.<br>`;
    explanation += `<strong>③ Subtract:</strong> ${s.current} − ${s.product} = <strong>${s.remainder}</strong>. This is our remainder.<br>`;

    if (idx < steps.length - 1 && !steps[idx + 1].addedDecimal) {
      explanation += `<strong>④ Bring down:</strong> Pull down the next digit (<strong>${divStr[s.i + 1] || "0"}</strong>).
        Now we work with <strong>${steps[idx + 1].current}</strong>.<br>`;
    } else if (idx < steps.length - 1) {
      explanation += `<strong>④ Bring down:</strong> No more digits — add a <strong>decimal point</strong> and bring down a <strong>0</strong>. Now we have ${steps[idx+1].current}.<br>`;
    } else if (s.remainder === 0) {
      explanation += `<strong>✅ Done!</strong> Remainder is 0 — the division is exact.`;
    } else {
      explanation += `<strong>④ Remainder:</strong> We have ${s.remainder} left over. That's our final remainder.`;
    }

    html += `<div class="step-block">
      <div class="step-num">Step ${stepNum}</div>
      <div class="step-body">${explanation}</div>
    </div>`;
  });

  html += `<div class="step-result">📝 Reading the answer digits we wrote: <strong>${quotient}</strong></div>`;
  html += `</div>`;
  return html;
}

function buildAreaModel(a, b) {
  const aTens = Math.floor(a / 10) * 10, aOnes = a % 10;
  const bTens = Math.floor(b / 10) * 10, bOnes = b % 10;
  return `<div class="area-model">
    <table class="area-table">
      <tr>
        <th></th><th>${aTens}</th><th>${aOnes}</th>
      </tr>
      <tr>
        <th>${bTens}</th>
        <td class="area-cell">${aTens * bTens}</td>
        <td class="area-cell">${aOnes * bTens}</td>
      </tr>
      <tr>
        <th>${bOnes}</th>
        <td class="area-cell">${aTens * bOnes}</td>
        <td class="area-cell">${aOnes * bOnes}</td>
      </tr>
    </table>
    <div class="area-sum">Sum: ${aTens*bTens} + ${aOnes*bTens} + ${aTens*bOnes} + ${aOnes*bOnes} = ${a*b}</div>
  </div>`;
}

// ============================================================
// ANSWER CHECKER
// ============================================================
function checkAnswer(problem, userInput) {
  const raw = String(userInput).trim().toLowerCase();
  const correct = String(problem.answer).trim().toLowerCase();

  if (raw === correct) return true;

  // Check alternates
  for (const alt of (problem.answerAlt || [])) {
    if (raw === String(alt).trim().toLowerCase()) return true;
  }

  // Numeric equivalence for decimal answers
  const rNum = parseFloat(raw);
  const cNum = parseFloat(correct);
  if (!isNaN(rNum) && !isNaN(cNum) && Math.abs(rNum - cNum) < 0.0001) return true;

  // Repeating decimal: accept 0.33 or 0.333 for 0.333...
  if (correct.includes("...")) {
    const base = correct.replace("...", "");
    if (raw.startsWith(base.slice(0, -1))) return true;
    if (Math.abs(rNum - parseFloat(base)) < 0.01) return true;
  }

  // Remainder format: accept "24r1" and "24 r1" and "24 R1"
  if (correct.includes("R") || correct.includes("r")) {
    const normalize = s => s.replace(/\s+/g, "").replace(/r/i, "R");
    if (normalize(raw) === normalize(correct)) return true;
  }

  // Fraction: accept "1/2" and "1 / 2"
  if (correct.includes("/")) {
    if (raw.replace(/\s/g, "") === correct.replace(/\s/g, "")) return true;
  }

  return false;
}

// Expose everything
window.MathProblems = {
  TOPIC_A, TOPIC_B, TOPIC_C, ALL_PROBLEMS, DIAGNOSTIC_BANK,
  getProblemsBySubtopic,
  getProblemsByTopicAndDifficulty,
  generateFractionProblem,
  generateDivisionProblem,
  generateMultiplicationProblem,
  buildExplanation,
  checkAnswer,
};
