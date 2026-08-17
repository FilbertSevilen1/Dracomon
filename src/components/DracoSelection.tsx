import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SaveData, TierType, PlayerStats } from '../types/game';
import { Shield, Zap, Lock, Sparkles, Coins, Award, X, Check, ArrowUpRight, Search, Trash2 } from 'lucide-react';
import { soundService } from '../services/sound';
import { HeroDemoCanvas } from './HeroDemoCanvas';
import { LevelUpModal } from './LevelUpModal';
import { InventoryModal } from './InventoryModal';
import { DracoArtwork } from './DracoArtwork';
import { useGameState } from '../hooks/useGameState';
import {
  getDracoEquipmentBonus,
  EQUIPMENT_REGISTRY,
  RARITY_CONFIG,
  SLOT_CONFIG,
  EquipmentRarity,
  EquipmentSlot,
  EQUIPMENT_SLOTS_ORDER,
  getSlotTypeByIndex,
  getSlotIndexByType,
  normalizeDracoEquipped
} from '../data/equipment';

interface DracoSelectionProps {
  saveData: SaveData;
  onSelect: (name: string) => void;
  onUnlock: (name: string, cost: number) => void;
  onLevelUpWithCoins: (name: string) => void;
  onClose?: () => void;
  onSwitchTier?: (tier: TierType) => void;
  isFullPage?: boolean;
  showLevelUp?: boolean;
  levelUpInfo?: {
    dracoName: string;
    oldLevel: number;
    newLevel: number;
    baseIncrease: Partial<PlayerStats>;
    bonusRoll: number;
  } | null;
  onApplyBonus?: (stat: keyof PlayerStats) => void;
  pendingLevelUps?: any[];
}

