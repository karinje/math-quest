// ============================================================
// MATH QUEST — Side-scrolling Platformer Engine
// ============================================================
(function () {
'use strict';

const MP = window.MathProblems;

// ── Canvas ─────────────────────────────────────────────────
const canvas = document.getElementById('game-canvas');
const ctx    = canvas.getContext('2d');
const CW = 800, CH = 500;
canvas.width = CW; canvas.height = CH;

function resizeCanvas() {
  const wrap = document.getElementById('game-viewport');
  if (!wrap || !wrap.style.display || wrap.style.display === 'none') return;
  const scale = Math.min(window.innerWidth / CW, (window.innerHeight - 10) / CH);
  const w = Math.floor(CW * scale), h = Math.floor(CH * scale);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  wrap.style.maxWidth = w + 'px';
}
window.addEventListener('resize', resizeCanvas);

// ── Save / Load ────────────────────────────────────────────
const SAVE_KEY = 'mathQuestV4';
function loadSave() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)); } catch(_){ return null; }
}
function writeSave() { if (G) localStorage.setItem(SAVE_KEY, JSON.stringify(G)); }
function defaultSave(name) {
  return {
    playerName: name || 'HERO',
    heroLevel: 1, heroXP: 0, heroMaxXP: 500,
    coins: 0, stars: 0,
    hp: 3, maxHp: 3,
    hintsLeft: 5,
    levelsUnlocked: [1],
    levelsCompleted: [],
    achievements: [],
    streak: { current:0, best:0, lastDate:null },
    totalCorrect: 0, totalAttempted: 0,
  };
}

let G = null;
const XP_TABLE = [0,500,1200,2200,3500,5200,7200,9500,12500,16000,20000];

function addXP(n) {
  if (!G) return;
  G.heroXP += n;
  while (G.heroLevel < 10 && G.heroXP >= G.heroMaxXP) {
    G.heroXP -= G.heroMaxXP;
    G.heroLevel++;
    G.heroMaxXP = XP_TABLE[G.heroLevel] || 20000;
    toast('🎉 LEVEL UP! Hero Level ' + G.heroLevel + '!');
  }
}

// ── Input ──────────────────────────────────────────────────
const keys = { left:false, right:false, up:false };
let jumpConsumed = false;
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft'  || e.key === 'a') keys.left  = true;
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
    keys.up = true;
    if (gameState === 'playing') e.preventDefault();
  }
  if (e.key === 'Escape') togglePause();
});
document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft'  || e.key === 'a') keys.left  = false;
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
    keys.up = false; jumpConsumed = false;
  }
});

// Mobile touch controls
function bindMobile() {
  const btnL = document.getElementById('mob-left');
  const btnR = document.getElementById('mob-right');
  const btnJ = document.getElementById('mob-jump');
  if (!btnL) return;
  const hold = (el, key) => {
    el.addEventListener('touchstart',  e => { keys[key]=true;  e.preventDefault(); }, {passive:false});
    el.addEventListener('touchend',    e => { keys[key]=false; if(key==='up') jumpConsumed=false; e.preventDefault(); }, {passive:false});
    el.addEventListener('touchcancel', e => { keys[key]=false; e.preventDefault(); }, {passive:false});
  };
  hold(btnL, 'left');
  hold(btnR, 'right');
  hold(btnJ, 'up');
}

