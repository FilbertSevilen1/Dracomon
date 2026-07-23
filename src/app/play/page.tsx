'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGameState } from '../../hooks/useGameState';
import { GameScreen } from '../../components/GameScreen';
import { InventoryModal } from '../../components/InventoryModal';
import { SettingsModal } from '../../components/SettingsModal';
import { soundService } from '../../services/sound';

function PlayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    saveData,
    currentStage,
    setCurrentStage,
    collectCoins,
    collectItem,
    handleEnemyDefeated,
    markStageCleared,
    usePotion,
    useUpgradeStone,
    buyItem,
    updateSettings,
    resetGameSave,
    exportSave,
    importSave,
  } = useGameState();

  const activePotionCount = saveData.inventory.find(i => i.id === 'potion')?.quantity || 0;

  const [showInventory, setShowInventory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const stageParam = searchParams.get('stage');
    if (stageParam) {
      const parsed = parseInt(stageParam, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 11) {
        setCurrentStage(parsed);
      }
    }
  }, [searchParams, setCurrentStage]);

  return (
    <div className="w-screen h-screen bg-stone-950 flex flex-col justify-center items-center overflow-hidden select-none relative">
      <div className="w-full h-full relative overflow-hidden bg-stone-950 flex flex-col">
        <GameScreen
          saveData={saveData}
          stageNum={currentStage}
          onCoinCollect={collectCoins}
          onItemCollect={collectItem}
          onEnemyDefeat={handleEnemyDefeated}
          onStageClear={() => markStageCleared(currentStage)}
          onNextLevel={() => {
            markStageCleared(currentStage);
            setCurrentStage(Math.min(currentStage + 1, 11));
          }}
          onQuit={() => {
            soundService.playClick();
            router.push('/maps');
          }}
          openSettings={() => setShowSettings(true)}
          openInventory={() => setShowInventory(true)}
          activePotionCount={activePotionCount}
          onUsePotion={usePotion}
        />
      </div>

      {}
      {showInventory && (
        <InventoryModal
          saveData={saveData}
          onUsePotion={usePotion}
          onUseUpgradeStone={useUpgradeStone}
          onBuyItem={buyItem}
          onClose={() => setShowInventory(false)}
        />
      )}

      {}
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
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={
      <div className="w-screen h-screen bg-stone-950 flex items-center justify-center text-amber-400 font-mono font-bold text-sm">
        <span>LOADING DRACOMON RPG... 🐉⚡</span>
      </div>
    }>
      <PlayContent />
    </Suspense>
  );
}
