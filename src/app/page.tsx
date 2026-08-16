'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGameState } from '../hooks/useGameState';
import { DracoSelection } from '../components/DracoSelection';
import { InventoryModal } from '../components/InventoryModal';
import { LevelUpModal } from '../components/LevelUpModal';
import { SettingsModal } from '../components/SettingsModal';
import { GameScreen } from '../components/GameScreen';
import { FullScreenShowcaseCanvas } from '../components/FullScreenShowcaseCanvas';
import { Footer } from '../components/Footer';
import { ActivationModal } from '../components/ActivationModal';
import { soundService } from '../services/sound';
import { STAGES } from '../game/LevelManager';
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
  ChevronLeft,
  ChevronRight,
  Globe,
  Award,
  Layers,
  ScrollText,
} from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
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
    pendingLevelUps,
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
    activationTier,
    setActivationTier,
    activationCodeInput,
    setActivationCodeInput,
    activationError,
    setActivationError,
    handleVerifyCode,
  } = useGameState();

  const [showSelection, setShowSelection] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStageSelector, setShowStageSelector] = useState(false);
  const [showControlsModal, setShowControlsModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [stagePage, setStagePage] = useState(0);
  const [realmPage, setRealmPage] = useState(0);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activeDracoName = saveData.selectedDraco;
  const activeDraco = saveData.dracos[activeDracoName];
  const activeLevel = activeDraco?.level || 1;
  const coins = saveData.player.coins;

  const potionItem = saveData.inventory.find(i => i.id === 'potion');
  const activePotionCount = potionItem ? potionItem.quantity : 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isPlaying, stagePage]);

  const isStageUnlocked = (stageNum: number) => {
    if (saveData.tier === 'Basic' || saveData.tier === 'Premium') {
      return true;
    }
    if (stageNum === 1) return true;
    const completed = saveData.completedStages || [];
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
    router.push(`/play?stage=${stageNum}`);
  };

  const triggerCompanionJump = (name: string) => {
    if (name === 'Jumpmon') soundService.playJump();
    if (name === 'Archermon') soundService.playShoot();
    if (name === 'Shieldmon') soundService.playBlock();
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
          <ellipse cx="50" cy="85" rx="28" ry="6" fill="rgba(0,0,0,0.2)" />
          <path d="M 36 32 Q 22 4 34 8 Q 40 18 42 24 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.8" />
          <path d="M 64 32 Q 78 4 66 8 Q 60 18 58 24 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.8" />
          <circle cx="50" cy="52" r="24" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
          <circle cx="50" cy="58" r="14" fill="#fef08a" />
          <circle cx="43" cy="46" r="3" fill="#000000" />
          <circle cx="57" cy="46" r="3" fill="#000000" />
          <circle cx="38" cy="52" r="2.5" fill="#f87171" />
          <circle cx="62" cy="52" r="2.5" fill="#f87171" />
          <polygon points="50,53 52,58 57,58 53,61 55,66 50,63 45,66 47,61 43,58 48,58" fill="#f59e0b" />
          <rect x="30" y="72" width="14" height="8" rx="3" fill="#d97706" stroke="#b45309" strokeWidth="1.5" />
          <rect x="56" y="72" width="14" height="8" rx="3" fill="#d97706" stroke="#b45309" strokeWidth="1.5" />
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
      signatureSkill: 'Shield Trample Dash (600px Max Trample & Knockback)',
      ultimateSkill: 'Portal Rampage Charge (Invincible Shield Charge to Exit Portal • Skyward Launch)',
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
          <ellipse cx="50" cy="85" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
          <path d="M 28 42 Q 10 24 32 32 Z" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
          <path d="M 72 42 Q 90 24 68 32 Z" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
          <path d="M 36 32 L 28 14 L 40 24 Z" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.5" />
          <path d="M 64 32 L 72 14 L 60 24 Z" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.5" />
          <rect x="32" y="30" width="36" height="46" rx="14" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2.8" />
          <rect x="40" y="40" width="6" height="5" rx="1" fill="#60a5fa" />
          <rect x="54" y="40" width="6" height="5" rx="1" fill="#60a5fa" />
          <rect x="42" y="41" width="2" height="3" fill="#ffffff" />
          <rect x="56" y="41" width="2" height="3" fill="#ffffff" />
          <path d="M 60 36 L 82 36 L 86 76 L 71 86 L 56 76 Z" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" />
          <line x1="71" y1="42" x2="71" y2="78" stroke="#60a5fa" strokeWidth="2.5" />
          <line x1="63" y1="56" x2="79" y2="56" stroke="#60a5fa" strokeWidth="2.5" />
          <circle cx="71" cy="56" r="3.5" fill="#ffffff" />
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
          <ellipse cx="50" cy="85" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
          <path d="M 32 44 Q -6 12 24 26 Q 12 46 32 58 Z" fill="rgba(56, 189, 248, 0.65)" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M 68 44 Q 106 12 76 26 Q 88 46 68 58 Z" fill="rgba(56, 189, 248, 0.65)" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M 36 32 Q 22 10 18 4 Q 30 14 40 22 Z" fill="#e11d48" stroke="#facc15" strokeWidth="1.2" />
          <path d="M 64 32 Q 78 10 82 4 Q 70 14 60 22 Z" fill="#e11d48" stroke="#facc15" strokeWidth="1.2" />
          <rect x="34" y="30" width="32" height="46" rx="12" fill="#e11d48" stroke="#881337" strokeWidth="2.5" />
          <rect x="34" y="44" width="32" height="4" fill="#facc15" />
          <rect x="34" y="54" width="32" height="4" fill="#facc15" />
          <circle cx="44" cy="40" r="3.5" fill="#facc15" />
          <circle cx="56" cy="40" r="3.5" fill="#facc15" />
          <polygon points="50,76 44,92 56,92" fill="#facc15" stroke="#881337" strokeWidth="1" />
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
          <ellipse cx="50" cy="85" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
          <path d="M 32 44 Q -4 10 26 24 Q 14 44 32 58 Z" fill="#f8fafc" stroke="#38bdf8" strokeWidth="1.8" />
          <path d="M 68 44 Q 104 10 74 24 Q 86 44 68 58 Z" fill="#f8fafc" stroke="#38bdf8" strokeWidth="1.8" />
          <path d="M 34 32 Q 50 14 66 32 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
          <rect x="36" y="32" width="28" height="44" rx="10" fill="#f8fafc" stroke="#64748b" strokeWidth="2.5" />
          <circle cx="44" cy="42" r="3.5" fill="#0284c7" />
          <circle cx="56" cy="42" r="3.5" fill="#0284c7" />
          <circle cx="50" cy="58" r="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
          <g transform="translate(74, 22)">
            <ellipse cx="10" cy="10" rx="8" ry="5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
            <polygon points="18,10 24,8 19,13" fill="#fbbf24" />
          </g>
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
    {
      name: 'Shadowmon',
      title: 'Nether Dark Dragon',
      cost: 450,
      role: 'Ranged Dark / Soul Burst DPS',
      lore: 'Born from the pitch-black void of the Nether Realm. Shadowmon attacks with dark crimson energy bolts. Defeating enemies in a stage absorbs Dark Soul Stacks (up to 5 max) onto his body, which empower his 120-Energy 360° Dark Void Eruption ultimate by up to 5x multiplier!',
      signatureSkill: 'Dark Shadowraze Eruption (Vertical Nether Ground Pillar)',
      ultimateSkill: 'Soul Blast (120 Energy • 1.5s Channel • Dual Screen-Sweeping Dark Waves)',
      color: 'rose',
      tagColor: 'bg-rose-950 text-rose-300 border-rose-700 font-mono',
      attackType: 'Ranged Dark Crimson Plasma Bolts',
      hp: saveData.dracos['Shadowmon']?.hp || 20,
      atk: saveData.dracos['Shadowmon']?.attack || 9,
      def: saveData.dracos['Shadowmon']?.defense || 3,
      spd: saveData.dracos['Shadowmon']?.speed || 8,
      jump: 10.5,
      svg: (
        <svg width="70" height="70" viewBox="0 0 100 100" className="animate-float-slow">
          <ellipse cx="50" cy="85" rx="30" ry="6" fill="rgba(0,0,0,0.2)" />
          <path d="M 28 45 Q 6 20 32 32 Z" fill="#9f1239" stroke="#ef4444" strokeWidth="1.5" />
          <path d="M 72 45 Q 94 20 68 32 Z" fill="#9f1239" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="34" y="34" width="32" height="42" rx="10" fill="#18181b" stroke="#ef4444" strokeWidth="2.5" />
          <path d="M 32 30 L 26 14 L 40 24 Z" fill="#ef4444" />
          <path d="M 68 30 L 74 14 L 60 24 Z" fill="#ef4444" />
          <rect x="42" y="44" width="5" height="4" fill="#ef4444" />
          <rect x="53" y="44" width="5" height="4" fill="#ef4444" />
          <circle cx="50" cy="62" r="7" fill="#881337" stroke="#ef4444" strokeWidth="1.5" />
          <text x="50" y="65" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="monospace">5</text>
        </svg>
      ),
    },
    {
      name: 'Bombamon',
      title: 'Fiery Carpet Bomber',
      cost: 350,
      role: 'Explosive / Carpet Bomber',
      lore: 'Forged in the heart of Volcanic Peak. Bombamon launches fire projectiles and throws homing rocks that ignite 3-block ground burn zones for 2s. Unleashes Carpet Bombing to fly high across the sky, shower fire streams onto platforms for 5s, hasten ignited foes, and detonate dying enemies into 120-damage AoE explosions!',
      signatureSkill: 'Homing Bomb Rock (1000px Range • 3-Block Ground Igniter 2s)',
      ultimateSkill: 'Carpet Bombing (8 Blocks High • 5s Platform Burn • Haste & Death Explosions)',
      color: 'orange',
      tagColor: 'bg-orange-100 text-orange-950 border-orange-300 font-mono',
      attackType: 'Ranged Fire Breath & Homing Explosive Rocks',
      hp: saveData.dracos['Bombamon']?.hp || 21,
      atk: saveData.dracos['Bombamon']?.attack || 8,
      def: saveData.dracos['Bombamon']?.defense || 3,
      spd: saveData.dracos['Bombamon']?.speed || 7,
      jump: 11,
      svg: (
        <svg width="70" height="70" viewBox="0 0 100 100" className="animate-float-medium">
          <ellipse cx="50" cy="85" rx="30" ry="6" fill="rgba(0,0,0,0.15)" />
          <path d="M 28 45 Q 8 22 32 34 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
          <path d="M 72 45 Q 92 22 68 34 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
          <rect x="34" y="34" width="32" height="42" rx="10" fill="#f97316" stroke="#c2410c" strokeWidth="2.5" />
          <path d="M 36 30 L 30 16 L 42 24 Z" fill="#ea580c" />
          <path d="M 64 30 L 70 16 L 58 24 Z" fill="#ea580c" />
          <rect x="42" y="44" width="5" height="5" fill="#fef08a" />
          <rect x="53" y="44" width="5" height="5" fill="#fef08a" />
          <circle cx="50" cy="62" r="7" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
          <text x="50" y="65" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="900">💣</text>
        </svg>
      ),
    },
    {
      name: 'Thundermon',
      title: 'Storm Lord of Thunder',
      cost: 400,
      role: 'Thunder / Electrotackle',
      lore: 'Born from celestial thunderbolts at Sky Heavens. Thundermon charges electric spheres and dashes into unblocked enemies, exploding lightning on contact and leaving a 4s electric charged platform path (300px) that deals continuous damage & 0.2s ministuns. Calls upon Raigeki to strike thunderbolts on all foes within 800px, stunning for 1.0s and turning defeated targets into bone piles!',
      signatureSkill: 'Electrotackle (Lightning Dash & 4s 300px Electric Platform Path)',
      ultimateSkill: 'Raigeki (200 Energy • 800px Radius Thunderbolts • 1.0s Stun • Bone Pile Death)',
      color: 'yellow',
      tagColor: 'bg-yellow-100 text-yellow-950 border-yellow-300 font-mono',
      attackType: 'Electric Sphere Area Charge',
      hp: saveData.dracos['Thundermon']?.hp || 22,
      atk: saveData.dracos['Thundermon']?.attack || 9,
      def: saveData.dracos['Thundermon']?.defense || 3,
      spd: saveData.dracos['Thundermon']?.speed || 7.5,
      jump: 11,
      svg: (
        <svg width="70" height="70" viewBox="0 0 100 100" className="animate-float-slow">
          <ellipse cx="50" cy="85" rx="30" ry="6" fill="rgba(0,0,0,0.15)" />
          <path d="M 28 44 Q 6 16 30 28 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
          <path d="M 72 44 Q 94 16 70 28 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
          <rect x="34" y="34" width="32" height="42" rx="10" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />
          <path d="M 34 34 L 26 14 L 38 24 Z" fill="#06b6d4" stroke="#0891b2" strokeWidth="1.5" />
          <path d="M 66 34 L 74 14 L 62 24 Z" fill="#06b6d4" stroke="#0891b2" strokeWidth="1.5" />
          <rect x="42" y="44" width="5" height="4" fill="#06b6d4" />
          <rect x="53" y="44" width="5" height="4" fill="#06b6d4" />
          <path d="M 52 52 L 44 64 L 50 64 L 47 74 L 56 60 L 50 60 Z" fill="#06b6d4" stroke="#0891b2" strokeWidth="1.2" />
        </svg>
      ),
    },
    {
      name: 'Enigmon',
      title: 'Cosmic Singularity Warden',
      cost: 500,
      role: 'Cosmic / Black Hole Gravity',
      lore: 'Born from deep outer space singularity void. Enigmon fires dark matter particles and casts Schwarzschild Pulse onto target ground zones. Channeling 300 Energy summons a 150px Black Hole singularity 400px forward that pulls enemies, stuns them, and destroys platform blocks and hazard zones.',
      signatureSkill: 'Schwarzschild Pulse (200px x 40px Oval Zone • Base + 3% Max HP/s)',
      ultimateSkill: 'Black Hole Singularity (300 Energy • 150px Radius • Pull & Tile/Hazard Destruction • 3s Stun)',
      color: 'purple',
      tagColor: 'bg-purple-950 text-purple-300 border-purple-700 font-mono',
      attackType: 'Dark Matter Particle Shot (500px Range)',
      hp: saveData.dracos['Enigmon']?.hp || 20,
      atk: saveData.dracos['Enigmon']?.attack || 8,
      def: saveData.dracos['Enigmon']?.defense || 3,
      spd: saveData.dracos['Enigmon']?.speed || 7,
      jump: 11,
      svg: (
        <svg width="70" height="70" viewBox="0 0 100 100" className="animate-float-slow">
          <ellipse cx="50" cy="85" rx="26" ry="6" fill="rgba(0,0,0,0.4)" />
          <ellipse cx="50" cy="52" rx="44" ry="16" fill="none" stroke="#e879f9" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.85" />
          <ellipse cx="50" cy="52" rx="36" ry="10" fill="none" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.65" />
          <circle cx="8" cy="52" r="3" fill="#e879f9" stroke="#ffffff" strokeWidth="1" />
          <circle cx="92" cy="52" r="3" fill="#e879f9" stroke="#ffffff" strokeWidth="1" />
          <path d="M 28 42 Q -6 6 24 24 Q 14 44 32 58 Z" fill="#3b0764" stroke="#e879f9" strokeWidth="2" />
          <path d="M 72 42 Q 106 6 76 24 Q 86 44 68 58 Z" fill="#3b0764" stroke="#e879f9" strokeWidth="2" />
          <path d="M 34 32 L 20 10 L 38 20 Z" fill="#581c87" stroke="#e879f9" strokeWidth="1.5" />
          <path d="M 66 32 L 80 10 L 62 20 Z" fill="#581c87" stroke="#e879f9" strokeWidth="1.5" />
          <rect x="34" y="30" width="32" height="46" rx="12" fill="#090514" stroke="#a855f7" strokeWidth="2.5" />
          <circle cx="44" cy="42" r="3.5" fill="#e879f9" />
          <circle cx="56" cy="42" r="3.5" fill="#e879f9" />
          <circle cx="44" cy="42" r="1.2" fill="#ffffff" />
          <circle cx="56" cy="42" r="1.2" fill="#ffffff" />
          <circle cx="50" cy="58" r="11" fill="rgba(232, 121, 249, 0.2)" />
          <circle cx="50" cy="58" r="8" fill="#000000" stroke="#e879f9" strokeWidth="2" />
          <circle cx="50" cy="58" r="4" fill="#7e22ce" stroke="#ffffff" strokeWidth="1" />
          <circle cx="50" cy="58" r="1.8" fill="#ffffff" />
        </svg>
      ),
    },
    {
      name: 'Lunarmon',
      title: 'Celestial Eclipse Guardian',
      cost: 450,
      role: 'Lunar / Eclipse Guardian',
      lore: 'Sovereign guardian of night skies. Lunarmon channels lunar energy into crescent moon beams (800px range) and calls down vertical Moonbeams onto foes to restore energy. During a Lunar Eclipse, Lunarmon bombards all enemies within 1200px and takes flight to fire a controllable giant radial beam!',
      signatureSkill: 'Moonbeam Strike (800px Range • Mini Stun • Energy Gain)',
      ultimateSkill: 'Lunar Eclipse (1200px Moonbeam Bombardment + 3s Controllable Radial Giant Beam)',
      color: 'indigo',
      tagColor: 'bg-indigo-950 text-indigo-300 border-indigo-700 font-mono',
      attackType: 'Crescent Moon Energy Beam (800px Range)',
      hp: saveData.dracos['Lunarmon']?.hp || 20,
      atk: saveData.dracos['Lunarmon']?.attack || 9,
      def: saveData.dracos['Lunarmon']?.defense || 3,
      spd: saveData.dracos['Lunarmon']?.speed || 7.5,
      jump: 11,
      svg: (
        <svg width="70" height="70" viewBox="0 0 100 100" className="animate-float-slow">
          <ellipse cx="50" cy="85" rx="26" ry="6" fill="rgba(0,0,0,0.3)" />
          <path d="M 50 12 A 22 22 0 1 1 50 56 A 15 15 0 1 0 50 12 Z" fill="#c7d2fe" stroke="#93c5fd" strokeWidth="1.5" opacity="0.9" />
          <circle cx="28" cy="22" r="1.5" fill="#ffffff" />
          <circle cx="72" cy="22" r="1.5" fill="#ffffff" />
          <path d="M 28 42 Q -2 10 26 24 Q 14 44 32 58 Z" fill="#1e3a8a" stroke="#e0f2fe" strokeWidth="1.8" />
          <path d="M 72 42 Q 102 10 74 24 Q 86 44 68 58 Z" fill="#1e3a8a" stroke="#e0f2fe" strokeWidth="1.8" />
          <path d="M 36 32 L 26 12 L 40 22 Z" fill="#4f46e5" stroke="#e0e7ff" strokeWidth="1.5" />
          <path d="M 64 32 L 74 12 L 60 22 Z" fill="#4f46e5" stroke="#e0e7ff" strokeWidth="1.5" />
          <rect x="34" y="30" width="32" height="46" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.5" />
          <circle cx="44" cy="42" r="3.5" fill="#e0e7ff" />
          <circle cx="56" cy="42" r="3.5" fill="#e0e7ff" />
          <circle cx="44" cy="42" r="1.5" fill="#6366f1" />
          <circle cx="56" cy="42" r="1.5" fill="#6366f1" />
          <circle cx="50" cy="58" r="10" fill="#312e81" stroke="#818cf8" strokeWidth="1.8" />
          <path d="M 50 51 A 7 7 0 1 1 50 65 A 4.5 4.5 0 1 0 50 51 Z" fill="#c7d2fe" />
        </svg>
      ),
    },
    {
      name: 'Pixelmon',
      title: '8-Bit Retro Digital Guardian',
      cost: 500,
      role: '8-Bit Retro / Tetris & Pacman',
      lore: 'Born from the digital core of the Pixel Kingdom. Pixelmon throws random Tetris blocks and commands a Pacman that charges 800px forward. Channeling 120 Energy transforms it into Mega Pixelmon (300% size boost) for 8 seconds, spamming Tetris barrages and slashing an 800px giant pixelated sword!',
      signatureSkill: 'Pacman Charge Strike (800px Range • Terrain Collision Stop)',
      ultimateSkill: 'Mega Pixelmon (120 Energy • 300% Size Boost • 8s Multidirectional Tetris & 800px Pixel Sword • End Blast)',
      color: 'fuchsia',
      tagColor: 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-700 font-mono',
      attackType: 'Random 8-Bit Tetris Block Shot',
      hp: saveData.dracos['Pixelmon']?.hp || 20,
      atk: saveData.dracos['Pixelmon']?.attack || 8,
      def: saveData.dracos['Pixelmon']?.defense || 3,
      spd: saveData.dracos['Pixelmon']?.speed || 7,
      jump: 11,
      svg: (
        <svg width="70" height="70" viewBox="0 0 100 100" className="animate-float-slow">
          <ellipse cx="50" cy="85" rx="30" ry="6" fill="rgba(0,0,0,0.2)" />
          <rect x="30" y="30" width="40" height="44" fill="#a855f7" stroke="#3b0764" strokeWidth="3" />
          <rect x="34" y="34" width="32" height="36" fill="#c084fc" />
          <rect x="38" y="42" width="6" height="6" fill="#000000" />
          <rect x="56" y="42" width="6" height="6" fill="#000000" />
          <rect x="40" y="44" width="2" height="2" fill="#ffffff" />
          <rect x="58" y="44" width="2" height="2" fill="#ffffff" />
          <rect x="30" y="22" width="6" height="8" fill="#f43f5e" />
          <rect x="64" y="22" width="6" height="8" fill="#f43f5e" />
          <rect x="44" y="54" width="12" height="4" fill="#c084fc" />
          <rect x="48" y="58" width="4" height="8" fill="#c084fc" />
        </svg>
      ),
    },
    {
      name: 'Krakenmon',
      title: 'Abyssal Ocean Leviathan',
      cost: 500,
      role: 'Ocean Abyssal / Leviathan',
      lore: 'Forged in the darkest abyssal depths of the oceanic trench. Krakenmon wields a heavy anchor for devastating melee smashes, summons an 800px Tidal Wave that slows enemies by 50%, and chokes out a Ghost Pirate Boat that splits into 30 shrapnel pieces while granting 6s 50% Damage Reduction.',
      signatureSkill: 'Tidal Wave (800px Range • 2s 50% Slow Effect)',
      ultimateSkill: 'Collision Course (100 Energy • Ghost Pirate Boat • 30 Shrapnel Split in 400px Radius • 50px AOE Radius • 6s 50% Damage Reduction Buff)',
      color: 'teal',
      tagColor: 'bg-teal-950 text-teal-300 border-teal-700 font-mono',
      attackType: 'Heavy Anchor Melee Smash (140px Arc)',
      hp: saveData.dracos['Krakenmon']?.hp || 24,
      atk: saveData.dracos['Krakenmon']?.attack || 8,
      def: saveData.dracos['Krakenmon']?.defense || 4,
      spd: saveData.dracos['Krakenmon']?.speed || 7.0,
      jump: 11,
      svg: (
        <svg width="70" height="70" viewBox="0 0 100 100" className="animate-float-slow">
          <ellipse cx="50" cy="85" rx="30" ry="6" fill="rgba(0,0,0,0.2)" />
          <path d="M 30 65 Q 15 80 25 90 Q 32 85 36 72 Z" fill="#0d9488" stroke="#115e59" strokeWidth="1.5" />
          <path d="M 70 65 Q 85 80 75 90 Q 68 85 64 72 Z" fill="#0d9488" stroke="#115e59" strokeWidth="1.5" />
          <circle cx="50" cy="48" r="24" fill="#14b8a6" stroke="#0f766e" strokeWidth="2.5" />
          <rect x="40" y="44" width="6" height="7" rx="2" fill="#fff" />
          <rect x="54" y="44" width="6" height="7" rx="2" fill="#fff" />
          <circle cx="43" cy="47.5" r="2" fill="#0284c7" />
          <circle cx="57" cy="47.5" r="2" fill="#0284c7" />
          <path d="M 50 56 L 50 68 M 44 64 Q 50 72 56 64" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ];



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

  // Derive stage cards from LevelManager — single source of truth
  const getDisplayName = (fullName: string) => {
    const match = fullName.match(/^Stage \d+:\s*(.+)$/);
    return match ? match[1] : fullName;
  };

  const STAGE_CARDS = STAGES.map((stg, index) => ({
    num: index + 1,
    name: getDisplayName(stg.name),
    difficulty: stg.difficulty,
    diffClass: stg.diffClass,
    borderHover: stg.borderHover,
    desc: stg.description,
    boss: stg.boss,
    color: stg.color,
  }));

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
    <div className={`min-h-screen ${isPlaying ? 'bg-stone-950 overflow-hidden' : 'bg-stone-950'} text-stone-100 flex flex-col justify-between font-display relative overflow-hidden scroll-smooth`}>

      {!isPlaying && (
        <>
          <div className="absolute top-0 right-0 w-[55rem] h-[55rem] bg-amber-200/25 rounded-full blur-3xl -z-10 animate-blob-drift-1" />
          <div className="absolute top-[35rem] left-0 w-[45rem] h-[45rem] bg-indigo-200/25 rounded-full blur-3xl -z-10 animate-blob-drift-2" />
          <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-emerald-200/20 rounded-full blur-3xl -z-10 animate-blob-drift-3" />
          <div className="absolute top-[80rem] right-12 w-[35rem] h-[35rem] bg-rose-200/20 rounded-full blur-3xl -z-10 animate-blob-drift-1" />
        </>
      )}

      

      <main className="flex-1 w-full z-30">
        <div className="w-full">
              <section id="hero" className="relative w-full min-h-screen md:h-screen flex items-center justify-center overflow-hidden py-12 md:py-0 bg-stone-950">
                {/* FULL SCREEN BACKGROUND SHOWCASE OF ALL DRACOS */}
                <FullScreenShowcaseCanvas />

                {/* HERO CONTENT OVERLAY */}
                <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-12 pt-28 pb-16 text-center">
                  <div className="space-y-10">
                    <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white leading-tight font-display drop-shadow-md">
                      Evolve Your Guardian. <br />
                      <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent font-extrabold">
                        Conquer the Sky Realms
                      </span>
                    </h1>

                    <p className="text-stone-200 text-base md:text-lg leading-relaxed max-w-2xl mx-auto drop-shadow-sm font-medium">
                      Leap across floating sky islands, master the physics of real-time blade combat, and collect sacred upgrade stones to forge the ultimate dragon companion.
                    </p>

                    {/* CALL TO ACTIONS */}
                    <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
                      <Link
                        href="/maps"
                        onClick={() => soundService.playClick()}
                        className="px-7 py-4 min-w-[200px] justify-center bg-amber-500 text-stone-950 hover:bg-amber-400 rounded-2xl font-extrabold text-sm shadow-xl shadow-amber-500/10 hover:shadow-amber-500/25 transition-all active:scale-95 flex items-center gap-2.5"
                      >
                        <Play className="w-5 h-5 text-stone-950 fill-stone-950" />
                        Play Campaign Stage
                      </Link>

                      <button
                        onClick={() => scrollToSection('characters')}
                        className="px-7 py-4 min-w-[200px] justify-center bg-white/10 border border-white/10 text-white rounded-2xl font-bold text-sm shadow-sm hover:bg-white/20 hover:border-white/20 transition-all active:scale-95 flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        Character Story
                      </button>

                      <button
                        onClick={() => { soundService.playClick(); setShowControlsModal(true); }}
                        className="px-7 py-4 min-w-[200px] justify-center bg-stone-900/60 hover:bg-stone-800/60 text-stone-200 rounded-2xl font-semibold text-sm border border-stone-800 transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <HelpCircle className="w-4 h-4" />
                        Controls
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section id="about" className="w-full max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-24 border-t border-stone-800/80">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center max-w-3xl mx-auto space-y-3"
                >
                  <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider font-display">About The Dracony Realm</h2>
                  <p className="text-stone-400 text-sm leading-relaxed font-mono">
                    Explore an ancient sky continent divided into distinct platforming realms. Defend the realm from patrolling slimes, archers, and lava golems.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-4 gap-6 my-16">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="p-6 bg-stone-900/80 border border-stone-800 rounded-3xl shadow-xl space-y-3 hover:border-amber-500/50 hover:shadow-2xl transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Sword className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-base text-white font-display">Swinging Attack Physics</h3>
                    <p className="text-xs text-stone-400 leading-relaxed font-mono">
                      Weapon blades sweep in dynamic 160-degree rotational arcs with trailing slash trails and spark collision effects.
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="p-6 bg-stone-900/80 border border-stone-800 rounded-3xl shadow-xl space-y-3 hover:border-emerald-500/50 hover:shadow-2xl transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Compass className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-base text-white font-display">Platform & Drop Down</h3>
                    <p className="text-xs text-stone-400 leading-relaxed font-mono">
                      One-way wooden platform landing ensures secure footing. Press <code className="bg-stone-800 text-amber-300 px-1 font-mono rounded">S</code> or <code className="bg-stone-800 text-amber-300 px-1 font-mono rounded">Down</code> to drop through intentionally.
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="p-6 bg-stone-900/80 border border-stone-800 rounded-3xl shadow-xl space-y-3 hover:border-purple-500/50 hover:shadow-2xl transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-base text-white font-display">Stat Synthesis & Evolution</h3>
                    <p className="text-xs text-stone-400 leading-relaxed font-mono">
                      Collect sacred Upgrade Stones during stages to permanently synthesize HP, Attack, Defense, and Speed attributes.
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="p-6 bg-stone-900/80 border border-stone-800 rounded-3xl shadow-xl space-y-3 hover:border-blue-500/50 hover:shadow-2xl transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-base text-white font-display">100% Offline Persistence</h3>
                    <p className="text-xs text-stone-400 leading-relaxed font-mono">
                      Your save data is saved locally in browser storage. Export or import save JSON strings anytime to back up progress.
                    </p>
                  </motion.div>
                </div>
              </section>

              <section id="membership" className="w-full max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-24 border-t border-stone-800/80">
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider font-display">Choose Your Membership Tier</h2>
                  <p className="text-stone-400 text-sm leading-relaxed font-mono">
                    Unlock instant access to all dragon companions, boosted starting attributes, and exclusive summoner perks.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  {(() => {
                    const TIER_RANKS: Record<string, number> = { Free: 0, Basic: 1, Premium: 2 };
                    const curTier = saveData.tier || 'Free';
                    const curRank = TIER_RANKS[curTier] ?? 0;

                    const isFreeActive = curTier === 'Free';
                    const isFreeLower = curRank > 0;

                    const isBasicActive = curTier === 'Basic';
                    const isBasicLower = curRank > 1;

                    const isPremiumActive = curTier === 'Premium';

                    return (
                      <>
                        <div className={`p-8 rounded-3xl border transition-all flex flex-col justify-between backdrop-blur-md ${
                          isFreeActive
                            ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-500/30 shadow-2xl'
                            : isFreeLower
                            ? 'bg-stone-900/40 border-stone-800 opacity-60 shadow-none'
                            : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 shadow-xl'
                        }`}>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-stone-400 uppercase">Standard Tier</span>
                              {isFreeActive ? (
                                <span className="text-[10px] font-mono font-black bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full">ACTIVE</span>
                              ) : isFreeLower ? (
                                <span className="text-[10px] font-mono font-bold bg-stone-800 text-stone-400 px-2.5 py-0.5 rounded-full">INCLUDED</span>
                              ) : null}
                            </div>
                            <h3 className="text-2xl font-black text-white font-display">Free Tier</h3>
                            <div className="text-3xl font-black text-stone-100 font-mono">0 <span className="text-sm text-stone-400 font-sans">Coins</span></div>
                            <ul className="space-y-2.5 text-xs text-stone-300 font-mono pt-4 border-t border-stone-800">
                              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Start with Jumpmon, Archermon &amp; Shieldmon</li>
                              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlock remaining roster via campaign coins</li>
                              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Standard Level 1 starting stats</li>
                              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Full offline local save persistence</li>
                            </ul>
                          </div>
                          <button
                            disabled={isFreeActive || isFreeLower}
                            onClick={() => switchTier('Free')}
                            className={`w-full py-3 mt-8 rounded-2xl font-extrabold text-xs uppercase tracking-wider font-mono transition-all ${
                              isFreeActive
                                ? 'bg-stone-800 text-stone-400 cursor-default'
                                : isFreeLower
                                ? 'bg-stone-900 text-stone-500 border border-stone-800 cursor-not-allowed opacity-75'
                                : 'bg-stone-100 text-stone-950 hover:bg-white shadow-md active:scale-95'
                            }`}
                          >
                            {isFreeActive
                              ? 'Current Active Tier'
                              : isFreeLower
                              ? `Included in ${curTier} Tier`
                              : 'Switch to Free Tier'}
                          </button>
                        </div>

                        <div className={`p-8 rounded-3xl border transition-all flex flex-col justify-between backdrop-blur-md ${
                          isBasicActive
                            ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-500/30 shadow-2xl'
                            : isBasicLower
                            ? 'bg-stone-900/40 border-stone-800 opacity-60 shadow-none'
                            : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 shadow-xl'
                        }`}>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Recommended Tier</span>
                              {isBasicActive ? (
                                <span className="text-[10px] font-mono font-black bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full">ACTIVE</span>
                              ) : isBasicLower ? (
                                <span className="text-[10px] font-mono font-bold bg-stone-800 text-stone-400 px-2.5 py-0.5 rounded-full">INCLUDED</span>
                              ) : null}
                            </div>
                            <h3 className="text-2xl font-black text-white font-display">Basic Tier</h3>
                            <div className="text-3xl font-black text-emerald-400 font-mono">Level 5 <span className="text-sm text-stone-400 font-sans">All Unlocked</span></div>
                            <ul className="space-y-2.5 text-xs text-stone-300 font-mono pt-4 border-t border-stone-800">
                              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Every Character Unlocked Immediately!</li>
                              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Instant Level 5 starting level</li>
                              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> +1 Bonus splitted to ALL attributes per level up</li>
                              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Instant Whitemon &amp; Bird Familiar access</li>
                            </ul>
                          </div>
                          <button
                            disabled={isBasicActive || isBasicLower}
                            onClick={() => switchTier('Basic')}
                            className={`w-full py-3 mt-8 rounded-2xl font-extrabold text-xs uppercase tracking-wider font-mono transition-all ${
                              isBasicActive
                                ? 'bg-stone-800 text-stone-400 cursor-default'
                                : isBasicLower
                                ? 'bg-stone-900 text-stone-500 border border-stone-800 cursor-not-allowed opacity-75'
                                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-950/50 active:scale-95'
                            }`}
                          >
                            {isBasicActive
                              ? 'Current Active Tier'
                              : isBasicLower
                              ? `Included in ${curTier} Tier`
                              : 'Activate Basic Tier'}
                          </button>
                        </div>

                        <div className={`p-8 rounded-3xl border transition-all flex flex-col justify-between backdrop-blur-md ${
                          isPremiumActive
                            ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-500/30 shadow-2xl'
                            : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 shadow-xl'
                        }`}>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-purple-400 uppercase">God Tier</span>
                              {isPremiumActive && (
                                <span className="text-[10px] font-mono font-black bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full">ACTIVE</span>
                              )}
                            </div>
                            <h3 className="text-2xl font-black text-white font-display">Premium Tier</h3>
                            <div className="text-3xl font-black text-purple-400 font-mono">Max Boost <span className="text-sm text-stone-400 font-sans">Full Roster</span></div>
                            <ul className="space-y-2.5 text-xs text-stone-300 font-mono pt-4 border-t border-stone-800">
                              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Every Character Unlocked immediately</li>
                              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> High starting level (Level 10)</li>
                              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Maximized +1 bonus to ALL stats per level</li>
                              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Full energy regeneration perks</li>
                            </ul>
                          </div>
                          <button
                            disabled={isPremiumActive}
                            onClick={() => switchTier('Premium')}
                            className={`w-full py-3 mt-8 rounded-2xl font-extrabold text-xs uppercase tracking-wider font-mono transition-all ${
                              isPremiumActive
                                ? 'bg-stone-800 text-stone-400 cursor-default'
                                : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-950/50 active:scale-95'
                            }`}
                          >
                            {isPremiumActive ? 'Current Active Tier' : 'Activate Premium Tier'}
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </section>

              <section id="characters" className="w-full max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-24 border-t border-stone-800/80">
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider font-display">Meet The Dragon Guardians</h2>
                  <p className="text-xs md:text-sm text-stone-400 max-w-xl mx-auto font-mono">
                    Each dragon companion possesses deep lore, distinct weapon swing styles, and active battle abilities.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-10">
                  {companionShowcase.slice(0, 3).map((item) => {
                    const isUnlocked = saveData.dracos[item.name]?.unlocked ?? (item.name === 'Jumpmon');
                    const isSelected = activeDracoName === item.name;
                    const canAfford = coins >= item.cost;

                    return (
                      <motion.div
                        key={item.name}
                        whileHover={{ y: -6 }}
                        className={`p-7 rounded-3xl border backdrop-blur-md ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-500/30 bg-stone-900/90 shadow-2xl'
                            : isUnlocked
                            ? 'border-stone-800 bg-stone-900/80 hover:border-stone-700 shadow-xl'
                            : 'border-stone-900 bg-stone-950/80 opacity-75'
                        } transition-all flex flex-col justify-between relative overflow-hidden`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className={`inline-block px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md border ${item.tagColor}`}>
                              {item.title}
                            </span>

                            <div className="shrink-0">
                              {isSelected ? (
                                <span className="px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-wider bg-amber-400 text-stone-950 rounded-md shadow-sm flex items-center gap-1 border border-amber-300">
                                  <Sparkles className="w-3 h-3 text-stone-950 fill-stone-950" /> EQUIPPED
                                </span>
                              ) : isUnlocked ? (
                                <span className="px-2.5 py-1 text-[10px] font-mono font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-md flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-400" /> UNLOCKED
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 text-[10px] font-mono font-extrabold uppercase tracking-wider bg-stone-950 text-stone-400 border border-stone-800 rounded-md flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-stone-500" /> LOCKED
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3.5">
                            <div className={`w-16 h-16 shrink-0 rounded-2xl ${isUnlocked ? 'bg-stone-950 border-stone-800' : 'bg-stone-950/80 border-stone-900'} border flex items-center justify-center p-2 shadow-inner relative`}>
                              {item.svg}
                              {!isUnlocked && (
                                <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                                  <Lock className="w-5 h-5 text-stone-500" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="text-2xl font-black text-white font-display leading-tight">{item.name}</h3>
                              <span className="text-xs font-mono text-amber-400 block mt-0.5">{item.role}</span>
                            </div>
                          </div>

                          <div className="mt-4 p-3.5 bg-stone-950 border border-stone-800/80 rounded-2xl text-xs leading-relaxed text-stone-300 font-mono">
                            <p>{item.lore}</p>
                          </div>

                          <div className="mt-3 space-y-1.5 text-xs font-mono">
                            <div className="flex justify-between text-stone-400">
                              <span>Attack Style:</span>
                              <span className="font-bold text-stone-200">{item.attackType}</span>
                            </div>
                            <div className="flex justify-between text-stone-400">
                              <span>Special Skill:</span>
                              <span className="font-bold text-amber-400">{item.signatureSkill}</span>
                            </div>
                            <div className="flex justify-between text-stone-400">
                              <span className="flex items-center gap-1">
                                <Zap className="w-3 h-3 text-purple-400 fill-purple-400" />
                                Ultimate Skill:
                              </span>
                              <span className="font-bold text-purple-400">{item.ultimateSkill}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-5 gap-1.5 mt-4 pt-3 border-t border-stone-800 text-center font-mono">
                            <div className="p-1.5 bg-stone-950 rounded-xl border border-stone-800/80">
                              <span className="text-[8px] text-stone-500 block font-sans">HP</span>
                              <span className="text-xs font-bold text-stone-200">{item.hp}</span>
                            </div>
                            <div className="p-1.5 bg-stone-950 rounded-xl border border-stone-800/80">
                              <span className="text-[8px] text-stone-500 block font-sans">ATK</span>
                              <span className="text-xs font-bold text-rose-400">{item.atk}</span>
                            </div>
                            <div className="p-1.5 bg-stone-950 rounded-xl border border-stone-800/80">
                              <span className="text-[8px] text-stone-500 block font-sans">DEF</span>
                              <span className="text-xs font-bold text-blue-400">{item.def}</span>
                            </div>
                            <div className="p-1.5 bg-stone-950 rounded-xl border border-stone-800/80">
                              <span className="text-[8px] text-stone-500 block font-sans">SPD</span>
                              <span className="text-xs font-bold text-emerald-400">{item.spd}</span>
                            </div>
                            <div className="p-1.5 bg-stone-950 rounded-xl border border-stone-800/80">
                              <span className="text-[8px] text-stone-500 block font-sans">JUMP</span>
                              <span className="text-xs font-bold text-amber-400">{item.jump}</span>
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="space-y-2 mt-5">
                            <button
                              disabled
                              className="w-full py-3 rounded-xl text-xs font-mono font-black bg-amber-400 text-stone-950 border border-amber-300 shadow-md cursor-default flex items-center justify-center gap-1.5"
                            >
                              <Sparkles className="w-4 h-4 text-stone-950 fill-stone-950" />
                              <span>EQUIPPED</span>
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
                                  ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-md active:scale-95'
                                  : 'bg-stone-950 text-stone-500 border border-stone-800 cursor-not-allowed'
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
                              className="w-full py-3 rounded-xl text-xs font-mono font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                            >
                              <Check className="w-4 h-4" />
                              <span>EQUIP COMPANION</span>
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
                                  ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-md active:scale-95'
                                  : 'bg-stone-950 text-stone-500 border border-stone-800 cursor-not-allowed'
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
                            className={`w-full mt-5 py-3 rounded-xl text-xs font-mono font-black transition-all flex items-center justify-center gap-1.5 ${
                              canAfford
                                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md active:scale-95'
                                : 'bg-stone-950 text-stone-500 cursor-not-allowed border border-stone-800'
                            }`}
                          >
                            {canAfford ? (
                              <>
                                <Coins className="w-4 h-4 text-stone-950 fill-stone-950" />
                                <span>UNLOCK ({item.cost} COINS)</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4" />
                                <span>NEED {item.cost} COINS</span>
                              </>
                            )}
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-8 text-center">
                  <Link
                    href="/heroes"
                    onClick={() => soundService.playClick()}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-mono font-black shadow-xl transition-all active:scale-95 border border-stone-800"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>EXPLORE →</span>
                  </Link>
                </div>
              </section>

              <section id="realms" className="w-full max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-24 border-t border-stone-800/80">
                <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
                  <h2 className="text-3xl md:text-5xl font-black text-white font-display uppercase tracking-wider">Explore Platform Realms</h2>
                  <p className="text-stone-400 text-xs md:text-sm leading-relaxed max-w-xl mx-auto font-mono">
                    Conquer custom hand-crafted platform stages. Basic &amp; Premium members get all maps unlocked instantly!
                  </p>
                </div>

                <div className="relative group/carousel my-8">
                  {/* Left caret button */}
                  <button
                    onClick={() => {
                      soundService.playClick();
                      setRealmPage(p => Math.max(0, p - 1));
                    }}
                    disabled={realmPage === 0}
                    className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-200 disabled:opacity-0 disabled:pointer-events-none transition-all flex items-center justify-center shadow-xl hover:scale-105 active:scale-95"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-stone-200" />
                  </button>

                  <div className="grid md:grid-cols-3 gap-6">
                  {STAGE_CARDS.slice(realmPage * 3, (realmPage + 1) * 3).map((stage) => {
                    const unlocked = isStageUnlocked(stage.num);

                    return (
                      <div
                        key={stage.num}
                        className={`relative p-7 border rounded-3xl transition-all flex flex-col justify-between space-y-4 overflow-hidden backdrop-blur-md ${
                          stage.num === 9
                            ? 'bg-gradient-to-b from-cyan-950/40 via-sky-950/20 to-cyan-950/50 border-cyan-500/40 ring-2 ring-cyan-400/30 shadow-2xl'
                            : stage.num === 8
                            ? 'bg-gradient-to-b from-amber-950/40 to-amber-950/20 border-amber-500/40 ring-2 ring-amber-400/30 shadow-2xl'
                            : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 shadow-xl'
                        } ${!unlocked ? 'opacity-80' : ''}`}
                      >
                        {!unlocked && (
                          <div className="absolute inset-0 z-20 bg-stone-950/80 backdrop-blur-[2px] p-6 flex flex-col items-center justify-center text-center text-white space-y-2 rounded-3xl">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 text-lg shadow-inner">
                              <Lock className="w-5 h-5" />
                            </div>
                            <h4 className="font-extrabold text-sm text-stone-100 font-display">Stage {stage.num} Locked</h4>
                            <p className="text-[10px] text-stone-400 max-w-[200px] leading-tight font-mono">
                              Complete Stage {stage.num - 1} or activate <span className="text-amber-400 font-bold">Basic Membership</span> to unlock!
                            </p>
                            <button
                              onClick={() => scrollToSection('membership')}
                              className="mt-2 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md active:scale-95 font-mono"
                            >
                              Unlock with Membership
                            </button>
                          </div>
                        )}

                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Stage {stage.num}</span>
                            <span className={`px-2.5 py-0.5 text-[9px] font-mono rounded-md font-extrabold ${stage.diffClass}`}>
                              {stage.difficulty}
                            </span>
                          </div>
                          <h3 className="text-xl font-extrabold text-white mt-2 font-display flex items-center gap-2">
                            <span>{stage.name}</span>
                            {stage.num === 9 && <span className="text-xs text-cyan-400 font-mono">🌊 SUB-MAP</span>}
                          </h3>
                          <p className="text-xs text-stone-400 mt-2 leading-relaxed font-mono">
                            {stage.desc}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-800 flex flex-col gap-2">
                          <div className="flex justify-between text-[10px] font-bold text-stone-400 font-mono">
                            <span>Boss: {stage.boss}</span>
                            <span>{unlocked ? 'Unlocked' : 'Locked'}</span>
                          </div>
                          <button
                            onClick={() => handleStartStage(stage.num)}
                            disabled={!unlocked}
                            className={`w-full py-3 rounded-2xl text-xs font-black font-mono transition-all flex items-center justify-center gap-2 ${
                              !unlocked
                                ? 'bg-stone-950 text-stone-600 border border-stone-800 cursor-not-allowed'
                                : stage.num === 9
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg active:scale-95'
                                : stage.num === 8
                                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg active:scale-95'
                                : 'bg-stone-100 hover:bg-white text-stone-950 shadow-md active:scale-95'
                            }`}
                          >
                            <Play className="w-4 h-4 fill-current" />
                            <span>{unlocked ? `Play Stage ${stage.num}` : `Locked (Requires Stage ${stage.num - 1})`}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right caret button */}
                <button
                  onClick={() => {
                    soundService.playClick();
                    setRealmPage(p => Math.min(Math.ceil(STAGE_CARDS.length / 3) - 1, p + 1));
                  }}
                  disabled={realmPage >= Math.ceil(STAGE_CARDS.length / 3) - 1}
                  className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-200 disabled:opacity-0 disabled:pointer-events-none transition-all flex items-center justify-center shadow-xl hover:scale-105 active:scale-95"
                  title="Next Page"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-stone-200" />
                </button>
              </div>

                <div className="mt-10 flex flex-col items-center justify-center gap-8">
                  {/* Enhanced bullet points */}
                  <div className="flex items-center gap-2.5">
                    {Array.from({ length: Math.ceil(STAGE_CARDS.length / 3) }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          soundService.playClick();
                          setRealmPage(idx);
                        }}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          realmPage === idx
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500 ring-4 ring-amber-400/25 w-8'
                            : 'bg-stone-800 hover:bg-stone-700 hover:scale-110 w-2.5'
                        }`}
                        title={`Go to Page ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* View Maps button */}
                  <Link
                    href="/maps"
                    onClick={() => soundService.playClick()}
                    className="px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-mono font-black transition-all flex items-center gap-2 shadow-xl active:scale-95 border border-stone-800"
                  >
                    <span>View All Campaign Maps</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </Link>
                </div>
              </section>

              <section id="faq" className="w-full max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-24 border-t border-stone-800/80">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center space-y-2 mb-8">
                  <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider font-display">Frequently Asked Questions</h2>
                  <p className="text-xs text-stone-400 font-mono">Quick answers regarding game mechanics, controls, and save files.</p>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div
                        key={index}
                        className="bg-stone-900/90 border border-stone-800 rounded-2xl overflow-hidden shadow-xl transition-all"
                      >
                        <button
                          onClick={() => {
                            soundService.playClick();
                            setOpenFaq(isOpen ? null : index);
                          }}
                          className="w-full px-6 py-4 flex items-center justify-between text-left font-mono font-bold text-sm text-stone-200 hover:text-amber-400 transition-colors"
                        >
                          <span>{faq.q}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                              className="overflow-hidden border-t border-stone-800/80"
                            >
                              <div className="px-6 pb-5 pt-4 text-xs text-stone-300 leading-relaxed font-mono">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
                </div>
              </section>

              <section id="support" className="w-full max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-24 border-t border-stone-800/80 select-none">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-stone-900 border border-stone-800 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-3 text-left md:max-w-md">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full border border-purple-500/30 animate-pulse">
                      💖 Support Guild
                    </div>
                    <h3 className="text-2xl font-black text-white font-display">Support the Developer</h3>
                    <p className="text-xs text-stone-400 leading-relaxed font-mono">
                      If you enjoyed playing Dracoman, consider supporting the developers! Your donations help us add new characters, mechanics, and stages to the realm.
                    </p>
                  </div>
                </div>
              </section>

              <section id="contact" className="w-full max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-24 border-t border-stone-800/80">
                <div className="max-w-4xl mx-auto grid md:grid-cols-12 gap-8 items-center bg-stone-900/90 border border-stone-800 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl">
                  <div className="md:col-span-5 space-y-4 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-white font-display">Dragon Keeper Guild</h3>
                    <p className="text-xs text-stone-400 leading-relaxed font-mono">
                      Have feedback, feature ideas, or bug reports? Contact our developer guild directly!
                    </p>
                    <div className="space-y-2 text-xs font-mono text-stone-300 pt-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-amber-400" />
                        <span>sevilenfilbert@gmail.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-400" />
                        <span>Offline Singleplayer RPG</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-7">
                    {contactSubmitted ? (
                      <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2">
                        <div className="w-10 h-10 bg-emerald-500 text-stone-950 rounded-full flex items-center justify-center mx-auto">
                          <Check className="w-6 h-6" />
                        </div>
                        <h4 className="font-mono font-black text-emerald-300 text-sm">Message Dispatched!</h4>
                        <p className="text-xs text-emerald-400 font-mono">Thank you Dragon Keeper! Your note has been received.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-3 font-mono">
                        <div>
                          <label className="text-[11px] font-bold text-stone-400 block mb-1 uppercase">Your Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Dragon Keeper Name"
                            value={contactName}
                            onChange={e => setContactName(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-stone-400 block mb-1 uppercase">Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="keeper@Dracoman.dev"
                            value={contactEmail}
                            onChange={e => setContactEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-stone-400 block mb-1 uppercase">Message / Feedback</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Share your thoughts on game balance, platform physics, or character skills..."
                            value={contactMessage}
                            onChange={e => setContactMessage(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-mono font-black shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider"
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
      </main>

      <AnimatePresence>
        {showStageSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-3xl overflow-hidden border bg-stone-900/95 border-stone-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-stone-100"
            >
              <h2 className="text-2xl font-black uppercase tracking-wider text-white font-display">Select Campaign Map</h2>
              <p className="text-xs text-stone-400 font-mono mt-1">Deploy your companion into custom platform realms.</p>
              <div className="grid md:grid-cols-2 gap-4 mt-6 min-h-[310px] p-1">
                {currentStages.map((stage) => {
                  const unlocked = isStageUnlocked(stage.num);
                  return (
                    <div
                      key={stage.num}
                      onClick={() => handleStartStage(stage.num)}
                      className={`relative p-5 border rounded-2xl transition-all flex flex-col justify-between group overflow-hidden ${
                        unlocked
                          ? 'cursor-pointer hover:shadow-xl bg-stone-950 border-stone-800 hover:border-amber-400'
                          : 'cursor-not-allowed bg-stone-950/60 border-stone-900 opacity-75'
                      }`}
                    >
                      {!unlocked && (
                        <div className="absolute inset-0 z-20 bg-stone-950/80 backdrop-blur-[2px] p-4 flex flex-col items-center justify-center text-center text-white space-y-1 font-mono">
                          <Lock className="w-5 h-5 text-amber-400" />
                          <span className="text-xs font-black">Stage {stage.num} Locked</span>
                          <span className="text-[10px] text-stone-400">Complete Stage {stage.num - 1} or Activate Basic Membership</span>
                        </div>
                      )}
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono font-bold text-amber-400 tracking-wider uppercase">Stage {stage.num}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-mono rounded font-bold ${stage.diffClass}`}>
                            {stage.difficulty}
                          </span>
                        </div>
                        <h3 className="font-black text-white text-lg mt-2 font-display">{stage.name}</h3>
                        <p className="text-xs text-stone-400 mt-2 leading-relaxed font-mono">
                          {stage.desc}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center justify-between text-xs font-mono font-bold text-stone-400 group-hover:text-stone-200">
                        <span>Boss: {stage.boss}</span>
                        <span className="group-hover:translate-x-1 transition-transform text-amber-400">{unlocked ? 'Deploy ➔' : 'Locked 🔒'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-stone-800 pt-5">
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
                          ? 'bg-amber-500 border-amber-400 text-stone-950 shadow-md'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-900'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <button
                    onClick={() => { soundService.playClick(); setShowStageSelector(false); }}
                    className="px-6 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold transition-all border border-stone-700"
                  >
                    Back
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showControlsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-xl border bg-stone-900/95 border-stone-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-stone-100"
            >
              <h2 className="text-2xl font-black text-white font-display uppercase tracking-wider">Game Controls Guide</h2>
              <p className="text-xs text-stone-400 font-mono mt-1">Master movement, platform landing, and weapon swinging.</p>

              <div className="space-y-3 mt-6 text-xs font-mono">
                <div className="flex items-center justify-between p-3 bg-stone-950 rounded-2xl border border-stone-800">
                  <span className="font-bold text-stone-300">Move Left / Right</span>
                  <div className="flex gap-1.5 text-xs">
                    <span className="px-2 py-1 bg-stone-900 border border-stone-800 text-amber-400 rounded font-bold">A</span>
                    <span className="px-2 py-1 bg-stone-900 border border-stone-800 text-amber-400 rounded font-bold">D</span>
                    <span className="text-stone-500">or</span>
                    <span className="px-2 py-1 bg-stone-900 border border-stone-800 text-amber-400 rounded font-bold">←</span>
                    <span className="px-2 py-1 bg-stone-900 border border-stone-800 text-amber-400 rounded font-bold">→</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-stone-950 rounded-2xl border border-stone-800">
                  <span className="font-bold text-stone-300">Jump / Double Jump</span>
                  <div className="flex gap-1.5 text-xs">
                    <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-amber-400 rounded font-bold">W</span>
                    <span className="text-stone-500">or</span>
                    <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-amber-400 rounded font-bold">↑</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="font-bold text-amber-300">Companion Ultimate Skill</span>
                    <span className="text-[10px] text-amber-400/80">Requires charged energy (Meteor, Shower, Avatar, Knives, Laser)</span>
                  </div>
                  <div className="flex gap-1.5 text-xs">
                    <span className="px-3 py-1 bg-amber-500 text-stone-950 rounded font-black">SPACE</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="font-bold text-amber-300">Drop Down Platform</span>
                    <span className="text-[10px] text-amber-400/80">Drop down through wooden floating platforms</span>
                  </div>
                  <div className="flex gap-1.5 text-xs">
                    <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-amber-400 rounded font-bold">S</span>
                    <span className="text-amber-500">or</span>
                    <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-amber-400 rounded font-bold">↓</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-stone-950 rounded-2xl border border-stone-800">
                  <div className="flex flex-col">
                    <span className="font-bold text-stone-300">Swinging Attack</span>
                    <span className="text-[10px] text-stone-500">Slash blade arc &amp; spark particles</span>
                  </div>
                  <div className="flex gap-1.5 text-xs">
                    <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-amber-400 rounded font-bold">J</span>
                    <span className="text-stone-500">or</span>
                    <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-amber-400 rounded font-bold">Z</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-stone-950 rounded-2xl border border-stone-800">
                  <span className="font-bold text-stone-300">Companion Special Skill</span>
                  <div className="flex gap-1.5 text-xs">
                    <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-amber-400 rounded font-bold">K</span>
                    <span className="text-stone-500">or</span>
                    <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-amber-400 rounded font-bold">X</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end font-mono">
                <button
                  onClick={() => { soundService.playClick(); setShowControlsModal(false); }}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-black uppercase transition-all shadow-md active:scale-95"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
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
            showLevelUp={showLevelUp}
            levelUpInfo={levelUpInfo}
            onApplyBonus={applyLevelUpBonus}
            pendingLevelUps={pendingLevelUps}
          />
        )}

        {showInventory && (
          <InventoryModal
            saveData={saveData}
            onUsePotion={usePotion}
            onUseUpgradeStone={useUpgradeStone}
            onBuyItem={buyItem}
            onClose={() => setShowInventory(false)}
          />
        )}

        {showLevelUp && levelUpInfo && (
          <LevelUpModal
            key={`${levelUpInfo.dracoName}-${levelUpInfo.oldLevel}-${levelUpInfo.newLevel}-${pendingLevelUps.length}`}
            dracoName={levelUpInfo.dracoName}
            oldLevel={levelUpInfo.oldLevel}
            newLevel={levelUpInfo.newLevel}
            baseIncrease={levelUpInfo.baseIncrease}
            bonusRoll={levelUpInfo.bonusRoll}
            onApplyBonus={applyLevelUpBonus}
            pendingCount={pendingLevelUps.length}
          />
        )}

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

      <ActivationModal
        activationTier={activationTier}
        activationCodeInput={activationCodeInput}
        activationError={activationError}
        onCodeChange={setActivationCodeInput}
        onVerify={handleVerifyCode}
        onClose={() => {
          setActivationTier(null);
          setActivationCodeInput('');
          setActivationError(false);
        }}
      />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