// ── LEVEL DEFINITIONS ──────────────────────────────────────
// Each level: platforms, enemies (with subtopic), collectibles, portal, theme
const LEVEL_DEFS = [
  {
    id:1, name:"Fraction Forest", topic:"A",
    theme:{ sky:['#0a1f0a','#1a3a1a'], ground:'#3a5a2a', dirt:'#2a3a1a', accent:'#5aaa3a' },
    bgTrees: true,
    subtopics:['A1','A2'],
    enemyLabel:'🌀 Fraction Sprite',
    platforms:[
      {x:0,   y:440, w:3400, h:60},
      {x:180, y:340, w:120,  h:18},
      {x:370, y:300, w:100,  h:18},
      {x:520, y:360, w:90,   h:18},
      {x:680, y:290, w:110,  h:18},
      {x:840, y:350, w:100,  h:18},
      {x:1000,y:280, w:120,  h:18},
      {x:1180,y:340, w:100,  h:18},
      {x:1350,y:300, w:110,  h:18},
      {x:1550,y:260, w:90,   h:18},
      {x:1700,y:340, w:120,  h:18},
      {x:1900,y:290, w:100,  h:18},
      {x:2080,y:350, w:110,  h:18},
      {x:2250,y:300, w:100,  h:18},
      {x:2450,y:260, w:120,  h:18},
      {x:2650,y:330, w:100,  h:18},
      {x:2850,y:280, w:110,  h:18},
    ],
    enemies:[
      {x:390, y:252, subtopic:'A1'},
      {x:700, y:242, subtopic:'A1'},
      {x:1020,y:232, subtopic:'A2'},
      {x:1370,y:252, subtopic:'A1'},
      {x:1720,y:292, subtopic:'A2'},
      {x:2100,y:302, subtopic:'A2'},
      {x:2670,y:282, subtopic:'A1'},
      {x:2870,y:232, subtopic:'A2'},
    ],
    collectibles: genCoinsOnPlatforms([
      {x:200,y:340,w:120},{x:380,y:300,w:100},{x:540,y:360,w:90},{x:700,y:290,w:110},
      {x:1010,y:280,w:120},{x:1360,y:300,w:110},{x:1560,y:260,w:90},{x:1710,y:340,w:120},
    ], ['hint','hint','hp','shield']),
    portalX: 3100,
  },
  {
    id:2, name:"Decimal Desert", topic:"A",
    theme:{ sky:['#1a1000','#3a2800'], ground:'#7a6030', dirt:'#5a4020', accent:'#c0a050' },
    bgCacti: true,
    subtopics:['A3','A4','A5'],
    enemyLabel:'🌀 Decimal Djinn',
    platforms:[
      {x:0,   y:440, w:3400, h:60},
      {x:150, y:350, w:110,  h:18},
      {x:320, y:290, w:100,  h:18},
      {x:500, y:360, w:90,   h:18},
      {x:660, y:300, w:110,  h:18},
      {x:830, y:260, w:100,  h:18},
      {x:1010,y:340, w:120,  h:18},
      {x:1200,y:290, w:100,  h:18},
      {x:1380,y:350, w:90,   h:18},
      {x:1560,y:280, w:110,  h:18},
      {x:1750,y:310, w:100,  h:18},
      {x:1940,y:270, w:120,  h:18},
      {x:2130,y:340, w:100,  h:18},
      {x:2320,y:290, w:110,  h:18},
      {x:2520,y:250, w:100,  h:18},
      {x:2720,y:310, w:120,  h:18},
      {x:2920,y:270, w:100,  h:18},
    ],
    enemies:[
      {x:340, y:242, subtopic:'A3'},
      {x:680, y:252, subtopic:'A4'},
      {x:850, y:212, subtopic:'A3'},
      {x:1220,y:242, subtopic:'A5'},
      {x:1580,y:232, subtopic:'A4'},
      {x:1760,y:262, subtopic:'A3'},
      {x:2140,y:292, subtopic:'A5'},
      {x:2940,y:222, subtopic:'A4'},
    ],
    collectibles: genCoinsOnPlatforms([
      {x:160,y:350,w:110},{x:330,y:290,w:100},{x:510,y:360,w:90},{x:840,y:260,w:100},
      {x:1020,y:340,w:120},{x:1390,y:350,w:90},{x:1570,y:280,w:110},{x:1760,y:310,w:100},
    ], ['hint','hp','hint','shield']),
    portalX: 3100,
  },
  {
    id:3, name:"Conversion Cavern", topic:"A",
    theme:{ sky:['#050508','#0a0a14'], ground:'#2a2a4a', dirt:'#1a1a2a', accent:'#6060cc' },
    bgCave: true,
    subtopics:['A6','A7','A8'],
    enemyLabel:'🐉 Repeating Dragon',
    platforms:[
      {x:0,   y:440, w:3400, h:60},
      {x:160, y:360, w:100,  h:18},
      {x:320, y:300, w:90,   h:18},
      {x:480, y:370, w:100,  h:18},
      {x:650, y:310, w:110,  h:18},
      {x:820, y:260, w:90,   h:18},
      {x:990, y:340, w:100,  h:18},
      {x:1160,y:290, w:110,  h:18},
      {x:1340,y:360, w:90,   h:18},
      {x:1520,y:290, w:100,  h:18},
      {x:1700,y:250, w:110,  h:18},
      {x:1880,y:320, w:90,   h:18},
      {x:2060,y:270, w:100,  h:18},
      {x:2250,y:340, w:110,  h:18},
      {x:2450,y:280, w:100,  h:18},
      {x:2650,y:320, w:90,   h:18},
      {x:2850,y:260, w:110,  h:18},
    ],
    enemies:[
      {x:340, y:252, subtopic:'A6'},
      {x:670, y:262, subtopic:'A7'},
      {x:840, y:212, subtopic:'A8'},
      {x:1180,y:242, subtopic:'A6'},
      {x:1540,y:242, subtopic:'A7'},
      {x:1720,y:202, subtopic:'A8'},
      {x:2270,y:292, subtopic:'A6'},
      {x:2870,y:212, subtopic:'A7'},
    ],
    collectibles: genCoinsOnPlatforms([
      {x:170,y:360,w:100},{x:330,y:300,w:90},{x:660,y:310,w:110},{x:830,y:260,w:90},
      {x:1000,y:340,w:100},{x:1350,y:360,w:90},{x:1530,y:290,w:100},{x:1710,y:250,w:110},
    ], ['hp','hint','shield','hint']),
    portalX: 3100,
  },
  {
    id:4, name:"Division Dungeon", topic:"B",
    theme:{ sky:['#0a0005','#14000a'], ground:'#3a1a2a', dirt:'#2a0a1a', accent:'#8a2a5a' },
    bgDungeon: true,
    subtopics:['B1','B2','B3'],
    enemyLabel:'💀 Division Lich',
    platforms:[
      {x:0,   y:440, w:3400, h:60},
      {x:200, y:350, w:110,  h:18},
      {x:380, y:300, w:100,  h:18},
      {x:560, y:370, w:90,   h:18},
      {x:720, y:310, w:110,  h:18},
      {x:900, y:260, w:100,  h:18},
      {x:1080,y:340, w:120,  h:18},
      {x:1270,y:290, w:100,  h:18},
      {x:1460,y:360, w:90,   h:18},
      {x:1640,y:290, w:110,  h:18},
      {x:1830,y:250, w:100,  h:18},
      {x:2020,y:320, w:110,  h:18},
      {x:2210,y:270, w:100,  h:18},
      {x:2400,y:340, w:90,   h:18},
      {x:2590,y:280, w:110,  h:18},
      {x:2780,y:310, w:100,  h:18},
      {x:2970,y:260, w:110,  h:18},
    ],
    enemies:[
      {x:400, y:252, subtopic:'B1'},
      {x:740, y:262, subtopic:'B2'},
      {x:920, y:212, subtopic:'B1'},
      {x:1290,y:242, subtopic:'B3'},
      {x:1660,y:242, subtopic:'B2'},
      {x:1850,y:202, subtopic:'B3'},
      {x:2220,y:222, subtopic:'B1'},
      {x:2990,y:212, subtopic:'B3'},
    ],
    collectibles: genCoinsOnPlatforms([
      {x:210,y:350,w:110},{x:390,y:300,w:100},{x:730,y:310,w:110},{x:910,y:260,w:100},
      {x:1090,y:340,w:120},{x:1470,y:360,w:90},{x:1650,y:290,w:110},{x:1840,y:250,w:100},
    ], ['hint','hp','hint','shield']),
    portalX: 3100,
  },
  {
    id:5, name:"Division Boss Tower", topic:"B",
    theme:{ sky:['#080008','#0f000f'], ground:'#3a0a3a', dirt:'#200020', accent:'#aa00aa' },
    bgTower: true,
    subtopics:['B4','B5','B6','B7','B8'],
    enemyLabel:'🪨 Divide Golem',
    platforms:[
      {x:0,   y:440, w:3400, h:60},
      {x:150, y:360, w:100,  h:18},
      {x:310, y:300, w:90,   h:18},
      {x:470, y:370, w:100,  h:18},
      {x:630, y:310, w:110,  h:18},
      {x:810, y:255, w:90,   h:18},
      {x:980, y:335, w:110,  h:18},
      {x:1160,y:280, w:100,  h:18},
      {x:1350,y:350, w:90,   h:18},
      {x:1530,y:280, w:110,  h:18},
      {x:1720,y:240, w:100,  h:18},
      {x:1910,y:310, w:90,   h:18},
      {x:2100,y:260, w:110,  h:18},
      {x:2300,y:330, w:100,  h:18},
      {x:2500,y:270, w:90,   h:18},
      {x:2700,y:300, w:110,  h:18},
      {x:2900,y:250, w:100,  h:18},
    ],
    enemies:[
      {x:330, y:252, subtopic:'B4'},
      {x:650, y:262, subtopic:'B5'},
      {x:830, y:207, subtopic:'B6'},
      {x:1180,y:232, subtopic:'B7'},
      {x:1550,y:232, subtopic:'B5'},
      {x:1740,y:192, subtopic:'B8'},
      {x:2120,y:212, subtopic:'B6'},
      {x:2920,y:202, subtopic:'B8'},
    ],
    collectibles: genCoinsOnPlatforms([
      {x:160,y:360,w:100},{x:320,y:300,w:90},{x:640,y:310,w:110},{x:820,y:255,w:90},
      {x:990,y:335,w:110},{x:1360,y:350,w:90},{x:1540,y:280,w:110},{x:1730,y:240,w:100},
    ], ['hint','hp','hint','shield']),
    portalX: 3100,
  },
  {
    id:6, name:"Multiply Marsh", topic:"C",
    theme:{ sky:['#001008','#002810'], ground:'#1a4a1a', dirt:'#0a2a0a', accent:'#40aa40' },
    bgMarsh: true,
    subtopics:['C1','C2','C3'],
    enemyLabel:'👹 Two-Digit Troll',
    platforms:[
      {x:0,   y:440, w:3400, h:60},
      {x:180, y:345, w:110,  h:18},
      {x:360, y:295, w:100,  h:18},
      {x:540, y:365, w:90,   h:18},
      {x:700, y:305, w:110,  h:18},
      {x:880, y:255, w:100,  h:18},
      {x:1060,y:335, w:120,  h:18},
      {x:1250,y:285, w:100,  h:18},
      {x:1440,y:355, w:90,   h:18},
      {x:1620,y:285, w:110,  h:18},
      {x:1810,y:245, w:100,  h:18},
      {x:2000,y:315, w:110,  h:18},
      {x:2190,y:265, w:100,  h:18},
      {x:2380,y:335, w:90,   h:18},
      {x:2570,y:275, w:110,  h:18},
      {x:2760,y:305, w:100,  h:18},
      {x:2950,y:255, w:110,  h:18},
    ],
    enemies:[
      {x:380, y:247, subtopic:'C1'},
      {x:720, y:257, subtopic:'C2'},
      {x:900, y:207, subtopic:'C3'},
      {x:1270,y:237, subtopic:'C1'},
      {x:1640,y:237, subtopic:'C2'},
      {x:1830,y:197, subtopic:'C3'},
      {x:2210,y:217, subtopic:'C1'},
      {x:2970,y:207, subtopic:'C2'},
    ],
    collectibles: genCoinsOnPlatforms([
      {x:190,y:345,w:110},{x:370,y:295,w:100},{x:710,y:305,w:110},{x:890,y:255,w:100},
      {x:1070,y:335,w:120},{x:1450,y:355,w:90},{x:1630,y:285,w:110},{x:1820,y:245,w:100},
    ], ['hint','hp','hint','shield']),
    portalX: 3100,
  },
  {
    id:7, name:"Carry Kingdom", topic:"C",
    theme:{ sky:['#0a0810','#1a1828'], ground:'#3a3060', dirt:'#2a2040', accent:'#8070cc' },
    bgKingdom: true,
    subtopics:['C4','C5','C6'],
    enemyLabel:'🔢 Carry Count',
    platforms:[
      {x:0,   y:440, w:3400, h:60},
      {x:160, y:355, w:100,  h:18},
      {x:320, y:300, w:90,   h:18},
      {x:480, y:370, w:100,  h:18},
      {x:640, y:310, w:110,  h:18},
      {x:820, y:260, w:90,   h:18},
      {x:990, y:340, w:100,  h:18},
      {x:1170,y:290, w:110,  h:18},
      {x:1360,y:360, w:90,   h:18},
      {x:1540,y:290, w:100,  h:18},
      {x:1730,y:250, w:110,  h:18},
      {x:1920,y:320, w:90,   h:18},
      {x:2110,y:270, w:100,  h:18},
      {x:2310,y:340, w:110,  h:18},
      {x:2510,y:280, w:100,  h:18},
      {x:2710,y:310, w:90,   h:18},
      {x:2910,y:260, w:110,  h:18},
    ],
    enemies:[
      {x:340, y:252, subtopic:'C4'},
      {x:660, y:262, subtopic:'C5'},
      {x:840, y:212, subtopic:'C6'},
      {x:1190,y:242, subtopic:'C4'},
      {x:1560,y:242, subtopic:'C5'},
      {x:1750,y:202, subtopic:'C6'},
      {x:2130,y:222, subtopic:'C4'},
      {x:2930,y:212, subtopic:'C5'},
    ],
    collectibles: genCoinsOnPlatforms([
      {x:170,y:355,w:100},{x:330,y:300,w:90},{x:650,y:310,w:110},{x:830,y:260,w:90},
      {x:1000,y:340,w:100},{x:1370,y:360,w:90},{x:1550,y:290,w:100},{x:1740,y:250,w:110},
    ], ['hint','hp','hint','shield']),
    portalX: 3100,
  },
  {
    id:8, name:"Decimal Multiply", topic:"C",
    theme:{ sky:['#000a10','#001428'], ground:'#1a3050', dirt:'#0a1828', accent:'#3080cc' },
    bgOcean: true,
    subtopics:['C7','C8','C9','C10'],
    enemyLabel:'🦎 Decimal Drake',
    platforms:[
      {x:0,   y:440, w:3400, h:60},
      {x:150, y:360, w:110,  h:18},
      {x:320, y:305, w:100,  h:18},
      {x:490, y:375, w:90,   h:18},
      {x:650, y:315, w:110,  h:18},
      {x:830, y:265, w:100,  h:18},
      {x:1010,y:345, w:120,  h:18},
      {x:1200,y:295, w:100,  h:18},
      {x:1390,y:365, w:90,   h:18},
      {x:1570,y:295, w:110,  h:18},
      {x:1760,y:255, w:100,  h:18},
      {x:1950,y:325, w:90,   h:18},
      {x:2140,y:275, w:110,  h:18},
      {x:2340,y:345, w:100,  h:18},
      {x:2540,y:285, w:90,   h:18},
      {x:2740,y:315, w:110,  h:18},
      {x:2940,y:265, w:100,  h:18},
    ],
    enemies:[
      {x:340, y:257, subtopic:'C7'},
      {x:670, y:267, subtopic:'C8'},
      {x:850, y:217, subtopic:'C9'},
      {x:1220,y:247, subtopic:'C7'},
      {x:1590,y:247, subtopic:'C10'},
      {x:1780,y:207, subtopic:'C8'},
      {x:2160,y:227, subtopic:'C9'},
      {x:2960,y:217, subtopic:'C10'},
    ],
    collectibles: genCoinsOnPlatforms([
      {x:160,y:360,w:110},{x:330,y:305,w:100},{x:660,y:315,w:110},{x:840,y:265,w:100},
      {x:1020,y:345,w:120},{x:1400,y:365,w:90},{x:1580,y:295,w:110},{x:1770,y:255,w:100},
    ], ['hint','hp','hint','shield']),
    portalX: 3100,
  },
  {
    id:9, name:"Grand Gauntlet", topic:null,
    theme:{ sky:['#080000','#180000'], ground:'#4a1010', dirt:'#2a0808', accent:'#cc2020' },
    bgFinal: true,
    subtopics:['A1','B1','C1','A3','B5','C4','B6','C7'],
    enemyLabel:'👾 FINAL BOSS',
    platforms:[
      {x:0,   y:440, w:3600, h:60},
      {x:200, y:350, w:120,  h:18},
      {x:400, y:290, w:110,  h:18},
      {x:590, y:360, w:100,  h:18},
      {x:760, y:295, w:120,  h:18},
      {x:960, y:245, w:100,  h:18},
      {x:1140,y:330, w:130,  h:18},
      {x:1350,y:270, w:110,  h:18},
      {x:1550,y:350, w:100,  h:18},
      {x:1740,y:280, w:120,  h:18},
      {x:1950,y:240, w:110,  h:18},
      {x:2150,y:320, w:100,  h:18},
      {x:2350,y:265, w:120,  h:18},
      {x:2560,y:340, w:110,  h:18},
      {x:2770,y:275, w:100,  h:18},
      {x:2980,y:240, w:120,  h:18},
      {x:3200,y:310, w:110,  h:18},
    ],
    enemies:[
      {x:420, y:242, subtopic:'A1'},
      {x:780, y:247, subtopic:'B1'},
      {x:980, y:197, subtopic:'C1'},
      {x:1370,y:222, subtopic:'A3'},
      {x:1760,y:232, subtopic:'B5'},
      {x:1970,y:192, subtopic:'C4'},
      {x:2370,y:217, subtopic:'B6'},
      {x:3000,y:192, subtopic:'C7'},
      {x:3220,y:262, subtopic:'A3'},
    ],
    collectibles: genCoinsOnPlatforms([
      {x:210,y:350,w:120},{x:410,y:290,w:110},{x:770,y:295,w:120},{x:970,y:245,w:100},
      {x:1150,y:330,w:130},{x:1560,y:350,w:100},{x:1750,y:280,w:120},{x:1960,y:240,w:110},
    ], ['hp','hp','hint','shield','hint']),
    portalX: 3350,
  },
];

