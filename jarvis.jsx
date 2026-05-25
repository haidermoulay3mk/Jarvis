import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Home, Target, Languages, Dumbbell, Apple, Activity, CreditCard, Bot,
  Check, Circle, Plus, Minus, Send, Mic, MicOff, Moon, Sun, Droplet,
  BookOpen, Code2, Brain, Trophy, Flame, Zap, ChevronRight, ChevronDown,
  Calendar, ExternalLink, Trash2, Edit3, X, Save, MoonStar, BedDouble,
  Heart, Star, Award, Sparkles, Cpu, GitBranch, Briefcase, DollarSign,
  Camera, Crown, Hand, Loader2
} from 'lucide-react';

// ============================================================
// CONSTANTS & DATA
// ============================================================

const RANKS = [
  { name: 'Recruit', min: 0, color: '#737373' },
  { name: 'Initiate', min: 500, color: '#a3a3a3' },
  { name: 'Operative', min: 1500, color: '#fbbf24' },
  { name: 'Specialist', min: 3500, color: '#f59e0b' },
  { name: 'Agent', min: 7000, color: '#f97316' },
  { name: 'Elite Agent', min: 12000, color: '#ea580c' },
  { name: 'Commander', min: 20000, color: '#dc2626' },
  { name: 'Director', min: 35000, color: '#b91c1c' },
  { name: 'Master', min: 60000, color: '#9333ea' },
  { name: 'JARVIS', min: 100000, color: '#06b6d4' },
];

const getRank = (exp) => {
  let current = RANKS[0];
  let next = RANKS[1];
  for (let i = 0; i < RANKS.length; i++) {
    if (exp >= RANKS[i].min) {
      current = RANKS[i];
      next = RANKS[i + 1] || null;
    }
  }
  return { current, next };
};

const todayKey = () => new Date().toISOString().split('T')[0];

// ============================================================
// GOAL ROADMAPS — every task has direct action, link, days
// ============================================================

