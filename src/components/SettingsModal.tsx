import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SaveData } from '../types/game';
import { Volume2, VolumeX, Trash2, Clipboard, Download, Upload, Check, AlertTriangle } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        className="w-full max-w-lg border bg-white/95 border-stone-200 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative"
      >
        <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-display">Options Menu</h2>
        <p className="text-xs text-stone-500 mt-1">Configure audio synthesizer volume and save file configurations.</p>

        {/* Audio Controls */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">Background Music</span>
            <button
              onClick={() => handleMusicToggle(!settings.music)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                settings.music
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-50 text-stone-400 border-stone-200'
              }`}
            >
              {settings.music ? 'Enabled' : 'Muted'}
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-stone-500 font-semibold">
              <span>Music Volume</span>
              <span>{settings.volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.volume}
              disabled={!settings.music}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-900 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-stone-500 font-semibold">
              <span>SFX Volume</span>
              <span>{settings.sfxVolume ?? 80}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.sfxVolume ?? 80}
              onChange={handleSfxChange}
              className="w-full h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-900"
            />
          </div>
        </div>

        {/* Save Data Operations */}
        <div className="mt-8 pt-6 border-t border-stone-100 space-y-4">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Save Data Manager</h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopySave}
              className="flex items-center justify-center gap-2 p-3 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Clipboard className="w-4 h-4" />}
              {copied ? 'Copied Save!' : 'Export Save'}
            </button>

            <button
              onClick={() => {
                setShowConfirmReset(true);
                soundService.playClick();
              }}
              className="flex items-center justify-center gap-2 p-3 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50/20 hover:bg-rose-50 transition-all active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              Reset Progress
            </button>
          </div>

          {/* Import Section */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-stone-500 block">Import Backup Key:</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste backup hash key here..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="flex-1 px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900 bg-white text-stone-800"
              />
              <button
                onClick={handleImportSubmit}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 active:scale-95 transition-all"
              >
                Import
              </button>
            </div>
            {importStatus === 'success' && (
              <p className="text-[10px] text-emerald-600 font-bold">✓ Progress restored successfully!</p>
            )}
            {importStatus === 'error' && (
              <p className="text-[10px] text-rose-600 font-bold">✗ Invalid save hash key. Try again.</p>
            )}
          </div>
        </div>

        {/* Action Close */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="px-6 py-2.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700 transition-all"
          >
            Close Settings
          </button>
        </div>

        {/* Confirm Reset Alert Overlay */}
        <AnimatePresence>
          {showConfirmReset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/95 rounded-3xl flex flex-col items-center justify-center p-6 text-center z-10"
            >
              <AlertTriangle className="w-12 h-12 text-rose-500 animate-bounce mb-3" />
              <h4 className="text-lg font-bold text-stone-900">Erase Save Data?</h4>
              <p className="text-xs text-stone-400 max-w-xs mt-1 leading-relaxed">
                This will permanently delete all Draco levels, coins, upgrades, and inventory. This cannot be undone.
              </p>
              <div className="flex gap-3 mt-6 w-full max-w-xs">
                <button
                  onClick={handleResetSubmit}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Yes, Erase
                </button>
                <button
                  onClick={() => {
                    soundService.playClick();
                    setShowConfirmReset(false);
                  }}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all border border-stone-200"
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