function genCoinsOnPlatforms(plats, powerupTypes) {
  const items = [];
  plats.forEach(p => {
    // 2-4 coins on each platform
    const count = 2 + Math.floor(p.w / 50);
    for (let i = 0; i < count; i++) {
      items.push({ type:'coin', x: p.x + 15 + i * (p.w - 30) / Math.max(count-1,1), y: p.y - 24, collected:false });
    }
  });
  // Stars on high platforms
  if (plats.length > 4) {
    [1,3,5].forEach(i => {
      if (plats[i]) items.push({ type:'star', x: plats[i].x + plats[i].w/2, y: plats[i].y - 50, collected:false });
    });
  }
  // Ground coins
  for (let x = 120; x < 3000; x += 180 + Math.floor(Math.random()*80)) {
    items.push({ type:'coin', x, y: 415, collected:false });
  }
  // Power-ups
  const powerPositions = [{x:500,y:390},{x:900,y:390},{x:1400,y:390},{x:1900,y:390},{x:2400,y:390}];
  powerupTypes.forEach((pt, i) => {
    const pos = powerPositions[i % powerPositions.length];
    items.push({ type:'powerup', powerType:pt, x:pos.x + i*80, y:pos.y, collected:false,
      label: pt==='hint'?'💡 HINT': pt==='hp'?'❤️ HP': pt==='shield'?'🛡️ SHIELD':'?' });
  });
  return items;
}

// ── Player ─────────────────────────────────────────────────
let P = null;
function resetPlayer(levelDef) {
  P = {
    x: 80, y: 300,
    vx: 0, vy: 0,
    w: 28, h: 44,
    onGround: false,
    facing: 1,
    animFrame: 0, animTick: 0,
    invincible: 0,
    shield: false,
    dead: false,
  };
}

