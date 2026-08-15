import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SaveData } from '../types/game';
import { Volume2, VolumeX, Trash2, Clipboard, Download, Upload, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { soundService } from '../services/sound';

interface SettingsModalProps {
  saveData: SaveData;
  onUpdateSettings: (music: boolean, volume: number, sfxVolume: number) => void;
  onResetSave: () => void;
  onExportSave: () => string;
  onImportSave: (dataStr: string) => boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  saveData,
  onUpdateSettings,
  onResetSave,
  onExportSave,
  onImportSave,
  onClose,
}) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const settings = saveData.settings;

  const handleMusicToggle = (val: boolean) => {
    soundService.playClick();
    onUpdateSettings(val, settings.volume, settings.sfxVolume ?? 80);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseInt(e.target.value);
    onUpdateSettings(settings.music, vol, settings.sfxVolume ?? 80);
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sfx = parseInt(e.target.value);
    onUpdateSettings(settings.music, settings.volume, sfx);
  };

  const handleCopySave = () => {
    soundService.playClick();
    const str = onExportSave();
    navigator.clipboard.writeText(str).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const ok = onImportSave(importText.trim());
    if (ok) {
      setImportStatus('success');
      setImportText('');
      soundService.playLevelUp();
      setTimeout(() => setImportStatus('idle'), 3000);
    } else {
      setImportStatus('error');
      soundService.playClick();
      setTimeout(() => setImportStatus('idle'), 3000);
    }
  };

  const handleResetSubmit = () => {
    onResetSave();
    setShowConfirmReset(false);
    soundService.playHit();
  };

  return (
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
        className="w-full max-w-lg border bg-stone-900/95 border-stone-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative text-stone-100"
      >
        <h2 className="text-2xl font-black tracking-wider text-white uppercase font-display">Options Menu</h2>
        <p className="text-xs text-stone-400 mt-1 font-mono">Configure audio synthesizer volume and save file configurations.</p>

        {/* AUDIO SYNTHESIZER CONTROLS */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider font-display">Background Music</span>
            <button
              onClick={() => handleMusicToggle(!settings.music)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase font-display border transition-all ${
                settings.music
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md'
                  : 'bg-stone-950 text-stone-500 border-stone-800'
              }`}
            >
              {settings.music ? 'Enabled' : 'Muted'}
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-stone-400 font-mono">
              <span>Music Volume</span>
              <span className="font-bold text-amber-400">{settings.volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.volume}
              disabled={!settings.music}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-stone-950 rounded-lg appearance-none cursor-pointer accent-amber-500 border border-stone-800 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-stone-400 font-mono">
              <span>SFX Volume</span>
              <span className="font-bold text-amber-400">{settings.sfxVolume ?? 80}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.sfxVolume ?? 80}
              onChange={handleSfxChange}
              className="w-full h-1.5 bg-stone-950 rounded-lg appearance-none cursor-pointer accent-amber-500 border border-stone-800"
            />
          </div>
        </div>

        {/* SAVE DATA CONTROL SYSTEM */}
        <div className="mt-8 pt-6 border-t border-stone-800 space-y-4">
          <h3 className="text-xs font-black text-stone-400 uppercase tracking-wider font-display">Save Data Manager</h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopySave}
              className="flex items-center justify-center gap-2 p-3 border border-stone-800 rounded-xl text-xs font-bold text-stone-200 bg-stone-950 hover:bg-stone-800 transition-all active:scale-95 font-display uppercase"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Clipboard className="w-4 h-4" />}
              {copied ? 'Copied Save!' : 'Export Save'}
            </button>

            <button
              onClick={() => {
                setShowConfirmReset(true);
                soundService.playClick();
              }}
              className="flex items-center justify-center gap-2 p-3 border border-rose-800/80 rounded-xl text-xs font-bold text-rose-400 bg-rose-950/40 hover:bg-rose-900/60 transition-all active:scale-95 font-display uppercase"
            >
              <Trash2 className="w-4 h-4" />
              Reset Progress
            </button>
          </div>

          {/* IMPORT BACKUP SAVE */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-stone-400 block">Import Backup Key:</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste backup hash key here..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="flex-1 px-3 py-2 border border-stone-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 bg-stone-950 text-stone-100 font-mono"
              />
              <button
                onClick={handleImportSubmit}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-black uppercase font-display active:scale-95 transition-all shadow-md"
              >
                Import
              </button>
            </div>
            {importStatus === 'success' && (
              <p className="text-[10px] text-emerald-400 font-bold font-mono">✓ Progress restored successfully!</p>
            )}
            {importStatus === 'error' && (
              <p className="text-[10px] text-rose-400 font-bold font-mono">✗ Invalid save hash key. Try again.</p>
            )}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => {
              soundService.playClick();
              onClose();
              router.push('/admin');
            }}
            className="px-4 py-2.5 text-xs font-black uppercase font-display bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <ShieldCheck className="w-4 h-4" /> Admin Panel
          </button>
          <button
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="px-6 py-2.5 text-xs font-black uppercase font-display bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl transition-all border border-stone-700"
          >
            Close Settings
          </button>
        </div>

        {/* CONFIRM RESET OVERLAY */}
        <AnimatePresence>
          {showConfirmReset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-950/95 rounded-3xl flex flex-col items-center justify-center p-6 text-center z-10 backdrop-blur-md"
            >
              <AlertTriangle className="w-12 h-12 text-rose-500 animate-bounce mb-3" />
              <h4 className="text-lg font-black text-white uppercase font-display">Erase Save Data?</h4>
              <p className="text-xs text-stone-400 max-w-xs mt-1 leading-relaxed font-mono">
                This will permanently delete all Draco levels, coins, upgrades, and inventory. This cannot be undone.
              </p>
              <div className="flex gap-3 mt-6 w-full max-w-xs">
                <button
                  onClick={handleResetSubmit}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase font-display transition-all shadow-lg"
                >
                  Yes, Erase
                </button>
                <button
                  onClick={() => {
                    soundService.playClick();
                    setShowConfirmReset(false);
                  }}
                  className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-black uppercase font-display transition-all border border-stone-700"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
export default SettingsModal;