const DRACO_META: {
  [key: string]: {
    role: string;
    abilityName: string;
    abilityDesc: string;
    ultimateName: string;
    ultimateDesc: string;
    cost: number;
    colorClass: string;
    bgGradient: string;
  };
} = {
  Jumpmon: {
    role: 'Agile / Double Jump',
    abilityName: 'Double Leap & Spin Slash',
    abilityDesc: 'Executes double jump mid-air. Spin melee covers 360° area.',
    ultimateName: 'Earthshaker Slam',
    ultimateDesc: 'Slams down creating dual shockwaves dealing 30 damage.',
    cost: 0,
    colorClass: 'text-amber-600 border-amber-200 bg-amber-50',
    bgGradient: 'from-amber-400 to-orange-500',
  },
  Archermon: {
    role: 'Ranged / Arrow DPS',
    abilityName: 'Triple Arrow Volley',
    abilityDesc: 'Shoots rapid arrows. Special fires a 3-arrow spread volley.',
    ultimateName: 'Arrow Rain Barrage',
    ultimateDesc: 'Fires 12 piercing arrows that rain down across all screen foes.',
    cost: 100,
    colorClass: 'text-emerald-600 border-emerald-200 bg-emerald-50',
    bgGradient: 'from-emerald-400 to-teal-600',
  },
  Shieldmon: {
    role: 'Tank / Bulwark Trample',
    abilityName: 'Shield Trample Dash',
    abilityDesc: 'High-speed 600px dash that trample and knocks back all enemies caught in path.',
    ultimateName: 'Portal Rampage Charge',
    ultimateDesc: 'Raises shield forward and charges continuously to the nearest portal, launching all hit enemies skyward!',
    cost: 200,
    colorClass: 'text-blue-500 border-blue-500 bg-blue-950',
    bgGradient: 'from-blue-900 via-indigo-950 to-slate-900',
  },
  Assassinmon: {
    role: 'Stealth / Burst',
    abilityName: 'Shadow Katana Slash',
    abilityDesc: 'Slash using Katana. Special dashes invulnerably through foes with shadow trail.',
    ultimateName: 'Single Slash of Death',
    ultimateDesc: 'Teleports behind target with 10.0x attack explosion burst.',
    cost: 300,
    colorClass: 'text-purple-600 border-purple-200 bg-purple-50',
    bgGradient: 'from-purple-500 to-indigo-800',
  },
  Flymon: {
    role: 'Aerial / Flight',
    abilityName: 'Sonic Wind Slice',
    abilityDesc: 'Poison needles. Special launches sonic blades & extreme hover.',
    ultimateName: 'Tornado Tempest',
    ultimateDesc: 'Summons a giant tornado for 4s at the nearest enemy that sucks and lifts targets. Flymon gains homing basic attacks and double damage to lifted targets!',
    cost: 400,
    colorClass: 'text-rose-600 border-rose-200 bg-rose-50',
    bgGradient: 'from-rose-400 to-pink-600',
  },
  Whitemon: {
    role: 'Summoner / Beastmaster',
    abilityName: 'Bird Familiar Summon',
    abilityDesc: 'Spinning axes. Special summons uncontrollable seeking Bird Familiar.',
    ultimateName: 'Familiar Rampage',
    ultimateDesc: 'Stuns visible enemies for 3s & drives Bird Familiar to 3x speed.',
    cost: 500,
    colorClass: 'text-sky-600 border-sky-200 bg-sky-50',
    bgGradient: 'from-sky-400 to-indigo-600',
  },
  Magemon: {
    role: 'Mage / Spellcaster',
    abilityName: 'Invoked Spell Trio',
    abilityDesc: 'Casts Chaos Meteor, homing Sun Strike, or enemy-lifting Tornado.',
    ultimateName: 'Trio Orb Blast',
    ultimateDesc: 'Giant Cleave arc followed by Chaos Meteor, Sun Strike & Tornado!',
    cost: 250,
    colorClass: 'text-purple-600 border-purple-200 bg-purple-50',
    bgGradient: 'from-purple-600 via-indigo-600 to-cyan-500',
  },
  Shadowmon: {
    role: 'Ranged Dark / Soul Burst',
    abilityName: 'Dark Shadowraze Eruption',
    abilityDesc: 'Fires dark crimson energy bolts. Special erupts a vertical nether shadowraze pillar from the ground.',
    ultimateName: 'Soul Blast',
    ultimateDesc: '1.5s channel, 120 energy, dual screen-sweeping dark waves empowered up to 5x by Dark Soul Stacks.',
    cost: 450,
    colorClass: 'text-rose-600 border-rose-900 bg-rose-950',
    bgGradient: 'from-rose-900 via-stone-900 to-red-950',
  },
  Bombamon: {
    role: 'Explosive / Carpet Bomber',
    abilityName: 'Homing Bomb Rock',
    abilityDesc: 'Throws a rock homing in on enemies (within 1000px). Explodes on hit or ignites 3-block ground burn for 2s.',
    ultimateName: 'Carpet Bombing',
    ultimateDesc: 'Flies across screen 8 blocks high, breathing fire to burn platforms for 5s. Lit foes move faster, linger burn 2s outside, & explode on death!',
    cost: 350,
    colorClass: 'text-orange-600 border-orange-300 bg-orange-50',
    bgGradient: 'from-orange-500 via-red-600 to-amber-500',
  },
  Thundermon: {
    role: 'Thunder / Electrotackle',
    abilityName: 'Electrotackle',
    abilityDesc: 'Dash forward to unblocked enemy. Explodes electricity on hit & leaves 4s electric charged platform path (300px) that deals damage & 0.2s ministuns.',
    ultimateName: 'Raigeki',
    ultimateDesc: 'Strikes lightning on all enemies within 800px radius, stunning for 1.0s. Defeated targets disintegrate into bone piles! (200 Energy)',
    cost: 400,
    colorClass: 'text-yellow-600 border-yellow-300 bg-yellow-50',
    bgGradient: 'from-yellow-400 via-amber-500 to-cyan-500',
  },
  Enigmon: {
    role: 'Cosmic / Dark Matter Singularity',
    abilityName: 'Schwarzschild Pulse',
    abilityDesc: 'Creates a 300px radius pulse dealing base damage + 3% enemy max HP damage each second for 3 seconds (cooldown 5s).',
    ultimateName: 'Black Hole',
    ultimateDesc: 'Channeling spell (300 Energy). Creates a 50px radius black hole 400px in front, pulling enemies & platforms in 400px radius at 80px/s (destroying sucked platforms except exit portal floor). Enemies within 150px are stunned. Lasts 3s.',
    cost: 500,
    colorClass: 'text-purple-400 border-purple-800 bg-purple-950',
    bgGradient: 'from-purple-900 via-indigo-950 to-black',
  },
  Lunarmon: {
    role: 'Lunar / Eclipse Guardian',
    abilityName: 'Moonbeam Strike',
    abilityDesc: 'Calls a vertical moonbeam from above onto the nearest enemy within 800px, dealing damage, mini-stunning, and restoring energy.',
    ultimateName: 'Lunar Eclipse',
    ultimateDesc: 'Triggers a lunar eclipse cinematic — bombards all enemies in 1200px with moonbeams, then launches above to fire a giant rotating beam for 3s (A/D to aim). Deals 0.25× attack damage per tick.',
    cost: 450,
    colorClass: 'text-indigo-300 border-indigo-700 bg-indigo-950',
    bgGradient: 'from-indigo-900 via-blue-950 to-slate-900',
  },
  Azuremon: {
    role: 'Celestial Dragon / Singularity',
    abilityName: 'Azure Singularity Vortex',
    abilityDesc: 'Fires a celestial black hole vortex ball that continuously pulls nearby enemies inward and implodes on hit, siphoning HP on damage.',
    ultimateName: 'Burst Stream of Singularity',
    ultimateDesc: 'Channels 2s to form a black hole singularity, then unleashes a gravitational cataclysm beam for 4s (W/S to aim) that pulls enemies, destroys terrain, and disintegrates all foes!',
    cost: 500,
    colorClass: 'text-sky-300 border-sky-400 bg-sky-950',
    bgGradient: 'from-sky-500 via-cyan-400 to-slate-900',
  },
  Pixelmon: {
    role: '8-Bit Retro / Tetris & Pacman',
    abilityName: 'Pacman Charge Strike',
    abilityDesc: 'Throws random Tetris blocks. Skill summons Pacman that charges 800px forward damaging foes until hitting terrain.',
    ultimateName: 'Mega Pixelmon (120 Energy)',
    ultimateDesc: 'Grows 300% larger for 8s. Spams multidirectional Tetris blocks, slashes a 800px giant Pixelated Sword, and detonates in a massive pixel blast when ending!',
    cost: 500,
    colorClass: 'text-fuchsia-400 border-fuchsia-500 bg-fuchsia-950',
    bgGradient: 'from-fuchsia-600 via-purple-700 to-indigo-900',
  },
  Krakenmon: {
    role: 'Ocean Abyssal / Leviathan',
    abilityName: 'Anchor Melee Smash & Tidal Wave',
    abilityDesc: 'Smashes a heavy anchor in a 140px melee arc for 1.25x damage. Special summons an 800px water wave that slows foes by 50% for 2s.',
    ultimateName: 'Collision Course (100 Energy)',
    ultimateDesc: 'Hurls a Ghost Pirate Boat projectile that explodes on impact into 30 random shrapnel pieces (400px radius, 50px AOE radius) & grants 50% Damage Reduction for 6s.',
    cost: 500,
    colorClass: 'text-teal-600 border-teal-300 bg-teal-50',
    bgGradient: 'from-teal-600 via-cyan-700 to-indigo-900',
  },
  Butchermon: {
    role: 'Blood / Melee Butcher',
    abilityName: 'Butcher Cleaver & Rotten Flesh (Toggle)',
    abilityDesc: 'Basic melee butcher knife slash (130px arc). Skill toggles a Rotten Flesh cloud damaging self and enemies with ramping damage over time, healing Butchermon for 25% of damage dealt.',
    ultimateName: 'Butcher\'s Masterpiece (80 Energy)',
    ultimateDesc: 'Fires an 800px wall-piercing hook chain. Hooking normal enemies pulls them to Butchermon (+200% Lifesteal for 6s); hooking bosses pulls Butchermon to the boss (+100% Lifesteal for 6s). Passive: +1 Max HP per kill.',
    cost: 500,
    colorClass: 'text-red-700 border-red-500 bg-red-950',
    bgGradient: 'from-red-700 via-rose-800 to-slate-950',
  },
  Reapermon: {
    role: 'Shadow Reaper / Death Scythe',
    abilityName: 'Death Scythe Cleave & Ascent Dash',
    abilityDesc: 'Basic attack swings the Scythe of Death in alternating wide arcs. Skill dashes 450px forward slicing enemies caught in path while swinging scythe upwards.',
    ultimateName: 'Giant Scythe of Damnation (120 Energy)',
    ultimateDesc: 'Marks & locks the enemy with the lowest % HP in 500px radius for 2s, then summons a Giant Spectral Scythe that slashes for massive execute damage (higher when enemy HP is low).',
    cost: 500,
    colorClass: 'text-purple-400 border-purple-600 bg-purple-950',
    bgGradient: 'from-purple-900 via-stone-900 to-emerald-950',
  },
  Mikomon: {
    role: 'Japanese Miko Draco / Sacred Fortune Master',
    abilityName: 'Omikuji Slip & Fortune Blast',
    abilityDesc: 'Basic attack throws a fortune slip card to enemies in 800px range. Skill (Fortune Blast) throws 5 homing fortune slips that inflict 3s DoT and end in mini explosions. Gimmick: 1% chance per attack hit to trigger Supernova Insta-Kill!',
    ultimateName: 'The Fate of the World (100 Energy)',
    ultimateDesc: 'Marks all visible enemies on screen. When a marked enemy is hit, it triggers a mini explosion and unleashes 12 fortune slips in 360° clock directions (blocked by ground).',
    cost: 500,
    colorClass: 'text-rose-400 border-rose-600 bg-rose-950',
    bgGradient: 'from-rose-900 via-stone-900 to-amber-950',
  },
};