// ── Game loop vars ─────────────────────────────────────────
let gameState  = 'title'; // 'title'|'map'|'playing'|'math'|'explain'|'clear'|'gameover'|'paused'
let currentLevelDef = null;
let currentLevelPlatforms = [];
let currentLevelEnemies   = [];
let currentLevelCollect   = [];
let particles = [];
let camX = 0;
let portalRect = null;
let levelStats  = { coins:0, stars:0, enemiesLeft:0 };
let mathCtx     = { enemy:null, problem:null, wrongCount:0 };
let raf = null;
let lastTime = 0;

// ── Achievements ───────────────────────────────────────────
const ACH = [
  {id:'first_enemy',  name:'First Blood',      icon:'⚔️',  desc:'Defeat your first monster'},
  {id:'collect_10',   name:'Coin Collector',   icon:'🪙',  desc:'Collect 10 coins'},
  {id:'collect_50',   name:'Treasure Hunter',  icon:'💰',  desc:'Collect 50 coins'},
  {id:'star_5',       name:'Star Gazer',        icon:'⭐',  desc:'Collect 5 stars'},
  {id:'no_damage',    name:'Flawless',          icon:'🛡️',  desc:'Complete a level without getting hit'},
  {id:'level_3',      name:'Explorer',          icon:'🗺️',  desc:'Complete 3 levels'},
  {id:'level_6',      name:'Adventurer',        icon:'🧭',  desc:'Complete 6 levels'},
  {id:'level_9',      name:'Grand Champion',    icon:'👑',  desc:'Complete the Grand Gauntlet'},
  {id:'correct_20',   name:'Problem Solver',    icon:'🔢',  desc:'Answer 20 problems correctly'},
  {id:'correct_50',   name:'Math Master',       icon:'🎓',  desc:'Answer 50 problems correctly'},
  {id:'use_teach',    name:'Eager Learner',     icon:'📖',  desc:'Use "How do I solve this?" 5 times'},
  {id:'streak_3',     name:'On Fire',           icon:'🔥',  desc:'3-day login streak'},
];

function checkAch(id) {
  if (!G || G.achievements.includes(id)) return;
  G.achievements.push(id);
  const def = ACH.find(a => a.id === id);
  if (def) showAchPopup(def);
  writeSave();
}

