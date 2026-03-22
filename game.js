// ============================================================
// MATH QUEST RPG — Game Engine
// ============================================================
(function() {
'use strict';

const { checkAnswer, buildExplanation, DIAGNOSTIC_BANK, ALL_PROBLEMS,
        getProblemsBySubtopic, generateFractionProblem,
        generateDivisionProblem, generateMultiplicationProblem } = window.MathProblems;

// ── Constants ─────────────────────────────────────────────
const SAVE_KEY = 'mathQuestSave';

const XP_THRESHOLDS = [0,500,1200,2200,3500,5200,7200,9500,12500,16000,20000];

const DUNGEON_DEFS = [
  { id:1,  name:"Fraction Forest",     icon:"🌲", topic:"A", subtopics:["A1"],        difficulty:1, boss:false, isMiniTest:false },
  { id:2,  name:"Decimal Desert",      icon:"🏜️", topic:"A", subtopics:["A2","A6"],   difficulty:1, boss:false, isMiniTest:false },
  { id:3,  name:"Conversion Cavern",   icon:"🕳️", topic:"A", subtopics:["A3","A4","A5"], difficulty:2, boss:true,  isMiniTest:false },
  { id:"mt1", name:"MINI-TEST I",      icon:"📋", topic:null, subtopics:[],           difficulty:0, boss:false, isMiniTest:true,  miniTestTopics:["A1","A2","A3"] },
  { id:4,  name:"Division Dungeon",    icon:"⚙️", topic:"B", subtopics:["B1","B2"],   difficulty:1, boss:false, isMiniTest:false },
  { id:5,  name:"Decimal Division Den",icon:"🔢", topic:"B", subtopics:["B3","B4","B5"],difficulty:2,boss:false, isMiniTest:false },
  { id:6,  name:"Division Boss Tower", icon:"🗼", topic:"B", subtopics:["B6","B7","B8"],difficulty:2,boss:true,  isMiniTest:false },
  { id:"mt2", name:"MINI-TEST II",     icon:"📋", topic:null, subtopics:[],           difficulty:0, boss:false, isMiniTest:true,  miniTestTopics:["B1","B3","B5"] },
  { id:7,  name:"Multiply Marsh",      icon:"🌿", topic:"C", subtopics:["C1","C2","C3"],difficulty:1,boss:false, isMiniTest:false },
  { id:8,  name:"Carry Kingdom",       icon:"👑", topic:"C", subtopics:["C4","C5"],   difficulty:2, boss:false, isMiniTest:false },
  { id:9,  name:"Decimal Multiply",    icon:"💧", topic:"C", subtopics:["C6","C7","C8"],difficulty:2,boss:true,  isMiniTest:false },
  { id:"mt3", name:"MINI-TEST III",    icon:"📋", topic:null, subtopics:[],           difficulty:0, boss:false, isMiniTest:true,  miniTestTopics:["C1","C4","C7"] },
  { id:10, name:"Grand Gauntlet",      icon:"🏰", topic:null, subtopics:["A1","B1","C1","A3","B5","C4"], difficulty:3, boss:true, isMiniTest:false },
];

// Enemy designs per dungeon
const ENEMY_DESIGNS = {
  1:  { name:"Fraction Sprite",    color:"#5b8dee", emoji:"🧚" },
  2:  { name:"Decimal Djinn",      color:"#e8a838", emoji:"🌀" },
  3:  { name:"Repeating Dragon",   color:"#e84040", emoji:"🐉" },
  4:  { name:"Long Divide Lich",   color:"#7040c0", emoji:"💀" },
  5:  { name:"Zero-Slot Zombie",   color:"#406040", emoji:"🧟" },
  6:  { name:"Grand Divide Golem", color:"#c04040", emoji:"🪨" },
  7:  { name:"Two-Digit Troll",    color:"#408040", emoji:"👹" },
  8:  { name:"Carry Count",        color:"#4080c0", emoji:"🔢" },
  9:  { name:"Decimal Drake",      color:"#8040c0", emoji:"🦎" },
  10: { name:"FINAL BOSS",         color:"#c00000", emoji:"👾" },
};

const ACHIEVEMENTS_DEF = [
  { id:"first_blood",      name:"First Blood",     icon:"⚔️",  desc:"Defeat your first enemy" },
  { id:"flawless_1",       name:"Flawless",        icon:"🛡️",  desc:"Complete a dungeon without taking damage" },
  { id:"speed_solver",     name:"Speed Solver",    icon:"⚡",   desc:"Answer 5 problems in under 30 seconds" },
  { id:"comeback_kid",     name:"Comeback Kid",    icon:"💪",   desc:"Win a boss fight with <20 HP" },
  { id:"division_master",  name:"Division Master", icon:"➗",   desc:"50 correct division answers" },
  { id:"decimal_wizard",   name:"Decimal Wizard",  icon:"🧙",   desc:"Complete all fraction/decimal dungeons" },
  { id:"grand_champion",   name:"Grand Champion",  icon:"🏆",   desc:"Complete the Grand Gauntlet (Level 10)" },
  { id:"perfect_run",      name:"Perfect Run",     icon:"✨",   desc:"100% accuracy in a dungeon" },
  { id:"mini_ace",         name:"Mini-Test Ace",   icon:"📋",   desc:"Score 100% on a mini-test" },
  { id:"streak_3",         name:"On Fire",         icon:"🔥",   desc:"3-day login streak" },
  { id:"streak_7",         name:"Week Warrior",    icon:"📅",   desc:"7-day login streak" },
  { id:"problem_50",       name:"Problem Solver",  icon:"🔢",   desc:"Solve 50 problems total" },
  { id:"problem_100",      name:"Century Club",    icon:"💯",   desc:"Solve 100 problems total" },
  { id:"problem_200",      name:"Math Machine",    icon:"🤖",   desc:"Solve 200 problems total" },
  { id:"no_hints",         name:"No Help Needed",  icon:"🎯",   desc:"Complete a dungeon without using any hints" },
  { id:"gold_100",         name:"Treasure Hunter", icon:"🪙",   desc:"Accumulate 100 gold" },
  { id:"level_5",          name:"Veteran",         icon:"🎖️",   desc:"Reach hero level 5" },
  { id:"level_10",         name:"Legend",          icon:"👑",   desc:"Reach hero level 10" },
  { id:"fraction_all",     name:"Fraction Fanatic",icon:"½",    desc:"Complete all fraction subtopic drills" },
  { id:"diagnostic_done",  name:"Assessed",        icon:"📊",   desc:"Complete the diagnostic quiz" },
];

// ── State ─────────────────────────────────────────────────
let G = null; // game save state

function defaultSave(playerName) {
  return {
    version: 3,
    playerName: playerName || "HERO",
    heroLevel: 1,
    heroXP: 0,
    heroMaxXP: 500,
    gold: 0,
    hp: 200,
    maxHp: 200,
    spells: { hint: 3, skip: 1, potion: 0 },
    diagnosticDone: false,
    topicOrder: ["A","B","C"],
    dungeonsCompleted: [],
    dungeonsUnlocked: [1],
    subtopicScores: {},      // { "A1": { correct:0, attempts:0 } }
    achievements: [],
    streak: { current: 0, best: 0, lastDate: null },
    totalProblemsCorrect: 0,
    totalProblemsAttempted: 0,
    dungeonStars: {},        // { dungeonId: 1|2|3 }
  };
}

function saveGame() {
  if (G) localStorage.setItem(SAVE_KEY, JSON.stringify(G));
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(_) {}
  return null;
}

// ── Battle State ──────────────────────────────────────────
let BS = {
  dungeon: null,
  problems: [],        // all problems for this run
  currentIdx: 0,
  enemyIdx: 0,         // which enemy (0–7 regular, 8 = boss)
  enemyHp: 0,
  enemyMaxHp: 0,
  heroHpAtStart: 200,
  wrongCount: 0,
  correctCount: 0,
  totalCount: 0,
  hintUsed: false,
  hintsThisDungeon: 0,
  skipsThisDungeon: 0,
  tookDamage: false,
  isBoss: false,
  bossHitsLeft: 3,
  bossHitsNeeded: 3,
  pendingProblem: null, // the problem we show after explanation
  speedTracker: [],    // timestamps of last 5 correct answers
};

// ── Diagnostic State ──────────────────────────────────────
let DS = {
  questions: [],
  current: 0,
  scores: { A: 0, B: 0, C: 0 },
};

// ── Mini-Test State ───────────────────────────────────────
let MT = {
  questions: [],
  current: 0,
  correct: 0,
  subtopicHits: {},
  subtopicTotal: {},
  timerInterval: null,
  timeLeft: 90,
  dungeonId: null,
};

// ── Drill State ───────────────────────────────────────────
let DR = {
  topic: null,
  current: null,
  streak: 0,
};

// ═════════════════════════════════════════════════════════════
// SCREEN MANAGER
// ═════════════════════════════════════════════════════════════
const screens = {
  name:         document.getElementById('screen-name'),
  title:        document.getElementById('screen-title'),
  diagnostic:   document.getElementById('screen-diagnostic'),
  map:          document.getElementById('screen-map'),
  shop:         document.getElementById('screen-shop'),
  battle:       document.getElementById('screen-battle'),
  explain:      document.getElementById('screen-explain'),
  levelclear:   document.getElementById('screen-levelclear'),
  minitest:     document.getElementById('screen-minitest'),
  gameover:     document.getElementById('screen-gameover'),
  achievements: document.getElementById('screen-achievements'),
  drill:        document.getElementById('screen-drill'),
};
const hudBar = document.getElementById('hud-bar');

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  if (screens[name]) screens[name].classList.add('active');

  const showHud = ['battle','minitest','explain'].includes(name);
  hudBar.classList.toggle('hidden', !showHud);
  if (showHud) updateHUD();
}

// ═════════════════════════════════════════════════════════════
// HUD
// ═════════════════════════════════════════════════════════════
function updateHUD() {
  if (!G) return;
  el('hud-level').textContent   = G.heroLevel;
  el('hud-hp').textContent      = G.hp;
  el('hud-maxhp').textContent   = G.maxHp;
  el('hud-gold').textContent    = G.gold;
  el('hud-xp').textContent      = G.heroXP;
  el('hud-xpmax').textContent   = G.heroMaxXP;
  el('hud-potions').textContent = G.spells.potion;
  el('hud-hints').textContent   = G.spells.hint;
  el('hud-skips').textContent   = G.spells.skip;
}

// ═════════════════════════════════════════════════════════════
// INIT
// ═════════════════════════════════════════════════════════════
function init() {
  bindAllButtons();

  const saved = loadGame();
  if (saved) {
    G = saved;
    updateStreak();
    showScreen('title');
    updateTitleScreen();
  } else {
    showScreen('name');
  }
}

function updateTitleScreen() {
  if (!G) return;
  // Show CONTINUE whenever a save exists — the handler already routes correctly
  // (no diagnostic done → starts diagnostic, diagnostic done → shows map)
  el('continue-btn').style.display = '';
  el('continue-btn').textContent = G.diagnosticDone ? '▶ CONTINUE' : '▶ START ADVENTURE';

  if (G.streak.current >= 2) {
    el('streak-display').classList.remove('hidden');
    el('streak-count').textContent = G.streak.current;
  }

  // Daily login XP
  const today = new Date().toDateString();
  if (G._lastLoginXP !== today) {
    G._lastLoginXP = today;
    addXP(25);
    saveGame();
    toast('🌅 Daily login bonus: +25 XP!');
  }
}

function updateStreak() {
  if (!G) return;
  const today = new Date().toDateString();
  if (G.streak.lastDate === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (G.streak.lastDate === yesterday.toDateString()) {
    G.streak.current++;
  } else if (G.streak.lastDate !== today) {
    G.streak.current = 1;
  }

  G.streak.best = Math.max(G.streak.best, G.streak.current);
  G.streak.lastDate = today;

  if (G.streak.current >= 3) checkAchievement('streak_3');
  if (G.streak.current >= 7) checkAchievement('streak_7');
}

// ═════════════════════════════════════════════════════════════
// DIAGNOSTIC QUIZ
// ═════════════════════════════════════════════════════════════
function startDiagnostic() {
  DS.questions = [
    ...DIAGNOSTIC_BANK.A,
    ...DIAGNOSTIC_BANK.B,
    ...DIAGNOSTIC_BANK.C,
  ].filter(Boolean);
  DS.current = 0;
  DS.scores = { A:0, B:0, C:0 };
  showScreen('diagnostic');
  showDiagnosticQuestion();
}

function showDiagnosticQuestion() {
  const q = DS.questions[DS.current];
  if (!q) { finishDiagnostic(); return; }

  const pct = Math.round((DS.current / DS.questions.length) * 100);
  el('diag-progress').style.width = pct + '%';
  el('diag-progress-text').textContent = `${DS.current} / ${DS.questions.length}`;

  const topicNames = { A:"FRACTIONS & DECIMALS", B:"LONG DIVISION", C:"MULTIPLICATION" };
  el('diag-topic-label').textContent = 'TOPIC: ' + (topicNames[q.topic] || q.topic);

  renderQuestion(q, 'diag-question', 'diag-mc-choices', 'diag-answer-row', 'diag-answer-input');
  el('diag-feedback').textContent = '';
  el('diag-hint').style.display = 'none';
}

function submitDiagnosticAnswer(userInput) {
  const q = DS.questions[DS.current];
  const correct = checkAnswer(q, userInput);

  if (correct) {
    DS.scores[q.topic]++;
    el('diag-feedback').textContent = '✅ Correct!';
    el('diag-feedback').style.color = 'var(--green)';
  } else {
    el('diag-feedback').textContent = `❌ Answer: ${q.answer}`;
    el('diag-feedback').style.color = 'var(--red)';
  }

  setTimeout(() => {
    DS.current++;
    showDiagnosticQuestion();
  }, 900);
}

function finishDiagnostic() {
  G.diagnosticDone = true;
  checkAchievement('diagnostic_done');

  // Order topics weakest first
  const order = ['A','B','C'].sort((a,b) => DS.scores[a] - DS.scores[b]);
  G.topicOrder = order;

  // Reorder dungeons
  reorderDungeonsByTopic(order);

  // Unlock first dungeon
  if (G.dungeonsUnlocked.length === 0) G.dungeonsUnlocked.push(DUNGEON_DEFS[0].id);
  saveGame();

  toast(`Weakest topic: ${topicName(order[0])} — starting there!`);
  setTimeout(() => showMap(), 1200);
}

function reorderDungeonsByTopic(order) {
  // Topic order just controls which topic zone appears first
  // (Dungeon IDs are static — we remap the topicOrder into the DUNGEON_DEFS display order)
  // For simplicity, we store topicOrder and the map renders dungeon groups in that order.
  // No structural change needed as dungeons are already grouped.
}

// ═════════════════════════════════════════════════════════════
// WORLD MAP
// ═════════════════════════════════════════════════════════════
function showMap() {
  showScreen('map');
  el('map-hero-name').textContent = G.playerName;
  el('map-level').textContent     = G.heroLevel;
  el('map-hp').textContent        = G.hp;
  el('map-gold').textContent      = G.gold;
  el('map-xp').textContent        = G.heroXP;

  const pct = Math.round((G.heroXP / G.heroMaxXP) * 100);
  el('map-xp-fill').style.width = pct + '%';
  el('map-xp-cur').textContent  = G.heroXP;
  el('map-xp-max').textContent  = G.heroMaxXP;
  el('map-xp-text').textContent = pct + '%';

  renderDungeonGrid();
}

function renderDungeonGrid() {
  const grid = el('dungeon-grid');
  grid.innerHTML = '';

  DUNGEON_DEFS.forEach(d => {
    const card = document.createElement('div');
    card.className = 'dungeon-card';

    const completed = G.dungeonsCompleted.includes(d.id);
    const unlocked  = G.dungeonsUnlocked.includes(d.id);
    const locked    = !unlocked;

    if (locked) card.classList.add('locked');
    if (completed) card.classList.add('completed');
    if (d.boss && !d.isMiniTest) card.classList.add('boss-level');
    if (d.isMiniTest) card.classList.add('mini-test-card');

    const stars = G.dungeonStars[d.id] || 0;
    const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

    card.innerHTML = `
      <div class="dungeon-icon">${d.icon}</div>
      <div class="dungeon-name">${d.name}</div>
      <div class="dungeon-level">${d.isMiniTest ? 'QUIZ' : `LV${d.id}`} ${completed ? '✅' : ''}</div>
      <div class="dungeon-stars">${completed ? starStr : ''}</div>
      ${locked ? '<div class="lock-overlay">🔒</div>' : ''}
    `;

    if (!locked) {
      card.addEventListener('click', () => enterDungeon(d));
    }

    grid.appendChild(card);
  });
}

function enterDungeon(dungeon) {
  if (dungeon.isMiniTest) {
    startMiniTest(dungeon);
    return;
  }
  if (dungeon.boss) {
    showShop(dungeon);
  } else {
    startBattle(dungeon);
  }
}

// ═════════════════════════════════════════════════════════════
// SHOP
// ═════════════════════════════════════════════════════════════
function showShop(dungeon) {
  BS.dungeon = dungeon;
  showScreen('shop');
  el('shop-gold-display').textContent = G.gold;
  el('buy-potion-btn').disabled = G.gold < 30;
  el('buy-hint-btn').disabled   = G.gold < 20;
  el('buy-skip-btn').disabled   = G.gold < 50;
}

function buyItem(item, cost) {
  if (G.gold < cost) { toast('Not enough gold!'); return; }
  G.gold -= cost;
  if (item === 'potion') G.spells.potion++;
  if (item === 'hint')   G.spells.hint += 3;
  if (item === 'skip')   G.spells.skip++;
  saveGame();
  el('shop-gold-display').textContent = G.gold;
  el('buy-potion-btn').disabled = G.gold < 30;
  el('buy-hint-btn').disabled   = G.gold < 20;
  el('buy-skip-btn').disabled   = G.gold < 50;
  toast(`Bought ${item}!`);
}

// ═════════════════════════════════════════════════════════════
// BATTLE
// ═════════════════════════════════════════════════════════════
const ENEMIES_PER_DUNGEON = 8; // regular + 1 boss = 9 total

function startBattle(dungeon) {
  BS.dungeon      = dungeon;
  BS.enemyIdx     = 0;
  BS.wrongCount   = 0;
  BS.correctCount = 0;
  BS.totalCount   = 0;
  BS.hintUsed     = false;
  BS.hintsThisDungeon  = 0;
  BS.skipsThisDungeon  = 0;
  BS.tookDamage   = false;
  BS.pendingProblem = null;
  BS.speedTracker = [];
  BS.isBoss       = false;

  // Build problem pool from dungeon's subtopics
  let pool = [];
  (dungeon.subtopics || []).forEach(st => {
    pool = pool.concat(getProblemsBySubtopic(st));
  });
  if (pool.length === 0) pool = ALL_PROBLEMS.filter(p => p.topic === dungeon.topic);
  pool = shuffle(pool);
  // We need at least (ENEMIES_PER_DUNGEON + boss×3) problems
  while (pool.length < 20) pool = pool.concat(pool);
  BS.problems = pool;
  BS.currentIdx = 0;

  showScreen('battle');
  spawnEnemy(false);
  showNextProblem();
}

function spawnEnemy(isBoss) {
  BS.isBoss = isBoss;
  const dunId = typeof BS.dungeon.id === 'number' ? BS.dungeon.id : 10;
  const design = ENEMY_DESIGNS[dunId] || { name:"Monster", color:"#c03030", emoji:"👾" };

  if (isBoss) {
    BS.enemyMaxHp = 120;
    BS.bossHitsLeft = 3;
    BS.bossHitsNeeded = 3;
  } else {
    BS.enemyMaxHp = 60 + Math.floor(Math.random() * 30);
    BS.bossHitsLeft = 1;
  }
  BS.enemyHp = BS.enemyMaxHp;

  el('enemy-name-display').textContent = isBoss ? `👾 BOSS: ${design.name}` : design.name;
  updateEnemyHpBar();
  updateBattleWave();

  // Tint enemy sprite
  const svg = document.getElementById('enemy-sprite');
  if (svg) {
    svg.querySelectorAll('ellipse, rect, circle').forEach(el_ => {
      if (el_.getAttribute('fill') === '#c03030') el_.setAttribute('fill', design.color);
    });
    if (svg.parentElement) {
      svg.parentElement.querySelector('.fighter-name') &&
        (svg.parentElement.querySelector('.fighter-name').textContent =
          isBoss ? `👾 BOSS: ${design.name}` : design.emoji + " " + design.name);
    }
  }
}

function showNextProblem() {
  if (BS.currentIdx >= BS.problems.length) {
    BS.currentIdx = 0; // cycle
  }
  const p = BS.problems[BS.currentIdx];
  BS.pendingProblem = p;
  renderBattleProblem(p);
}

function renderBattleProblem(p) {
  const topicNames = { A:"FRACTIONS & DECIMALS", B:"LONG DIVISION", C:"MULTIPLICATION" };
  el('battle-topic-badge').textContent = topicNames[p.topic] || p.topic;

  renderQuestion(p, 'battle-question', 'battle-mc-choices', 'battle-answer-row', 'battle-answer-input');

  el('battle-hint-box').style.display = 'none';
  el('battle-hint-box').textContent = '';

  el('hint-count').textContent   = G.spells.hint;
  el('potion-count').textContent = G.spells.potion;
  el('skip-count').textContent   = G.spells.skip;

  el('use-skip-btn').disabled = G.spells.skip <= 0 || BS.skipsThisDungeon >= 1;

  if (BS.isBoss) {
    el('battle-wave').textContent =
      `BOSS BATTLE — Hit ${BS.bossHitsNeeded - BS.bossHitsLeft + 1} / ${BS.bossHitsNeeded}`;
  }
}

function submitBattleAnswer(userInput) {
  const p = BS.pendingProblem;
  if (!p) return;

  const correct = checkAnswer(p, userInput);
  BS.totalCount++;
  G.totalProblemsAttempted++;

  recordSubtopicAttempt(p.subtopic, correct);

  if (correct) {
    G.totalProblemsCorrect++;
    BS.correctCount++;
    BS.speedTracker.push(Date.now());
    checkSpeedAchievement();
    checkAchievement('first_blood');
    if (p.topic === 'B') checkDivisionMaster();
    if (G.totalProblemsCorrect >= 50)  checkAchievement('problem_50');
    if (G.totalProblemsCorrect >= 100) checkAchievement('problem_100');
    if (G.totalProblemsCorrect >= 200) checkAchievement('problem_200');

    animateHeroAttack();
    const dmg = 30 + Math.floor(Math.random() * 15);
    damageEnemy(dmg);

    el('battle-answer-input').classList.add('correct-flash');
    setTimeout(() => el('battle-answer-input').classList.remove('correct-flash'), 500);
    el('battle-answer-input').value = '';
  } else {
    BS.wrongCount++;
    BS.tookDamage = true;
    animateEnemyAttack();
    const dmg = 15 + Math.floor(Math.random() * 10);
    damageHero(dmg);

    shakeScreen();
    el('battle-answer-input').classList.add('shake');
    setTimeout(() => el('battle-answer-input').classList.remove('shake'), 450);

    // Show explanation
    setTimeout(() => showExplanation(p), 500);
    return;
  }

  // Check enemy dead
  if (BS.enemyHp <= 0) {
    enemyDefeated();
  } else {
    BS.currentIdx++;
    setTimeout(showNextProblem, 300);
  }
  saveGame();
}

function damageEnemy(amount) {
  BS.enemyHp = Math.max(0, BS.enemyHp - amount);
  updateEnemyHpBar();
  spawnDamageFloater(amount, false);

  if (BS.isBoss) {
    BS.bossHitsLeft--;
    if (BS.bossHitsLeft <= 0 || BS.enemyHp <= 0) {
      BS.enemyHp = 0;
    }
  }
}

function damageHero(amount) {
  G.hp = Math.max(0, G.hp - amount);
  updateHeroHpBar();
  spawnDamageFloater(amount, true);
  updateHUD();

  if (G.hp <= 0) {
    setTimeout(showGameOver, 600);
  }
}

function enemyDefeated() {
  G.gold += 10;
  addXP(15);

  if (BS.isBoss) {
    checkAchievement('comeback_kid', () => G.hp < 20);
    addXP(35); // bonus XP for boss
    dungeonComplete();
    return;
  }

  BS.enemyIdx++;
  if (BS.enemyIdx >= ENEMIES_PER_DUNGEON) {
    // All regular enemies done → spawn boss
    spawnEnemy(true);
    // Use harder problems for boss
    BS.problems = shuffle(ALL_PROBLEMS.filter(p =>
      BS.dungeon.subtopics.includes(p.subtopic) && p.difficulty >= 2
    ));
    if (BS.problems.length < 10) BS.problems = shuffle(ALL_PROBLEMS.filter(p => p.topic === BS.dungeon.topic));
    BS.currentIdx = 0;
    toast('⚠️ BOSS INCOMING!');
    setTimeout(showNextProblem, 600);
    return;
  }

  // Next regular enemy
  spawnEnemy(false);
  BS.currentIdx++;
  setTimeout(showNextProblem, 400);
  saveGame();
}

function dungeonComplete() {
  const accuracy = BS.totalCount > 0 ? Math.round((BS.correctCount / BS.totalCount) * 100) : 0;
  const xpEarned = 15 * BS.correctCount + 50 + (BS.tookDamage ? 0 : 30);
  const goldEarned = 10 * (BS.enemyIdx + 1);

  if (!G.dungeonsCompleted.includes(BS.dungeon.id)) {
    G.dungeonsCompleted.push(BS.dungeon.id);
  }

  // Stars
  let stars = 1;
  if (accuracy >= 70) stars = 2;
  if (!BS.tookDamage && accuracy === 100) stars = 3;
  G.dungeonStars[BS.dungeon.id] = Math.max(G.dungeonStars[BS.dungeon.id] || 0, stars);

  // Unlock next dungeon
  unlockNextDungeon(BS.dungeon.id);

  // Achievements
  if (!BS.tookDamage) checkAchievement('flawless_1');
  if (accuracy === 100) checkAchievement('perfect_run');
  if (BS.hintsThisDungeon === 0) checkAchievement('no_hints');
  if (BS.dungeon.topic === 'A') checkDecimalWizard();
  if (BS.dungeon.id === 10) checkAchievement('grand_champion');

  addXP(xpEarned);
  G.gold += goldEarned;
  saveGame();

  // Show level clear screen
  el('clear-dungeon-name').textContent = BS.dungeon.name;
  el('clear-xp').textContent    = '+' + xpEarned;
  el('clear-gold').textContent  = '+' + goldEarned;
  el('clear-accuracy').textContent = accuracy + '%';

  const bonusStat = el('clear-bonus-stat');
  bonusStat.style.display = (!BS.tookDamage) ? '' : 'none';

  spawnConfetti();
  showScreen('levelclear');
}

function unlockNextDungeon(currentId) {
  const idx = DUNGEON_DEFS.findIndex(d => d.id === currentId);
  if (idx >= 0 && idx + 1 < DUNGEON_DEFS.length) {
    const nextId = DUNGEON_DEFS[idx + 1].id;
    if (!G.dungeonsUnlocked.includes(nextId)) {
      G.dungeonsUnlocked.push(nextId);
    }
  }
}

// ═════════════════════════════════════════════════════════════
// EXPLANATION SCREEN
// ═════════════════════════════════════════════════════════════
function showExplanation(problem) {
  const html = buildExplanation(problem);
  el('explain-content').innerHTML = html;
  el('explain-more-content').style.display = 'none';
  el('explain-more-content').innerHTML = buildMoreExplanation(problem);
  showScreen('explain');
}

function buildMoreExplanation(p) {
  const analogies = {
    A: `<p style="font-size:14px;color:var(--white);">
      <strong>Think of it this way:</strong><br>
      A fraction tells you how many pieces out of a whole.<br>
      A decimal is the same thing written with a decimal point.<br><br>
      🍕 If you have 3/4 of a pizza, you have 0.75 of a pizza.<br>
      They mean <em>exactly</em> the same amount — just written differently!<br><br>
      <strong>Rule:</strong> Divide the top (numerator) by the bottom (denominator).<br>
      Always. Every time. No exceptions.
    </p>`,
    B: `<p style="font-size:14px;color:var(--white);">
      <strong>Long division — the D-M-S-B dance:</strong><br>
      <strong>D</strong>ivide → how many times does the divisor fit?<br>
      <strong>M</strong>ultiply → divisor × that number<br>
      <strong>S</strong>ubtract → take it away<br>
      <strong>B</strong>ring down → bring the next digit<br><br>
      Repeat until done. If you get a remainder and want a decimal,
      add a decimal point and bring down a 0.<br><br>
      ⚠️ Don't skip the 0 in the quotient when a digit doesn't divide evenly!
    </p>`,
    C: `<p style="font-size:14px;color:var(--white);">
      <strong>Multiplication = repeated addition, done fast.</strong><br><br>
      Break big numbers apart:<br>
      23 × 14 = (20 + 3) × (10 + 4)<br>
      = (20×10) + (20×4) + (3×10) + (3×4)<br>
      = 200 + 80 + 30 + 12 = 322<br><br>
      This is the <em>area model</em> — imagine a rectangle 23 wide × 14 tall.
      The area is the answer!<br><br>
      For decimals: ignore the point, multiply, then count decimal places.
    </p>`,
  };
  return analogies[p.topic] || '';
}

// ═════════════════════════════════════════════════════════════
// MINI-TEST
// ═════════════════════════════════════════════════════════════
function startMiniTest(dungeon) {
  clearInterval(MT.timerInterval);
  MT.dungeonId   = dungeon.id;
  MT.current     = 0;
  MT.correct     = 0;
  MT.subtopicHits  = {};
  MT.subtopicTotal = {};
  MT.timeLeft    = 90;

  // Pull problems from the mini-test's topic areas
  const topics = dungeon.miniTestTopics || ["A1","B1","C1"];
  let pool = [];
  topics.forEach(st => {
    const probs = getProblemsBySubtopic(st);
    pool = pool.concat(probs);
  });
  pool = shuffle(pool).slice(0, 10);
  while (pool.length < 10) pool = pool.concat(shuffle(pool));
  pool = pool.slice(0, 10);
  MT.questions = pool;

  showScreen('minitest');
  el('minitest-results').classList.add('hidden');
  el('minitest-answer-row').style.display = '';

  startMiniTestTimer();
  showMiniTestQuestion();
}

function startMiniTestTimer() {
  el('minitest-timer').textContent = formatTime(MT.timeLeft);
  MT.timerInterval = setInterval(() => {
    MT.timeLeft--;
    el('minitest-timer').textContent = formatTime(MT.timeLeft);
    el('minitest-timer').classList.toggle('urgent', MT.timeLeft <= 15);
    if (MT.timeLeft <= 0) {
      clearInterval(MT.timerInterval);
      finishMiniTest();
    }
  }, 1000);
}

function showMiniTestQuestion() {
  const q = MT.questions[MT.current];
  if (!q) { finishMiniTest(); return; }

  const pct = Math.round((MT.current / MT.questions.length) * 100);
  el('minitest-progress').style.width = pct + '%';
  el('minitest-progress-text').textContent = `${MT.current} / ${MT.questions.length}`;

  renderQuestion(q, 'minitest-question', 'minitest-mc-choices', 'minitest-answer-row', 'minitest-answer-input');
  el('minitest-feedback').textContent = '';
}

function submitMiniTestAnswer(userInput) {
  const q = MT.questions[MT.current];
  const correct = checkAnswer(q, userInput);

  MT.subtopicTotal[q.subtopic] = (MT.subtopicTotal[q.subtopic] || 0) + 1;
  if (correct) {
    MT.correct++;
    MT.subtopicHits[q.subtopic] = (MT.subtopicHits[q.subtopic] || 0) + 1;
    el('minitest-feedback').textContent = '✅ Correct!';
    el('minitest-feedback').style.color = 'var(--green)';
    G.totalProblemsCorrect++;
  } else {
    el('minitest-feedback').textContent = `❌ Answer: ${q.answer}`;
    el('minitest-feedback').style.color = 'var(--red)';
  }
  G.totalProblemsAttempted++;

  setTimeout(() => {
    MT.current++;
    showMiniTestQuestion();
  }, 700);
}

function finishMiniTest() {
  clearInterval(MT.timerInterval);
  const score = MT.correct;
  const total = MT.questions.length;
  const pct   = Math.round((score / total) * 100);
  const passed = pct >= 60;

  if (score === total) checkAchievement('mini_ace');
  addXP(passed ? 50 + (score === total ? 50 : 0) : 10);
  saveGame();

  el('minitest-score-text').textContent = `${score} / ${total}`;
  el('minitest-pass-fail').textContent  = passed
    ? `✅ PASSED! (${pct}%) — Next zone unlocked!`
    : `❌ FAILED (${pct}%) — Need 60% to continue. Try again!`;
  el('minitest-pass-fail').style.color  = passed ? 'var(--green)' : 'var(--red)';

  if (passed && !G.dungeonsCompleted.includes(MT.dungeonId)) {
    G.dungeonsCompleted.push(MT.dungeonId);
    unlockNextDungeon(MT.dungeonId);
    saveGame();
  }

  // Breakdown
  const bdEl = el('minitest-breakdown');
  bdEl.innerHTML = '';
  Object.keys(MT.subtopicTotal).forEach(st => {
    const h = MT.subtopicHits[st] || 0;
    const t = MT.subtopicTotal[st];
    const p = Math.round((h / t) * 100);
    bdEl.innerHTML += `
      <div class="subtopic-row">
        <div class="subtopic-label">${st}</div>
        <div class="subtopic-bar-wrap"><div class="subtopic-bar-fill" style="width:${p}%"></div></div>
        <div class="subtopic-pct">${p}%</div>
      </div>`;
  });

  el('minitest-progress').style.width = '100%';
  el('minitest-progress-text').textContent = `${total} / ${total}`;
  el('minitest-results').classList.remove('hidden');
  el('minitest-answer-row').style.display = 'none';
  document.getElementById('minitest-mc-choices').classList.add('hidden');
}

// ═════════════════════════════════════════════════════════════
// FREE DRILL
// ═════════════════════════════════════════════════════════════
function startDrill(topic) {
  DR.topic   = topic;
  DR.streak  = 0;
  DR.current = getNextDrillProblem(topic);

  el('drill-topic-badge').textContent = { A:"FRACTIONS", B:"DIVISION", C:"MULTIPLY" }[topic];
  el('drill-next-btn').style.display  = 'none';
  el('drill-feedback').textContent    = '';
  el('drill-explain-panel').classList.add('hidden');
  el('drill-explain-panel').innerHTML = '';
  el('drill-streak').textContent      = 0;

  renderQuestion(DR.current, 'drill-question', 'drill-mc-choices', 'drill-answer-row', 'drill-answer-input');
  el('drill-answer-row').style.display = '';
}

function getNextDrillProblem(topic) {
  if (topic === 'A') return generateFractionProblem();
  if (topic === 'B') return generateDivisionProblem();
  if (topic === 'C') return generateMultiplicationProblem();
  return generateFractionProblem();
}

function submitDrillAnswer(userInput) {
  const p = DR.current;
  const correct = checkAnswer(p, userInput);

  G.totalProblemsAttempted++;
  if (correct) {
    G.totalProblemsCorrect++;
    DR.streak++;
    addXP(5);
    el('drill-feedback').textContent = '✅ Correct! +5 XP';
    el('drill-feedback').style.color = 'var(--green)';
    el('drill-explain-panel').classList.add('hidden');
  } else {
    DR.streak = 0;
    el('drill-feedback').textContent = `❌ Answer: ${p.answer}`;
    el('drill-feedback').style.color = 'var(--red)';
    el('drill-explain-panel').classList.remove('hidden');
    el('drill-explain-panel').innerHTML = buildExplanation(p);
  }
  el('drill-streak').textContent = DR.streak;
  el('drill-next-btn').style.display = '';
  saveGame();
}

// ═════════════════════════════════════════════════════════════
// XP & LEVELING
// ═════════════════════════════════════════════════════════════
function addXP(amount) {
  if (!G) return;
  G.heroXP += amount;
  while (G.heroLevel < 10 && G.heroXP >= G.heroMaxXP) {
    G.heroXP -= G.heroMaxXP;
    G.heroLevel++;
    G.heroMaxXP = XP_THRESHOLDS[G.heroLevel] || 20000;
    toast(`🎉 LEVEL UP! Now Level ${G.heroLevel}!`);
    if (G.heroLevel >= 5)  checkAchievement('level_5');
    if (G.heroLevel >= 10) checkAchievement('level_10');
  }
  if (G.gold >= 100) checkAchievement('gold_100');
  updateHUD();
}

// ═════════════════════════════════════════════════════════════
// ACHIEVEMENTS
// ═════════════════════════════════════════════════════════════
function checkAchievement(id, condition) {
  if (!G) return;
  if (G.achievements.includes(id)) return;
  if (condition && !condition()) return;
  G.achievements.push(id);
  const def = ACHIEVEMENTS_DEF.find(a => a.id === id);
  if (def) showAchievementPopup(def);
  saveGame();
}

function checkDivisionMaster() {
  const st = G.subtopicScores;
  let total = 0;
  ['B1','B2','B3','B4','B5','B6','B7','B8','B9','B10'].forEach(s => {
    total += (st[s] ? st[s].correct : 0);
  });
  if (total >= 50) checkAchievement('division_master');
}

function checkDecimalWizard() {
  const aComplete = [1,2,3].every(id => G.dungeonsCompleted.includes(id));
  if (aComplete) checkAchievement('decimal_wizard');
}

function checkSpeedAchievement() {
  const now = Date.now();
  // Keep only last 5 timestamps
  BS.speedTracker = BS.speedTracker.filter(t => now - t < 30000).slice(-5);
  if (BS.speedTracker.length >= 5) {
    const span = now - BS.speedTracker[0];
    if (span <= 30000) checkAchievement('speed_solver');
  }
}

function showAchievementPopup(def) {
  const popup = document.createElement('div');
  popup.className = 'ach-popup';
  popup.innerHTML = `
    <div class="ach-popup-icon">${def.icon}</div>
    <div class="ach-popup-text">
      <div class="ach-popup-title">ACHIEVEMENT UNLOCKED</div>
      <div class="ach-popup-name">${def.name}</div>
    </div>`;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 4000);
}

function renderAchievementsScreen() {
  const grid = el('ach-grid');
  grid.innerHTML = '';
  ACHIEVEMENTS_DEF.forEach(def => {
    const unlocked = G.achievements.includes(def.id);
    const card = document.createElement('div');
    card.className = `ach-card ${unlocked ? 'unlocked' : 'locked'}`;
    card.innerHTML = `
      <div class="ach-icon">${def.icon}</div>
      <div class="ach-name">${def.name}</div>
      <div class="ach-desc">${unlocked ? def.desc : '???'}</div>`;
    grid.appendChild(card);
  });
  el('ach-count-text').textContent = `${G.achievements.length} / ${ACHIEVEMENTS_DEF.length} unlocked`;
}

// ═════════════════════════════════════════════════════════════
// SUBTOPIC TRACKING
// ═════════════════════════════════════════════════════════════
function recordSubtopicAttempt(subtopic, correct) {
  if (!G.subtopicScores[subtopic]) G.subtopicScores[subtopic] = { correct:0, attempts:0 };
  G.subtopicScores[subtopic].attempts++;
  if (correct) G.subtopicScores[subtopic].correct++;
}

// ═════════════════════════════════════════════════════════════
// UI HELPERS
// ═════════════════════════════════════════════════════════════
function renderQuestion(p, questionId, mcId, rowId, inputId) {
  // Question text with fraction rendering
  el(questionId).innerHTML = formatQuestionText(p.question);

  const mcEl = el(mcId);
  const rowEl = el(rowId);
  const inputEl = el(inputId);

  if (p.type === 'mc' && p.choices) {
    mcEl.classList.remove('hidden');
    rowEl.style.display = 'none';
    mcEl.innerHTML = '';
    p.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'mc-btn';
      btn.textContent = choice;
      btn.addEventListener('click', () => {
        mcEl.querySelectorAll('.mc-btn').forEach(b => b.disabled = true);
        const correct = checkAnswer(p, choice);
        btn.classList.add(correct ? 'correct' : 'wrong');
        if (!correct) {
          // Highlight correct
          mcEl.querySelectorAll('.mc-btn').forEach(b => {
            if (checkAnswer(p, b.textContent)) b.classList.add('correct');
          });
        }
        // Dispatch to appropriate handler after a tick
        setTimeout(() => {
          if (inputId === 'battle-answer-input') submitBattleAnswer(choice);
          else if (inputId === 'diag-answer-input') submitDiagnosticAnswer(choice);
          else if (inputId === 'minitest-answer-input') submitMiniTestAnswer(choice);
          else if (inputId === 'drill-answer-input') submitDrillAnswer(choice);
        }, 600);
      });
      mcEl.appendChild(btn);
    });
  } else {
    mcEl.classList.add('hidden');
    rowEl.style.display = '';
    inputEl.value = '';
    inputEl.focus();
  }
}