export const DracoSelection: React.FC<DracoSelectionProps> = ({
  saveData,
  onSelect,
  onUnlock,
  onLevelUpWithCoins,
  onClose,
  onSwitchTier,
  isFullPage = false,
  showLevelUp,
  levelUpInfo,
  onApplyBonus,
  pendingLevelUps,
}) => {
  const router = useRouter();
  const equippedDraco = saveData.selectedDraco;
  const [selectedName, setSelectedName] = useState<string>(equippedDraco);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectTab, setInspectTab] = useState<'details' | 'equipment' | 'preview'>('details');
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [activeSlotPicker, setActiveSlotPicker] = useState<number | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const {
    usePotion,
    useUpgradeStone,
    buyItem,
    equipItem,
    unequipItem,
    unequipAllItems,
    autoEquipOptimal,
    sellEquipment,
    dismantleEquipment,
  } = useGameState();
  const coins = saveData.player.coins;
  const currentTier = saveData.tier || 'Free';

  const dracoNames = Object.keys(saveData.dracos).sort((a, b) => a.localeCompare(b));
  const filteredDracos = dracoNames.filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (DRACO_META[name]?.role || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inspectedData = saveData.dracos[selectedName] || {
    level: 1,
    hp: 10,
    attack: 1,
    defense: 1,
    speed: 1,
    jump: 1,
    range: 1,
    unlocked: false,
    equipped: [],
  };
  const inspectedMeta = DRACO_META[selectedName] || DRACO_META['Jumpmon'];
  const isUnlocked = !!inspectedData.unlocked;
  const isEquipped = equippedDraco === selectedName;
  const canAfford = coins >= inspectedMeta.cost;
  const lvl = inspectedData.level || 1;
  const hp = Math.round((inspectedData.hp || 10) * 10) / 10;
  const att = Math.round((inspectedData.attack || 1) * 10) / 10;
  const def = Math.round((inspectedData.defense || 1) * 10) / 10;
  const spd = Math.round((inspectedData.speed || 1) * 10) / 10;
  const equippedList = normalizeDracoEquipped(inspectedData.equipped);
  const equippedCount = equippedList.filter(Boolean).length;
  const eqBonus = getDracoEquipmentBonus(equippedList);

  const equippedCountsByOtherDracos = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(saveData.dracos).forEach(dName => {
      if (dName === selectedName) return;
      const d = saveData.dracos[dName];
      if (d && Array.isArray(d.equipped)) {
        d.equipped.forEach(eqId => {
          counts[eqId] = (counts[eqId] || 0) + 1;
        });
      }
    });
    return counts;
  }, [saveData.dracos, selectedName]);

  const levelUpCost = lvl * 100;
  const canLevelUp = isUnlocked && lvl < 25 && coins >= levelUpCost;

  const content = (
    <div className={`w-full flex flex-col ${isFullPage ? 'min-h-[550px]' : 'bg-stone-950 border border-stone-800/90 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh]'}`}>
      {!isFullPage && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-stone-800/80 bg-stone-900/60 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 text-stone-950 rounded-2xl shadow-lg shadow-amber-500/20">
              <Shield className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-wider text-stone-100 uppercase font-display flex items-center gap-2">
                Hero Roster <span className="text-amber-400 text-xs font-mono lowercase tracking-normal">dota 2 edition</span>
              </h2>
              <p className="text-xs text-stone-400 font-mono">Select & equip your battle companion</p>
            </div>
          </div>

          {onSwitchTier && (
            <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-xl">
              {(() => {
                const TIER_RANKS: Record<TierType, number> = { Free: 0, Basic: 1, Premium: 2 };
                const curRank = TIER_RANKS[currentTier] ?? 0;

                return (['Free', 'Basic', 'Premium'] as TierType[]).map((t) => {
                  const tRank = TIER_RANKS[t] ?? 0;
                  const isCurrent = currentTier === t;
                  const isLower = tRank < curRank;

                  return (
                    <button
                      key={t}
                      disabled={isCurrent || isLower}
                      onClick={() => {
                        soundService.playClick();
                        onSwitchTier(t);
                      }}
                      title={isLower ? `Included in ${currentTier} Tier` : undefined}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        isCurrent
                          ? 'bg-amber-500 text-stone-950 shadow-sm cursor-default'
                          : isLower
                          ? 'bg-stone-800/60 text-stone-500 cursor-not-allowed opacity-60'
                          : 'text-stone-300 hover:text-white hover:bg-stone-800'
                      }`}
                    >
                      <Award className="w-3 h-3" />
                      <span>{t}</span>
                    </button>
                  );
                });
              })()}
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-stone-900/90 rounded-full border border-stone-800 shadow-inner">
              <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-mono font-bold text-xs text-amber-300">{coins} Coins</span>
            </div>
            {onClose && (
              <button
                onClick={() => {
                  soundService.playClick();
                  onClose();
                }}
                className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-start p-2 sm:p-4 text-stone-100">
        {/* Left Column: Dota 2 / Valorant Style Hero Roster Grid */}
        <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter hero by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-stone-900/90 border border-stone-800 rounded-2xl text-xs font-mono text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
              />
            </div>
            <div className="text-xs font-black uppercase tracking-wider text-amber-400 bg-stone-900/90 border border-stone-800 px-4 py-2.5 rounded-2xl shrink-0 font-display shadow-lg">
              Roster ({filteredDracos.length})
            </div>
          </div>

          <div className="p-4 bg-stone-900/40 rounded-3xl border border-stone-800/80 backdrop-blur-xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {filteredDracos.map((name) => {
                const dData = saveData.dracos[name];
                const meta = DRACO_META[name];
                const itemUnlocked = !!dData.unlocked;
                const itemEquipped = equippedDraco === name;
                const isSelected = selectedName === name;

                return (
                  <button
                    key={name}
                    onClick={() => {
                      soundService.playClick();
                      setSelectedName(name);
                    }}
                    className={`h-44 sm:h-48 rounded-3xl border transition-all duration-300 relative group overflow-hidden flex flex-col justify-between p-3.5 shadow-xl ${
                      isSelected
                        ? 'border-2 border-amber-400 ring-4 ring-amber-500/30 scale-[1.03] z-20 shadow-[0_0_30px_rgba(251,191,36,0.5)] bg-amber-950/80'
                        : itemEquipped
                        ? 'border-emerald-500/80 ring-2 ring-emerald-500/30 hover:scale-[1.02] hover:z-10 hover:border-emerald-400 bg-emerald-950/40'
                        : itemUnlocked
                        ? 'border-stone-800 hover:border-amber-400/80 hover:scale-[1.02] hover:z-10 bg-stone-900/90'
                        : 'border-stone-900 opacity-40 hover:opacity-85 hover:scale-[1.02] bg-stone-950/80'
                    }`}
                  >
                    {/* Full Background Hero Elemental Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${meta.bgGradient} opacity-35 group-hover:opacity-70 transition-opacity`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                    {/* Top Badges */}
                    <div className="relative z-10 w-full flex items-center justify-between px-0.5 pt-0.5">
                      {itemEquipped ? (
                        <span className="px-2 py-0.5 bg-emerald-500 text-stone-950 text-[9px] font-black uppercase rounded-md tracking-wider shadow-sm font-display">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-stone-900/80 text-stone-400 text-[8px] font-mono font-bold rounded uppercase truncate max-w-[80px]">
                          {meta.role.split('/')[0]}
                        </span>
                      )}
                      {!itemUnlocked && (
                        <Lock className="w-3.5 h-3.5 text-stone-400 ml-auto drop-shadow-md" />
                      )}
                    </div>

                    {/* Hero SVG Character Artwork Floating in Upper Center */}
                    <div className="relative z-10 my-auto p-1 drop-shadow-[0_6px_12px_rgba(0,0,0,0.7)] transform group-hover:scale-110 transition-transform duration-300 flex justify-center">
                      <DracoArtwork name={name} animated={isSelected} size={56} />
                    </div>

                    {/* Bottom Hero Name & Level Badge */}
                    <div className="relative z-10 w-full flex flex-col items-center pt-1 border-t border-stone-800/50">
                      <span className={`text-xs font-black uppercase tracking-wider truncate max-w-full text-center drop-shadow-md font-display ${isSelected ? 'text-amber-300' : 'text-stone-100'}`}>
                        {name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-mono text-stone-400 font-bold drop-shadow">
                          {itemUnlocked ? `Lv.${dData.level || 1}` : `Unlock: ${meta.cost}🪙`}
                        </span>
                        {itemUnlocked && Array.isArray(dData.equipped) && dData.equipped.length > 0 && (
                          <span className="text-[9px] px-1 py-0.2 bg-amber-950/80 border border-amber-800/80 text-amber-300 rounded font-mono font-bold">
                            {dData.equipped.length}⚔️
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Dota 2 Dark Obsidian Inspect Panel */}
        <div className="order-1 lg:order-2 lg:col-span-5 lg:sticky lg:top-24 p-5 sm:p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-2xl flex flex-col justify-between space-y-4 backdrop-blur-xl">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-950/90 rounded-2xl border border-stone-800">
            <button
              onClick={() => {
                soundService.playClick();
                setInspectTab('details');
              }}
              className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1 transition-all ${
                inspectTab === 'details'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              <span>📋 Details</span>
            </button>
            <button
              onClick={() => {
                soundService.playClick();
                setInspectTab('equipment');
              }}
              className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1 transition-all ${
                inspectTab === 'equipment'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              <span>⚔️ Gear</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                inspectTab === 'equipment' ? 'bg-stone-950/30 text-stone-950' : 'bg-stone-900 text-amber-400 border border-stone-800'
              }`}>
                {equippedCount}/5
              </span>
            </button>
            <button
              onClick={() => {
                soundService.playClick();
                setInspectTab('preview');
              }}
              className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1 transition-all ${
                inspectTab === 'preview'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>⚡ Preview</span>
            </button>
          </div>

          {inspectTab === 'preview' ? (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div>
                  <h4 className="text-sm font-black text-stone-100 font-display uppercase tracking-wider">
                    {selectedName} Combat Preview
                  </h4>
                </div>
              </div>
              <HeroDemoCanvas selectedDraco={selectedName} />
            </div>
          ) : inspectTab === 'equipment' ? (
            <div className="space-y-4">
              {/* Hero Banner inside Equipment Tab */}
              <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${
                isEquipped
                  ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-950/50'
                  : 'bg-stone-950/70 border-stone-800'
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${inspectedMeta.bgGradient} p-0.5 shadow-md flex items-center justify-center shrink-0`}>
                    <div className="w-full h-full bg-stone-950/90 rounded-lg flex items-center justify-center">
                      <DracoArtwork name={selectedName} animated={isEquipped} size={38} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white uppercase tracking-wider font-display truncate">{selectedName}</h4>
                      {isEquipped && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-stone-400 mt-0.5">
                      {isUnlocked ? `Loadout • ${equippedCount} of 5 typed slots equipped` : `Unlock hero to equip gear`}
                    </p>
                  </div>
                </div>

                {isUnlocked && (
                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        const success = autoEquipOptimal(selectedName);
                        if (success) {
                          soundService.playLevelUp();
                          setFeedbackToast('⚡ Auto-equipped optimal typed gear!');
                          setTimeout(() => setFeedbackToast(null), 2500);
                        } else {
                          soundService.playHit();
                          setFeedbackToast('No unequipped typed gear available');
                          setTimeout(() => setFeedbackToast(null), 2000);
                        }
                      }}
                      className="flex-1 sm:flex-none px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 rounded-xl text-xs font-bold font-display transition-all"
                    >
                      ⚡ Auto-Equip
                    </button>
                    {equippedCount > 0 && (
                      <button
                        onClick={() => {
                          soundService.playClick();
                          unequipAllItems(selectedName);
                          setFeedbackToast('Cleared all equipped gear');
                          setTimeout(() => setFeedbackToast(null), 2000);
                        }}
                        className="px-2.5 py-1.5 bg-stone-900 hover:bg-rose-950 border border-stone-800 hover:border-rose-700 text-stone-400 hover:text-rose-300 rounded-xl text-xs transition-all"
                        title="Unequip all gear"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Feedback Toast */}
              {feedbackToast && (
                <div className="px-3.5 py-2 bg-amber-500/20 border border-amber-500/40 rounded-xl text-xs font-mono font-bold text-amber-300 text-center animate-pulse">
                  {feedbackToast}
                </div>
              )}

              {/* Total Equipment Stat Boosts Bar */}
              <div className="p-3 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-stone-400 font-display">
                  <span>Equipment Stat Bonuses:</span>
                  <span className="text-amber-400 font-mono font-bold">Total Power</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {eqBonus.attack > 0 && (
                    <span className="px-2 py-0.5 bg-amber-950/70 border border-amber-800/80 text-amber-300 text-[10px] font-mono font-bold rounded-lg">
                      +{eqBonus.attack} ATK
                    </span>
                  )}
                  {eqBonus.defense > 0 && (
                    <span className="px-2 py-0.5 bg-blue-950/70 border border-blue-800/80 text-blue-300 text-[10px] font-mono font-bold rounded-lg">
                      +{eqBonus.defense} DEF
                    </span>
                  )}
                  {eqBonus.hp > 0 && (
                    <span className="px-2 py-0.5 bg-rose-950/70 border border-rose-800/80 text-rose-300 text-[10px] font-mono font-bold rounded-lg">
                      +{eqBonus.hp} HP
                    </span>
                  )}
                  {eqBonus.speed > 0 && (
                    <span className="px-2 py-0.5 bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 text-[10px] font-mono font-bold rounded-lg">
                      +{eqBonus.speed} SPD
                    </span>
                  )}
                  {eqBonus.jump > 0 && (
                    <span className="px-2 py-0.5 bg-purple-950/70 border border-purple-800/80 text-purple-300 text-[10px] font-mono font-bold rounded-lg">
                      +{eqBonus.jump} JUMP
                    </span>
                  )}
                  {eqBonus.range > 0 && (
                    <span className="px-2 py-0.5 bg-cyan-950/70 border border-cyan-800/80 text-cyan-300 text-[10px] font-mono font-bold rounded-lg">
                      +{eqBonus.range} RNG
                    </span>
                  )}
                  {(eqBonus.energyRegen || 0) > 0 && (
                    <span className="px-2 py-0.5 bg-yellow-950/70 border border-yellow-800/80 text-yellow-300 text-[10px] font-mono font-bold rounded-lg">
                      +{eqBonus.energyRegen} NRG
                    </span>
                  )}
                  {Object.values(eqBonus).every(v => v === 0) && (
                    <span className="text-[11px] text-stone-500 font-mono italic">
                      Equip items into their designated typed slots below
                    </span>
                  )}
                </div>
              </div>

              {/* 5 Typed Equipment Slots */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {[0, 1, 2, 3, 4].map(slotIdx => {
                  const slotType = getSlotTypeByIndex(slotIdx);
                  const slotCfg = SLOT_CONFIG[slotType];
                  const eqId = equippedList[slotIdx];
                  const eq = eqId ? EQUIPMENT_REGISTRY[eqId] : null;
                  const rarityCfg = eq ? RARITY_CONFIG[eq.rarity as EquipmentRarity] || RARITY_CONFIG.common : null;
                  const isPickerOpen = activeSlotPicker === slotIdx;

                  return (
                    <div key={slotIdx} className="space-y-2">
                      <div
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          eq
                            ? 'bg-stone-950/90 border-stone-800 hover:border-stone-700'
                            : 'bg-stone-950/40 border-dashed border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-md"
                            style={{
                              backgroundColor: '#0f172a',
                              border: eq && rarityCfg ? `2px solid ${rarityCfg.color}` : '1px dashed #334155'
                            }}
                          >
                            <span>{eq?.icon || slotCfg.icon}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                                {slotCfg.icon} {slotCfg.label} Slot
                              </span>
                              {eq && rarityCfg && (
                                <span
                                  className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded font-mono"
                                  style={{
                                    backgroundColor: rarityCfg.bg,
                                    color: rarityCfg.color,
                                    border: `1px solid ${rarityCfg.border}`
                                  }}
                                >
                                  {rarityCfg.label}
                                </span>
                              )}
                            </div>
                            <h5 className="text-xs font-bold text-stone-200 truncate mt-0.5">
                              {eq ? eq.name : `Empty ${slotCfg.label} Slot`}
                            </h5>
                            {eq && eq.stats ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {Object.entries(eq.stats).map(([k, v]) => (
                                  <span key={k} className="text-[9px] font-mono text-emerald-400 font-bold">
                                    +{v} {k.toUpperCase()}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[10px] text-stone-500 font-mono mt-0.5 truncate">
                                {slotCfg.desc}
                              </p>
                            )}
                          </div>
                        </div>

                        {isUnlocked ? (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                soundService.playClick();
                                setActiveSlotPicker(isPickerOpen ? null : slotIdx);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display transition-all ${
                                isPickerOpen
                                  ? 'bg-amber-500 text-stone-950 shadow-md'
                                  : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
                              }`}
                            >
                              {eq ? 'Swap' : `+ Equip ${slotCfg.label}`}
                            </button>
                            {eq && (
                              <button
                                onClick={() => {
                                  soundService.playClick();
                                  unequipItem(selectedName, slotIdx);
                                  setFeedbackToast(`Unequipped ${eq.name}`);
                                  setTimeout(() => setFeedbackToast(null), 2000);
                                }}
                                className="p-1.5 text-stone-500 hover:text-rose-400 rounded-lg hover:bg-stone-900 transition-colors"
                                title="Unequip this item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-stone-600 font-mono">Locked</span>
                        )}
                      </div>

                      {/* Inline Slot Picker Drawer: Strictly Filters by slotType */}
                      {isPickerOpen && (
                        <div className="p-3 bg-stone-950 border border-amber-500/40 rounded-2xl space-y-2 shadow-xl">
                          <div className="flex items-center justify-between text-[11px] font-black uppercase text-amber-400 font-display">
                            <span>Select {slotCfg.label} ({slotCfg.icon}) for {selectedName}:</span>
                            <button
                              onClick={() => setActiveSlotPicker(null)}
                              className="text-stone-400 hover:text-white text-xs"
                            >
                              ✕ Close
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                            {saveData.inventory
                              .filter(i => {
                                if (i.type !== 'equipment') return false;
                                const eqData = EQUIPMENT_REGISTRY[i.id];
                                if (!eqData || eqData.slot !== slotType) return false;
                                const usedByOtherDracos = equippedCountsByOtherDracos[i.id] || 0;
                                const isEquippedHere = equippedList[slotIdx] === i.id;
                                const availableForSlot = i.quantity - usedByOtherDracos;
                                return isEquippedHere || availableForSlot > 0;
                              })
                              .map(item => {
                                const eqData = EQUIPMENT_REGISTRY[item.id] || item;
                                const rCfg = RARITY_CONFIG[(eqData.rarity as EquipmentRarity) || 'common'] || RARITY_CONFIG.common;
                                const isEquippedHere = equippedList[slotIdx] === item.id;

                                return (
                                  <button
                                    key={item.id}
                                    onClick={() => {
                                      const success = equipItem(selectedName, item.id, slotIdx);
                                      if (success) {
                                        soundService.playLevelUp();
                                        setFeedbackToast(`Equipped ${eqData.name}!`);
                                        setTimeout(() => setFeedbackToast(null), 2000);
                                      }
                                      setActiveSlotPicker(null);
                                    }}
                                    className={`p-2 rounded-xl text-left flex items-center justify-between gap-2 transition-all group ${
                                      isEquippedHere
                                        ? 'bg-amber-950/30 border border-amber-400 text-white'
                                        : 'bg-stone-900/90 border border-stone-800 hover:border-amber-400 text-stone-300'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <span className="text-lg">{eqData.icon || slotCfg.icon}</span>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs font-bold group-hover:text-amber-300 truncate">
                                            {eqData.name}
                                          </span>
                                          {isEquippedHere && (
                                            <span className="text-[8px] font-mono bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-bold">
                                              Equipped
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-[10px] text-stone-500 font-mono block truncate">
                                          {Object.entries(eqData.stats || {})
                                            .map(([k, v]) => `+${v} ${k.toUpperCase()}`)
                                            .join(' ')}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-amber-400 font-display shrink-0">
                                      Select →
                                    </span>
                                  </button>
                                );
                              })}
                            {saveData.inventory.filter(i => {
                              if (i.type !== 'equipment') return false;
                              const eqData = EQUIPMENT_REGISTRY[i.id];
                              if (!eqData || eqData.slot !== slotType) return false;
                              const usedByOther = equippedCountsByOtherDracos[i.id] || 0;
                              const isEquippedHere = equippedList[slotIdx] === i.id;
                              return isEquippedHere || i.quantity - usedByOther > 0;
                            }).length === 0 && (
                              <div className="p-3 text-center text-xs text-stone-500 font-mono">
                                No available {slotCfg.label} items in your bag. Craft or buy one at the Armory!
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick Jump to /inventory */}
              <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-stone-400">Need to forge or buy gear?</span>
                <button
                  onClick={() => {
                    soundService.playClick();
                    router.push(`/inventory?tab=shop&draco=${selectedName}`);
                  }}
                  className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-amber-400 rounded-xl text-xs font-bold font-display transition-all flex items-center gap-1"
                >
                  <span>Armory &amp; Forge</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${
                isEquipped
                  ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-950/50'
                  : 'bg-stone-950/70 border-stone-800'
              }`}>
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${inspectedMeta.bgGradient} p-1 shadow-lg flex items-center justify-center flex-shrink-0`}>
                    <div className="w-full h-full bg-stone-950/90 rounded-xl flex items-center justify-center">
                      <DracoArtwork name={selectedName} animated={isEquipped} size={52} />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-black text-white uppercase tracking-wider font-display truncate">{selectedName}</h3>
                    <p className="text-xs font-semibold text-amber-400 mt-0.5 truncate">{inspectedMeta.role}</p>
                    <p className="text-[11px] font-mono text-stone-400 mt-0.5 truncate">
                      {isUnlocked ? `Class Unlocked • Level ${lvl}` : `Unlock Cost: ${inspectedMeta.cost} Coins`}
                    </p>
                  </div>
                </div>

                <div className="w-full xl:w-auto shrink-0 mt-1 xl:mt-0">
                  {isUnlocked ? (
                    <button
                      disabled={isEquipped}
                      onClick={() => {
                        soundService.playLevelUp();
                        onSelect(selectedName);
                      }}
                      className={`w-full xl:w-auto px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-display transition-all shadow-lg flex items-center justify-center gap-1.5 whitespace-nowrap ${
                        isEquipped
                          ? 'bg-stone-800 text-stone-500 border border-stone-700 cursor-default'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 shadow-amber-500/20 active:scale-95'
                      }`}
                    >
                      {isEquipped ? 'ACTIVE HERO' : 'EQUIP HERO'}
                    </button>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        soundService.playLevelUp();
                        onUnlock(selectedName, inspectedMeta.cost);
                      }}
                      className={`w-full xl:w-auto px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-display transition-all shadow-lg flex items-center justify-center gap-1.5 whitespace-nowrap ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20 active:scale-95'
                          : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-4 h-4 shrink-0 fill-current" />
                      Unlock ({inspectedMeta.cost}🪙)
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-black uppercase tracking-wider text-stone-200 flex items-center gap-1.5 font-display">
                    <span>Battle Attributes</span>
                    {isUnlocked && <span className="text-stone-400 font-mono text-[11px] font-normal">(Lv.{lvl}/25)</span>}
                  </div>

                  {isUnlocked && (
                    <div>
                      {lvl >= 25 ? (
                        <span className="px-2.5 py-1 text-[10px] font-black text-purple-300 bg-purple-950/80 border border-purple-800 rounded-lg">
                          MAX LEVEL
                        </span>
                      ) : (
                        <button
                          disabled={!canLevelUp}
                          onClick={() => {
                            if (canLevelUp) {
                              soundService.playLevelUp();
                              onLevelUpWithCoins(selectedName);
                            } else {
                              soundService.playHit();
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                            canLevelUp
                              ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md active:scale-95'
                              : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                          }`}
                        >
                          <Coins className="w-3.5 h-3.5 fill-current" />
                          Upgrade ({levelUpCost}🪙)
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-stone-400 mb-1">
                      <span className="font-bold text-stone-300">HP</span>
                      <span className="font-bold text-rose-400">
                        {hp}
                        {eqBonus.hp > 0 && <span className="text-emerald-400 text-[10px] ml-1">(+{eqBonus.hp})</span>}
                      </span>
                    </div>
                    <div className="h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                      <div
                        className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)] rounded-full"
                        style={{ width: `${Math.min(100, ((hp + eqBonus.hp) / 240) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-stone-400 mb-1">
                      <span className="font-bold text-stone-300">Attack</span>
                      <span className="font-bold text-amber-400">
                        {att}
                        {eqBonus.attack > 0 && <span className="text-emerald-400 text-[10px] ml-1">(+{eqBonus.attack})</span>}
                      </span>
                    </div>
                    <div className="h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                      <div
                        className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)] rounded-full"
                        style={{ width: `${Math.min(100, ((att + eqBonus.attack) / 35) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-stone-400 mb-1">
                      <span className="font-bold text-stone-300">Defense</span>
                      <span className="font-bold text-blue-400">
                        {def}
                        {eqBonus.defense > 0 && <span className="text-emerald-400 text-[10px] ml-1">(+{eqBonus.defense})</span>}
                      </span>
                    </div>
                    <div className="h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                      <div
                        className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] rounded-full"
                        style={{ width: `${Math.min(100, ((def + eqBonus.defense) / 70) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-stone-400 mb-1">
                      <span className="font-bold text-stone-300">Speed</span>
                      <span className="font-bold text-emerald-400">
                        {spd}
                        {eqBonus.speed > 0 && <span className="text-emerald-400 text-[10px] ml-1">(+{eqBonus.speed})</span>}
                      </span>
                    </div>
                    <div className="h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                      <div
                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] rounded-full"
                        style={{ width: `${Math.min(100, ((spd + eqBonus.speed) / 15) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Equipped Gear Bar */}
              <div className="p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">⚔️</span>
                  <div>
                    <span className="text-xs font-black uppercase text-stone-200 font-display block">
                      Equipped Gear ({equippedList.length}/5)
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      {equippedList.length > 0 ? (
                        equippedList.map((eqId, idx) => {
                          const eq = EQUIPMENT_REGISTRY[eqId];
                          return (
                            <span
                              key={idx}
                              className="text-xs px-1.5 py-0.5 bg-stone-900 border border-stone-800 rounded-md"
                              title={eq?.name || 'Gear'}
                            >
                              {eq?.icon || '⚔️'}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[10px] text-stone-500 font-mono">No equipment equipped</span>
                      )}
                    </div>
                  </div>
                </div>
                {isUnlocked && (
                  <button
                    onClick={() => {
                      soundService.playClick();
                      setInspectTab('equipment');
                    }}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-black uppercase font-display transition-all shadow-md active:scale-95 flex items-center gap-1"
                  >
                    <span>Manage Gear</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-400 font-display">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Special Skill</span>
                  </div>
                  <p className="text-xs font-bold text-stone-100 mt-1 leading-tight">{inspectedMeta.abilityName}</p>
                  <p className="text-[11px] text-stone-400 mt-1 leading-normal">{inspectedMeta.abilityDesc}</p>
                </div>

                <div className="p-3.5 bg-purple-950/30 rounded-2xl border border-purple-800/60">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase text-purple-400 font-display">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Ultimate Skill</span>
                  </div>
                  <p className="text-xs font-bold text-purple-300 mt-1 leading-tight">
                    {inspectedMeta.ultimateName}
                  </p>
                  <p className="text-[11px] text-purple-200/80 mt-1 leading-normal">{inspectedMeta.ultimateDesc}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const modalElement = showLevelUp && levelUpInfo && onApplyBonus && (
    <LevelUpModal
      key={`${levelUpInfo.dracoName}-${levelUpInfo.oldLevel}-${levelUpInfo.newLevel}-${pendingLevelUps?.length || 0}`}
      dracoName={levelUpInfo.dracoName}
      oldLevel={levelUpInfo.oldLevel}
      newLevel={levelUpInfo.newLevel}
      baseIncrease={levelUpInfo.baseIncrease}
      bonusRoll={levelUpInfo.bonusRoll}
      currentStats={saveData.dracos[levelUpInfo.dracoName] as any}
      onApplyBonus={onApplyBonus}
      pendingCount={pendingLevelUps?.length || 0}
    />
  );

  const equipmentModalElement = showEquipmentModal && (
    <InventoryModal
      saveData={saveData}
      initialTab="equipment"
      initialDraco={selectedName}
      onUsePotion={usePotion}
      onUseUpgradeStone={useUpgradeStone}
      onBuyItem={buyItem}
      onEquipItem={equipItem}
      onUnequipItem={unequipItem}
      onUnequipAll={unequipAllItems}
      onAutoEquip={autoEquipOptimal}
      onSellItem={sellEquipment}
      onDismantleItem={dismantleEquipment}
      onClose={() => setShowEquipmentModal(false)}
    />
  );

  if (isFullPage) {
    return (
      <>
        {content}
        {modalElement}
        {equipmentModalElement}
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-stone-900/50 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.96, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 10 }}
          className="w-full max-w-5xl"
        >
          {content}
        </motion.div>
      </motion.div>
      {modalElement}
      {equipmentModalElement}
    </>
  );
};

export default DracoSelection;