function showAchPopup(def) {
  const el = document.createElement('div');
  el.className = 'ach-popup';
  el.innerHTML = `<div class="ach-popup-icon">${def.icon}</div>
    <div class="ach-popup-text">
      <div style="font-size:7px;color:var(--accent2);font-family:var(--pixel)">ACHIEVEMENT</div>
      <div style="font-size:8px;font-family:var(--pixel)">${def.name}</div>
    </div>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// ── Toast ──────────────────────────────────────────────────
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3100);
}

// ── Screen switcher ────────────────────────────────────────
function showHTMLScreen(name) {
  ['screen-title','screen-name','screen-map','screen-achievements'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.toggle('active', id === name); }
  });
  const vp = document.getElementById('game-viewport');
  if (vp) vp.style.display = (name === 'game-viewport') ? 'block' : 'none';
  if (name === 'game-viewport') {
    resizeCanvas();
    bindMobile();
  }
}

// ── Load level into runtime arrays ─────────────────────────
function loadLevel(def) {
  currentLevelDef = def;
  currentLevelPlatforms = def.platforms.map(p => ({...p}));
  currentLevelEnemies = def.enemies.map((e, i) => {
    const pool = MP.getProblemsBySubtopic(e.subtopic).filter(Boolean);
    const problem = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    const plat = def.platforms.find(p => Math.abs((p.x + p.w/2) - e.x) < p.w/2 + 40) || def.platforms[1];
    return {
      id: i,
      x: e.x, y: e.y,
      w: 36, h: 44,
      vx: 1.2, dir: 1,
      patrolL: plat ? plat.x + 10 : e.x - 80,
      patrolR: plat ? plat.x + plat.w - 10 : e.x + 80,
      problem,
      alive: true,
      alertRadius: 220,
      animTick: 0,
      subtopic: e.subtopic,
      // Show the problem numbers visually on enemy
      label: problem ? getEnemyLabel(problem) : '?',
    };
  });
  currentLevelCollect = def.collectibles.map(c => ({...c, bobOffset: Math.random()*Math.PI*2}));
  particles = [];
  camX = 0;
  portalRect = { x: def.portalX, y: 370, w: 50, h: 70 };
  levelStats = { coins:0, stars:0, enemiesLeft: currentLevelEnemies.length, tookDamage:false };
  resetPlayer(def);
  updateGameHUD();
}

function getEnemyLabel(problem) {
  // Show the key numbers from the problem so even while running the student sees the math
  if (!problem) return '?';
  const q = problem.question;
  const m = q.match(/(\d+\/\d+|\d+\s*[÷×]\s*\d+)/);
  return m ? m[0] : q.slice(0,8);
}

// ── Main game loop ─────────────────────────────────────────
function startLoop() {
  if (raf) cancelAnimationFrame(raf);
  lastTime = performance.now();
  function frame(now) {
    const dt = Math.min((now - lastTime) / 16.67, 3); // cap at 3x slow
    lastTime = now;
    if (gameState === 'playing') {
      update(dt);
      render();
    } else if (gameState === 'paused') {
      render(); // still render, just frozen
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
}

// ── UPDATE ─────────────────────────────────────────────────
function update(dt) {
  updatePlayer(dt);
  updateEnemies(dt);
  updateCollectibles();
  updateParticles(dt);
  updateCamera();
  checkPortal();
}

function updatePlayer(dt) {
  if (!P || P.dead) return;

  // Horizontal movement
  P.vx = 0;
  if (keys.left)  { P.vx = -5 * dt; P.facing = -1; }
  if (keys.right) { P.vx =  5 * dt; P.facing =  1; }

  // Jumping
  if (keys.up && P.onGround && !jumpConsumed) {
    P.vy = -13;
    jumpConsumed = true;
    spawnParticles(P.x + P.w/2, P.y + P.h, '#aaaaff', 4);
  }

  // Gravity
  P.vy += 0.55 * dt;
  if (P.vy > 16) P.vy = 16;

  // Move
  P.x += P.vx;
  P.y += P.vy;

  // Keep in world bounds
  if (P.x < 0) P.x = 0;

  // Platform collision
  P.onGround = false;
  for (const plat of currentLevelPlatforms) {
    if (rectOverlap(P, plat)) {
      // Landing on top
      if (P.vy >= 0 && P.y + P.h - P.vy * dt <= plat.y + 2) {
        P.y = plat.y - P.h;
        P.vy = 0;
        P.onGround = true;
      } else if (P.vy < 0 && P.y >= plat.y + plat.h - 2) {
        // Hitting underside
        P.y = plat.y + plat.h;
        P.vy = 0;
      } else {
        // Side collision
        const fromLeft  = P.x + P.w - P.vx > plat.x && P.x - P.vx <= plat.x;
        const fromRight = P.x - P.vx < plat.x + plat.w && P.x + P.w - P.vx >= plat.x + plat.w;
        if (fromLeft)  P.x = plat.x - P.w;
        if (fromRight) P.x = plat.x + plat.w;
        P.vx = 0;
      }
    }
  }

  // Fall off bottom → die
  if (P.y > CH + 50) {
    playerDie();
    return;
  }

  // Invincibility frames
  if (P.invincible > 0) P.invincible -= dt;

  // Animation
  P.animTick += dt;
  if (P.animTick >= 8) { P.animTick = 0; P.animFrame = (P.animFrame + 1) % 2; }

  // Check enemy collision
  if (P.invincible <= 0) {
    for (const enemy of currentLevelEnemies) {
      if (!enemy.alive) continue;
      if (rectOverlap(P, enemy)) {
        triggerMathProblem(enemy);
        break;
      }
    }
  }
}

function rectOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

function updateEnemies(dt) {
  for (const e of currentLevelEnemies) {
    if (!e.alive) continue;
    e.animTick += dt;
    // Patrol left/right
    e.x += e.vx * e.dir * dt;
    if (e.x <= e.patrolL) { e.dir =  1; e.x = e.patrolL; }
    if (e.x >= e.patrolR) { e.dir = -1; e.x = e.patrolR; }
  }
}

function updateCollectibles() {
  if (!P) return;
  for (const item of currentLevelCollect) {
    if (item.collected) continue;
    const itemRect = { x:item.x-14, y:item.y-14, w:28, h:28 };
    if (rectOverlap(P, itemRect)) {
      item.collected = true;
      collectItem(item);
    }
  }
}

function collectItem(item) {
  if (item.type === 'coin') {
    G.coins++; levelStats.coins++;
    spawnParticles(item.x, item.y, '#f0d060', 5);
    if (G.coins >= 10) checkAch('collect_10');
    if (G.coins >= 50) checkAch('collect_50');
  } else if (item.type === 'star') {
    G.stars++; levelStats.stars++;
    addXP(10);
    spawnParticles(item.x, item.y, '#ffffa0', 8);
    if (G.stars >= 5) checkAch('star_5');
  } else if (item.type === 'powerup') {
    spawnParticles(item.x, item.y, '#80ffff', 10);
    if (item.powerType === 'hp') {
      G.hp = Math.min(G.maxHp, G.hp + 1);
      toast('❤️ +1 HP!');
    } else if (item.powerType === 'hint') {
      G.hintsLeft = (G.hintsLeft || 0) + 2;
      toast('💡 +2 Hints!');
    } else if (item.powerType === 'shield') {
      P.shield = true;
      toast('🛡️ Shield activated! Next wrong answer is blocked.');
    }
  }
  updateGameHUD();
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt; p.y += p.vy * dt;
    p.vy += 0.15 * dt;
    p.life -= dt;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function updateCamera() {
  if (!P) return;
  const target = P.x - CW * 0.35;
  camX += (target - camX) * 0.1;
  if (camX < 0) camX = 0;
}

function checkPortal() {
  if (!P || !portalRect) return;
  if (levelStats.enemiesLeft > 0) return; // portal only opens when all enemies defeated
  if (rectOverlap(P, portalRect)) {
    levelComplete();
  }
}

// ── Math trigger ────────────────────────────────────────────
let teachUsedCount = 0;
function triggerMathProblem(enemy) {
  if (!enemy.problem) { enemy.alive = false; return; }
  gameState = 'math';
  mathCtx = { enemy, problem: enemy.problem, wrongCount: 0 };

  const topicNames = { A:'FRACTIONS & DECIMALS', B:'LONG DIVISION', C:'MULTIPLICATION' };
  const p = enemy.problem;

  document.getElementById('math-enemy-label').textContent = currentLevelDef.enemyLabel + ' — ' + enemy.label;
  document.getElementById('math-topic-badge').textContent = topicNames[p.topic] || p.topic;
  document.getElementById('math-question').innerHTML = formatQuestion(p.question);
  document.getElementById('math-hint-box').style.display = 'none';
  document.getElementById('math-hint-box').textContent = '';
  document.getElementById('math-feedback').textContent = '';
  document.getElementById('math-hint-count').textContent = G.hintsLeft || 0;

  const mcDiv = document.getElementById('math-mc-choices');
  const inputRow = document.getElementById('math-input-row');

  if (p.type === 'mc' && p.choices) {
    mcDiv.style.display = 'grid';
    inputRow.style.display = 'none';
    mcDiv.innerHTML = '';
    p.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'mc-btn'; btn.textContent = choice;
      btn.addEventListener('click', () => submitMathAnswer(choice));
      mcDiv.appendChild(btn);
    });
  } else {
    mcDiv.style.display = 'none';
    inputRow.style.display = 'flex';
    document.getElementById('math-answer-input').value = '';
    setTimeout(() => document.getElementById('math-answer-input').focus(), 100);
  }

  document.getElementById('math-modal').style.display = 'flex';
}

function submitMathAnswer(userInput) {
  if (!mathCtx.problem) return;
  const correct = MP.checkAnswer(mathCtx.problem, String(userInput).trim());
  G.totalAttempted++;

  if (correct) {
    G.totalCorrect++;
    addXP(20);
    writeSave();
    document.getElementById('math-feedback').textContent = '✅ CORRECT! Enemy defeated!';
    document.getElementById('math-feedback').style.color = 'var(--green)';
    // Defeat enemy
    setTimeout(() => {
      document.getElementById('math-modal').style.display = 'none';
      const e = mathCtx.enemy;
      e.alive = false;
      levelStats.enemiesLeft--;
      spawnParticles(e.x + e.w/2, e.y + e.h/2, '#44d479', 20);
      spawnParticles(e.x + e.w/2, e.y + e.h/2, '#f0d060', 10);
      gameState = 'playing';
      updateGameHUD();
      checkAch('first_enemy');
      if (G.totalCorrect >= 20) checkAch('correct_20');
      if (G.totalCorrect >= 50) checkAch('correct_50');
      if (levelStats.enemiesLeft === 0) toast('🎉 All enemies defeated! Reach the portal!');
    }, 800);
  } else {
    mathCtx.wrongCount++;
    document.getElementById('math-feedback').textContent = '❌ Not quite — try again!';
    document.getElementById('math-feedback').style.color = 'var(--red)';
    // Flash
    const input = document.getElementById('math-answer-input');
    if (input) { input.classList.add('shake'); setTimeout(() => input.classList.remove('shake'), 400); }
    // Damage player after 2 wrong
    if (mathCtx.wrongCount >= 2) {
      if (P.shield) {
        P.shield = false;
        toast('🛡️ Shield absorbed the hit!');
      } else {
        G.hp--;
        P.invincible = 90;
        updateGameHUD();
        if (G.hp <= 0) {
          document.getElementById('math-modal').style.display = 'none';
          setTimeout(playerDie, 200);
          return;
        }
      }
      mathCtx.wrongCount = 0;
      toast('❤️ HP: ' + G.hp + '/' + G.maxHp);
    }
  }
}

function openTeachModal() {
  if (!mathCtx.problem) return;
  teachUsedCount++;
  if (teachUsedCount >= 5) checkAch('use_teach');

  // Build explanation but STRIP the final answer line
  const html = buildExplanNoAnswer(mathCtx.problem);
  document.getElementById('explain-modal-header').textContent = '📖 HOW TO SOLVE: ' + mathCtx.problem.question.slice(0, 40);
  document.getElementById('explain-modal-header').style.color = 'var(--purple)';
  document.getElementById('explain-modal-content').innerHTML = html;
  document.getElementById('explain-feedback').textContent = '';
  document.getElementById('explain-answer-input').value = '';
  document.getElementById('math-modal').style.display = 'none';
  document.getElementById('explain-modal').style.display = 'flex';
  setTimeout(() => document.getElementById('explain-answer-input').focus(), 100);
}

function buildExplanNoAnswer(problem) {
  // Get the full explanation from problems.js
  let html = MP.buildExplanation(problem);
  // Strip the answer reveal div (the green box at the bottom)
  html = html.replace(/<div class="explain-answer">.*?<\/div>/gs, '');
  return html;
}

function submitExplainAnswer() {
  const userInput = document.getElementById('explain-answer-input').value.trim();
  if (!userInput) return;
  const correct = MP.checkAnswer(mathCtx.problem, userInput);
  const fb = document.getElementById('explain-feedback');
  if (correct) {
    fb.textContent = '✅ Correct! Now go defeat that monster!';
    fb.style.color = 'var(--green)';
    setTimeout(() => {
      document.getElementById('explain-modal').style.display = 'none';
      document.getElementById('math-modal').style.display = 'flex';
      document.getElementById('math-answer-input').value = userInput;
      document.getElementById('math-feedback').textContent = '';
    }, 1000);
  } else {
    fb.textContent = '❌ Not yet — re-read the steps above and try again.';
    fb.style.color = 'var(--red)';
    document.getElementById('explain-answer-input').value = '';
  }
}

// ── Player death ────────────────────────────────────────────
function playerDie() {
  if (!P) return;
  P.dead = true;
  gameState = 'gameover';
  spawnParticles(P.x + P.w/2, P.y + P.h/2, '#e84040', 20);
  document.getElementById('gameover-overlay').style.display = 'flex';
}

// ── Level complete ─────────────────────────────────────────
function levelComplete() {
  gameState = 'clear';
  const xpEarned = 100 + levelStats.coins * 2 + levelStats.stars * 10;
  addXP(xpEarned);

  if (!G.levelsCompleted.includes(currentLevelDef.id)) {
    G.levelsCompleted.push(currentLevelDef.id);
  }
  // Unlock next level
  const nextId = currentLevelDef.id + 1;
  if (nextId <= LEVEL_DEFS.length && !G.levelsUnlocked.includes(nextId)) {
    G.levelsUnlocked.push(nextId);
  }
  if (!levelStats.tookDamage) checkAch('no_damage');
  if (G.levelsCompleted.length >= 3) checkAch('level_3');
  if (G.levelsCompleted.length >= 6) checkAch('level_6');
  if (G.levelsCompleted.length >= 9) checkAch('level_9');
  writeSave();

  document.getElementById('clear-level-name').textContent = currentLevelDef.name;
  document.getElementById('cs-coins').textContent = levelStats.coins;
  document.getElementById('cs-stars').textContent = levelStats.stars;
  document.getElementById('cs-xp').textContent = '+' + xpEarned;
  spawnConfetti();
  document.getElementById('level-clear-overlay').style.display = 'flex';
}

// ── Particles ──────────────────────────────────────────────
function spawnParticles(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 2 + Math.random() * 4;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 20 + Math.random() * 20,
      maxLife: 40,
      color,
      size: 3 + Math.random() * 3,
    });
  }
}

function spawnConfetti() {
  const colors = ['#5b8dee','#e8a838','#44d479','#e84040','#9c6dd8','#f0d060'];
  for (let i = 0; i < 60; i++) {
    const wrap = document.getElementById('level-clear-overlay');
    if (!wrap) return;
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `left:${Math.random()*100}%;background:${colors[i%colors.length]};
      animation-duration:${1.5+Math.random()*2}s;animation-delay:${Math.random()*0.5}s;
      width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;
      border-radius:${Math.random()>0.5?'50%':'2px'};`;
    wrap.appendChild(piece);
  }
}

// ── RENDER ─────────────────────────────────────────────────
function render() {
  ctx.clearRect(0, 0, CW, CH);
  const def = currentLevelDef;
  if (!def) return;

  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0,0,0,CH);
  const skyColors = def.theme.sky || ['#0a0f1a','#12162a'];
  skyGrad.addColorStop(0, skyColors[0]);
  skyGrad.addColorStop(1, skyColors[1]);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, CW, CH);

  // Background decorations
  renderBackground(def);

  ctx.save();
  ctx.translate(-camX, 0);

  // Ground glow/mist
  renderMist(def);

  // Platforms
  renderPlatforms(def);

  // Portal (only visible when all enemies dead)
  if (portalRect && levelStats.enemiesLeft === 0) renderPortal();

  // Collectibles
  renderCollectibles();

  // Enemies
  renderEnemies(def);

  // Player
  if (P && !P.dead) renderPlayer();

  // Particles
  renderParticlesCanvas();

  ctx.restore();

  // HUD overlays on canvas
  renderCanvasHUD(def);
}

function renderBackground(def) {
  const t = def.theme;
  const scroll1 = camX * 0.2, scroll2 = camX * 0.4;

  if (def.bgTrees) {
    // Tree silhouettes (parallax layer)
    ctx.fillStyle = 'rgba(0,40,0,0.5)';
    for (let i = 0; i < 20; i++) {
      const tx = ((i * 180 - scroll1) % (CW + 200)) - 100;
      const th = 80 + (i%3) * 40;
      drawTree(tx, CH - 60, th);
    }
    ctx.fillStyle = 'rgba(0,60,0,0.4)';
    for (let i = 0; i < 15; i++) {
      const tx = ((i * 230 + 60 - scroll2) % (CW + 200)) - 100;
      const th = 60 + (i%4) * 30;
      drawTree(tx, CH - 60, th);
    }
  }
  if (def.bgCacti) {
    ctx.fillStyle = 'rgba(60,40,0,0.5)';
    for (let i = 0; i < 12; i++) {
      const cx = ((i * 200 - scroll1) % (CW + 200)) - 100;
      drawCactus(cx, CH - 60);
    }
  }
  if (def.bgCave) {
    // Stalactites
    ctx.fillStyle = 'rgba(20,20,50,0.7)';
    for (let i = 0; i < 18; i++) {
      const sx = ((i * 150 - scroll1) % (CW + 200)) - 100;
      const sh = 20 + (i%4)*20;
      ctx.beginPath();
      ctx.moveTo(sx, 0); ctx.lineTo(sx+25, 0); ctx.lineTo(sx+12, sh);
      ctx.fill();
    }
    // Gems
    ctx.fillStyle = 'rgba(80,80,200,0.6)';
    for (let i = 0; i < 10; i++) {
      const gx = ((i * 280 - scroll2) % (CW + 200)) - 100;
      const gy = 80 + (i%3)*60;
      ctx.beginPath();
      ctx.arc(gx, gy, 6, 0, Math.PI*2);
      ctx.fill();
    }
  }
  if (def.bgDungeon || def.bgTower) {
    // Stone wall pattern
    ctx.fillStyle = 'rgba(30,10,20,0.5)';
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 10; col++) {
        const bx = ((col * 120 + (row%2)*60) - scroll1*0.3) % (CW+120);
        const by = 40 + row * 80;
        ctx.strokeStyle = 'rgba(60,20,40,0.4)';
        ctx.strokeRect(bx, by, 100, 60);
      }
    }
  }
  if (def.bgFinal) {
    // Dramatic red sky with lightning
    const now = performance.now() / 1000;
    if (Math.sin(now * 3) > 0.95) {
      ctx.fillStyle = 'rgba(255,200,100,0.15)';
      ctx.fillRect(0, 0, CW, CH);
    }
  }
}

function drawTree(x, groundY, h) {
  // trunk
  ctx.fillRect(x - 6, groundY - h * 0.4, 12, h * 0.4);
  // canopy
  ctx.beginPath();
  ctx.arc(x, groundY - h * 0.4, h * 0.35, 0, Math.PI * 2);
  ctx.fill();
}
function drawCactus(x, groundY) {
  ctx.fillRect(x - 5, groundY - 70, 10, 70);
  ctx.fillRect(x - 25, groundY - 50, 20, 8);
  ctx.fillRect(x + 5, groundY - 40, 20, 8);
}

function renderMist(def) {
  const t = def.theme;
  const grad = ctx.createLinearGradient(0, CH - 80, 0, CH);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(1, t.ground + 'cc');
  ctx.fillStyle = grad;
  ctx.fillRect(camX, CH - 80, CW + 100, 80);
}

function renderPlatforms(def) {
  const t = def.theme;
  for (const plat of currentLevelPlatforms) {
    // Skip if off-screen
    if (plat.x + plat.w < camX - 50 || plat.x > camX + CW + 50) continue;
    const isGround = plat.h > 30;

    // Main body
    ctx.fillStyle = t.dirt;
    ctx.fillRect(plat.x, plat.y, plat.w, plat.h);

    // Top surface
    ctx.fillStyle = t.ground;
    ctx.fillRect(plat.x, plat.y, plat.w, isGround ? 14 : 8);

    // Accent stripe
    ctx.fillStyle = t.accent;
    ctx.fillRect(plat.x, plat.y, plat.w, 3);

    // Border
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(plat.x, plat.y, plat.w, plat.h);
  }
}

function renderPortal() {
  const p = portalRect;
  const now = performance.now() / 1000;
  // Pulsing portal effect
  const pulse = 0.8 + 0.2 * Math.sin(now * 3);
  ctx.save();
  // Glow
  ctx.shadowBlur = 30 * pulse;
  ctx.shadowColor = '#44d479';
  // Portal frame
  ctx.fillStyle = `rgba(68,212,121,${0.8 * pulse})`;
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.fillStyle = `rgba(0,255,150,${0.4 * pulse})`;
  ctx.fillRect(p.x + 8, p.y + 8, p.w - 16, p.h - 16);
  // Text
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('EXIT', p.x + p.w/2, p.y + p.h/2 + 4);
  ctx.restore();
}

function renderCollectibles() {
  const now = performance.now() / 1000;
  for (const item of currentLevelCollect) {
    if (item.collected) continue;
    if (item.x < camX - 50 || item.x > camX + CW + 50) continue;
    const bob = Math.sin(now * 2 + (item.bobOffset||0)) * 4;

    if (item.type === 'coin') {
      // Gold coin
      ctx.save();
      ctx.fillStyle = '#f0d060';
      ctx.shadowBlur = 8; ctx.shadowColor = '#f0d060';
      ctx.beginPath();
      ctx.arc(item.x, item.y + bob, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c0a020';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('$', item.x, item.y + bob + 4);
      ctx.restore();
    } else if (item.type === 'star') {
      // Star
      ctx.save();
      ctx.fillStyle = '#ffffa0';
      ctx.shadowBlur = 12; ctx.shadowColor = '#ffffa0';
      drawStar(item.x, item.y + bob, 14, 6);
      ctx.restore();
    } else if (item.type === 'powerup') {
      // Power-up crate
      ctx.save();
      const col = item.powerType==='hp'?'#e84040': item.powerType==='hint'?'#5b8dee':'#9c6dd8';
      ctx.fillStyle = col;
      ctx.shadowBlur = 14; ctx.shadowColor = col;
      ctx.fillRect(item.x - 16, item.y - 16 + bob, 32, 32);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
      ctx.strokeRect(item.x - 16, item.y - 16 + bob, 32, 32);
      ctx.fillStyle = '#fff';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.type==='powerup'?(item.powerType==='hp'?'❤️':item.powerType==='hint'?'💡':'🛡️'):'?',
        item.x, item.y + bob + 6);
      ctx.restore();
    }
  }
}

function drawStar(cx, cy, outerR, innerR) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI * 2 * i / 10) - Math.PI / 2;
    if (i === 0) ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    else ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
  }
  ctx.closePath(); ctx.fill();
}

function renderEnemies(def) {
  const now = performance.now() / 1000;
  for (const e of currentLevelEnemies) {
    if (!e.alive) continue;
    if (e.x < camX - 80 || e.x > camX + CW + 80) continue;

    const bounce = Math.sin(now * 3 + e.id) * 3;
    const facing = e.dir;

    ctx.save();
    ctx.translate(e.x + e.w/2, e.y + e.h/2 + bounce);
    ctx.scale(facing, 1);

    // Enemy body — color based on topic
    const col = def.topic==='A'?'#5b8dee': def.topic==='B'?'#9c4040': def.topic==='C'?'#408040':'#c03030';
    const darkCol = def.topic==='A'?'#2a5aaa': def.topic==='B'?'#701010': def.topic==='C'?'#206020':'#801010';

    // Body
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(0, -4, 18, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#fff';
    ctx.fillRect(-10, -12, 8, 8);
    ctx.fillRect(2, -12, 8, 8);
    ctx.fillStyle = '#111';
    ctx.fillRect(-8, -10, 5, 5);
    ctx.fillRect(4, -10, 5, 5);
    // Mouth (angry)
    ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, 2); ctx.lineTo(8, 2); ctx.stroke();

    ctx.restore();

    // Label showing the math on the enemy
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(e.x - 2, e.y - 22, e.w + 4, 18);
    ctx.fillStyle = '#f0d060';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(e.label, e.x + e.w/2, e.y - 8);
    ctx.restore();

    // Alert radius visual when player is close
    if (P && dist(P.x + P.w/2, P.y + P.h/2, e.x + e.w/2, e.y + e.h/2) < e.alertRadius * 0.5) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255,50,50,0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4,4]);
      ctx.beginPath();
      ctx.arc(e.x + e.w/2, e.y + e.h/2, e.alertRadius * 0.5, 0, Math.PI*2);
      ctx.stroke();
      ctx.restore();
    }
  }
}

function dist(x1,y1,x2,y2) {
  return Math.sqrt((x2-x1)**2+(y2-y1)**2);
}

function renderPlayer() {
  if (!P) return;
  const now = performance.now() / 1000;
  const blink = P.invincible > 0 && Math.floor(now * 8) % 2 === 0;
  if (blink) return;

  ctx.save();
  ctx.translate(P.x + P.w/2, P.y + P.h/2);
  ctx.scale(P.facing, 1);

  // Body (knight)
  // Legs
  const legSwing = P.onGround ? Math.sin(now * 10) * 6 : 0;
  ctx.fillStyle = '#2255cc';
  ctx.fillRect(-8, 8, 6, 14 + (P.onGround ? legSwing : 0));
  ctx.fillRect(2, 8, 6, 14 - (P.onGround ? legSwing : 0));
  // Torso
  ctx.fillStyle = '#3a7aff';
  ctx.fillRect(-10, -8, 20, 18);
  // Armor highlight
  ctx.fillStyle = '#5599ff';
  ctx.fillRect(-8, -6, 16, 5);
  // Head
  ctx.fillStyle = '#c0c0f0';
  ctx.fillRect(-8, -22, 16, 16);
  // Visor
  ctx.fillStyle = '#5b8dee';
  ctx.fillRect(-6, -16, 12, 4);
  // Eyes (visible through visor)
  ctx.fillStyle = '#ffff80';
  ctx.fillRect(-4, -16, 3, 3);
  ctx.fillRect(1, -16, 3, 3);
  // Sword
  ctx.fillStyle = '#c0c0c0';
  ctx.fillRect(10, -10, 4, 20);
  ctx.fillStyle = '#8a6020';
  ctx.fillRect(8, -4, 8, 4);
  // Shield if active
  if (P.shield) {
    ctx.strokeStyle = '#9c6dd8'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI*2);
    ctx.stroke();
  }

  ctx.restore();
}

function renderParticlesCanvas() {
  for (const p of particles) {
    ctx.save();
    const alpha = Math.min(1, p.life / 15);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
    ctx.restore();
  }
}

function renderCanvasHUD(def) {
  // Enemy counter at top-right on canvas
  if (levelStats.enemiesLeft > 0) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(CW - 160, 8, 152, 28);
    ctx.fillStyle = '#e84040';
    ctx.font = 'bold 11px "Courier New"';
    ctx.textAlign = 'right';
    ctx.fillText('👾 ' + levelStats.enemiesLeft + ' monsters left', CW - 12, 27);
    ctx.restore();
  } else {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(CW - 200, 8, 192, 28);
    ctx.fillStyle = '#44d479';
    ctx.font = 'bold 11px "Courier New"';
    ctx.textAlign = 'right';
    ctx.fillText('✅ All defeated → REACH PORTAL!', CW - 12, 27);
    ctx.restore();
  }
}

// ── HTML HUD update ────────────────────────────────────────
function updateGameHUD() {
  if (!G || !currentLevelDef) return;
  // Hearts
  const hearts = document.getElementById('hud-hearts');
  if (hearts) {
    hearts.innerHTML = '';
    for (let i = 0; i < G.maxHp; i++) {
      const h = document.createElement('span');
      h.textContent = i < G.hp ? '❤️' : '🖤';
      h.style.fontSize = '18px';
      hearts.appendChild(h);
    }
  }
  const ln = document.getElementById('hud-level-name');
  if (ln) ln.textContent = currentLevelDef.name;
  const el = document.getElementById('hud-enemies-left');
  if (el) el.textContent = levelStats.enemiesLeft + ' monsters remaining';
  const hc = document.getElementById('hud-coins');
  if (hc) hc.textContent = G.coins;
  const hs = document.getElementById('hud-stars');
  if (hs) hs.textContent = G.stars;
}

// ── Helpers ────────────────────────────────────────────────
function formatQuestion(text) {
  return text.replace(/(\d+)\s*\/\s*(\d+)/g, (_, n, d) =>
    `<span class="frac-display"><span class="frac-num">${n}</span><span class="frac-den">${d}</span></span>`
  );
}

function togglePause() {
  if (gameState === 'playing') {
    gameState = 'paused';
    document.getElementById('pause-overlay').style.display = 'flex';
  } else if (gameState === 'paused') {
    gameState = 'playing';
    document.getElementById('pause-overlay').style.display = 'none';
  }
}

// ── Map Screen ─────────────────────────────────────────────
function renderMapScreen() {
  showHTMLScreen('screen-map');
  document.getElementById('map-name').textContent = G.playerName;
  document.getElementById('map-hp').textContent = G.hp + '/' + G.maxHp;
  document.getElementById('map-coins').textContent = G.coins;
  document.getElementById('map-level').textContent = G.heroLevel;
  document.getElementById('map-xp').textContent = G.heroXP;
  document.getElementById('map-xp-max').textContent = G.heroMaxXP;
  const pct = Math.round((G.heroXP / G.heroMaxXP) * 100);
  document.getElementById('map-xp-fill').style.width = pct + '%';

  const grid = document.getElementById('level-grid');
  grid.innerHTML = '';
  LEVEL_DEFS.forEach(def => {
    const unlocked  = G.levelsUnlocked.includes(def.id);
    const completed = G.levelsCompleted.includes(def.id);
    const card = document.createElement('div');
    card.className = `dungeon-card${unlocked?'':' locked'}${completed?' completed':''}`;
    card.innerHTML = `
      <div style="font-size:28px;">${def.bgTrees?'🌲':def.bgCacti?'🏜️':def.bgCave?'🕳️':def.bgDungeon?'⚙️':def.bgTower?'🗼':def.bgMarsh?'🌿':def.bgKingdom?'👑':def.bgOcean?'💧':def.bgFinal?'🏰':'⚔️'}</div>
      <div class="dungeon-name">Level ${def.id}</div>
      <div class="dungeon-name" style="font-size:6px;margin-top:2px;">${def.name}</div>
      <div style="font-size:12px;margin-top:4px;">${completed ? '✅' : unlocked ? '▶' : '🔒'}</div>
    `;
    if (unlocked) {
      card.addEventListener('click', () => enterLevel(def));
    }
    grid.appendChild(card);
  });
}

function enterLevel(def) {
  G.hp = G.maxHp; // restore HP on level entry
  writeSave();
  loadLevel(def);
  showHTMLScreen('game-viewport');
  // Hide all overlays
  ['math-modal','explain-modal','level-clear-overlay','gameover-overlay','pause-overlay'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  gameState = 'playing';
  startLoop();
  updateGameHUD();
}

// ── Streak ─────────────────────────────────────────────────
function updateStreak() {
  const today = new Date().toDateString();
  if (G.streak.lastDate === today) return;
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  G.streak.current = G.streak.lastDate === yesterday.toDateString() ? G.streak.current + 1 : 1;
  G.streak.best = Math.max(G.streak.best, G.streak.current);
  G.streak.lastDate = today;
  if (G.streak.current >= 3) checkAch('streak_3');
}

// ── Achievements screen ────────────────────────────────────
function renderAchScreen() {
  showHTMLScreen('screen-achievements');
  const grid = document.getElementById('ach-grid');
  grid.innerHTML = '';
  ACH.forEach(def => {
    const unlocked = G.achievements.includes(def.id);
    const card = document.createElement('div');
    card.className = `ach-card${unlocked?' unlocked':''}`;
    card.innerHTML = `
      <div class="ach-icon">${def.icon}</div>
      <div class="ach-name">${def.name}</div>
      <div class="ach-desc">${unlocked ? def.desc : '???'}</div>`;
    grid.appendChild(card);
  });
  document.getElementById('ach-count').textContent =
    G.achievements.length + ' / ' + ACH.length + ' unlocked';
}

// ── Title screen ───────────────────────────────────────────
function renderTitleScreen() {
  showHTMLScreen('screen-title');
  const hasSave = G && (G.levelsCompleted.length > 0 || G.levelsUnlocked.length > 1);
  document.getElementById('btn-continue').style.display = G ? '' : 'none';
  document.getElementById('btn-start').style.display    = G ? 'none' : '';
  if (G && G.streak.current >= 2) {
    document.getElementById('streak-badge').classList.remove('hidden');
    document.getElementById('streak-val').textContent = G.streak.current;
  }
}

// ── INIT ───────────────────────────────────────────────────
function init() {
  bindAllButtons();
  bindMobile();

  const saved = loadSave();
  if (saved) {
    G = saved;
    updateStreak();
    writeSave();
    renderTitleScreen();
  } else {
    showHTMLScreen('screen-name');
  }
}

// ── Button bindings ────────────────────────────────────────
function bindAllButtons() {

  // Name
  document.getElementById('btn-name-confirm').addEventListener('click', () => {
    const name = (document.getElementById('name-input').value.trim().toUpperCase()) || 'HERO';
    G = defaultSave(name);
    writeSave();
    renderTitleScreen();
  });
  document.getElementById('name-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-name-confirm').click();
  });

  // Title
  document.getElementById('btn-start').addEventListener('click', () => {
    if (!G) { showHTMLScreen('screen-name'); return; }
    renderMapScreen();
  });
  document.getElementById('btn-continue').addEventListener('click', () => {
    if (!G) { showHTMLScreen('screen-name'); return; }
    renderMapScreen();
  });
  document.getElementById('btn-newgame').addEventListener('click', () => {
    if (confirm('Start a new game? All progress will be lost!')) {
      localStorage.removeItem(SAVE_KEY);
      G = null;
      showHTMLScreen('screen-name');
    }
  });
  document.getElementById('btn-achievements').addEventListener('click', () => {
    if (G) renderAchScreen();
  });

  // Map
  document.getElementById('btn-map-back').addEventListener('click', renderTitleScreen);

  // Math modal
  document.getElementById('btn-math-submit').addEventListener('click', () => {
    submitMathAnswer(document.getElementById('math-answer-input').value.trim());
  });
  document.getElementById('math-answer-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-math-submit').click();
  });
  document.getElementById('btn-math-hint').addEventListener('click', () => {
    if (!mathCtx.problem || (G.hintsLeft || 0) <= 0) { toast('No hints left!'); return; }
    G.hintsLeft--;
    document.getElementById('math-hint-box').textContent = '💡 ' + mathCtx.problem.hint;
    document.getElementById('math-hint-box').style.display = 'block';
    document.getElementById('math-hint-count').textContent = G.hintsLeft;
    writeSave();
  });
  document.getElementById('btn-math-teach').addEventListener('click', openTeachModal);

  // Explanation modal
  document.getElementById('btn-explain-submit').addEventListener('click', submitExplainAnswer);
  document.getElementById('explain-answer-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-explain-submit').click();
  });
  document.getElementById('btn-explain-back').addEventListener('click', () => {
    document.getElementById('explain-modal').style.display = 'none';
    document.getElementById('math-modal').style.display = 'flex';
  });

  // Level clear
  document.getElementById('btn-next-level').addEventListener('click', () => {
    document.getElementById('level-clear-overlay').style.display = 'none';
    if (raf) cancelAnimationFrame(raf);
    const nextId = currentLevelDef ? currentLevelDef.id + 1 : 1;
    const nextDef = LEVEL_DEFS.find(d => d.id === nextId);
    if (nextDef && G.levelsUnlocked.includes(nextDef.id)) {
      enterLevel(nextDef);
    } else {
      renderMapScreen();
    }
  });
  document.getElementById('btn-back-map').addEventListener('click', () => {
    document.getElementById('level-clear-overlay').style.display = 'none';
    if (raf) cancelAnimationFrame(raf);
    renderMapScreen();
  });

  // Game over
  document.getElementById('btn-retry-level').addEventListener('click', () => {
    document.getElementById('gameover-overlay').style.display = 'none';
    if (currentLevelDef) enterLevel(currentLevelDef);
    else renderMapScreen();
  });
  document.getElementById('btn-go-map').addEventListener('click', () => {
    document.getElementById('gameover-overlay').style.display = 'none';
    if (raf) cancelAnimationFrame(raf);
    renderMapScreen();
  });

  // Pause
  document.getElementById('btn-resume').addEventListener('click', () => {
    gameState = 'playing';
    document.getElementById('pause-overlay').style.display = 'none';
  });
  document.getElementById('btn-pause-map').addEventListener('click', () => {
    document.getElementById('pause-overlay').style.display = 'none';
    if (raf) cancelAnimationFrame(raf);
    renderMapScreen();
  });

  // Achievements back
  document.getElementById('btn-ach-back').addEventListener('click', renderTitleScreen);
}

window.addEventListener('DOMContentLoaded', init);

})();
