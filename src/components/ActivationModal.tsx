'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import { TierType } from '../types/game';

interface ActivationModalProps {
  activationTier: TierType | null;
  activationCodeInput: string;
  activationError: boolean;
  onCodeChange: (val: string) => void;
  onVerify: () => void;
  onClose: () => void;
}

export const ActivationModal: React.FC<ActivationModalProps> = ({
  activationTier,
  activationCodeInput,
  activationError,
  onCodeChange,
  onVerify,
  onClose,
}) => {
  if (!activationTier) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white border border-stone-200 rounded-[2rem] p-6 shadow-2xl space-y-5 text-center relative overflow-hidden"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-stone-900 font-display mt-2">
              Unlock {activationTier} Tier
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Please enter your membership activation code below to unlock premium features.
            </p>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-wider block">
              Activation Code
            </label>
            <input
              type="text"
              value={activationCodeInput}
              onChange={(e) => onCodeChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onVerify();
                }
              }}
              placeholder="e.g. dracoman_basic_tier"
              className={`w-full px-4 py-3 bg-stone-50 border rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                activationError
                  ? 'border-rose-300 focus:ring-rose-500/20 text-rose-600 focus:border-rose-300'
                  : 'border-stone-200 focus:border-amber-500 focus:ring-amber-500/20 text-stone-800'
              }`}
              autoFocus
            />
            {activationError && (
              <p className="text-[10px] font-bold text-rose-500 animate-pulse mt-1">
                Invalid activation code. Please try again.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl text-xs font-bold transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={onVerify}
              className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-2xl text-xs font-extrabold transition-all active:scale-95 shadow-md shadow-amber-500/10 hover:shadow-amber-500/25"
            >
              Unlock Tier
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
