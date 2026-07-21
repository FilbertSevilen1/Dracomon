'use client';

import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { DracoSelection } from '../components/DracoSelection';
import { InventoryModal } from '../components/InventoryModal';
import { LevelUpModal } from '../components/LevelUpModal';
import { SettingsModal } from '../components/SettingsModal';
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
  } = useGameState();

  // Modal open states
  const [showSelection, setShowSelection] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStageSelector, setShowStageSelector] = useState(false);
  const [showControlsModal, setShowControlsModal] = useState(false);
  const [stagePage, setStagePage] = useState(0);

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

  const handleStartStage = (stageNum: number) => {
    soundService.playClick();
    setCurrentStage(stageNum);
    setShowStageSelector(false);
    setIsPlaying(true);
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
      lore: 'Born in the pitch-black obsidian caves of Mystic Ruins, Assassinmon is a shadow assassin wielding twin daggers. Specialized in silent shadow-steps and high speed strike combinations.',
      signatureSkill: 'Shadow Dash Strike (Invulnerable Dash)',
      color: 'purple',
      tagColor: 'bg-purple-100 text-purple-900 border-purple-300 font-mono',
      attackType: 'Melee Shadow Dagger Slash',
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
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-stone-600">
          <button onClick={() => scrollToSection('hero')} className="hover:text-amber-600 transition-colors">Overview</button>
          <button onClick={() => scrollToSection('about')} className="hover:text-amber-600 transition-colors">About Realm</button>
          <button onClick={() => scrollToSection('characters')} className="hover:text-amber-600 transition-colors">Character Lore</button>
          <button onClick={() => scrollToSection('realms')} className="hover:text-amber-600 transition-colors">Campaign Stages</button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-amber-600 transition-colors">FAQ</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-amber-600 transition-colors">Guild Contact</button>
        </nav>

        {/* Right Utility Bar */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-full text-xs font-semibold text-stone-700 shadow-sm">
            <span className="text-stone-400">Partner:</span>
            <span className="font-bold text-stone-900">{activeDracoName} (Lv.{activeLevel})</span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-mono font-bold text-amber-700 shadow-sm">
            <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{coins}</span>
          </div>

          <button
            onClick={() => { soundService.playCoin(); }}
            className="p-2 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 text-amber-600 shadow-sm transition-all active:scale-95 flex items-center justify-center"
            title="Test Sound SFX"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => { soundService.playClick(); setShowInventory(true); }}
            className="p-2 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 text-stone-600 shadow-sm transition-all active:scale-95 flex items-center justify-center"
            title="Open Inventory"
          >
            <Briefcase className="w-4 h-4" />
          </button>

          <button
            onClick={() => { soundService.playClick(); setShowSettings(true); }}
            className="p-2 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 text-stone-600 shadow-sm transition-all active:scale-95 flex items-center justify-center"
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
                onStageClear={() => {}}
                onQuit={() => setIsPlaying(false)}
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
                  <div className="md:col-span-5 flex justify-center items-center h-[340px] md:h-[400px] relative select-none">
                    {/* Floating Island 1: Jumpmon */}
                    <motion.div
                      className={`absolute top-2 left-2 md:left-6 flex flex-col items-center cursor-pointer group z-10 ${
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

                    {/* Floating Island 2: Archermon */}
                    <motion.div
                      className={`absolute bottom-2 left-0 md:left-4 flex flex-col items-center cursor-pointer group z-10 ${
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

                    {/* Floating Island 3: Shieldmon (Center Center) */}
                    <motion.div
                      className={`absolute top-28 left-[110px] md:left-[140px] flex flex-col items-center cursor-pointer group z-20 ${
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

                    {/* Floating Island 4: Assassinmon */}
                    <motion.div
                      className={`absolute top-2 right-2 md:right-6 flex flex-col items-center cursor-pointer group z-10 ${
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

                    {/* Floating Island 5: Flymon */}
                    <motion.div
                      className={`absolute bottom-2 right-0 md:right-4 flex flex-col items-center cursor-pointer group z-10 ${
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
                        {/* Header Status Badge */}
                        <div className="absolute top-5 right-5 z-10">
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

                        <div>
                          {/* Companion Header */}
                          <div className="flex items-center gap-4">
                            <div className={`w-18 h-18 rounded-2xl ${isUnlocked ? 'bg-stone-100 border-stone-200' : 'bg-stone-200/60 border-stone-300'} border flex items-center justify-center p-2 shadow-inner relative`}>
                              {item.svg}
                              {!isUnlocked && (
                                <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                                  <Lock className="w-6 h-6 text-stone-700" />
                                </div>
                              )}
                            </div>
                            <div>
                              <span className={`inline-block px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md border ${item.tagColor}`}>
                                {item.title}
                              </span>
                              <h3 className="text-xl font-black text-stone-900 mt-1">{item.name}</h3>
                              <span className="text-[10px] font-semibold text-stone-400">{item.role}</span>
                            </div>
                          </div>

                          {/* Character Story Paragraph */}
                          <div className="mt-4 p-3.5 bg-stone-50/80 border border-stone-100 rounded-2xl text-xs leading-relaxed text-stone-600">
                            <p>{item.lore}</p>
                          </div>

                          {/* Signature Ability */}
                          <div className="mt-3 space-y-1.5 text-xs">
                            <div className="flex justify-between text-stone-600">
                              <span className="font-semibold">Attack Style:</span>
                              <span className="font-bold text-stone-900">{item.attackType}</span>
                            </div>
                            <div className="flex justify-between text-stone-600">
                              <span className="font-semibold">Signature Skill:</span>
                              <span className="font-bold text-amber-600">{item.signatureSkill}</span>
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
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <h2 className="text-3xl md:text-5xl font-black text-stone-900">Explore Platform Realms</h2>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Deploy your active dragon companion into custom campaign realms filled with slimes, archers, hazards, and bosses.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-10">
                  {/* Stage 1 */}
                  <div className="p-7 bg-white border border-stone-200 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-emerald-600 uppercase tracking-wider font-mono">Stage 1</span>
                        <span className="px-2.5 py-0.5 text-[9px] font-mono bg-emerald-100 text-emerald-800 font-extrabold rounded-md">[ EASY ]</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-stone-900 mt-2 font-display">Whispering Woods</h3>
                      <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                        Gentle forest platforms with Slimes. Features the <strong>King Slime Lord</strong> boss guarding the exit portal.
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartStage(1)}
                      className="w-full py-3 bg-stone-900 hover:bg-emerald-700 text-white rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                      <span>Deploy to Stage 1</span>
                    </button>
                  </div>

                  {/* Stage 2 */}
                  <div className="p-7 bg-white border border-stone-200 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-600 uppercase tracking-wider font-mono">Stage 2</span>
                        <span className="px-2.5 py-0.5 text-[9px] font-mono bg-slate-100 text-slate-800 font-extrabold rounded-md">[ MEDIUM ]</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-stone-900 mt-2 font-display">Mystic Ruins</h3>
                      <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                        Ancient ruined stone structures with floor spikes, Goblin Archers, and the <strong>Sentinel Archdemon</strong>.
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartStage(2)}
                      className="w-full py-3 bg-stone-900 hover:bg-slate-700 text-white rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 text-slate-400 fill-slate-400" />
                      <span>Deploy to Stage 2</span>
                    </button>
                  </div>

                  {/* Stage 3 */}
                  <div className="p-7 bg-white border border-stone-200 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-orange-600 uppercase tracking-wider font-mono">Stage 3</span>
                        <span className="px-2.5 py-0.5 text-[9px] font-mono bg-orange-100 text-orange-800 font-extrabold rounded-md">[ HARD ]</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-stone-900 mt-2 font-display">Volcanic Peak</h3>
                      <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                        Magma hazards with Fire Golems and the <strong>Dracoguard Fire Lord</strong> lava dragon boss.
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartStage(3)}
                      className="w-full py-3 bg-stone-900 hover:bg-orange-600 text-white rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 text-orange-400 fill-orange-400" />
                      <span>Deploy to Stage 3</span>
                    </button>
                  </div>

                  {/* Stage 4 */}
                  <div className="p-7 bg-white border border-stone-200 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-sky-600 uppercase tracking-wider font-mono">Stage 4</span>
                        <span className="px-2.5 py-0.5 text-[9px] font-mono bg-sky-100 text-sky-800 font-extrabold rounded-md">[ EXPERT ]</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-stone-900 mt-2 font-display">Frozen Citadel</h3>
                      <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                        Glacial ice chasms with Frost Golems and the <strong>Frostbite Wyvern</strong> ice dragon boss fight.
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartStage(4)}
                      className="w-full py-3 bg-stone-900 hover:bg-sky-700 text-white rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 text-sky-400 fill-sky-400" />
                      <span>Deploy to Stage 4</span>
                    </button>
                  </div>

                  {/* Stage 5 */}
                  <div className="p-7 bg-white border border-stone-200 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-purple-600 uppercase tracking-wider font-mono">Stage 5</span>
                        <span className="px-2.5 py-0.5 text-[9px] font-mono bg-purple-100 text-purple-800 font-extrabold rounded-md">[ MASTER ]</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-stone-900 mt-2 font-display">Shadow Abyss</h3>
                      <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                        Corrupted void crystal platforms featuring the <strong>Shadow Overlord</strong> dark energy dragon boss.
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartStage(5)}
                      className="w-full py-3 bg-stone-900 hover:bg-purple-700 text-white rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
                      <span>Deploy to Stage 5</span>
                    </button>
                  </div>

                  {/* Stage 6 */}
                  <div className="p-7 bg-white border border-stone-200 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-emerald-600 uppercase tracking-wider font-mono">Stage 6</span>
                        <span className="px-2.5 py-0.5 text-[9px] font-mono bg-emerald-100 text-emerald-800 font-extrabold rounded-md">[ CHALLENGE ]</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-stone-900 mt-2 font-display">Celestial Temple</h3>
                      <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                        Grand sanctuary altar defending sacred artifacts from corrupted Fire Golems.
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartStage(6)}
                      className="w-full py-3 bg-stone-900 hover:bg-emerald-700 text-white rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                      <span>Deploy to Stage 6</span>
                    </button>
                  </div>

                  {/* Stage 7 */}
                  <div className="p-7 bg-white border border-stone-200 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-sky-600 uppercase tracking-wider font-mono">Stage 7</span>
                        <span className="px-2.5 py-0.5 text-[9px] font-mono bg-sky-100 text-sky-800 font-extrabold rounded-md">[ EXPERT ]</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-stone-900 mt-2 font-display">Sky Heavens</h3>
                      <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                        Use bouncy trampolines to cross bottomless pits guarded by landmines, skewers, and Sentinel Archdemons.
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartStage(7)}
                      className="w-full py-3 bg-stone-900 hover:bg-sky-600 text-white rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 text-sky-400 fill-sky-400" />
                      <span>Deploy to Stage 7</span>
                    </button>
                  </div>

                  {/* Stage 8 */}
                  <div className="p-7 bg-white border border-amber-300 ring-2 ring-amber-400/30 rounded-3xl shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4 bg-gradient-to-b from-amber-500/5 to-amber-500/10">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-amber-700 uppercase tracking-wider font-mono">Stage 8 • FINAL</span>
                        <span className="px-2.5 py-0.5 text-[9px] font-mono bg-amber-500 text-stone-950 font-black rounded-md">[ DRAGON KING ]</span>
                      </div>
                      <h3 className="text-xl font-black text-stone-900 mt-2 font-display">Primordial Core</h3>
                      <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                        Magma cores erupting fire torrents! Defeat the legendary <strong>PRIMORDIAL DRAGON KING</strong> with 5-arrow Bullet-Hell!
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartStage(8)}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <Play className="w-4 h-4 text-stone-950 fill-stone-950" />
                      <span>Face Dragon King</span>
                    </button>
                  </div>
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
                  
                  <div className="w-full md:w-auto min-w-[290px] bg-white border border-purple-200/60 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center font-bold text-lg text-purple-600 shadow-inner">
                        🏦
                      </div>
                      <div className="text-left">
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider font-mono">Transfer Method</span>
                        <h4 className="font-bold text-xs text-stone-700">Bank Central Asia (BCA)</h4>
                      </div>
                    </div>

                    {/* EDITABLE BANK ACCOUNT DETAILS */}
                    <div className="p-3.5 bg-stone-50 border border-stone-100 rounded-xl font-mono text-center relative">
                      <div className="text-stone-400 text-[9px] uppercase font-bold tracking-wider mb-1">Account Number</div>
                      <div className="text-stone-950 font-black text-base tracking-widest select-all">
                        5271835648
                      </div>
                      <div className="text-stone-500 text-[10px] font-bold mt-1.5">
                        A/N: IGNATIUS FILBERT SEVILEN
                      </div>
                      
                      {/* Copy to Clipboard Trigger */}
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
                  </div>
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
                {currentStages.map((stage) => (
                  <div
                    key={stage.num}
                    onClick={() => handleStartStage(stage.num)}
                    className={`p-5 border border-stone-200 rounded-2xl cursor-pointer transition-all hover:shadow-md flex flex-col justify-between group ${stage.borderHover}`}
                  >
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
                      <span className="group-hover:translate-x-1 transition-transform">Deploy ➔</span>
                    </div>
                  </div>
                ))}
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
        {/* Draco Selection */}
        {showSelection && (
          <DracoSelection
            saveData={saveData}
            onSelect={selectDraco}
            onUnlock={unlockDraco}
            onLevelUpWithCoins={(name) => {
              setShowSelection(false);
              levelUpDracoWithCoins(name);
            }}
            onClose={() => setShowSelection(false)}
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