function formatQuestionText(text) {
  // Replace "a/b" fractions with styled fraction spans (only pure digit/digit)
  return text.replace(/(\d+)\s*\/\s*(\d+)/g, (_, n, d) =>
    `<span class="frac-display"><span class="frac-num">${n}</span><span class="frac-den">${d}</span></span>`
  );
}

function updateHeroHpBar() {
  const pct = G.maxHp > 0 ? Math.max(0, Math.round((G.hp / G.maxHp) * 100)) : 0;
  const fill = el('hero-hp-fill');
  fill.style.width = pct + '%';
  fill.className = `hp-fill ${pct > 50 ? 'high' : pct > 25 ? 'mid' : 'low'}`;
  el('hero-hp-text').textContent = `${G.hp}/${G.maxHp}`;
  el('hero-name-display').textContent = G.playerName || 'HERO';
  updateHUD();
}

function updateEnemyHpBar() {
  const pct = BS.enemyMaxHp > 0
    ? Math.max(0, Math.round((BS.enemyHp / BS.enemyMaxHp) * 100))
    : 0;
  const fill = el('enemy-hp-fill');
  fill.style.width = pct + '%';
  fill.className = `hp-fill ${pct > 50 ? 'high' : pct > 25 ? 'mid' : 'low'}`;
  el('enemy-hp-text').textContent = `${BS.enemyHp}/${BS.enemyMaxHp}`;
}