const ROADMAPS = {
  coding: {
    title: 'Coding • CS • AI Engineering',
    icon: Code2,
    color: '#fbbf24',
    description: 'Python → CS50 → GitHub → APIs → ML → AI Engineering → Build & Sell',
    sections: [
      {
        title: 'Phase 1 — Python Foundations',
        tasks: [
          { id: 'c1', title: 'Watch "Python for Beginners" by freeCodeCamp (4h 26m, watch in chunks)', link: 'https://www.youtube.com/watch?v=rfscVS0vtbw', days: 4, exp: 75 },
          { id: 'c2', title: 'Install Python + VS Code on your machine', link: 'https://code.visualstudio.com/', days: 1, exp: 25 },
          { id: 'c3', title: 'Complete CS50P — Harvard Python (10 problem sets)', link: 'https://cs50.harvard.edu/python/', days: 45, exp: 500 },
        ],
      },
      {
        title: 'Phase 2 — CS Fundamentals',
        tasks: [
          { id: 'c4', title: 'Complete CS50x — Harvard CS Intro (all weeks, final project)', link: 'https://cs50.harvard.edu/x/', days: 75, exp: 800 },
          { id: 'c5', title: 'Get CS50 certificate (free verified certificate)', link: 'https://cs50.harvard.edu/certificates/', days: 1, exp: 200 },
        ],
      },
      {
        title: 'Phase 3 — Git & GitHub (start in parallel with Phase 2)',
        tasks: [
          { id: 'c6', title: 'Watch "Git & GitHub Crash Course" by freeCodeCamp (1h)', link: 'https://www.youtube.com/watch?v=RGOj5yH7evk', days: 1, exp: 30 },
          { id: 'c7', title: 'Complete GitHub Skills — Introduction track', link: 'https://skills.github.com/', days: 3, exp: 75 },
          { id: 'c8', title: 'Create GitHub profile README (pinned repos, bio)', link: 'https://github.com/abhisheknaiidu/awesome-github-profile-readme', days: 1, exp: 50 },
          { id: 'c9', title: 'Push first Python project to GitHub (any CS50P final)', link: 'https://github.com/new', days: 1, exp: 100 },
        ],
      },
      {
        title: 'Phase 4 — APIs',
        tasks: [
          { id: 'c10', title: 'Watch "APIs for Beginners" — freeCodeCamp (2h 30m)', link: 'https://www.youtube.com/watch?v=GZvSYJDk-us', days: 3, exp: 75 },
          { id: 'c11', title: 'Build weather app using OpenWeather API (Python)', link: 'https://openweathermap.org/api', days: 3, exp: 100 },
          { id: 'c12', title: 'Build CLI tool that uses 2 different APIs', days: 5, exp: 150 },
          { id: 'c13', title: 'Push both API projects to GitHub with READMEs', days: 1, exp: 50 },
        ],
      },
      {
        title: 'Phase 5 — System Design',
        tasks: [
          { id: 'c14', title: 'Read "System Design Primer" — main sections only', link: 'https://github.com/donnemartin/system-design-primer', days: 14, exp: 200 },
          { id: 'c15', title: 'Watch Gaurav Sen System Design Playlist (top 10 videos)', link: 'https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX', days: 14, exp: 200 },
        ],
      },
      {
        title: 'Phase 6 — Machine Learning',
        tasks: [
          { id: 'c16', title: 'Audit Andrew Ng "Machine Learning Specialization" (free audit)', link: 'https://www.coursera.org/specializations/machine-learning-introduction', days: 60, exp: 800 },
          { id: 'c17', title: 'Complete Kaggle "Intro to ML" + "Intermediate ML" (free certs)', link: 'https://www.kaggle.com/learn', days: 10, exp: 250 },
          { id: 'c18', title: 'Complete fast.ai "Practical Deep Learning" Part 1', link: 'https://course.fast.ai/', days: 45, exp: 600 },
          { id: 'c19', title: 'Hugging Face NLP Course (free)', link: 'https://huggingface.co/learn/nlp-course', days: 20, exp: 300 },
          { id: 'c20', title: 'Build & deploy 1 ML project, push to GitHub', days: 14, exp: 400 },
        ],
      },
      {
        title: 'Phase 7 — AI Engineering',
        tasks: [
          { id: 'c21', title: 'Read Anthropic Claude API docs (Quickstart + Tool use)', link: 'https://docs.claude.com/en/docs/intro', days: 3, exp: 100 },
          { id: 'c22', title: 'Complete DeepLearning.AI "Functions, Tools and Agents" (free)', link: 'https://www.deeplearning.ai/short-courses/', days: 2, exp: 75 },
          { id: 'c23', title: 'Build a RAG chatbot (LangChain or LlamaIndex)', link: 'https://python.langchain.com/docs/tutorials/rag/', days: 10, exp: 300 },
          { id: 'c24', title: 'Build an AI agent that calls 3+ tools', days: 14, exp: 400 },
        ],
      },
      {
        title: 'Phase 8 — Vibe Coding & Claude Code',
        tasks: [
          { id: 'c25', title: 'Install Claude Code CLI + read docs', link: 'https://docs.claude.com/en/docs/claude-code/overview', days: 1, exp: 50 },
          { id: 'c26', title: 'Build a small full-stack app entirely via Claude Code', days: 5, exp: 200 },
          { id: 'c27', title: 'Set up Claude in Chrome for a personal workflow', link: 'https://claude.ai/chrome', days: 1, exp: 50 },
          { id: 'c28', title: 'Watch top 3 "Claude Code workflow" videos on YouTube', days: 2, exp: 50 },
        ],
      },
      {
        title: 'Phase 9 — Build Cal AI-Style App',
        tasks: [
          { id: 'c29', title: 'Pick your concept (1 sentence: what + who)', days: 2, exp: 50 },
          { id: 'c30', title: 'Sketch UI on paper (3 screens max)', days: 1, exp: 30 },
          { id: 'c31', title: 'Build MVP with Claude Code (React Native or web)', days: 21, exp: 600 },
          { id: 'c32', title: 'Ship to App Store / Web', days: 7, exp: 400 },
        ],
      },
      {
        title: 'Phase 10 — Monetize',
        tasks: [
          { id: 'c33', title: 'Set up Gumroad account (free)', link: 'https://gumroad.com/', days: 1, exp: 50 },
          { id: 'c34', title: 'Launch first paid offer — under BHD15/month membership', days: 7, exp: 500 },
          { id: 'c35', title: 'Make first BHD1 online', days: 0, exp: 1000 },
        ],
      },
    ],
  },

  math: {
    title: 'Math & Physics',
    icon: Brain,
    color: '#06b6d4',
    description: 'A-Level Math/Physics → Calculus → Linear Algebra → Math for ML',
    sections: [
      {
        title: 'Phase 1 — Foundations Refresh',
        tasks: [
          { id: 'm1', title: 'Khan Academy "Algebra 1" (entire course, take notes)', link: 'https://www.khanacademy.org/math/algebra', days: 14, exp: 200 },
          { id: 'm2', title: 'Khan Academy "Trigonometry"', link: 'https://www.khanacademy.org/math/trigonometry', days: 10, exp: 150 },
        ],
      },
      {
        title: 'Phase 2 — AS Level Math',
        tasks: [
          { id: 'm3', title: 'ExamSolutions — AS Pure Math (full playlist)', link: 'https://www.examsolutions.net/a-level-maths/', days: 30, exp: 400 },
          { id: 'm4', title: 'Physics & Maths Tutor — AS Math past papers (do 5)', link: 'https://www.physicsandmathstutor.com/maths-revision/a-level-edexcel/', days: 7, exp: 150 },
        ],
      },
      {
        title: 'Phase 3 — A2 Level Math',
        tasks: [
          { id: 'm5', title: 'ExamSolutions — A2 Pure Math (full playlist)', link: 'https://www.examsolutions.net/a-level-maths/', days: 30, exp: 400 },
          { id: 'm6', title: 'A2 Math past papers (do 5)', link: 'https://www.physicsandmathstutor.com/maths-revision/a-level-edexcel/', days: 7, exp: 150 },
        ],
      },
      {
        title: 'Phase 4 — AS/A Level Physics',
        tasks: [
          { id: 'm7', title: 'Physics & Maths Tutor — AS Physics (all topics)', link: 'https://www.physicsandmathstutor.com/physics-revision/', days: 25, exp: 350 },
          { id: 'm8', title: 'Physics & Maths Tutor — A2 Physics (all topics)', link: 'https://www.physicsandmathstutor.com/physics-revision/', days: 25, exp: 350 },
        ],
      },
      {
        title: 'Phase 5 — Calculus (Differential)',
        tasks: [
          { id: 'm9', title: '3Blue1Brown "Essence of Calculus" (10 videos)', link: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr', days: 5, exp: 150 },
          { id: 'm10', title: 'Khan Academy "Calculus 1"', link: 'https://www.khanacademy.org/math/calculus-1', days: 20, exp: 350 },
        ],
      },
      {
        title: 'Phase 6 — Integral Calculus',
        tasks: [
          { id: 'm11', title: 'Khan Academy "Calculus 2" (integrals + series)', link: 'https://www.khanacademy.org/math/calculus-2', days: 20, exp: 350 },
          { id: 'm12', title: 'Khan Academy "Multivariable Calculus"', link: 'https://www.khanacademy.org/math/multivariable-calculus', days: 14, exp: 300 },
        ],
      },
      {
        title: 'Phase 7 — Math for ML',
        tasks: [
          { id: 'm13', title: '3Blue1Brown "Essence of Linear Algebra"', link: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', days: 5, exp: 150 },
          { id: 'm14', title: 'Khan Academy "Linear Algebra"', link: 'https://www.khanacademy.org/math/linear-algebra', days: 15, exp: 300 },
          { id: 'm15', title: 'Khan Academy "Statistics & Probability"', link: 'https://www.khanacademy.org/math/statistics-probability', days: 20, exp: 300 },
          { id: 'm16', title: 'Coursera "Mathematics for ML" — Imperial College (audit free)', link: 'https://www.coursera.org/specializations/mathematics-machine-learning', days: 30, exp: 500 },
        ],
      },
    ],
  },

  fitness: {
    title: 'Physique • Pull-ups • Calisthenics • Flips',
    icon: Dumbbell,
    color: '#ef4444',
    description: 'Train 6x/week → 20 pull-ups → Handstand → HSPU → L-sit → Flips',
    sections: [
      {
        title: 'Foundation — First 60 Days',
        tasks: [
          { id: 'f1', title: 'Take starting photos (front, side, back) + log weight', days: 1, exp: 50 },
          { id: 'f2', title: 'Get measuring tape — log waist, chest, arms', days: 1, exp: 25 },
          { id: 'f3', title: 'Watch Jeff Nippard "Push Pull Legs" guide', link: 'https://www.youtube.com/watch?v=L9TMRvgEKsg', days: 1, exp: 25 },
          { id: 'f4', title: 'Complete 60 days of consistent PPL training (logged in Workouts tab)', days: 60, exp: 500 },
        ],
      },
      {
        title: '20 Pull-Up Plan',
        tasks: [
          { id: 'f5', title: 'Test max pull-ups (log baseline)', days: 1, exp: 25 },
          { id: 'f6', title: 'Greasing the Groove — 5 sets/day, sub-max reps, 30 days', link: 'https://www.youtube.com/watch?v=-uxXh3cf5N4', days: 30, exp: 250 },
          { id: 'f7', title: 'Weighted pull-ups protocol — 8 weeks', link: 'https://www.youtube.com/watch?v=v9hRq6JryWE', days: 56, exp: 400 },
          { id: 'f8', title: 'Hit 20 pull-ups in a row', days: 0, exp: 1000 },
        ],
      },
      {
        title: 'Perfect Handstand',
        tasks: [
          { id: 'f9', title: 'FitnessFAQs "Handstand Tutorial" (full playlist)', link: 'https://www.youtube.com/@FitnessFAQs', days: 3, exp: 50 },
          { id: 'f10', title: 'Daily wrist + shoulder prep — 14 days', days: 14, exp: 100 },
          { id: 'f11', title: 'Wall handstand — hold 60s unbroken', days: 30, exp: 250 },
          { id: 'f12', title: 'Freestanding handstand — 10s', days: 30, exp: 400 },
          { id: 'f13', title: 'Freestanding handstand — 30s clean', days: 0, exp: 600 },
        ],
      },
      {
        title: 'HSPU (Handstand Push-Up)',
        tasks: [
          { id: 'f14', title: 'Pike push-ups — 3x10 strict', days: 14, exp: 100 },
          { id: 'f15', title: 'Elevated pike push-ups — 3x8', days: 14, exp: 100 },
          { id: 'f16', title: 'Wall HSPU — 3x5', days: 21, exp: 300 },
          { id: 'f17', title: 'Freestanding HSPU — 1 rep', days: 0, exp: 800 },
        ],
      },
      {
        title: 'L-Sit & Advanced',
        tasks: [
          { id: 'f18', title: 'Tuck L-sit — 30s', days: 14, exp: 100 },
          { id: 'f19', title: 'Full L-sit — 30s', days: 30, exp: 300 },
          { id: 'f20', title: 'L-sit to handstand — Calimove tutorial', link: 'https://www.youtube.com/@Calimove', days: 45, exp: 500 },
          { id: 'f21', title: 'Pike to handstand — clean rep', days: 30, exp: 500 },
        ],
      },
      {
        title: 'Flips (USE A MAT / TRAINED SPOTTER)',
        tasks: [
          { id: 'f22', title: 'Damien Walters "Sideflip Tutorial" — drill on soft surface', link: 'https://www.youtube.com/@DamienWalters', days: 14, exp: 200 },
          { id: 'f23', title: 'Land first sideflip', days: 0, exp: 500 },
          { id: 'f24', title: 'Damien Walters "Backflip Tutorial" — drill progression', days: 30, exp: 300 },
          { id: 'f25', title: 'Land first backflip', days: 0, exp: 800 },
        ],
      },
      {
        title: 'Unrecognizable Physique',
        tasks: [
          { id: 'f26', title: '12 months of consistent training + nutrition logged', days: 365, exp: 2000 },
          { id: 'f27', title: 'Compare 12-month progress photos', days: 1, exp: 500 },
        ],
      },
    ],
  },

  brand: {
    title: 'Fitness Brand — IG & YouTube',
    icon: Camera,
    color: '#ec4899',
    description: 'Alex Eubank-style. Study → Setup → Daily reels → Long-form weekly',
    sections: [
      {
        title: 'Study & Setup',
        tasks: [
          { id: 'b1', title: 'Study Alex Eubank — watch 30 reels, note hooks/cuts/music', link: 'https://www.instagram.com/alex_eubank15/', days: 7, exp: 100 },
          { id: 'b2', title: 'Study 5 other top fitness creators (Sam Sulek, Jesse James West, etc.)', days: 5, exp: 75 },
          { id: 'b3', title: 'Create IG handle + YouTube channel (consistent name)', days: 1, exp: 50 },
          { id: 'b4', title: 'Buy phone tripod + ring light (or window light)', days: 1, exp: 25 },
          { id: 'b5', title: 'Install CapCut mobile (free)', link: 'https://www.capcut.com/', days: 1, exp: 25 },
          { id: 'b6', title: 'Watch "CapCut for Beginners" (1h)', link: 'https://www.youtube.com/results?search_query=capcut+for+beginners+full+course', days: 1, exp: 50 },
        ],
      },
      {
        title: 'Posting Cadence — First 90 Days',
        tasks: [
          { id: 'b7', title: 'Post 1 IG reel/day for 30 days', days: 30, exp: 600 },
          { id: 'b8', title: 'Post 1 YouTube short/day for 30 days', days: 30, exp: 600 },
          { id: 'b9', title: 'Post 1 long-form YouTube video/week for 12 weeks', days: 84, exp: 1200 },
          { id: 'b10', title: 'Engage with 20 accounts/day in your niche (90 days)', days: 90, exp: 600 },
        ],
      },
      {
        title: 'Milestones',
        tasks: [
          { id: 'b11', title: 'First 100 IG followers', exp: 200 },
          { id: 'b12', title: 'First 1000 IG followers', exp: 500 },
          { id: 'b13', title: 'First 10,000 IG followers', exp: 1500 },
          { id: 'b14', title: 'First viral reel (>100k views)', exp: 1000 },
        ],
      },
    ],
  },

  chess: {
    title: 'Professional Chess',
    icon: Crown,
    color: '#a78bfa',
    description: 'Fundamentals → Tactics daily → Openings → Endgames → Play',
    sections: [
      {
        title: 'Fundamentals',
        tasks: [
          { id: 'ch1', title: 'Chess.com free account + finish "Learn the Rules" lesson', link: 'https://www.chess.com/lessons', days: 1, exp: 25 },
          { id: 'ch2', title: 'ChessBrah "Building Habits" series (Levels 1-3)', link: 'https://www.youtube.com/playlist?list=PLBRObSmbZluRiGDWMKtOTJiLy3q0zIfd-', days: 14, exp: 200 },
          { id: 'ch3', title: 'Hanging Pawns "Beginner Openings"', link: 'https://www.youtube.com/@HangingPawns', days: 7, exp: 100 },
        ],
      },
      {
        title: 'Daily Practice (ongoing)',
        tasks: [
          { id: 'ch4', title: 'Solve 10 puzzles/day for 30 days (Chess.com)', link: 'https://www.chess.com/puzzles', days: 30, exp: 300 },
          { id: 'ch5', title: 'Play 1 rapid game/day for 30 days + review with engine', days: 30, exp: 300 },
        ],
      },
      {
        title: 'Advanced',
        tasks: [
          { id: 'ch6', title: 'Saint Louis Chess Club YouTube lectures (top 20)', link: 'https://www.youtube.com/@STLChessClub', days: 60, exp: 500 },
          { id: 'ch7', title: 'Pick 1 white + 1 black opening, study deeply', days: 30, exp: 250 },
          { id: 'ch8', title: 'Reach 1200 ELO on Chess.com Rapid', exp: 500 },
          { id: 'ch9', title: 'Reach 1500 ELO on Chess.com Rapid', exp: 1000 },
          { id: 'ch10', title: 'Reach 1800 ELO on Chess.com Rapid', exp: 2000 },
        ],
      },
    ],
  },

  quran: {
    title: 'Quran — 10 Short Surahs',
    icon: BookOpen,
    color: '#10b981',
    description: 'Memorize 10 short surahs. Listen daily → Read → Memorize → Review',
    sections: [
      {
        title: 'Method (do for each)',
        tasks: [
          { id: 'q0', title: 'Pick reciter (Mishary Alafasy is recommended)', link: 'https://quran.com/', days: 1, exp: 25 },
        ],
      },
      {
        title: '10 Short Surahs',
        tasks: [
          { id: 'q1', title: 'Al-Fil (105) — memorize + 7-day review', link: 'https://quran.com/105', days: 10, exp: 150 },
          { id: 'q2', title: 'Quraysh (106)', link: 'https://quran.com/106', days: 10, exp: 150 },
          { id: 'q3', title: 'Al-Maun (107)', link: 'https://quran.com/107', days: 10, exp: 150 },
          { id: 'q4', title: 'Al-Kawthar (108)', link: 'https://quran.com/108', days: 7, exp: 100 },
          { id: 'q5', title: 'Al-Kafirun (109)', link: 'https://quran.com/109', days: 10, exp: 150 },
          { id: 'q6', title: 'An-Nasr (110)', link: 'https://quran.com/110', days: 7, exp: 100 },
          { id: 'q7', title: 'Al-Masad (111)', link: 'https://quran.com/111', days: 10, exp: 150 },
          { id: 'q8', title: 'Al-Ikhlas (112)', link: 'https://quran.com/112', days: 7, exp: 100 },
          { id: 'q9', title: 'Al-Falaq (113)', link: 'https://quran.com/113', days: 7, exp: 100 },
          { id: 'q10', title: 'An-Nas (114)', link: 'https://quran.com/114', days: 7, exp: 100 },
          { id: 'q11', title: 'Recite all 10 from memory in one sitting', exp: 1000 },
        ],
      },
    ],
  },

  books: {
    title: 'Books — 5 Minimum',
    icon: BookOpen,
    color: '#f97316',
    description: 'Financial literacy + biographies. Read or audiobook (free on Libby)',
    sections: [
      {
        title: 'Read in this order',
        tasks: [
          { id: 'bk1', title: '"Atomic Habits" — James Clear (habits foundation first)', days: 21, exp: 300 },
          { id: 'bk2', title: '"The Psychology of Money" — Morgan Housel', days: 21, exp: 300 },
          { id: 'bk3', title: '"Rich Dad Poor Dad" — Robert Kiyosaki', days: 21, exp: 300 },
          { id: 'bk4', title: '"Shoe Dog" — Phil Knight (Nike biography)', days: 30, exp: 350 },
          { id: 'bk5', title: '"The Almanack of Naval Ravikant" (free PDF available)', link: 'https://www.navalmanack.com/', days: 21, exp: 300 },
        ],
      },
    ],
  },

  aitools: {
    title: 'AI Tools — Pro Workflows',
    icon: Sparkles,
    color: '#8b5cf6',
    description: 'Master Claude, ChatGPT, Perplexity, Cursor, Claude Code',
    sections: [
      {
        title: 'Core Chat AIs',
        tasks: [
          { id: 'a1', title: 'Read Anthropic prompt engineering guide (full)', link: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview', days: 2, exp: 75 },
          { id: 'a2', title: 'Watch "Prompt Engineering for Devs" by Anthropic', link: 'https://www.youtube.com/results?search_query=anthropic+prompt+engineering+course', days: 2, exp: 75 },
          { id: 'a3', title: 'Set up Claude Projects with 3 custom contexts', link: 'https://claude.ai/projects', days: 1, exp: 50 },
          { id: 'a4', title: 'Master ChatGPT custom GPTs — build 3 of your own', link: 'https://chatgpt.com/', days: 3, exp: 100 },
          { id: 'a5', title: 'Use Perplexity for daily research — 14 days', link: 'https://www.perplexity.ai/', days: 14, exp: 75 },
        ],
      },
      {
        title: 'Coding AIs',
        tasks: [
          { id: 'a6', title: 'Cursor IDE — complete onboarding + build 1 project', link: 'https://cursor.sh/', days: 5, exp: 150 },
          { id: 'a7', title: 'Claude Code — see Coding roadmap', days: 0, exp: 0 },
        ],
      },
      {
        title: 'Content/Image AIs',
        tasks: [
          { id: 'a8', title: 'Try Ideogram, Midjourney (free tier), DALL-E — make 20 images', days: 3, exp: 75 },
          { id: 'a9', title: 'ElevenLabs voice cloning (free tier) — clone your voice', link: 'https://elevenlabs.io/', days: 1, exp: 50 },
        ],
      },
    ],
  },

  flow: {
    title: 'Certificates (Free with Cert)',
    icon: Award,
    color: '#14b8a6',
    description: 'Stack credentials. All free or free-to-audit with certificate option',
    sections: [
      {
        title: 'High-Value Free Certificates',
        tasks: [
          { id: 'cert1', title: 'CS50x Certificate (Harvard)', link: 'https://cs50.harvard.edu/certificates/', exp: 500 },
          { id: 'cert2', title: 'CS50P Certificate (Harvard Python)', link: 'https://cs50.harvard.edu/certificates/', exp: 400 },
          { id: 'cert3', title: 'freeCodeCamp "Responsive Web Design" (300h, free cert)', link: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', days: 30, exp: 400 },
          { id: 'cert4', title: 'freeCodeCamp "JavaScript Algorithms" (300h, free cert)', link: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/', days: 45, exp: 500 },
          { id: 'cert5', title: 'Kaggle "Intro to ML" + "Intermediate ML" certs', link: 'https://www.kaggle.com/learn', days: 10, exp: 200 },
          { id: 'cert6', title: 'Google "AI Essentials" (Coursera, free audit + paid cert)', link: 'https://www.coursera.org/google-certificates/ai-essentials', days: 10, exp: 250 },
          { id: 'cert7', title: 'HubSpot "Inbound Marketing" (free cert)', link: 'https://academy.hubspot.com/courses/inbound-marketing', days: 5, exp: 150 },
        ],
      },
    ],
  },
};

const GERMAN_ROADMAP = [
  {
    title: 'Phase 1 — Absolute Beginner (A1, ~60 days)',
    tasks: [
      { id: 'g1', title: 'Install Duolingo (free) — daily 15min streak', link: 'https://www.duolingo.com/', days: 30, exp: 200 },
      { id: 'g2', title: 'Deutsche Welle "Nicos Weg A1" — full course (free)', link: 'https://learngerman.dw.com/en/beginners/c-36519789', days: 30, exp: 500 },
      { id: 'g3', title: 'Learn German alphabet + pronunciation (Easy German YT)', link: 'https://www.youtube.com/@EasyGerman', days: 3, exp: 50 },
      { id: 'g4', title: 'Memorize 100 most common nouns (with der/die/das)', days: 7, exp: 150 },
      { id: 'g5', title: 'Memorize 100 most common verbs', days: 7, exp: 150 },
      { id: 'g6', title: 'Master present tense conjugation (regular + sein/haben)', days: 5, exp: 100 },
      { id: 'g7', title: 'Master numbers 0-1000 + dates + time', days: 5, exp: 75 },
      { id: 'g8', title: 'Hold 5 basic conversations on iTalki community (free)', link: 'https://www.italki.com/', days: 14, exp: 200 },
    ],
  },
  {
    title: 'Phase 2 — A2 (~90 days)',
    tasks: [
      { id: 'g9', title: 'Deutsche Welle "Nicos Weg A2" full course', link: 'https://learngerman.dw.com/en/beginners/c-36519797', days: 45, exp: 600 },
      { id: 'g10', title: 'Master past tenses (Perfekt + Präteritum)', days: 10, exp: 200 },
      { id: 'g11', title: 'Master all 4 cases (Nominativ, Akkusativ, Dativ, Genitiv)', days: 14, exp: 300 },
      { id: 'g12', title: 'Easy German "Super Easy German" playlist (50 videos)', link: 'https://www.youtube.com/playlist?list=PLA5UIoabheFNYcc8eUmsLXEhSyU03XPa3', days: 30, exp: 400 },
      { id: 'g13', title: 'Watch "Extra auf Deutsch" full series (free on YouTube)', link: 'https://www.youtube.com/results?search_query=extra+auf+deutsch+full+episodes', days: 14, exp: 200 },
      { id: 'g14', title: 'Write a 100-word diary entry in German daily for 30 days', days: 30, exp: 400 },
    ],
  },
  {
    title: 'Phase 3 — B1 (~120 days)',
    tasks: [
      { id: 'g15', title: 'Deutsche Welle "Nicos Weg B1"', link: 'https://learngerman.dw.com/en/beginners/c-36519805', days: 60, exp: 800 },
      { id: 'g16', title: 'Read 1 graded reader (Olly Richards "Short Stories in German")', days: 21, exp: 300 },
      { id: 'g17', title: 'Watch 1 German Netflix show with German subs (Dark, Babylon Berlin)', days: 30, exp: 400 },
      { id: 'g18', title: 'Daily Easy German podcast — 30 days', link: 'https://www.easygerman.fm/', days: 30, exp: 300 },
      { id: 'g19', title: 'Master subjunctive (Konjunktiv II)', days: 10, exp: 200 },
      { id: 'g20', title: 'Pass a free online B1 placement test', exp: 500 },
    ],
  },
  {
    title: 'Phase 4 — B2 & Beyond (~150 days)',
    tasks: [
      { id: 'g21', title: 'Deutsche Welle B2 content', link: 'https://learngerman.dw.com/en/learn-german/s-9528', days: 90, exp: 1000 },
      { id: 'g22', title: 'Read a full novel in German', days: 45, exp: 600 },
      { id: 'g23', title: 'Hold a 30-minute conversation entirely in German', exp: 800 },
      { id: 'g24', title: 'Reach C1 level (self-assessed)', exp: 2000 },
    ],
  },
];

// ============================================================
// STORAGE HELPER
// ============================================================

const storage = {
  async get(key, fallback = null) {
    try {
      const r = await window.storage.get(key);
      return r ? JSON.parse(r.value) : fallback;
    } catch {
      return fallback;
    }
  },
  async set(key, value) {
    try {
      await window.storage.set(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set failed:', key, e);
    }
  },
};

// ============================================================
// SHARED UI
// ============================================================

const Checkbox = ({ checked, onToggle, label, link, days, exp, color = '#fbbf24' }) => (
  <div className="group flex items-start gap-3 py-3 px-3 rounded-md hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/[0.05]">
    <button
      onClick={onToggle}
      className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
      aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
    >
      {checked ? (
        <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: color }}>
          <Check size={13} strokeWidth={3} className="text-black" />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-md border-2 border-neutral-700 group-hover:border-neutral-500 transition-colors" />
      )}
    </button>
    <div className="flex-1 min-w-0">
      <div className={`text-[14px] leading-relaxed ${checked ? 'text-neutral-600 line-through' : 'text-neutral-200'}`}>
        {label}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-amber-400 transition-colors font-mono"
          >
            <ExternalLink size={10} />
            open link
          </a>
        )}
        {days > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
            <Calendar size={10} />
            {days}d
          </span>
        )}
        {exp > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono" style={{ color: checked ? '#525252' : color }}>
            <Zap size={10} />
            +{exp} EXP
          </span>
        )}
      </div>
    </div>
  </div>
);

