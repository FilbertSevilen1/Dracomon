'use client';

import React, { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { DracoSelection } from '../components/DracoSelection';
import { InventoryModal } from '../components/InventoryModal';
import { LevelUpModal } from '../components/LevelUpModal';
import { SettingsModal } from '../components/SettingsModal';
import { VersionHistoryModal } from '../components/VersionHistoryModal';
import { GameScreen } from '../components/GameScreen';
import { soundService } from '../services/sound';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sword,
  Settings,
  Briefcase,
  Coins,
  Play,
  HelpCircle,
  Shield,
  Target,
  Zap,
  Sparkles,
  Volume2,
  ArrowRight,
  Lock,
  Check,
  BookOpen,
  Compass,
  MessageSquare,
  Mail,
  Send,
  ChevronDown,
  ChevronUp,
  Globe,
  Award,
  Layers,
} from 'lucide-react';

export default function Home() {
  const {
    saveData,
    isPlaying,
    setIsPlaying,
    currentStage,
    setCurrentStage,
    showLevelUp,
    levelUpInfo,
    updateSettings,
    selectDraco,
    unlockDraco,
    collectCoins,
    collectItem,
    usePotion,
    useUpgradeStone,
    buyItem,
    handleEnemyDefeated,
    applyLevelUpBonus,
    levelUpDracoWithCoins,
    resetGameSave,
    exportSave,
    importSave,
    switchTier,
    markStageCleared,
  } = useGameState();

  // Modal open states
  const [showSelection, setShowSelection] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStageSelector, setShowStageSelector] = useState(false);
  const [showControlsModal, setShowControlsModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [stagePage, setStagePage] = useState(0);
  const [realmPage, setRealmPage] = useState(0);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // FAQ open accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Active companion specs
  const activeDracoName = saveData.selectedDraco;
  const activeDraco = saveData.dracos[activeDracoName];
  const activeLevel = activeDraco?.level || 1;
  const coins = saveData.player.coins;

  // Retrieve active potions
  const potionItem = saveData.inventory.find(i => i.id === 'potion');
  const activePotionCount = potionItem ? potionItem.quantity : 0;

  // Auto scroll to top when toggling game screen or stage page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isPlaying, stagePage]);

  const isStageUnlocked = (stageNum: number) => {
    if (saveData.tier === 'Basic' || saveData.tier === 'Premium') {
      return true; // Basic and Premium membership tiers unlock all maps immediately!
    }
    if (stageNum === 1) return true; // Stage 1 unlocked by default for Free Tier
    const completed = saveData.completedStages || [1];
    return completed.includes(stageNum) || completed.includes(stageNum - 1);
  };

  const handleStartStage = (stageNum: number) => {
    if (!isStageUnlocked(stageNum)) {
      soundService.playHit();
      scrollToSection('membership');
      alert(`🔒 Stage ${stageNum} is locked!\n\nComplete Stage ${stageNum - 1} or activate Basic/Premium Membership to unlock all maps immediately.`);
      return;
    }
    soundService.playClick();
    setCurrentStage(stageNum);
    setShowStageSelector(false);
    setIsPlaying(true);
    window.scrollTo(0, 0);
  };

  // Sound triggers for landing page companion click
  const triggerCompanionJump = (name: string) => {
    if (name === 'Jumpmon') soundService.playJump();
    if (name === 'Archermon') soundService.playShoot();
    if (name === 'Shieldmon') soundService.playBlock();
  };

  // Handler for direct selection/unlock from Hero floating islands & quick bar
  const handleHeroSelectDraco = (name: string, cost: number) => {
    const isUnlocked = saveData.dracos[name]?.unlocked ?? (name === 'Jumpmon');
    if (isUnlocked) {
      soundService.playClick();
      selectDraco(name);
      triggerCompanionJump(name);
    } else if (coins >= cost) {
      unlockDraco(name, cost);
      selectDraco(name);
      triggerCompanionJump(name);
    } else {
      soundService.playHit();
      setShowSelection(true);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactMessage) return;
    soundService.playCoin();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setContactSubmitted(false);
    }, 4000);
  };

  // Companion specs list with deep story lore & attributes
  const companionShowcase = [
    {
      name: 'Jumpmon',
      title: 'Agile Sun Blader',
      cost: 0,
      role: 'High Mobility / Swordmaster',
      lore: 'Born from the sunlit high ridges of Whispering Woods, Jumpmon wields the Golden Flame Greatsword. Master of mid-air double leaps and sweeping rotational blade slashes.',
      signatureSkill: 'Flame Sword Swing & Double Leap',
      ultimateSkill: 'Earthshaker Ground Slam (30 AoE Shockwaves)',
      color: 'amber',
      tagColor: 'bg-amber-100 text-amber-900 border-amber-300 font-mono',
      attackType: 'Melee Flame Slash Arc',
      hp: saveData.dracos['Jumpmon']?.hp || 18,
      atk: saveData.dracos['Jumpmon']?.attack || 5,
      def: saveData.dracos['Jumpmon']?.defense || 3,
      spd: saveData.dracos['Jumpmon']?.speed || 7,
      jump: 11,
      svg: (
        <svg width="70" height="70" viewBox="0 0 100 100" className="animate-float-slow">
          <ellipse cx="50" cy="85" rx="30" ry="6" fill="rgba(0,0,0,0.15)" />
          <circle cx="50" cy="52" r="24" fill="#fbbf24" stroke="#b45309" strokeWidth="2.5" />
          <path d="M 36 30 Q 30 14 42 22 Z" fill="#b45309" />
          <path d="M 64 30 Q 70 14 58 22 Z" fill="#b45309" />
          <rect x="42" y="44" width="6" height="8" fill="#fff" />
          <rect x="52" y="44" width="6" height="8" fill="#fff" />
          <rect x="45" y="46" width="3" height="4" fill="#000" />
          <rect x="53" y="46" width="3" height="4" fill="#000" />
          <rect x="68" y="42" width="16" height="4" rx="1" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
        </svg>
      ),
    },
    {
      name: 'Archermon',
      title: 'Emerald Forest Ranger',
      cost: 100,
      role: 'Ranged DPS / Wind Sentinel',
      lore: 'Sovereign guardian of the Mystic Ruins canopy. Armed with an ancient enchanted ranger bow, Archermon shoots rapid arrows and unleashes piercing triple-arrow volleys.',
      signatureSkill: 'Piercing Arrow Volley (3x Spread)',
      ultimateSkill: 'Arrow Rain Barrage (12 Sky Arrows)',
      color: 'emerald',
      tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-mono',
      attackType: 'Ranged Bow Wind Slash & Arrow Shot',
      hp: saveData.dracos['Archermon']?.hp || 16,
      atk: saveData.dracos['Archermon']?.attack || 7,
      def: saveData.dracos['Archermon']?.defense || 2,
      spd: saveData.dracos['Archermon']?.speed || 8,
      jump: 10.5,
      svg: (
        <svg width="70" height="70" viewBox="0 0 100 100" className="animate-float-medium">
          <ellipse cx="50" cy="85" rx="30" ry="6" fill="rgba(0,0,0,0.15)" />
          <rect x="34" y="36" width="32" height="40" rx="10" fill="#10b981" stroke="#047857" strokeWidth="2.5" />
          <path d="M 30 36 Q 50 16 70 36 Z" fill="#059669" stroke="#047857" strokeWidth="2" />
          <rect x="42" y="44" width="5" height="7" fill="#fff" />
          <rect x="53" y="44" width="5" height="7" fill="#fff" />
          <rect x="44" y="46" width="3" height="3" fill="#000" />
          <rect x="54" y="46" width="3" height="3" fill="#000" />
          <path d="M 68 32 Q 78 52 68 70" fill="none" stroke="#ca8a04" strokeWidth="3" />
        </svg>
      ),
    },
    {
      name: 'Shieldmon',
      title: 'Royal Iron Guardian',
      cost: 200,
      role: 'Tank / Fortress Sentinel',
      lore: 'Forged in the molten depths of Volcanic Peak. Encased in royal steel armor, Shieldmon projects invulnerable light barriers that block all damage while crushing foes with shield bashes.',
      signatureSkill: 'Aegis Invulnerable Barrier (2s Shield)',
      ultimateSkill: 'Aegis Fortress Shockwave (5s Invulnerable)',
      color: 'blue',
      tagColor: 'bg-blue-100 text-blue-900 border-blue-300 font-mono',
      attackType: 'Heavy Shield Bash Wave',
      hp: saveData.dracos['Shieldmon']?.hp || 26,
      atk: saveData.dracos['Shieldmon']?.attack || 4,
      def: saveData.dracos['Shieldmon']?.defense || 9,
      spd: saveData.dracos['Shieldmon']?.speed || 5,
      jump: 10,
      svg: (
        <svg width="70" height="70" viewBox="0 0 100 100" className="animate-float-fast">
          <ellipse cx="50" cy="85" rx="30" ry="6" fill="rgba(0,0,0,0.15)" />
          <rect x="32" y="34" width="36" height="44" rx="14" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2.5" />
          <rect x="42" y="42" width="5" height="7" fill="#fff" />
          <rect x="53" y="42" width="5" height="7" fill="#fff" />
          <rect x="44" y="44" width="3" height="3" fill="#000" />
          <rect x="54" y="44" width="3" height="3" fill="#000" />
          <rect x="66" y="40" width="14" height="34" rx="3" fill="#475569" stroke="#1e293b" strokeWidth="2" />
        </svg>
      ),
    },
    {
      name: 'Assassinmon',
      title: 'Shadow Stalker Assassin',
      cost: 300,
      role: 'Stealth / Burst DPS',
      lore: 'Born in the pitch-black obsidian caves of Mystic Ruins, Assassinmon is a shadow assassin wielding a shadow Katana. Specialized in silent shadow-steps and high speed dash strike combinations.',
      signatureSkill: 'Shadow Dash Strike (Invulnerable Dash Animation)',
      ultimateSkill: 'Single Slash of Death (Shadow Dimensional Shatter)',
      color: 'purple',
      tagColor: 'bg-purple-100 text-purple-900 border-purple-300 font-mono',
      attackType: 'Melee Shadow Katana Slash',
      hp: saveData.dracos['Assassinmon']?.hp || 15,
      atk: saveData.dracos['Assassinmon']?.attack || 8,
      def: saveData.dracos['Assassinmon']?.defense || 2,
      spd: saveData.dracos['Assassinmon']?.speed || 9,
      jump: 11.5,
      svg: (
        <svg width="70" height="70" viewBox="0 0 100 100" className="animate-float-slow">
          <ellipse cx="50" cy="85" rx="30" ry="6" fill="rgba(0,0,0,0.15)" />
          <rect x="34" y="38" width="32" height="38" rx="8" fill="#4c1d95" stroke="#1e1b4b" strokeWidth="2" />
          <path d="M 30 38 Q 50 16 70 38 Z" fill="#1e1b4b" stroke="#1e1b4b" strokeWidth="1.5" />
          <rect x="41" y="44" width="6" height="3" fill="#c084fc" />
          <rect x="53" y="44" width="6" height="3" fill="#c084fc" />
          <path d="M 28 48 L 18 36 L 24 52 Z" fill="#a855f7" stroke="#1e1b4b" strokeWidth="1.5" />
          <path d="M 72 48 L 82 36 L 76 52 Z" fill="#a855f7" stroke="#1e1b4b" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      name: 'Flymon',
      title: 'Sonic Tempest Wasp',
      cost: 400,
      role: 'Aerial Hover / Wind Storm',
      lore: 'Guardian of the high skies above Volcanic Peaks. Flymon utilizes powerful wings to glide and hover in mid-air. Shoots rapid poison needles and releases sonic wave slashes.',
      signatureSkill: 'Sonic Wind Slice (Air Launch & 2-way Slash)',
      ultimateSkill: 'Sonic Typhoon Whirlwind (Infinite Flight)',
      color: 'rose',
      tagColor: 'bg-rose-100 text-rose-900 border-rose-300 font-mono',
      attackType: 'Ranged Poison Needle Shot',
      hp: saveData.dracos['Flymon']?.hp || 17,
      atk: saveData.dracos['Flymon']?.attack || 5,
      def: saveData.dracos['Flymon']?.defense || 3,
      spd: saveData.dracos['Flymon']?.speed || 6,
      jump: 14,
      svg: (
        <svg width="70" height="70" viewBox="0 0 100 100" className="animate-float-medium">
          <ellipse cx="50" cy="85" rx="30" ry="6" fill="rgba(0,0,0,0.15)" />
          <path d="M 34 50 Q 14 26 36 38 Z" fill="#fda4af" opacity="0.85" />
          <path d="M 66 50 Q 86 26 64 38 Z" fill="#fda4af" opacity="0.85" />
          <rect x="36" y="36" width="28" height="40" rx="8" fill="#e11d48" stroke="#881337" strokeWidth="2" />
          <rect x="36" y="46" width="28" height="4" fill="#fb7185" />
          <rect x="36" y="56" width="28" height="4" fill="#fb7185" />
          <circle cx="44" cy="44" r="3.5" fill="#facc15" />
          <circle cx="56" cy="44" r="3.5" fill="#facc15" />
        </svg>
      ),
    },
    {
      name: 'Whitemon',
      title: 'Beastmaster Summoner',
      cost: 500,
      role: 'Summoner / Beastmaster',
      lore: 'Master of ancient beast spirits from the Sunken Coral Reefs. Whitemon throws spinning axes and commands an autonomous Bird Familiar. Unleashes Primal Roar to paralyze foes and drive the familiar into a frenzy.',
      signatureSkill: 'Bird Familiar Autonomous Attack',
      ultimateSkill: 'Primal Roar & Familiar Rampage (3s Stun + 3x Speed)',
      color: 'sky',
      tagColor: 'bg-sky-100 text-sky-900 border-sky-300 font-mono',
      attackType: 'Throwing Axes & Bird Familiar Attack',
      hp: saveData.dracos['Whitemon']?.hp || 20,
      atk: saveData.dracos['Whitemon']?.attack || 6,
      def: saveData.dracos['Whitemon']?.defense || 3,
      spd: saveData.dracos['Whitemon']?.speed || 6,
      jump: 11,
      svg: (
        <svg width="70" height="70" viewBox="0 0 100 100" className="animate-float-slow">
          <ellipse cx="50" cy="85" rx="30" ry="6" fill="rgba(0,0,0,0.15)" />
          <path d="M 32 48 Q 10 24 34 36 Z" fill="#e2e8f0" opacity="0.9" />
          <path d="M 68 48 Q 90 24 66 36 Z" fill="#e2e8f0" opacity="0.9" />
          <rect x="36" y="36" width="28" height="40" rx="10" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
          <circle cx="24" cy="30" r="5" fill="#38bdf8" />
          <path d="M 68 44 L 80 32 L 76 52 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      name: 'Magemon',
      title: 'Grand Magus Spell Weaver',
      cost: 250,
      role: 'Mage / Elemental Spells',
      lore: 'An ancient grand magus who commands Quas, Wex, and Exort elemental orbs. Magemon casts unpredictable legendary spells: 45° rolling Chaos Meteor, 1.7s homing Sun Strike laser, and enemy-lifting Tornado.',
      signatureSkill: 'Invoked Spell (Meteor / Sun Strike / Tornado)',
      ultimateSkill: 'Trio Orb Blast (Giant Cleave + Meteor + Sun Strike + Tornado)',
      color: 'purple',
      tagColor: 'bg-purple-100 text-purple-900 border-purple-300 font-mono',
      attackType: 'Arcane Energy Orbs',
      hp: saveData.dracos['Magemon']?.hp || 19,
      atk: saveData.dracos['Magemon']?.attack || 7,
      def: saveData.dracos['Magemon']?.defense || 3,
      spd: saveData.dracos['Magemon']?.speed || 6.5,
      jump: 11,
      svg: (
        <svg width="70" height="70" viewBox="0 0 100 100" className="animate-float-slow">
          <ellipse cx="50" cy="85" rx="30" ry="6" fill="rgba(0,0,0,0.15)" />
          <circle cx="30" cy="22" r="5" fill="#ef4444" />
          <circle cx="50" cy="14" r="5" fill="#38bdf8" />
          <circle cx="70" cy="22" r="5" fill="#fbbf24" />
          <path d="M 32 45 L 68 45 L 76 80 L 24 80 Z" fill="#4c1d95" stroke="#312e81" strokeWidth="2" />
          <circle cx="50" cy="40" r="14" fill="#6d28d9" stroke="#4c1d95" strokeWidth="2" />
          <circle cx="45" cy="38" r="2.5" fill="#f59e0b" />
          <circle cx="55" cy="38" r="2.5" fill="#f59e0b" />
        </svg>
      ),
    },
  ];

  // FAQ List
  const faqs = [
    {
      q: 'How do I drop down through floating platforms?',
      a: 'While standing on any wooden platform (=), press the S key or Down Arrow key on keyboard, or tap the Down button on mobile touch controls to instantly drop down through the platform.',
    },
    {
      q: 'How does weapon swinging and attacking work?',
      a: 'Press J or Z to execute a real-time weapon swing attack. Your character will swing their weapon in a dynamic arc with blade shine, slash trails, and spark particles.',
    },
    {
      q: 'How do I unlock new dragon companions?',
      a: 'Collect coins during campaign stages or earn defeat rewards. You can unlock Archermon for 100 coins and Shieldmon for 200 coins directly from the Hero floating islands, Character Story section, or Roster modal.',
    },
    {
      q: 'How do I upgrade companion stats permanently?',
      a: 'Collect Upgrade Stones dropped by enemies or Mini-Bosses. Open your Inventory bag and use Upgrade Stones to permanently increase HP, Attack, Defense, or Speed stats.',
    },
    {
      q: 'Is my progress saved when I close the browser?',
      a: 'Yes! All your coins, unlocked companions, levels, stats, and inventory items are 100% saved locally in your browser storage automatically.',
    },
  ];

  // Campaign Stages Card Metadata for paginated campaign maps selection
  const STAGE_CARDS = [
    {
      num: 1,
      name: 'Whispering Woods',
      difficulty: 'EASY',
      diffClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      borderHover: 'hover:border-emerald-500 hover:bg-emerald-50/20',
      desc: 'Forest platforms with Slimes & King Slime Lord.',
      boss: 'King Slime',
      color: 'emerald'
    },
    {
      num: 2,
      name: 'Mystic Ruins',
      difficulty: 'MEDIUM',
      diffClass: 'bg-slate-100 text-slate-800 border-slate-200',
      borderHover: 'hover:border-slate-500 hover:bg-slate-50/20',
      desc: 'Ruined stone structures with Goblin Archers & Archdemon.',
      boss: 'Archdemon',
      color: 'slate'
    },
    {
      num: 3,
      name: 'Volcanic Peak',
      difficulty: 'HARD',
      diffClass: 'bg-orange-100 text-orange-800 border-orange-200',
      borderHover: 'hover:border-orange-500 hover:bg-orange-50/20',
      desc: 'Lava hazards with Fire Golems & Dracoguard Fire Lord.',
      boss: 'Fire Lord',
      color: 'orange'
    },
    {
      num: 4,
      name: 'Frozen Citadel',
      difficulty: 'EXPERT',
      diffClass: 'bg-sky-100 text-sky-800 border-sky-200',
      borderHover: 'hover:border-sky-500 hover:bg-sky-50/20',
      desc: 'Glacial ice chasms with Frostbite Wyvern ice boss.',
      boss: 'Frost Wyvern',
      color: 'sky'
    },
    {
      num: 5,
      name: 'Shadow Abyss',
      difficulty: 'MASTER',
      diffClass: 'bg-purple-100 text-purple-800 border-purple-200',
      borderHover: 'hover:border-purple-500 hover:bg-purple-50/20',
      desc: 'Void crystal platforms with Shadow Overlord boss.',
      boss: 'Shadow Lord',
      color: 'purple'
    },
    {
      num: 6,
      name: 'Celestial Temple',
      difficulty: 'CHALLENGE',
      diffClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      borderHover: 'hover:border-emerald-500 hover:bg-emerald-50/20',
      desc: 'Grand sanctuary altar defending sacred artifacts.',
      boss: 'Fire Golems',
      color: 'emerald'
    },
    {
      num: 7,
      name: 'Sky Heavens',
      difficulty: 'EXPERT',
      diffClass: 'bg-sky-100 text-sky-800 border-sky-200',
      borderHover: 'hover:border-sky-500 hover:bg-sky-50/20',
      desc: 'Trampolines, skewers, landmines, and Sentinel Archdemon.',
      boss: 'Archdemon',
      color: 'sky'
    },
    {
      num: 8,
      name: 'Primordial Core',
      difficulty: 'FINAL BOSS',
      diffClass: 'bg-amber-500 text-stone-950 font-black border-amber-300',
      borderHover: 'hover:border-amber-500 hover:bg-amber-500/10 ring-2 ring-amber-400/30',
      desc: 'Magma core erupting fire torrents and the Primordial Dragon King.',
      boss: 'Dragon King',
      color: 'amber'
    },
    {
      num: 9,
      name: 'Underwater Abyss',
      difficulty: 'WATER WORLD',
      diffClass: 'bg-cyan-500 text-stone-950 font-black border-cyan-300',
      borderHover: 'hover:border-cyan-500 hover:bg-cyan-500/10 ring-2 ring-cyan-400/30',
      desc: 'Low gravity floating, water currents, moving anchors, scallop traps, and Leviathan Orca Killer Whale boss.',
      boss: 'Killer Whale',
      color: 'cyan'
    },
    {
      num: 10,
      name: 'Jungle Sanctuary',
      difficulty: 'JUNGLE WORLD',
      diffClass: 'bg-emerald-500 text-stone-950 font-black border-emerald-300',
      borderHover: 'hover:border-emerald-500 hover:bg-emerald-500/10 ring-2 ring-emerald-400/30',
      desc: 'Climbable tree vines, 2s root vine traps, instant-death toxic poison swamp chasm with melting acid skeleton animation, reviving skeleton archers, and the Primordial King Kong Boss with 3-jump 2s seismic stun ground slam!',
      boss: 'King Kong',
      color: 'emerald'
    }
  ];

  const scrollToSection = (id: string) => {
    soundService.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const itemsPerPage = 4;
  const pageCount = Math.ceil(STAGE_CARDS.length / itemsPerPage);
  const currentStages = STAGE_CARDS.slice(stagePage * itemsPerPage, (stagePage + 1) * itemsPerPage);

  return (
    <div className="min-h-screen bg-stone-50 bg-grid text-stone-900 flex flex-col justify-between font-display relative overflow-hidden scroll-smooth">
      
      {/* Dynamic background lighting accents */}
      <div className="absolute top-0 right-0 w-[55rem] h-[55rem] bg-amber-200/25 rounded-full blur-3xl -z-10 animate-blob-drift-1" />
      <div className="absolute top-[35rem] left-0 w-[45rem] h-[45rem] bg-indigo-200/25 rounded-full blur-3xl -z-10 animate-blob-drift-2" />
      <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-emerald-200/20 rounded-full blur-3xl -z-10 animate-blob-drift-3" />
      <div className="absolute top-[80rem] right-12 w-[35rem] h-[35rem] bg-rose-200/20 rounded-full blur-3xl -z-10 animate-blob-drift-1" />

      {/* Navigation Header */}
      <header className="sticky top-0 w-full border-b border-stone-200/70 bg-white/85 backdrop-blur-md px-6 md:px-12 py-3.5 flex items-center justify-between z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xl md:text-2xl font-black tracking-tight text-stone-900 flex items-center gap-2">
            🐉 DRACOMON <span className="text-amber-500 font-extrabold">RPG</span>
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-stone-600">
          <button onClick={() => scrollToSection('about')} className="hover:text-amber-600 transition-colors">About</button>
          <button onClick={() => scrollToSection('characters')} className="hover:text-amber-600 transition-colors">Heroes</button>
          <button onClick={() => scrollToSection('realms')} className="hover:text-amber-600 transition-colors">Stages</button>
          <button onClick={() => scrollToSection('membership')} className="hover:text-amber-600 transition-colors">Memberships</button>
        </nav>

        {/* Right Utility Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50/80 border border-amber-200/80 rounded-full text-xs font-mono font-bold text-amber-700 shadow-sm">
            <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{coins}</span>
          </div>

          <button
            onClick={() => { soundService.playClick(); setShowInventory(true); }}
            className="p-2 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 text-stone-700 shadow-sm transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold"
            title="Open Inventory"
          >
            <Briefcase className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Bag</span>
          </button>

          <button
            onClick={() => { soundService.playClick(); setShowSettings(true); }}
            className="p-2 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 text-stone-700 shadow-sm transition-all active:scale-95 flex items-center justify-center"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full z-30">
        <AnimatePresence mode="wait">
          {isPlaying ? (
            // IN-GAME SCREEN VIEW
            <motion.div
              key="game-screen-wrapper"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex justify-center p-4 md:p-8"
            >
              <GameScreen
                saveData={saveData}
                stageNum={currentStage}
                onCoinCollect={collectCoins}
                onItemCollect={collectItem}
                onEnemyDefeat={handleEnemyDefeated}
                onStageClear={() => markStageCleared(currentStage)}
                onQuit={() => {
                  setIsPlaying(false);
                  window.scrollTo(0, 0);
                }}
                openSettings={() => setShowSettings(true)}
                openInventory={() => setShowInventory(true)}
                activePotionCount={activePotionCount}
                onUsePotion={usePotion}
              />
            </motion.div>
          ) : (
            // FULL GAME WEBSITE LANDING VIEW
            <div className="w-full space-y-24 py-8">
              
              {/* HERO BANNER SECTION */}
              <section id="hero" className="w-full min-h-[85vh] max-w-6xl mx-auto px-6 md:px-12 pt-6 flex items-center">
                <div className="grid md:grid-cols-12 gap-8 items-center">
                  {/* Hero Left Content */}
                  <div className="md:col-span-7 space-y-6 text-left">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-stone-900 leading-tight font-display">
                      Evolve Your Companion. <br />
                      <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                        Conquer Floating Realms
                      </span>
                    </h1>
                    
                    <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-xl">
                      Leap across floating platform islands, master real-time weapon swing arcs, collect sacred upgrade stones, and synthesize the ultimate dragon warrior.
                    </p>

                    {/* Quick Partner Selector in Hero */}
                    <div className="pt-2">
                      <span className="text-[11px] font-mono font-bold text-stone-500 block mb-2 uppercase tracking-widest">
                        ► Select Active Partner:
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {companionShowcase.map((item) => {
                          const isUnlocked = saveData.dracos[item.name]?.unlocked ?? (item.name === 'Jumpmon');
                          const isSelected = activeDracoName === item.name;
                          return (
                            <button
                              key={item.name}
                              onClick={() => handleHeroSelectDraco(item.name, item.cost)}
                              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                                isSelected
                                  ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-500/40 border border-amber-400 active:scale-95'
                                  : isUnlocked
                                  ? 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 shadow-sm active:scale-95'
                                  : 'bg-stone-100 text-stone-500 border border-stone-200 hover:border-amber-300'
                              }`}
                            >
                              <span>{item.name}</span>
                              {isSelected ? (
                                <Sparkles className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />
                              ) : isUnlocked ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Lock className="w-3.5 h-3.5 text-stone-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Hero Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <button
                        onClick={() => { soundService.playClick(); setShowStageSelector(true); }}
                        className="px-8 py-4 bg-stone-900 text-white rounded-2xl font-extrabold text-sm shadow-xl hover:bg-stone-800 hover:shadow-stone-900/20 transition-all active:scale-95 flex items-center gap-2.5"
                      >
                        <Play className="w-5 h-5 text-amber-400 fill-amber-400" />
                        Play Campaign Stage
                      </button>

                      <button
                        onClick={() => scrollToSection('characters')}
                        className="px-6 py-4 bg-white border border-stone-200 text-stone-800 rounded-2xl font-bold text-sm shadow-sm hover:bg-stone-50 transition-all active:scale-95 flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4 text-amber-600" />
                        Character Story
                      </button>

                      <button
                        onClick={() => { soundService.playClick(); setShowControlsModal(true); }}
                        className="px-5 py-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl font-semibold text-sm transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <HelpCircle className="w-4 h-4" />
                        Controls
                      </button>
                    </div>

                    {/* Features summary */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-200/60 max-w-lg text-xs font-semibold text-stone-500">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>100% Offline Save</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Swinging Blade Arcs</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <span>Platforming Physics</span>
                      </div>
                    </div>
                  </div>

                  {/* Hero Right Interactive Floating Islands */}
                  <div className="md:col-span-5 flex justify-center items-center h-[460px] md:h-[500px] relative select-none w-full">
                    {/* Floating Island 1: Jumpmon (Top-Left) */}
                    <motion.div
                      className={`absolute top-0 left-0 md:left-2 flex flex-col items-center cursor-pointer group z-10 ${
                        activeDracoName === 'Jumpmon' ? 'scale-105' : ''
                      }`}
                      onClick={() => handleHeroSelectDraco('Jumpmon', 0)}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="animate-float-slow drop-shadow-md">
                        {companionShowcase[0].svg}
                      </div>
                      <div className={`w-28 h-7 bg-[#10b981] border-2 ${activeDracoName === 'Jumpmon' ? 'border-amber-400 ring-4 ring-amber-400/30' : 'border-[#047857]'} rounded-full shadow-lg mt-1 flex flex-col overflow-hidden`}>
                        <div className="bg-[#b45309] h-3.5 mt-auto w-full" />
                      </div>
                      <div className="mt-1 flex flex-col items-center">
                        <span className="text-[10px] font-extrabold text-stone-700 uppercase tracking-wider group-hover:text-stone-900 transition-colors">
                          Jumpmon
                        </span>
                        {activeDracoName === 'Jumpmon' ? (
                          <span className="text-[9px] font-mono font-black text-amber-950 bg-amber-400 px-2 py-0.5 rounded border border-amber-300 shadow-sm flex items-center gap-1 animate-pulse">
                            ⚡ EQUIPPED
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                            ✓ EQUIP
                          </span>
                        )}
                      </div>
                    </motion.div>

                    {/* Floating Island 2: Archermon (Top-Right) */}
                    <motion.div
                      className={`absolute top-0 right-0 md:right-2 flex flex-col items-center cursor-pointer group z-10 ${
                        activeDracoName === 'Archermon' ? 'scale-105' : ''
                      }`}
                      onClick={() => handleHeroSelectDraco('Archermon', 100)}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="animate-float-medium drop-shadow-md">
                        {companionShowcase[1].svg}
                      </div>
                      <div className={`w-28 h-7 bg-[#64748b] border-2 ${activeDracoName === 'Archermon' ? 'border-amber-400 ring-4 ring-amber-400/30' : 'border-[#334155]'} rounded-full shadow-lg mt-1 flex flex-col overflow-hidden`}>
                        <div className="bg-[#475569] h-3.5 mt-auto w-full" />
                      </div>
                      <div className="mt-1 flex flex-col items-center">
                        <span className="text-[10px] font-extrabold text-stone-700 uppercase tracking-wider group-hover:text-stone-900 transition-colors">
                          Archermon
                        </span>
                        {activeDracoName === 'Archermon' ? (
                          <span className="text-[9px] font-mono font-black text-amber-950 bg-amber-400 px-2 py-0.5 rounded border border-amber-300 shadow-sm flex items-center gap-1 animate-pulse">
                            ⚡ EQUIPPED
                          </span>
                        ) : saveData.dracos['Archermon']?.unlocked ? (
                          <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                            ✓ EQUIP
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-0.5">
                            🔒 UNLOCK (100C)
                          </span>
                        )}
                      </div>
                    </motion.div>

                    {/* Floating Island 3: Shieldmon (Mid-Left) */}
                    <motion.div
                      className={`absolute top-[165px] left-2 md:left-8 flex flex-col items-center cursor-pointer group z-20 ${
                        activeDracoName === 'Shieldmon' ? 'scale-105' : ''
                      }`}
                      onClick={() => handleHeroSelectDraco('Shieldmon', 200)}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="animate-float-fast drop-shadow-md">
                        {companionShowcase[2].svg}
                      </div>
                      <div className={`w-30 h-7 bg-[#4b5563] border-2 ${activeDracoName === 'Shieldmon' ? 'border-amber-400 ring-4 ring-amber-400/30' : 'border-[#1f2937]'} rounded-full shadow-lg mt-1 flex flex-col overflow-hidden`}>
                        <div className="bg-[#ea580c] h-3.5 mt-auto w-full" />
                      </div>
                      <div className="mt-1 flex flex-col items-center">
                        <span className="text-[10px] font-extrabold text-stone-700 uppercase tracking-wider group-hover:text-stone-900 transition-colors">
                          Shieldmon
                        </span>
                        {activeDracoName === 'Shieldmon' ? (
                          <span className="text-[9px] font-mono font-black text-amber-950 bg-amber-400 px-2 py-0.5 rounded border border-amber-300 shadow-sm flex items-center gap-1 animate-pulse">
                            ⚡ EQUIPPED
                          </span>
                        ) : saveData.dracos['Shieldmon']?.unlocked ? (
                          <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                            ✓ EQUIP
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-0.5">
                            🔒 UNLOCK (200C)
                          </span>
                        )}
                      </div>
                    </motion.div>

                    {/* Floating Island 4: Assassinmon (Mid-Right) */}
                    <motion.div
                      className={`absolute top-[165px] right-2 md:right-8 flex flex-col items-center cursor-pointer group z-20 ${
                        activeDracoName === 'Assassinmon' ? 'scale-105' : ''
                      }`}
                      onClick={() => handleHeroSelectDraco('Assassinmon', 300)}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="animate-float-slow drop-shadow-md">
                        {companionShowcase[3].svg}
                      </div>
                      <div className={`w-28 h-7 bg-[#581c87] border-2 ${activeDracoName === 'Assassinmon' ? 'border-amber-400 ring-4 ring-amber-400/30' : 'border-[#3b0764]'} rounded-full shadow-lg mt-1 flex flex-col overflow-hidden`}>
                        <div className="bg-[#1e1b4b] h-3.5 mt-auto w-full" />
                      </div>
                      <div className="mt-1 flex flex-col items-center">
                        <span className="text-[10px] font-extrabold text-stone-700 uppercase tracking-wider group-hover:text-stone-900 transition-colors">
                          Assassinmon
                        </span>
                        {activeDracoName === 'Assassinmon' ? (
                          <span className="text-[9px] font-mono font-black text-amber-950 bg-amber-400 px-2 py-0.5 rounded border border-amber-300 shadow-sm flex items-center gap-1 animate-pulse">
                            ⚡ EQUIPPED
                          </span>
                        ) : saveData.dracos['Assassinmon']?.unlocked ? (
                          <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                            ✓ EQUIP
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-0.5">
                            🔒 UNLOCK (300C)
                          </span>
                        )}
                      </div>
                    </motion.div>

                    {/* Floating Island 5: Flymon (Bottom-Left) */}
                    <motion.div
                      className={`absolute bottom-0 left-0 md:left-2 flex flex-col items-center cursor-pointer group z-10 ${
                        activeDracoName === 'Flymon' ? 'scale-105' : ''
                      }`}
                      onClick={() => handleHeroSelectDraco('Flymon', 400)}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="animate-float-medium drop-shadow-md">
                        {companionShowcase[4].svg}
                      </div>
                      <div className={`w-28 h-7 bg-[#e11d48] border-2 ${activeDracoName === 'Flymon' ? 'border-amber-400 ring-4 ring-amber-400/30' : 'border-[#881337]'} rounded-full shadow-lg mt-1 flex flex-col overflow-hidden`}>
                        <div className="bg-[#fda4af] h-3.5 mt-auto w-full" />
                      </div>
                      <div className="mt-1 flex flex-col items-center">
                        <span className="text-[10px] font-extrabold text-stone-700 uppercase tracking-wider group-hover:text-stone-900 transition-colors">
                          Flymon
                        </span>
                        {activeDracoName === 'Flymon' ? (
                          <span className="text-[9px] font-mono font-black text-amber-950 bg-amber-400 px-2 py-0.5 rounded border border-amber-300 shadow-sm flex items-center gap-1 animate-pulse">
                            ⚡ EQUIPPED
                          </span>
                        ) : saveData.dracos['Flymon']?.unlocked ? (
                          <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                            ✓ EQUIP
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-0.5">
                            🔒 UNLOCK (400C)
                          </span>
                        )}
                      </div>
                    </motion.div>

                    {/* Floating Island 6: Whitemon (Bottom-Right) */}
                    <motion.div
                      className={`absolute bottom-0 right-0 md:right-2 flex flex-col items-center cursor-pointer group z-10 ${
                        activeDracoName === 'Whitemon' ? 'scale-105' : ''
                      }`}
                      onClick={() => handleHeroSelectDraco('Whitemon', 500)}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="animate-float-slow drop-shadow-md">
                        {companionShowcase[5].svg}
                      </div>
                      <div className={`w-28 h-7 bg-[#0284c7] border-2 ${activeDracoName === 'Whitemon' ? 'border-amber-400 ring-4 ring-amber-400/30' : 'border-[#0369a1]'} rounded-full shadow-lg mt-1 flex flex-col overflow-hidden`}>
                        <div className="bg-[#38bdf8] h-3.5 mt-auto w-full" />
                      </div>
                      <div className="mt-1 flex flex-col items-center">
                        <span className="text-[10px] font-extrabold text-stone-700 uppercase tracking-wider group-hover:text-stone-900 transition-colors">
                          Whitemon
                        </span>
                        {activeDracoName === 'Whitemon' ? (
                          <span className="text-[9px] font-mono font-black text-amber-950 bg-amber-400 px-2 py-0.5 rounded border border-amber-300 shadow-sm flex items-center gap-1 animate-pulse">
                            ⚡ EQUIPPED
                          </span>
                        ) : saveData.dracos['Whitemon']?.unlocked ? (
                          <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                            ✓ EQUIP
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-0.5">
                            🔒 UNLOCK (500C)
                          </span>
                        )}
                      </div>
                    </motion.div>

                    {/* Floating Island 7: Magemon (Center Bottom) */}
                    <motion.div
                      className={`absolute bottom-[-15px] left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group z-30 ${
                        activeDracoName === 'Magemon' ? 'scale-105' : ''
                      }`}
                      onClick={() => handleHeroSelectDraco('Magemon', 250)}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="animate-float-fast drop-shadow-md">
                        {companionShowcase[6].svg}
                      </div>
                      <div className={`w-28 h-7 bg-[#4c1d95] border-2 ${activeDracoName === 'Magemon' ? 'border-amber-400 ring-4 ring-amber-400/30' : 'border-[#312e81]'} rounded-full shadow-lg mt-1 flex flex-col overflow-hidden`}>
                        <div className="bg-[#6d28d9] h-3.5 mt-auto w-full" />
                      </div>
                      <div className="mt-1 flex flex-col items-center">
                        <span className="text-[10px] font-extrabold text-stone-700 uppercase tracking-wider group-hover:text-stone-900 transition-colors">
                          Magemon
                        </span>
                        {activeDracoName === 'Magemon' ? (
                          <span className="text-[9px] font-mono font-black text-amber-950 bg-amber-400 px-2 py-0.5 rounded border border-amber-300 shadow-sm flex items-center gap-1 animate-pulse">
                            ⚡ EQUIPPED
                          </span>
                        ) : saveData.dracos['Magemon']?.unlocked ? (
                          <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                            ✓ EQUIP
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-0.5">
                            🔒 UNLOCK (250C)
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* ABOUT THE REALM & GAME LORE */}
              <section id="about" className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-12 border-t border-stone-200/60">
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <h2 className="text-3xl md:text-5xl font-black text-stone-900">About The Dracony Realm</h2>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Explore an ancient sky continent divided into distinct platforming realms. Defend the realm from patrolling slimes, archers, and lava golems.
                  </p>
                </div>

                {/* 4 Feature Pillars */}
                <div className="grid md:grid-cols-4 gap-6 mt-12">
                  <div className="p-6 bg-white border border-stone-200 rounded-3xl shadow-sm space-y-3 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                      <Sword className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-base text-stone-900">Swinging Attack Physics</h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Weapon blades sweep in dynamic 160-degree rotational arcs with trailing slash trails and spark collision effects.
                    </p>
                  </div>

                  <div className="p-6 bg-white border border-stone-200 rounded-3xl shadow-sm space-y-3 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      <Compass className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-base text-stone-900">Platform & Drop Down</h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      One-way wooden platform landing ensures secure footing. Press <code className="bg-stone-100 px-1 font-mono rounded">S</code> or <code className="bg-stone-100 px-1 font-mono rounded">Down</code> to drop through intentionally.
                    </p>
                  </div>

                  <div className="p-6 bg-white border border-stone-200 rounded-3xl shadow-sm space-y-3 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-base text-stone-900">Stat Synthesis & Evolution</h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Collect sacred Upgrade Stones during stages to permanently synthesize HP, Attack, Defense, and Speed attributes.
                    </p>
                  </div>

                  <div className="p-6 bg-white border border-stone-200 rounded-3xl shadow-sm space-y-3 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-base text-stone-900">100% Offline Persistence</h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Your save data is saved locally in browser storage. Export or import save JSON strings anytime to back up progress.
                    </p>
                  </div>
                </div>
              </section>

              {/* CHARACTER STORY & LORE SECTION */}
              <section id="characters" className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-12 border-t border-stone-200/60">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl md:text-5xl font-black text-stone-900">Meet The Dragon Guardians</h2>
                    <p className="text-xs md:text-sm text-stone-500 mt-1 max-w-xl">
                      Each dragon companion possesses deep lore, distinct weapon swing styles, and active battle abilities.
                    </p>
                  </div>

                  <button
                    onClick={() => { soundService.playClick(); setShowSelection(true); }}
                    className="px-5 py-2.5 bg-stone-900 text-white rounded-2xl text-xs font-extrabold hover:bg-stone-800 transition-all flex items-center gap-1.5 self-start md:self-auto"
                  >
                    <span>Manage Roster Modal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Detailed Character Story Cards Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-10">
                  {companionShowcase.map((item) => {
                    const isUnlocked = saveData.dracos[item.name]?.unlocked ?? (item.name === 'Jumpmon');
                    const isSelected = activeDracoName === item.name;
                    const canAfford = coins >= item.cost;

                    return (
                      <motion.div
                        key={item.name}
                        whileHover={{ y: -6 }}
                        className={`p-7 rounded-3xl border ${
                          isSelected
                            ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5'
                            : isUnlocked
                            ? 'border-emerald-500/50 bg-white'
                            : 'border-stone-200 bg-stone-50/70 opacity-90'
                        } shadow-md hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden`}
                      >
                        <div>
                          {/* Card Top Badges Bar */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className={`inline-block px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md border ${item.tagColor}`}>
                              {item.title}
                            </span>

                            <div className="shrink-0">
                              {isSelected ? (
                                <span className="px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-wider bg-amber-500 text-stone-950 rounded-md shadow-sm flex items-center gap-1 border border-amber-400">
                                  <Sparkles className="w-3 h-3 text-stone-950 fill-stone-950" /> [ EQUIPPED ]
                                </span>
                              ) : isUnlocked ? (
                                <span className="px-2.5 py-1 text-[10px] font-mono font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 rounded-md flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-600" /> [ UNLOCKED ]
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 text-[10px] font-mono font-extrabold uppercase tracking-wider bg-stone-200 text-stone-700 border border-stone-300 rounded-md flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-stone-500" /> [ LOCKED ]
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Companion Avatar & Name Profile */}
                          <div className="flex items-center gap-3.5">
                            <div className={`w-16 h-16 shrink-0 rounded-2xl ${isUnlocked ? 'bg-stone-100 border-stone-200' : 'bg-stone-200/60 border-stone-300'} border flex items-center justify-center p-2 shadow-inner relative`}>
                              {item.svg}
                              {!isUnlocked && (
                                <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                                  <Lock className="w-5 h-5 text-stone-700" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="text-2xl font-black text-stone-900 leading-tight">{item.name}</h3>
                              <span className="text-xs font-semibold text-stone-400 block mt-0.5">{item.role}</span>
                            </div>
                          </div>

                          {/* Character Story Paragraph */}
                          <div className="mt-4 p-3.5 bg-stone-50/80 border border-stone-100 rounded-2xl text-xs leading-relaxed text-stone-600">
                            <p>{item.lore}</p>
                          </div>

                          {/* Signature & Ultimate Ability */}
                          <div className="mt-3 space-y-1.5 text-xs">
                            <div className="flex justify-between text-stone-600">
                              <span className="font-semibold">Attack Style:</span>
                              <span className="font-bold text-stone-900">{item.attackType}</span>
                            </div>
                            <div className="flex justify-between text-stone-600">
                              <span className="font-semibold">Special Skill:</span>
                              <span className="font-bold text-amber-600">{item.signatureSkill}</span>
                            </div>
                            <div className="flex justify-between text-stone-600">
                              <span className="font-semibold flex items-center gap-1">
                                <Zap className="w-3 h-3 text-purple-500 fill-purple-500" />
                                Ultimate Skill:
                              </span>
                              <span className="font-bold text-purple-600">{item.ultimateSkill}</span>
                            </div>
                          </div>

                          {/* Attribute Stats Grid */}
                          <div className="grid grid-cols-5 gap-1.5 mt-4 pt-3 border-t border-stone-100 text-center font-mono">
                            <div className="p-1.5 bg-stone-50 rounded-xl">
                              <span className="text-[8px] text-stone-400 block font-sans">HP</span>
                              <span className="text-xs font-bold text-stone-800">{item.hp}</span>
                            </div>
                            <div className="p-1.5 bg-stone-50 rounded-xl">
                              <span className="text-[8px] text-stone-400 block font-sans">ATK</span>
                              <span className="text-xs font-bold text-rose-600">{item.atk}</span>
                            </div>
                            <div className="p-1.5 bg-stone-50 rounded-xl">
                              <span className="text-[8px] text-stone-400 block font-sans">DEF</span>
                              <span className="text-xs font-bold text-blue-600">{item.def}</span>
                            </div>
                            <div className="p-1.5 bg-stone-50 rounded-xl">
                              <span className="text-[8px] text-stone-400 block font-sans">SPD</span>
                              <span className="text-xs font-bold text-emerald-600">{item.spd}</span>
                            </div>
                            <div className="p-1.5 bg-stone-50 rounded-xl">
                              <span className="text-[8px] text-stone-400 block font-sans">JUMP</span>
                              <span className="text-xs font-bold text-amber-600">{item.jump}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        {isSelected ? (
                          <div className="space-y-2 mt-5">
                            <button
                              disabled
                              className="w-full py-3 rounded-xl text-xs font-mono font-extrabold bg-amber-500 text-stone-950 border border-amber-400 shadow-md cursor-default flex items-center justify-center gap-1.5"
                            >
                              <Sparkles className="w-4 h-4 text-stone-950 fill-stone-950" />
                              <span>[ EQUIPPED • ACTIVE PARTNER ]</span>
                            </button>
                            <button
                              onClick={() => {
                                if (coins >= activeLevel * 100) {
                                  levelUpDracoWithCoins(item.name);
                                } else {
                                  soundService.playHit();
                                }
                              }}
                              disabled={coins < activeLevel * 100}
                              className={`w-full py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                                coins >= activeLevel * 100
                                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm active:scale-95'
                                  : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                              }`}
                            >
                              <Coins className="w-3.5 h-3.5" />
                              <span>LEVEL UP ({activeLevel * 100} COINS)</span>
                            </button>
                          </div>
                        ) : isUnlocked ? (
                          <div className="space-y-2 mt-5">
                            <button
                              onClick={() => {
                                soundService.playClick();
                                selectDraco(item.name);
                              }}
                              className="w-full py-3 rounded-xl text-xs font-mono font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
                            >
                              <Check className="w-4 h-4" />
                              <span>[ EQUIP COMPANION ]</span>
                            </button>
                            <button
                              onClick={() => {
                                const currentLvl = saveData.dracos[item.name]?.level || 1;
                                if (coins >= currentLvl * 100) {
                                  levelUpDracoWithCoins(item.name);
                                } else {
                                  soundService.playHit();
                                }
                              }}
                              disabled={coins < (saveData.dracos[item.name]?.level || 1) * 100}
                              className={`w-full py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                                coins >= (saveData.dracos[item.name]?.level || 1) * 100
                                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm active:scale-95'
                                  : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                              }`}
                            >
                              <Coins className="w-3.5 h-3.5" />
                              <span>LEVEL UP ({(saveData.dracos[item.name]?.level || 1) * 100} COINS)</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              if (canAfford) {
                                unlockDraco(item.name, item.cost);
                              } else {
                                soundService.playHit();
                              }
                            }}
                            disabled={!canAfford}
                            className={`w-full mt-5 py-3 rounded-xl text-xs font-mono font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                              canAfford
                                ? 'bg-stone-900 hover:bg-amber-600 text-white shadow-md active:scale-95'
                                : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
                            }`}
                          >
                            {canAfford ? (
                              <>
                                <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span>[ UNLOCK ({item.cost} COINS) ]</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4" />
                                <span>[ NEED {item.cost} COINS ]</span>
                              </>
                            )}
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* CAMPAIGN STAGES SECTION */}
              <section id="realms" className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-12 border-t border-stone-200/60">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-widest rounded-full font-mono border border-amber-200">
                      🗺️ 9 Campaign Realms
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-stone-900 mt-2 font-display">Explore Platform Realms</h2>
                    <p className="text-stone-600 text-xs md:text-sm leading-relaxed mt-1">
                      Conquer custom hand-crafted platform stages. Basic & Premium members get all maps unlocked instantly!
                    </p>
                  </div>

                  {/* Pagination Header Controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        soundService.playClick();
                        setRealmPage(p => Math.max(0, p - 1));
                      }}
                      disabled={realmPage === 0}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold font-mono transition-all shadow-sm"
                    >
                      ◀ Prev
                    </button>
                    <span className="px-3 py-1.5 bg-stone-100 text-stone-700 text-xs font-mono font-bold rounded-xl border border-stone-200">
                      Page {realmPage + 1} of {Math.ceil(STAGE_CARDS.length / 3)}
                    </span>
                    <button
                      onClick={() => {
                        soundService.playClick();
                        setRealmPage(p => Math.min(Math.ceil(STAGE_CARDS.length / 3) - 1, p + 1));
                      }}
                      disabled={realmPage >= Math.ceil(STAGE_CARDS.length / 3) - 1}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold font-mono transition-all shadow-sm"
                    >
                      Next ▶
                    </button>
                  </div>
                </div>

                {/* Paginated Stage Cards Grid (3 cards per page) */}
                <div className="grid md:grid-cols-3 gap-6">
                  {STAGE_CARDS.slice(realmPage * 3, (realmPage + 1) * 3).map((stage) => {
                    const unlocked = isStageUnlocked(stage.num);

                    return (
                      <div
                        key={stage.num}
                        className={`relative p-7 border rounded-3xl transition-all flex flex-col justify-between space-y-4 overflow-hidden ${
                          stage.num === 9
                            ? 'bg-gradient-to-b from-cyan-950/5 via-sky-500/10 to-cyan-500/20 border-cyan-300 ring-2 ring-cyan-400/40 shadow-lg'
                            : stage.num === 8
                            ? 'bg-gradient-to-b from-amber-500/5 to-amber-500/10 border-amber-300 ring-2 ring-amber-400/30 shadow-md'
                            : 'bg-white border-stone-200 shadow-sm hover:shadow-md'
                        } ${!unlocked ? 'opacity-90' : ''}`}
                      >
                        {/* Lock Overlay Badge if locked */}
                        {!unlocked && (
                          <div className="absolute inset-0 z-20 bg-stone-900/65 backdrop-blur-[2px] p-6 flex flex-col items-center justify-center text-center text-white space-y-2 rounded-3xl">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 text-lg shadow-inner">
                              <Lock className="w-5 h-5" />
                            </div>
                            <h4 className="font-extrabold text-sm text-stone-100 font-display">Stage {stage.num} Locked</h4>
                            <p className="text-[10px] text-stone-300 max-w-[200px] leading-tight">
                              Complete Stage {stage.num - 1} or activate <span className="text-amber-400 font-bold">Basic Membership</span> to unlock!
                            </p>
                            <button
                              onClick={() => scrollToSection('membership')}
                              className="mt-2 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
                            >
                              Unlock with Membership
                            </button>
                          </div>
                        )}

                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-stone-600 uppercase tracking-wider font-mono">Stage {stage.num}</span>
                            <span className={`px-2.5 py-0.5 text-[9px] font-mono rounded-md font-extrabold ${stage.diffClass}`}>
                              {stage.difficulty}
                            </span>
                          </div>
                          <h3 className="text-xl font-extrabold text-stone-900 mt-2 font-display flex items-center gap-2">
                            <span>{stage.name}</span>
                            {stage.num === 9 && <span className="text-xs text-cyan-600 font-mono">🌊 SUB-MAP</span>}
                          </h3>
                          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                            {stage.desc}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-100/80 flex flex-col gap-2">
                          <div className="flex justify-between text-[10px] font-bold text-stone-400 font-mono">
                            <span>Boss: {stage.boss}</span>
                            <span>{unlocked ? 'Unlocked' : 'Locked'}</span>
                          </div>
                          <button
                            onClick={() => handleStartStage(stage.num)}
                            disabled={!unlocked}
                            className={`w-full py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                              !unlocked
                                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                : stage.num === 9
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md active:scale-95'
                                : stage.num === 8
                                ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-md active:scale-95'
                                : 'bg-stone-900 hover:bg-amber-600 text-white shadow-sm active:scale-95'
                            }`}
                          >
                            <Play className="w-4 h-4 fill-current" />
                            <span>{unlocked ? `Deploy to Stage ${stage.num}` : `Locked (Requires Stage ${stage.num - 1})`}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Page Indicator Dots */}
                <div className="mt-8 flex items-center justify-center gap-2">
                  {Array.from({ length: Math.ceil(STAGE_CARDS.length / 3) }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        soundService.playClick();
                        setRealmPage(idx);
                      }}
                      className={`w-3 h-3 rounded-full transition-all ${
                        realmPage === idx
                          ? 'bg-amber-500 ring-2 ring-amber-400/40 w-8'
                          : 'bg-stone-300 hover:bg-stone-400'
                      }`}
                      title={`Go to Page ${idx + 1}`}
                    />
                  ))}
                </div>
              </section>

              {/* FREQUENTLY ASKED QUESTIONS SECTION */}
              <section id="faq" className="w-full max-w-4xl mx-auto px-6 md:px-12 pt-12 border-t border-stone-200/60">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-3xl md:text-4xl font-black text-stone-900">Frequently Asked Questions</h2>
                  <p className="text-xs text-stone-500">Quick answers regarding game mechanics, controls, and save files.</p>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div
                        key={index}
                        className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm transition-all"
                      >
                        <button
                          onClick={() => {
                            soundService.playClick();
                            setOpenFaq(isOpen ? null : index);
                          }}
                          className="w-full px-6 py-4 flex items-center justify-between text-left font-extrabold text-sm text-stone-800 hover:text-amber-600 transition-colors"
                        >
                          <span>{faq.q}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-amber-500" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                              className="overflow-hidden border-t border-stone-100"
                            >
                              <div className="px-6 pb-5 pt-4 text-xs text-stone-600 leading-relaxed">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* SUPPORT THE DEVELOPER SECTION (BCA Transfer Info - Editable) */}
              <section id="support" className="w-full max-w-4xl mx-auto px-6 md:px-12 pt-12 border-t border-stone-200/60 select-none">
                <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/5 to-purple-500/10 border border-purple-200/60 rounded-3xl p-8 md:p-10 shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-3 text-left md:max-w-md">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-extrabold uppercase tracking-widest rounded-full font-mono border border-purple-200/40 animate-pulse">
                      💖 Support Guild
                    </div>
                    <h3 className="text-2xl font-black text-stone-900 font-display">Support the Developer</h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      If you enjoyed playing Dracomon, consider supporting the developers! Your donations help us add new characters, mechanics, and stages to the realm.
                    </p>
                  </div>
                  
                  {/* <div className="w-full md:w-auto min-w-[290px] bg-white border border-purple-200/60 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center font-bold text-lg text-purple-600 shadow-inner">
                        🏦
                      </div>
                      <div className="text-left">
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider font-mono">Transfer Method</span>
                        <h4 className="font-bold text-xs text-stone-700">Bank Central Asia (BCA)</h4>
                      </div>
                    </div>
                    <div className="p-3.5 bg-stone-50 border border-stone-100 rounded-xl font-mono text-center relative">
                      <div className="text-stone-400 text-[9px] uppercase font-bold tracking-wider mb-1">Account Number</div>
                      <div className="text-stone-950 font-black text-base tracking-widest select-all">
                        5271835648
                      </div>
                      <div className="text-stone-500 text-[10px] font-bold mt-1.5">
                        A/N: IGNATIUS FILBERT SEVILEN
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('5271835648');
                          soundService.playCoin();
                          alert('BCA Account Number (5271835648) copied to clipboard!');
                        }}
                        className="mt-3.5 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        📋 Copy Account No.
                      </button>
                    </div>
                  </div> */}
                </div>
              </section>

              {/* CONTACT & GUILD SECTION */}
              <section id="contact" className="w-full max-w-4xl mx-auto px-6 md:px-12 pt-12 border-t border-stone-200/60">
                <div className="grid md:grid-cols-12 gap-8 items-center bg-white border border-stone-200 rounded-3xl p-8 md:p-10 shadow-lg">
                  {/* Left Column info */}
                  <div className="md:col-span-5 space-y-4 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-stone-900">Dragon Keeper Guild</h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Have feedback, feature ideas, or bug reports? Contact our developer guild directly!
                    </p>
                    <div className="space-y-2 text-xs font-semibold text-stone-600 pt-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-amber-500" />
                        <span>support@dracomon-rpg.dev</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-500" />
                        <span>v1.2.0 Offline Singleplayer RPG</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Form */}
                  <div className="md:col-span-7">
                    {contactSubmitted ? (
                      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                          <Check className="w-6 h-6" />
                        </div>
                        <h4 className="font-extrabold text-emerald-900 text-sm">Message Dispatched!</h4>
                        <p className="text-xs text-emerald-700">Thank you Dragon Keeper! Your note has been received.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-3">
                        <div>
                          <label className="text-[11px] font-bold text-stone-700 block mb-1">Your Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Dragon Keeper Name"
                            value={contactName}
                            onChange={e => setContactName(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-stone-700 block mb-1">Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="keeper@dracomon.dev"
                            value={contactEmail}
                            onChange={e => setContactEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-stone-700 block mb-1">Message / Feedback</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Share your thoughts on game balance, platform physics, or character skills..."
                            value={contactMessage}
                            onChange={e => setContactMessage(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-amber-500 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-extrabold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Feedback</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </section>

              {/* MEMBERSHIP TIERS SECTION */}
              <section id="membership" className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-16 border-t border-stone-200/60">
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <span className="text-xs font-mono font-black text-amber-600 uppercase tracking-widest bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
                    ★ ACCOUNT MEMBERSHIP & PROGRESSION TIERS
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black text-stone-900">Choose Your Membership Tier</h2>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Unlock instant access to all dragon companions, boosted starting attributes, and exclusive summoner perks.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  {/* Free Tier */}
                  <div className={`p-8 rounded-3xl border transition-all flex flex-col justify-between ${
                    saveData.tier === 'Free' || !saveData.tier
                      ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-400/30 shadow-lg'
                      : 'bg-white border-stone-200 shadow-sm hover:shadow-md'
                  }`}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-extrabold text-stone-500 uppercase">Standard Tier</span>
                        { (saveData.tier === 'Free' || !saveData.tier) && (
                          <span className="text-[10px] font-mono font-black bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full">ACTIVE</span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black text-stone-900">Free Tier</h3>
                      <div className="text-3xl font-black text-stone-900 font-mono">0 <span className="text-sm text-stone-500 font-sans">Coins</span></div>
                      <ul className="space-y-2.5 text-xs text-stone-600 pt-4 border-t border-stone-100">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Start with Jumpmon unlocked</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlock characters via campaign coins</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Standard Level 1 starting stats</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Full offline local save persistence</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => switchTier('Free')}
                      className={`w-full py-3 mt-8 rounded-2xl font-extrabold text-xs transition-all ${
                        saveData.tier === 'Free' || !saveData.tier
                          ? 'bg-stone-200 text-stone-600 cursor-default'
                          : 'bg-stone-900 text-white hover:bg-stone-800 shadow-md active:scale-95'
                      }`}
                    >
                      {saveData.tier === 'Free' || !saveData.tier ? 'Current Active Tier' : 'Switch to Free Tier'}
                    </button>
                  </div>

                  {/* Basic Tier */}
                  <div className={`p-8 rounded-3xl border transition-all flex flex-col justify-between ${
                    saveData.tier === 'Basic'
                      ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-400/30 shadow-lg'
                      : 'bg-white border-stone-200 shadow-sm hover:shadow-md'
                  }`}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-extrabold text-emerald-600 uppercase">Recommended Tier</span>
                        { saveData.tier === 'Basic' && (
                          <span className="text-[10px] font-mono font-black bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full">ACTIVE</span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black text-stone-900">Basic Tier</h3>
                      <div className="text-3xl font-black text-emerald-600 font-mono">Level 5 <span className="text-sm text-stone-500 font-sans">All Unlocked</span></div>
                      <ul className="space-y-2.5 text-xs text-stone-600 pt-4 border-t border-stone-100">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Every Character Unlocked Immediately!</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Instant Level 5 starting level</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> +1 Bonus splitted to ALL attributes per level up</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Instant Whitemon & Bird Familiar access</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => switchTier('Basic')}
                      className={`w-full py-3 mt-8 rounded-2xl font-extrabold text-xs transition-all ${
                        saveData.tier === 'Basic'
                          ? 'bg-stone-200 text-stone-600 cursor-default'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md active:scale-95'
                      }`}
                    >
                      {saveData.tier === 'Basic' ? 'Current Active Tier' : 'Activate Basic Tier'}
                    </button>
                  </div>

                  {/* Premium Tier */}
                  <div className={`p-8 rounded-3xl border transition-all flex flex-col justify-between ${
                    saveData.tier === 'Premium'
                      ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-400/30 shadow-lg'
                      : 'bg-white border-stone-200 shadow-sm hover:shadow-md'
                  }`}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-extrabold text-purple-600 uppercase">God Tier</span>
                        { saveData.tier === 'Premium' && (
                          <span className="text-[10px] font-mono font-black bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full">ACTIVE</span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black text-stone-900">Premium Tier</h3>
                      <div className="text-3xl font-black text-purple-600 font-mono">Max Boost <span className="text-sm text-stone-500 font-sans">Full Roster</span></div>
                      <ul className="space-y-2.5 text-xs text-stone-600 pt-4 border-t border-stone-100">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-500" /> Every Character Unlocked immediately</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-500" /> High starting level (Level 10)</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-500" /> Maximized +1 bonus to ALL stats per level</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-500" /> Full energy regeneration perks</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => switchTier('Premium')}
                      className={`w-full py-3 mt-8 rounded-2xl font-extrabold text-xs transition-all ${
                        saveData.tier === 'Premium'
                          ? 'bg-stone-200 text-stone-600 cursor-default'
                          : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md active:scale-95'
                      }`}
                    >
                      {saveData.tier === 'Premium' ? 'Current Active Tier' : 'Activate Premium Tier'}
                    </button>
                  </div>
                </div>
              </section>

            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Stage Selector Modal */}
      <AnimatePresence>
        {showStageSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-3xl overflow-hidden border bg-white border-stone-200 rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
            >
              <h2 className="text-2xl font-extrabold tracking-tight text-stone-900 font-display">Select Campaign Map</h2>
              <p className="text-xs text-stone-500 mt-1">Deploy your companion into custom platform realms.</p>
              <div className="grid md:grid-cols-2 gap-4 mt-6 min-h-[310px] p-1">
                {currentStages.map((stage) => {
                  const unlocked = isStageUnlocked(stage.num);
                  return (
                    <div
                      key={stage.num}
                      onClick={() => handleStartStage(stage.num)}
                      className={`relative p-5 border border-stone-200 rounded-2xl transition-all flex flex-col justify-between group overflow-hidden ${
                        unlocked
                          ? 'cursor-pointer hover:shadow-md bg-white ' + stage.borderHover
                          : 'cursor-not-allowed bg-stone-50 opacity-80'
                      }`}
                    >
                      {!unlocked && (
                        <div className="absolute inset-0 z-20 bg-stone-900/60 backdrop-blur-[2px] p-4 flex flex-col items-center justify-center text-center text-white space-y-1">
                          <Lock className="w-5 h-5 text-amber-400" />
                          <span className="text-xs font-black">Stage {stage.num} Locked</span>
                          <span className="text-[10px] text-stone-300">Complete Stage {stage.num - 1} or Activate Basic Membership</span>
                        </div>
                      )}
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-extrabold text-stone-400 tracking-wider uppercase font-mono">Stage {stage.num}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-mono rounded font-bold ${stage.diffClass}`}>
                            {stage.difficulty}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-stone-900 text-lg mt-2 font-display">{stage.name}</h3>
                        <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                          {stage.desc}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center justify-between text-xs font-bold text-stone-600 group-hover:text-stone-900 font-mono">
                        <span>Boss: {stage.boss}</span>
                        <span className="group-hover:translate-x-1 transition-transform">{unlocked ? 'Deploy ➔' : 'Locked 🔒'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              <div className="mt-8 flex items-center justify-between border-t border-stone-100 pt-5">
                <div className="flex items-center gap-2">
                  {Array.from({ length: pageCount }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        soundService.playClick();
                        setStagePage(idx);
                      }}
                      className={`w-8 h-8 rounded-full text-xs font-mono font-bold transition-all border ${
                        stagePage === idx
                          ? 'bg-stone-900 border-stone-900 text-white shadow-sm'
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { soundService.playClick(); setShowStageSelector(false); }}
                    className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700 text-xs font-bold transition-all"
                  >
                    Back
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls & How to Play Modal */}
      <AnimatePresence>
        {showControlsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-xl border bg-white border-stone-200 rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
            >
              <h2 className="text-2xl font-black text-stone-900 font-display">Game Controls Guide</h2>
              <p className="text-xs text-stone-500 mt-1">Master movement, platform landing, and weapon swinging.</p>

              <div className="space-y-4 mt-6 text-sm">
                <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="font-semibold text-stone-700">Move Left / Right</span>
                  <div className="flex gap-1.5 font-mono text-xs">
                    <span className="px-2 py-1 bg-white border rounded shadow-sm font-bold">A</span>
                    <span className="px-2 py-1 bg-white border rounded shadow-sm font-bold">D</span>
                    <span className="text-stone-400">or</span>
                    <span className="px-2 py-1 bg-white border rounded shadow-sm font-bold">←</span>
                    <span className="px-2 py-1 bg-white border rounded shadow-sm font-bold">→</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="font-semibold text-stone-700">Jump / Double Jump</span>
                  <div className="flex gap-1.5 font-mono text-xs">
                    <span className="px-2.5 py-1 bg-white border rounded shadow-sm font-bold">W</span>
                    <span className="text-stone-400">or</span>
                    <span className="px-2.5 py-1 bg-white border rounded shadow-sm font-bold">↑</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="font-bold text-amber-900">Companion Ultimate Skill</span>
                    <span className="text-[11px] text-amber-700">Requires charged energy (Meteor, Shower, Avatar, Knives, Laser)</span>
                  </div>
                  <div className="flex gap-1.5 font-mono text-xs">
                    <span className="px-3.5 py-1 bg-white border border-amber-300 text-amber-900 rounded shadow-sm font-bold">SPACE</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50/60 border border-amber-200/60 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="font-bold text-amber-900">Drop Down Platform</span>
                    <span className="text-[11px] text-amber-700">Drop down through wooden floating platforms</span>
                  </div>
                  <div className="flex gap-1.5 font-mono text-xs">
                    <span className="px-2.5 py-1 bg-white border border-amber-300 text-amber-900 rounded shadow-sm font-bold">S</span>
                    <span className="text-amber-500">or</span>
                    <span className="px-2.5 py-1 bg-white border border-amber-300 text-amber-900 rounded shadow-sm font-bold">↓</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="flex flex-col">
                    <span className="font-semibold text-stone-700">Swinging Attack</span>
                    <span className="text-[11px] text-stone-500">Slash blade arc & spark particles</span>
                  </div>
                  <div className="flex gap-1.5 font-mono text-xs">
                    <span className="px-2.5 py-1 bg-white border rounded shadow-sm font-bold">J</span>
                    <span className="text-stone-400">or</span>
                    <span className="px-2.5 py-1 bg-white border rounded shadow-sm font-bold">Z</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="font-semibold text-stone-700">Companion Special Skill</span>
                  <div className="flex gap-1.5 font-mono text-xs">
                    <span className="px-2.5 py-1 bg-white border rounded shadow-sm font-bold">K</span>
                    <span className="text-stone-400">or</span>
                    <span className="px-2.5 py-1 bg-white border rounded shadow-sm font-bold">X</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => { soundService.playClick(); setShowControlsModal(false); }}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAY PORTALS */}
      <AnimatePresence>
        {/* Roster selection */}
        {showSelection && (
          <DracoSelection
            saveData={saveData}
            onSelect={(name) => {
              selectDraco(name);
              setShowSelection(false);
            }}
            onUnlock={(name, cost) => unlockDraco(name, cost)}
            onLevelUpWithCoins={(name) => levelUpDracoWithCoins(name)}
            onClose={() => setShowSelection(false)}
            onSwitchTier={switchTier}
          />
        )}

        {/* Inventory Bag */}
        {showInventory && (
          <InventoryModal
            saveData={saveData}
            onUsePotion={usePotion}
            onUseUpgradeStone={useUpgradeStone}
            onBuyItem={buyItem}
            onClose={() => setShowInventory(false)}
          />
        )}

        {/* Level Up selection */}
        {showLevelUp && levelUpInfo && (
          <LevelUpModal
            dracoName={levelUpInfo.dracoName}
            oldLevel={levelUpInfo.oldLevel}
            newLevel={levelUpInfo.newLevel}
            baseIncrease={levelUpInfo.baseIncrease}
            bonusRoll={levelUpInfo.bonusRoll}
            onApplyBonus={applyLevelUpBonus}
          />
        )}

        {/* Settings options */}
        {showSettings && (
          <SettingsModal
            saveData={saveData}
            onUpdateSettings={updateSettings}
            onResetSave={resetGameSave}
            onExportSave={exportSave}
            onImportSave={importSave}
            onClose={() => setShowSettings(false)}
          />
        )}

        {/* Version History Modal */}
        {showVersionHistory && (
          <VersionHistoryModal onClose={() => setShowVersionHistory(false)} />
        )}
      </AnimatePresence>

      {/* AAA FOOTER */}
      <footer className="w-full border-t border-stone-200 bg-white/70 backdrop-blur-md pt-12 pb-8 z-40 select-none font-sans">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-4 gap-8 text-left text-xs">
          <div className="space-y-3">
            <span className="text-lg font-black text-stone-900 flex items-center gap-1 font-display">
              🐉 DRACOMON RPG
            </span>
            <p className="text-stone-500 leading-relaxed text-[11px]">
              Offline platforming dragon action RPG built with HTML5 Canvas 2D engine & React.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-stone-900 uppercase tracking-wider mb-3 font-mono">Quick Navigation</h4>
            <ul className="space-y-2 text-stone-500 font-semibold">
              <li><button onClick={() => scrollToSection('hero')} className="hover:text-amber-600">Overview</button></li>
              <li><button onClick={() => scrollToSection('about')} className="hover:text-amber-600">About Realm</button></li>
              <li><button onClick={() => scrollToSection('characters')} className="hover:text-amber-600">Character Lore</button></li>
              <li><button onClick={() => scrollToSection('realms')} className="hover:text-amber-600">Campaign Stages</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-stone-900 uppercase tracking-wider mb-3 font-mono">Community & Help</h4>
            <ul className="space-y-2 text-stone-500 font-semibold">
              <li><button onClick={() => scrollToSection('faq')} className="hover:text-amber-600">FAQ</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="hover:text-amber-600">Contact Guild</button></li>
              <li><button onClick={() => scrollToSection('support')} className="hover:text-amber-600">Support Developers 💖</button></li>
              <li><button onClick={() => setShowControlsModal(true)} className="hover:text-amber-600">Controls Guide</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-stone-900 uppercase tracking-wider font-mono">Release Info</h4>
            <p className="text-stone-400 text-[11px] font-mono">
              Version: <strong className="text-stone-700">v1.2.0 Stable</strong> <br />
              Stack: React 19, Next.js 15, Canvas 2D
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-[11px] font-mono font-extrabold text-stone-700 transition-all"
            >
              ↑ Back To Top
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-100 text-center text-[11px] text-stone-400 font-mono">
          © {new Date().getFullYear()} Dracomon RPG Realm. All rights reserved. Offline Save Persistence Enabled.
        </div>
      </footer>
    </div>
  );
}