function updateBattleWave() {
  if (!BS.isBoss) {
    el('battle-wave').textContent = `Enemy ${BS.enemyIdx + 1} / ${ENEMIES_PER_DUNGEON}`;
  }
}

function spawnDamageFloater(amount, isHero) {
  const arena = el('battle-arena');
  const f = document.createElement('div');
  f.className = `damage-floater ${isHero ? 'hero-dmg' : 'enemy-dmg'}`;
  f.textContent = (isHero ? '-' : '-') + amount + ' HP';
  f.style.left = isHero ? '10%' : '60%';
  f.style.top  = '30%';
  arena.appendChild(f);
  setTimeout(() => f.remove(), 1100);
}

function animateHeroAttack() {
  const hero = document.getElementById('hero-sprite');
  if (!hero) return;
  hero.classList.add('hero-attack');
  setTimeout(() => hero.classList.remove('hero-attack'), 400);
}

function animateEnemyAttack() {
  const enemy = document.getElementById('enemy-sprite');
  const hero  = document.getElementById('hero-sprite');
  if (enemy) {
    enemy.classList.add('enemy-attack');
    setTimeout(() => enemy.classList.remove('enemy-attack'), 400);
  }
  if (hero) {
    hero.classList.add('hero-flash');
    setTimeout(() => hero.classList.remove('hero-flash'), 500);
  }
}