const Card = ({ children, className = '', ...props }) => (
  <div
    className={`bg-neutral-950/40 border border-neutral-800/60 rounded-lg ${className}`}
    {...props}
  >
    {children}
  </div>
);

const SectionTitle = ({ icon: Icon, children, accent = '#fbbf24' }) => (
  <div className="flex items-center gap-2.5 mb-4">
    {Icon && <Icon size={16} style={{ color: accent }} />}
    <h3 className="text-[11px] uppercase tracking-[0.18em] text-neutral-400 font-medium">{children}</h3>
  </div>
);

// ============================================================
// VIEWS
// ============================================================

const DashboardView = ({ exp, streak, tasksCompleted, totalTasks, todayStats, onNavigate }) => {
  const { current, next } = getRank(exp);
  const progressToNext = next ? ((exp - current.min) / (next.min - current.min)) * 100 : 100;

  const completionPct = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Hero rank card */}
      <Card className="p-6 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(to right, transparent, ${current.color}, transparent)` }}
        />
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Current Rank</div>
            <div className="text-3xl font-light" style={{ color: current.color }}>
              {current.name}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Total EXP</div>
            <div className="text-3xl font-light text-amber-400 font-mono">{exp.toLocaleString()}</div>
          </div>
        </div>

        {next && (
          <div>
            <div className="flex justify-between text-[11px] text-neutral-500 mb-2 font-mono">
              <span>{current.name}</span>
              <span>{next.name} · {next.min.toLocaleString()}</span>
            </div>
            <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-700"
                style={{
                  width: `${progressToNext}%`,
                  background: `linear-gradient(to right, ${current.color}, ${next.color})`,
                }}
              />
            </div>
            <div className="text-[10px] text-neutral-600 mt-2 font-mono">
              {(next.min - exp).toLocaleString()} EXP to next rank
            </div>
          </div>
        )}
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500">Streak</span>
            <Flame size={14} className="text-orange-500" />
          </div>
          <div className="text-2xl font-light text-neutral-100 font-mono">{streak}</div>
          <div className="text-[10px] text-neutral-600 mt-1">days active</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500">Progress</span>
            <Target size={14} className="text-amber-500" />
          </div>
          <div className="text-2xl font-light text-neutral-100 font-mono">{Math.round(completionPct)}%</div>
          <div className="text-[10px] text-neutral-600 mt-1">{tasksCompleted}/{totalTasks} tasks</div>
        </Card>
      </div>

      {/* Today summary */}
      <Card className="p-5">
        <SectionTitle icon={Activity}>Today</SectionTitle>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 flex items-center gap-2"><Droplet size={13} /> Water</span>
            <span className="font-mono text-neutral-200">{todayStats.water}/8</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 flex items-center gap-2"><Heart size={13} /> Prayers</span>
            <span className="font-mono text-neutral-200">{todayStats.prayers}/5</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 flex items-center gap-2"><BedDouble size={13} /> Sleep</span>
            <span className="font-mono text-neutral-200">{todayStats.sleep || '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 flex items-center gap-2"><Dumbbell size={13} /> Workout</span>
            <span className="font-mono text-neutral-200">{todayStats.workout ? '✓' : '—'}</span>
          </div>
        </div>
      </Card>

      {/* Quick links */}
      <Card className="p-5">
        <SectionTitle icon={Zap}>Jump In</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['goals', 'Goals', Target],
            ['german', 'German', Languages],
            ['fitness', 'Workouts', Dumbbell],
            ['nutrition', 'Food', Apple],
            ['habits', 'Habits', Heart],
            ['jarvis', 'Ask JARVIS', Bot],
          ].map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="flex items-center gap-2.5 p-3 rounded-md border border-neutral-800/60 hover:border-amber-500/30 hover:bg-amber-500/[0.03] transition-all text-left"
            >
              <Icon size={14} className="text-amber-400" />
              <span className="text-[13px] text-neutral-300">{label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

const GoalsView = ({ taskState, toggleTask }) => {
  const [openRoadmap, setOpenRoadmap] = useState('coding');
  const [openSections, setOpenSections] = useState({});

  return (
    <div className="space-y-3">
      <div className="mb-2">
        <h2 className="text-2xl font-light text-neutral-100">Goals</h2>
        <p className="text-[13px] text-neutral-500 mt-1">
          Check off tasks as you do them. Tap a goal to expand.
        </p>
      </div>

      {Object.entries(ROADMAPS).map(([key, rm]) => {
        const Icon = rm.icon;
        const allTasks = rm.sections.flatMap(s => s.tasks);
        const done = allTasks.filter(t => taskState[t.id]).length;
        const pct = (done / allTasks.length) * 100;
        const isOpen = openRoadmap === key;

        return (
          <Card key={key}>
            <button
              onClick={() => setOpenRoadmap(isOpen ? null : key)}
              className="w-full p-4 flex items-center gap-3 text-left"
            >
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: `${rm.color}15`, color: rm.color }}
              >
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] text-neutral-100 font-medium">{rm.title}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5 truncate">{rm.description}</div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="text-[11px] text-neutral-400 font-mono">{done}/{allTasks.length}</div>
                  <div className="w-20 h-1 bg-neutral-900 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{ width: `${pct}%`, background: rm.color }}
                    />
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-neutral-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-neutral-800/60 p-3">
                {rm.sections.map((section, sIdx) => {
                  const sectKey = `${key}-${sIdx}`;
                  const sectOpen = openSections[sectKey] !== false;
                  return (
                    <div key={sIdx} className="mb-2 last:mb-0">
                      <button
                        onClick={() => setOpenSections(p => ({ ...p, [sectKey]: !sectOpen }))}
                        className="w-full flex items-center gap-2 px-2 py-2 text-left hover:bg-white/[0.02] rounded-md transition-colors"
                      >
                        <ChevronRight
                          size={12}
                          className={`text-neutral-600 transition-transform ${sectOpen ? 'rotate-90' : ''}`}
                        />
                        <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                          {section.title}
                        </span>
                      </button>
                      {sectOpen && (
                        <div className="ml-1">
                          {section.tasks.map(task => (
                            <Checkbox
                              key={task.id}
                              checked={!!taskState[task.id]}
                              onToggle={() => toggleTask(task.id, task.exp)}
                              label={task.title}
                              link={task.link}
                              days={task.days}
                              exp={task.exp}
                              color={rm.color}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

const GermanView = ({ taskState, toggleTask }) => {
  const allTasks = GERMAN_ROADMAP.flatMap(p => p.tasks);
  const done = allTasks.filter(t => taskState[t.id]).length;
  const pct = (done / allTasks.length) * 100;

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="text-2xl font-light text-neutral-100">Deutsch</h2>
        <p className="text-[13px] text-neutral-500 mt-1">
          Step-by-step path from zero to C1. Do them in order.
        </p>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-wider text-neutral-400">Overall Progress</span>
          <span className="text-sm font-mono text-amber-400">{done}/{allTasks.length}</span>
        </div>
        <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${pct}%`, background: 'linear-gradient(to right, #f59e0b, #ef4444)' }}
          />
        </div>
      </Card>

      {GERMAN_ROADMAP.map((phase, pIdx) => {
        const phaseDone = phase.tasks.filter(t => taskState[t.id]).length;
        return (
          <Card key={pIdx} className="overflow-hidden">
            <div className="p-4 border-b border-neutral-800/60 flex items-center justify-between">
              <div className="text-[12px] uppercase tracking-wider text-neutral-300 font-medium">
                {phase.title}
              </div>
              <span className="text-[11px] font-mono text-neutral-500">
                {phaseDone}/{phase.tasks.length}
              </span>
            </div>
            <div className="p-2">
              {phase.tasks.map(task => (
                <Checkbox
                  key={task.id}
                  checked={!!taskState[task.id]}
                  onToggle={() => toggleTask(task.id, task.exp)}
                  label={task.title}
                  link={task.link}
                  days={task.days}
                  exp={task.exp}
                  color="#f59e0b"
                />
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

const HabitsView = ({
  water, setWater, prayers, togglePrayer,
  sleep, setSleep, addExp
}) => {
  const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const [bedtime, setBedtime] = useState(sleep?.bedtime || '');
  const [waketime, setWaketime] = useState(sleep?.waketime || '');

  useEffect(() => {
    setBedtime(sleep?.bedtime || '');
    setWaketime(sleep?.waketime || '');
  }, [sleep]);

  const sleepHours = () => {
    if (!bedtime || !waketime) return null;
    const [bh, bm] = bedtime.split(':').map(Number);
    const [wh, wm] = waketime.split(':').map(Number);
    let mins = (wh * 60 + wm) - (bh * 60 + bm);
    if (mins < 0) mins += 24 * 60;
    return (mins / 60).toFixed(1);
  };

  const saveSleep = () => {
    setSleep({ bedtime, waketime, hours: sleepHours() });
    addExp(15);
  };

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="text-2xl font-light text-neutral-100">Habits</h2>
        <p className="text-[13px] text-neutral-500 mt-1">
          Auto-resets every day at midnight.
        </p>
      </div>

      {/* Water */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Droplet size={16} className="text-cyan-400" />
            <span className="text-[12px] uppercase tracking-wider text-neutral-300 font-medium">Water</span>
          </div>
          <span className="text-sm font-mono text-cyan-400">{water} / 8 glasses</span>
        </div>
        <div className="flex gap-1.5 mb-4">
          {Array.from({ length: 8 }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                if (i + 1 > water) addExp(5);
                setWater(i + 1 === water ? i : i + 1);
              }}
              className={`flex-1 h-10 rounded transition-all ${
                i < water
                  ? 'bg-cyan-500/30 border border-cyan-500/50'
                  : 'border border-neutral-800 hover:border-neutral-700'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { if (water < 8) { setWater(water + 1); addExp(5); } }}
            className="flex-1 py-2 rounded-md border border-neutral-800 hover:border-cyan-500/40 text-[12px] text-neutral-300 transition-colors"
          >
            + Glass (+5 EXP)
          </button>
          <button
            onClick={() => setWater(Math.max(0, water - 1))}
            className="px-4 py-2 rounded-md border border-neutral-800 hover:border-neutral-700 text-[12px] text-neutral-400 transition-colors"
          >
            <Minus size={14} />
          </button>
        </div>
        <p className="text-[10px] text-neutral-600 mt-3 text-center">
          Reminder: drink one glass every 1.5–2 hours
        </p>
      </Card>

      {/* Prayers */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Heart size={16} className="text-emerald-400" />
            <span className="text-[12px] uppercase tracking-wider text-neutral-300 font-medium">5 Daily Prayers</span>
          </div>
          <span className="text-sm font-mono text-emerald-400">
            {Object.values(prayers).filter(Boolean).length} / 5
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {PRAYERS.map(p => (
            <button
              key={p}
              onClick={() => togglePrayer(p)}
              className={`py-3 rounded-md text-[11px] uppercase tracking-wider transition-all ${
                prayers[p]
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                  : 'border border-neutral-800 text-neutral-500 hover:border-neutral-700'
              }`}
            >
              {prayers[p] && <Check size={11} className="mx-auto mb-1" />}
              {p}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-neutral-600 mt-3 text-center">+10 EXP per prayer</p>
      </Card>

      {/* Sleep */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <MoonStar size={16} className="text-indigo-400" />
            <span className="text-[12px] uppercase tracking-wider text-neutral-300 font-medium">Sleep</span>
          </div>
          {sleep?.hours && (
            <span className="text-sm font-mono text-indigo-400">{sleep.hours}h</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1.5">Bedtime</label>
            <input
              type="time"
              value={bedtime}
              onChange={e => setBedtime(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200 font-mono focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1.5">Wake</label>
            <input
              type="time"
              value={waketime}
              onChange={e => setWaketime(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200 font-mono focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>
        <button
          onClick={saveSleep}
          disabled={!bedtime || !waketime}
          className="w-full mt-3 py-2 rounded-md border border-neutral-800 hover:border-indigo-500/40 text-[12px] text-neutral-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Log Sleep (+15 EXP)
        </button>
      </Card>
    </div>
  );
};

const FitnessView = ({ workouts, addWorkout, addExp }) => {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [sets, setSets] = useState('');
  const [day, setDay] = useState('Push');

  const DAYS = ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs', 'Rest'];
  const today = new Date().getDay();
  const todayKey_ = todayKey();
  const todayWorkouts = workouts.filter(w => w.date === todayKey_);

  const handleAdd = () => {
    if (!name) return;
    addWorkout({
      id: Date.now(),
      date: todayKey_,
      day,
      name,
      sets,
    });
    addExp(25);
    setName('');
    setSets('');
    setAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="text-2xl font-light text-neutral-100">Workouts</h2>
        <p className="text-[13px] text-neutral-500 mt-1">
          Today: <span className="text-amber-400">{DAYS[(today + 6) % 7]} day</span> · log every set
        </p>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
          const dayDate = new Date();
          dayDate.setDate(dayDate.getDate() - ((today + 6) % 7) + i);
          const key = dayDate.toISOString().split('T')[0];
          const has = workouts.some(w => w.date === key);
          const isToday = key === todayKey_;
          return (
            <div
              key={i}
              className={`aspect-square rounded-md flex flex-col items-center justify-center text-[10px] ${
                isToday
                  ? 'border-2 border-amber-500/50 bg-amber-500/5'
                  : has
                  ? 'bg-red-500/15 border border-red-500/30'
                  : 'border border-neutral-800'
              }`}
            >
              <span className="text-neutral-500">{d}</span>
              {has && <Check size={10} className="text-red-400 mt-0.5" />}
            </div>
          );
        })}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle icon={Dumbbell} accent="#ef4444">Today's Session</SectionTitle>
          {!adding && (
            <button
              onClick={() => setAdding(true)}
              className="text-[11px] px-3 py-1.5 rounded-md border border-neutral-800 hover:border-red-500/40 text-neutral-300 transition-colors"
            >
              <Plus size={11} className="inline mr-1" /> Add
            </button>
          )}
        </div>

        {adding && (
          <div className="mb-4 p-3 rounded-md border border-neutral-800 bg-neutral-950/60 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {['Push', 'Pull', 'Legs'].map(d => (
                <button
                  key={d}
                  onClick={() => setDay(d)}
                  className={`py-1.5 rounded text-[11px] uppercase tracking-wider transition-colors ${
                    day === d
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'border border-neutral-800 text-neutral-500'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Exercise (e.g. Bench Press)"
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-red-500/50"
            />
            <input
              value={sets}
              onChange={e => setSets(e.target.value)}
              placeholder="Sets (e.g. 4x8 @ 80kg)"
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-red-500/50"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 py-2 rounded bg-red-500/20 border border-red-500/40 text-red-300 text-[12px] hover:bg-red-500/30 transition-colors"
              >
                Save (+25 EXP)
              </button>
              <button
                onClick={() => { setAdding(false); setName(''); setSets(''); }}
                className="px-4 py-2 rounded border border-neutral-800 text-neutral-400 text-[12px]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {todayWorkouts.length === 0 && !adding && (
          <div className="text-center py-6 text-[12px] text-neutral-600">
            No workout logged today. Get after it.
          </div>
        )}

        {todayWorkouts.map(w => (
          <div key={w.id} className="py-2.5 px-3 border-b border-neutral-900 last:border-0">
            <div className="flex justify-between">
              <span className="text-[13px] text-neutral-200">{w.name}</span>
              <span className="text-[11px] uppercase tracking-wider text-red-400">{w.day}</span>
            </div>
            {w.sets && <div className="text-[11px] text-neutral-500 font-mono mt-0.5">{w.sets}</div>}
          </div>
        ))}
      </Card>

      <Card className="p-5">
        <SectionTitle icon={Calendar} accent="#ef4444">This Week</SectionTitle>
        <div className="text-[12px] text-neutral-400 space-y-1.5">
          <div className="flex justify-between"><span>Sessions logged</span><span className="font-mono text-neutral-200">{
            workouts.filter(w => {
              const d = new Date(w.date);
              const now = new Date();
              const diff = (now - d) / (1000 * 60 * 60 * 24);
              return diff < 7;
            }).length
          }</span></div>
          <div className="flex justify-between"><span>Total sessions</span><span className="font-mono text-neutral-200">{workouts.length}</span></div>
        </div>
      </Card>
    </div>
  );
};

const NutritionView = ({ meals, addMeal, deleteMeal, addExp }) => {
  const [name, setName] = useState('');
  const today = todayKey();
  const dayOfWeek = new Date().getDay(); // 0 Sun, 4 Thu
  const isCheatDay = dayOfWeek === 4;
  const todayMeals = meals.filter(m => m.date === today);
  const cheatUsed = todayMeals.some(m => m.cheat);

  const handleAdd = (cheat = false) => {
    if (!name) return;
    addMeal({ id: Date.now(), date: today, name, cheat });
    addExp(cheat ? 5 : 15);
    setName('');
  };

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="text-2xl font-light text-neutral-100">Nutrition</h2>
        <p className="text-[13px] text-neutral-500 mt-1">
          {isCheatDay ? (
            <span className="text-amber-400">It's Thursday — cheat day available 🍕</span>
          ) : (
            <span>Cheat day = Thursday only. Clean today.</span>
          )}
        </p>
      </div>

      <Card className="p-5">
        <div className="flex gap-2 mb-3">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Meal (e.g. 150g chicken, rice, broccoli)"
            onKeyDown={e => e.key === 'Enter' && handleAdd(false)}
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-green-500/50"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleAdd(false)}
            disabled={!name}
            className="py-2 rounded-md bg-green-500/15 border border-green-500/40 text-green-300 text-[12px] hover:bg-green-500/25 transition-colors disabled:opacity-40"
          >
            Log Clean Meal (+15)
          </button>
          <button
            onClick={() => handleAdd(true)}
            disabled={!name || !isCheatDay || cheatUsed}
            className="py-2 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[12px] hover:bg-amber-500/25 transition-colors disabled:opacity-30"
          >
            {cheatUsed ? 'Cheat used' : 'Log Cheat (+5)'}
          </button>
        </div>
      </Card>

      <Card className="p-5">
        <SectionTitle icon={Apple} accent="#10b981">Today's Meals</SectionTitle>
        {todayMeals.length === 0 ? (
          <div className="text-center py-6 text-[12px] text-neutral-600">No meals logged yet</div>
        ) : (
          <div className="space-y-1">
            {todayMeals.map(m => (
              <div key={m.id} className="flex items-center justify-between py-2 px-3 rounded hover:bg-white/[0.02]">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  {m.cheat ? (
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 flex-shrink-0">
                      cheat
                    </span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                  )}
                  <span className="text-[13px] text-neutral-200 truncate">{m.name}</span>
                </div>
                <button
                  onClick={() => deleteMeal(m.id)}
                  className="text-neutral-700 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

const SubscriptionsView = ({ subs, addSub, deleteSub }) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!name || !cost) return;
    addSub({ id: Date.now(), name, cost: parseFloat(cost) });
    setName(''); setCost(''); setAdding(false);
  };

  const total = subs.reduce((s, x) => s + x.cost, 0);

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="text-2xl font-light text-neutral-100">Subscriptions</h2>
        <p className="text-[13px] text-neutral-500 mt-1">Track every recurring charge</p>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-neutral-500">Monthly total</span>
        </div>
        <div className="text-3xl font-light font-mono text-amber-400">BHD {total.toFixed(2)}</div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <SectionTitle icon={CreditCard}>Active</SectionTitle>
          {!adding && (
            <button
              onClick={() => setAdding(true)}
              className="text-[11px] px-3 py-1.5 rounded-md border border-neutral-800 hover:border-amber-500/40 text-neutral-300 transition-colors"
            >
              <Plus size={11} className="inline mr-1" /> Add
            </button>
          )}
        </div>

        {adding && (
          <div className="mb-3 p-3 rounded-md border border-neutral-800 bg-neutral-950/60 space-y-2">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Service name"
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-500/50"
            />
            <input
              value={cost}
              onChange={e => setCost(e.target.value)}
              type="number"
              step="0.01"
              placeholder="Monthly cost (BHD)"
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 font-mono focus:outline-none focus:border-amber-500/50"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 py-2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[12px]"
              >
                Save
              </button>
              <button
                onClick={() => { setAdding(false); setName(''); setCost(''); }}
                className="px-4 py-2 rounded border border-neutral-800 text-neutral-400 text-[12px]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {subs.length === 0 ? (
          <div className="text-center py-6 text-[12px] text-neutral-600">No subscriptions tracked</div>
        ) : (
          <div className="space-y-1">
            {subs.map(s => (
              <div key={s.id} className="flex items-center justify-between py-2.5 px-3 rounded hover:bg-white/[0.02]">
                <span className="text-[13px] text-neutral-200">{s.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-mono text-amber-400">BHD {s.cost.toFixed(2)}</span>
                  <button
                    onClick={() => deleteSub(s.id)}
                    className="text-neutral-700 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

const JarvisChat = ({ context, history, addMessage, clearHistory }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recogRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      setSpeechSupported(true);
      const r = new SR();
      r.continuous = false;
      r.interimResults = false;
      r.lang = 'en-US';
      r.onresult = (e) => {
        const t = e.results[0][0].transcript;
        setInput(prev => prev ? `${prev} ${t}` : t);
      };
      r.onend = () => setListening(false);
      r.onerror = () => setListening(false);
      recogRef.current = r;
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, loading]);

  const toggleVoice = () => {
    if (!recogRef.current) return;
    if (listening) {
      recogRef.current.stop();
      setListening(false);
    } else {
      try {
        recogRef.current.start();
        setListening(true);
      } catch {}
    }
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    addMessage({ role: 'user', content: userMsg });
    setLoading(true);

    const systemPrompt = `You are JARVIS, the user's personal AI assistant inspired by Iron Man. You are concise, direct, slightly formal but warm. You are aware of all the user's progress, goals, and current state.

USER CONTEXT (current state):
- Current rank: ${context.rank}
- Total EXP: ${context.exp}
- Streak: ${context.streak} days
- Tasks completed: ${context.tasksCompleted} / ${context.totalTasks}
- Today's water: ${context.todayStats.water}/8
- Today's prayers: ${context.todayStats.prayers}/5
- Today's sleep: ${context.todayStats.sleep || 'not logged'}
- Today's workout: ${context.todayStats.workout ? 'logged' : 'not logged'}
- Recent completed tasks: ${context.recentCompleted.join(', ') || 'none yet'}
- Current active goal areas: Coding, Math, Fitness, Brand, German, Chess, Quran, Books, AI Tools

The user has ADHD — be DIRECT and actionable. No fluff. Tell them exactly what to do next. If they ask "what should I do next" or similar, give ONE specific task pulled from their current incomplete goals. Keep replies short unless they ask for detail.`;

    try {
      const messages = [
        ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMsg },
      ];

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages,
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || '').join('\n').trim() || 'I encountered an issue. Try again, sir.';
      addMessage({ role: 'assistant', content: reply });
    } catch (e) {
      addMessage({ role: 'assistant', content: 'Connection failed. Check your network and try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] min-h-[500px]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-neutral-100 flex items-center gap-2">
            <Cpu size={20} className="text-amber-400" />
            JARVIS
          </h2>
          <p className="text-[12px] text-neutral-500 mt-0.5">Aware of your progress · ask anything</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-[11px] text-neutral-600 hover:text-red-400 transition-colors"
          >
            Clear chat
          </button>
        )}
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Cpu size={20} className="text-amber-400" />
              </div>
              <div className="text-[13px] text-neutral-400 mb-1">Online and ready.</div>
              <div className="text-[11px] text-neutral-600">
                Try: "What should I do next?" or "Summarize my week"
              </div>
            </div>
          )}
          {history.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-amber-500/15 border border-amber-500/30 text-amber-100'
                    : 'bg-neutral-900/60 border border-neutral-800 text-neutral-200'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-lg px-3.5 py-2.5">
                <Loader2 size={14} className="text-amber-400 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-neutral-800/60 p-3">
          <div className="flex gap-2 items-end">
            {speechSupported && (
              <button
                onClick={toggleVoice}
                className={`p-2.5 rounded-md border transition-colors ${
                  listening
                    ? 'border-red-500/50 bg-red-500/15 text-red-400'
                    : 'border-neutral-800 text-neutral-400 hover:border-amber-500/40'
                }`}
              >
                {listening ? <MicOff size={15} /> : <Mic size={15} />}
              </button>
            )}
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={listening ? 'Listening...' : 'Type or tap mic...'}
              rows={1}
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2.5 text-[13px] text-neutral-200 focus:outline-none focus:border-amber-500/40 resize-none max-h-32"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================

const NAV = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'german', label: 'German', icon: Languages },
  { id: 'fitness', label: 'Workouts', icon: Dumbbell },
  { id: 'nutrition', label: 'Food', icon: Apple },
  { id: 'habits', label: 'Habits', icon: Heart },
  { id: 'subs', label: 'Subs', icon: CreditCard },
  { id: 'jarvis', label: 'JARVIS', icon: Bot },
];

export default function App() {
  const [view, setView] = useState('dashboard');
  const [loaded, setLoaded] = useState(false);

  // State
  const [exp, setExp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [taskState, setTaskState] = useState({});
  const [water, setWaterState] = useState(0);
  const [prayers, setPrayers] = useState({});
  const [sleep, setSleepState] = useState(null);
  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [subs, setSubs] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  // ===== Load on mount =====
  useEffect(() => {
    (async () => {
      const [
        expV, streakV, lastDate, tasks, waterDate, waterV, prayerDate,
        prayerV, sleepV, mealsV, workoutsV, subsV, chatV
      ] = await Promise.all([
        storage.get('jarvis:exp', 0),
        storage.get('jarvis:streak', 0),
        storage.get('jarvis:last_date', null),
        storage.get('jarvis:tasks', {}),
        storage.get('jarvis:water_date', null),
        storage.get('jarvis:water', 0),
        storage.get('jarvis:prayer_date', null),
        storage.get('jarvis:prayers', {}),
        storage.get('jarvis:sleep', null),
        storage.get('jarvis:meals', []),
        storage.get('jarvis:workouts', []),
        storage.get('jarvis:subs', []),
        storage.get('jarvis:chat', []),
      ]);

      setExp(expV);
      setTaskState(tasks);
      setMeals(mealsV);
      setWorkouts(workoutsV);
      setSubs(subsV);
      setChatHistory(chatV);

      const today = todayKey();

      // Daily reset for water
      if (waterDate === today) {
        setWaterState(waterV);
      } else {
        setWaterState(0);
        await storage.set('jarvis:water', 0);
        await storage.set('jarvis:water_date', today);
      }

      // Daily reset for prayers
      if (prayerDate === today) {
        setPrayers(prayerV);
      } else {
        setPrayers({});
        await storage.set('jarvis:prayers', {});
        await storage.set('jarvis:prayer_date', today);
      }

      // Daily reset for sleep
      if (sleepV?.date === today) {
        setSleepState(sleepV);
      } else {
        setSleepState(null);
      }

      // Streak logic
      if (lastDate !== today) {
        const y = new Date();
        y.setDate(y.getDate() - 1);
        const yKey = y.toISOString().split('T')[0];
        if (lastDate === yKey) {
          setStreak(streakV + 1);
          await storage.set('jarvis:streak', streakV + 1);
        } else if (lastDate) {
          setStreak(1);
          await storage.set('jarvis:streak', 1);
        } else {
          setStreak(1);
          await storage.set('jarvis:streak', 1);
        }
        await storage.set('jarvis:last_date', today);
      } else {
        setStreak(streakV);
      }

      setLoaded(true);
    })();
  }, []);

  // ===== Helpers =====
  const addExp = useCallback((amount) => {
    setExp(prev => {
      const next = prev + amount;
      storage.set('jarvis:exp', next);
      return next;
    });
  }, []);

  const toggleTask = useCallback((id, expVal = 0) => {
    setTaskState(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
        if (expVal > 0) addExp(-expVal);
      } else {
        next[id] = todayKey();
        if (expVal > 0) addExp(expVal);
      }
      storage.set('jarvis:tasks', next);
      return next;
    });
  }, [addExp]);

  const setWater = useCallback((v) => {
    setWaterState(v);
    storage.set('jarvis:water', v);
    storage.set('jarvis:water_date', todayKey());
  }, []);

  const togglePrayer = useCallback((p) => {
    setPrayers(prev => {
      const next = { ...prev, [p]: !prev[p] };
      if (next[p]) addExp(10); else addExp(-10);
      storage.set('jarvis:prayers', next);
      storage.set('jarvis:prayer_date', todayKey());
      return next;
    });
  }, [addExp]);

  const setSleep = useCallback((s) => {
    const v = { ...s, date: todayKey() };
    setSleepState(v);
    storage.set('jarvis:sleep', v);
  }, []);

  const addMeal = useCallback((m) => {
    setMeals(prev => {
      const next = [m, ...prev];
      storage.set('jarvis:meals', next);
      return next;
    });
  }, []);
  const deleteMeal = useCallback((id) => {
    setMeals(prev => {
      const next = prev.filter(x => x.id !== id);
      storage.set('jarvis:meals', next);
      return next;
    });
  }, []);

  const addWorkout = useCallback((w) => {
    setWorkouts(prev => {
      const next = [w, ...prev];
      storage.set('jarvis:workouts', next);
      return next;
    });
  }, []);

  const addSub = useCallback((s) => {
    setSubs(prev => {
      const next = [...prev, s];
      storage.set('jarvis:subs', next);
      return next;
    });
  }, []);
  const deleteSub = useCallback((id) => {
    setSubs(prev => {
      const next = prev.filter(x => x.id !== id);
      storage.set('jarvis:subs', next);
      return next;
    });
  }, []);

  const addChatMessage = useCallback((m) => {
    setChatHistory(prev => {
      const next = [...prev, m];
      storage.set('jarvis:chat', next);
      return next;
    });
  }, []);
  const clearChat = useCallback(() => {
    setChatHistory([]);
    storage.set('jarvis:chat', []);
  }, []);

  // Aggregate stats
  const allTasks = [
    ...Object.values(ROADMAPS).flatMap(r => r.sections.flatMap(s => s.tasks)),
    ...GERMAN_ROADMAP.flatMap(p => p.tasks),
  ];
  const tasksCompleted = Object.keys(taskState).length;
  const totalTasks = allTasks.length;

  const todayStats = {
    water,
    prayers: Object.values(prayers).filter(Boolean).length,
    sleep: sleep?.hours ? `${sleep.hours}h` : null,
    workout: workouts.some(w => w.date === todayKey()),
  };

  const recentCompleted = Object.entries(taskState)
    .sort((a, b) => (b[1] || '').localeCompare(a[1] || ''))
    .slice(0, 5)
    .map(([id]) => {
      const t = allTasks.find(x => x.id === id);
      return t?.title || id;
    })
    .filter(Boolean);

  const { current: currentRank } = getRank(exp);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="text-amber-500 animate-spin" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans" style={{
      fontFamily: "'IBM Plex Sans', -apple-system, system-ui, sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        body { font-family: 'IBM Plex Sans', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #262626; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #404040; }
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(0.6);
        }
      `}</style>

      <div className="flex min-h-screen">
        {/* Sidebar - desktop */}
        <aside className="hidden md:flex flex-col w-56 border-r border-neutral-900 bg-neutral-950/50 sticky top-0 h-screen">
          <div className="p-5 border-b border-neutral-900">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <Sparkles size={13} className="text-amber-400" />
              </div>
              <div>
                <div className="text-[15px] font-medium text-neutral-100 tracking-wide">JARVIS</div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-600">Personal OS</div>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-2">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] transition-colors mb-0.5 ${
                  view === id
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-neutral-900">
            <div className="text-[10px] uppercase tracking-wider text-neutral-600 mb-1">Rank</div>
            <div className="text-[13px] font-medium" style={{ color: currentRank.color }}>
              {currentRank.name}
            </div>
            <div className="text-[11px] font-mono text-amber-400 mt-1">{exp.toLocaleString()} EXP</div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 pb-20 md:pb-6">
          {/* Mobile header */}
          <header className="md:hidden sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-neutral-900 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-amber-400" />
              <span className="text-[14px] font-medium tracking-wide">JARVIS</span>
            </div>
            <div className="text-[11px] font-mono text-amber-400">{exp.toLocaleString()} EXP</div>
          </header>

          <div className="max-w-2xl mx-auto px-4 md:px-8 py-5 md:py-8">
            {view === 'dashboard' && (
              <DashboardView
                exp={exp} streak={streak}
                tasksCompleted={tasksCompleted} totalTasks={totalTasks}
                todayStats={todayStats} onNavigate={setView}
              />
            )}
            {view === 'goals' && <GoalsView taskState={taskState} toggleTask={toggleTask} />}
            {view === 'german' && <GermanView taskState={taskState} toggleTask={toggleTask} />}
            {view === 'fitness' && <FitnessView workouts={workouts} addWorkout={addWorkout} addExp={addExp} />}
            {view === 'nutrition' && <NutritionView meals={meals} addMeal={addMeal} deleteMeal={deleteMeal} addExp={addExp} />}
            {view === 'habits' && (
              <HabitsView
                water={water} setWater={setWater}
                prayers={prayers} togglePrayer={togglePrayer}
                sleep={sleep} setSleep={setSleep}
                addExp={addExp}
              />
            )}
            {view === 'subs' && <SubscriptionsView subs={subs} addSub={addSub} deleteSub={deleteSub} />}
            {view === 'jarvis' && (
              <JarvisChat
                context={{
                  exp,
                  streak,
                  rank: currentRank.name,
                  tasksCompleted,
                  totalTasks,
                  todayStats,
                  recentCompleted,
                }}
                history={chatHistory}
                addMessage={addChatMessage}
                clearHistory={clearChat}
              />
            )}
          </div>
        </main>

        {/* Bottom nav - mobile */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-black/95 backdrop-blur-md border-t border-neutral-900 px-1 py-1.5 flex justify-around z-30">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex flex-col items-center justify-center px-2 py-1.5 rounded-md transition-colors min-w-0 ${
                view === id ? 'text-amber-400' : 'text-neutral-500'
              }`}
            >
              <Icon size={16} />
              <span className="text-[9px] mt-0.5 truncate">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