function shakeScreen() {
  const battle = document.getElementById('screen-battle');
  if (!battle) return;
  battle.classList.add('shake-screen');
  setTimeout(() => battle.classList.remove('shake-screen'), 450);
}

function spawnConfetti() {
  const wrap = el('confetti-wrap');
  wrap.innerHTML = '';
  const colors = ['#5b8dee','#e8a838','#44d479','#e84040','#9c6dd8','#f0d060'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${1.5 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.5}s;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    wrap.appendChild(piece);
  }
  setTimeout(() => wrap.innerHTML = '', 4000);
}

function showGameOver() {
  showScreen('gameover');
}

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3100);
}

function el(id) { return document.getElementById(id); }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function topicName(t) {
  return { A:"Fractions & Decimals", B:"Long Division", C:"Multiplication" }[t] || t;
}

// ═════════════════════════════════════════════════════════════
// BUTTON BINDINGS
// ═════════════════════════════════════════════════════════════
function bindAllButtons() {

  // ── Name screen ───────────────────────────────────────────
  el('name-confirm-btn').addEventListener('click', () => {
    const name = el('name-input').value.trim().toUpperCase() || 'HERO';
    G = defaultSave(name);
    saveGame();
    showScreen('title');
    updateTitleScreen();
  });
  el('name-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') el('name-confirm-btn').click();
  });

  // ── Title screen ──────────────────────────────────────────
  el('continue-btn').addEventListener('click', () => {
    if (!G) { showScreen('name'); return; }
    if (!G.diagnosticDone) startDiagnostic();
    else showMap();
  });
  el('newgame-btn').addEventListener('click', () => {
    if (confirm('Start a new game? All progress will be lost!')) {
      localStorage.removeItem(SAVE_KEY);
      G = null;
      showScreen('name');
    }
  });
  el('achievements-btn').addEventListener('click', () => {
    if (!G) return;
    renderAchievementsScreen();
    showScreen('achievements');
  });
  el('drill-btn').addEventListener('click', () => {
    if (!G) { showScreen('name'); return; }
    DR.streak = 0;
    el('drill-answer-row').style.display = 'none';
    el('drill-question').textContent = 'Press a topic button to start!';
    showScreen('drill');
  });

  // ── Diagnostic ────────────────────────────────────────────
  el('diag-submit-btn').addEventListener('click', () => {
    const val = el('diag-answer-input').value;
    if (!val.trim()) return;
    submitDiagnosticAnswer(val.trim());
  });
  el('diag-answer-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') el('diag-submit-btn').click();
  });
  el('diag-skip-btn').addEventListener('click', () => {
    submitDiagnosticAnswer('__skip__');
  });

  // ── Map ───────────────────────────────────────────────────
  el('map-title-btn').addEventListener('click', () => showScreen('title'));

  // ── Shop ──────────────────────────────────────────────────
  el('buy-potion-btn').addEventListener('click', () => buyItem('potion', 30));
  el('buy-hint-btn').addEventListener('click',   () => buyItem('hint', 20));
  el('buy-skip-btn').addEventListener('click',   () => buyItem('skip', 50));
  el('shop-continue-btn').addEventListener('click', () => {
    if (BS.dungeon) startBattle(BS.dungeon);
  });

  // ── Battle ────────────────────────────────────────────────
  el('battle-submit-btn').addEventListener('click', () => {
    const val = el('battle-answer-input').value;
    if (!val.trim()) return;
    submitBattleAnswer(val.trim());
  });
  el('battle-answer-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') el('battle-submit-btn').click();
  });

  el('use-hint-btn').addEventListener('click', () => {
    if (!BS.pendingProblem || G.spells.hint <= 0) return;
    G.spells.hint--;
    BS.hintsThisDungeon++;
    el('battle-hint-box').textContent = '💡 ' + BS.pendingProblem.hint;
    el('battle-hint-box').style.display = 'block';
    el('hint-count').textContent = G.spells.hint;
    updateHUD();
    saveGame();
  });

  el('use-potion-btn').addEventListener('click', () => {
    if (G.spells.potion <= 0) { toast('No potions!'); return; }
    G.spells.potion--;
    G.hp = Math.min(G.maxHp, G.hp + 50);
    toast('🧪 +50 HP!');
    updateHeroHpBar();
    updateHUD();
    saveGame();
  });

  el('use-skip-btn').addEventListener('click', () => {
    if (G.spells.skip <= 0 || BS.skipsThisDungeon >= 1) {
      toast('No skips left!'); return;
    }
    G.spells.skip--;
    BS.skipsThisDungeon++;
    toast('⚡ Problem skipped!');
    BS.currentIdx++;
    el('use-skip-btn').disabled = true;
    el('skip-count').textContent = G.spells.skip;
    saveGame();
    showNextProblem();
  });

  // ── Explanation ───────────────────────────────────────────
  el('explain-retry-btn').addEventListener('click', () => {
    showScreen('battle');
    // Re-show same problem
    if (BS.pendingProblem) renderBattleProblem(BS.pendingProblem);
    el('battle-answer-input').value = '';
    el('battle-answer-input').focus();
  });
  el('explain-more-btn').addEventListener('click', () => {
    const mc = el('explain-more-content');
    mc.style.display = mc.style.display === 'none' ? 'block' : 'none';
  });

  // ── Level Clear ───────────────────────────────────────────
  el('clear-continue-btn').addEventListener('click', () => {
    // Find next unlocked dungeon
    const nextIdx = DUNGEON_DEFS.findIndex(d => G.dungeonsUnlocked.includes(d.id) && !G.dungeonsCompleted.includes(d.id));
    if (nextIdx >= 0) {
      enterDungeon(DUNGEON_DEFS[nextIdx]);
    } else {
      showMap();
    }
  });
  el('clear-map-btn').addEventListener('click', showMap);

  // ── Mini-test ─────────────────────────────────────────────
  el('minitest-submit-btn').addEventListener('click', () => {
    const val = el('minitest-answer-input').value;
    if (!val.trim()) return;
    submitMiniTestAnswer(val.trim());
    el('minitest-answer-input').value = '';
  });
  el('minitest-answer-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') el('minitest-submit-btn').click();
  });
  el('minitest-continue-btn').addEventListener('click', () => {
    clearInterval(MT.timerInterval);
    showMap();
  });
  el('minitest-retry-btn').addEventListener('click', () => {
    const dungeon = DUNGEON_DEFS.find(d => d.id === MT.dungeonId);
    if (dungeon) startMiniTest(dungeon);
  });

  // ── Game Over ─────────────────────────────────────────────
  el('gameover-retry-btn').addEventListener('click', () => {
    G.hp = G.maxHp; // Restore HP for retry
    saveGame();
    if (BS.dungeon) startBattle(BS.dungeon);
    else showMap();
  });
  el('gameover-map-btn').addEventListener('click', () => {
    G.hp = Math.max(50, G.hp); // Small heal
    saveGame();
    showMap();
  });

  // ── Achievements ──────────────────────────────────────────
  el('ach-back-btn').addEventListener('click', () => showScreen('title'));

  // ── Free Drill ────────────────────────────────────────────
  el('drill-fractions-btn').addEventListener('click', () => startDrill('A'));
  el('drill-division-btn').addEventListener('click',  () => startDrill('B'));
  el('drill-multiply-btn').addEventListener('click',  () => startDrill('C'));
  el('drill-submit-btn').addEventListener('click', () => {
    const val = el('drill-answer-input').value;
    if (!val.trim()) return;
    submitDrillAnswer(val.trim());
    el('drill-answer-input').value = '';
  });
  el('drill-answer-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') el('drill-submit-btn').click();
  });
  el('drill-next-btn').addEventListener('click', () => {
    DR.current = getNextDrillProblem(DR.topic);
    el('drill-next-btn').style.display = 'none';
    el('drill-feedback').textContent = '';
    el('drill-explain-panel').classList.add('hidden');
    renderQuestion(DR.current, 'drill-question', 'drill-mc-choices', 'drill-answer-row', 'drill-answer-input');
    el('drill-answer-row').style.display = '';
  });
  el('drill-back-btn').addEventListener('click', () => showScreen('title'));
}

// ═════════════════════════════════════════════════════════════
// BOOT
// ═════════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', init);
})();
