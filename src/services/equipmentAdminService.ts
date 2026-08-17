import { EquipmentItem, EquipmentSlot, EquipmentRarity } from '../data/equipment';
import { CraftingRecipe } from '../data/crafting';
import defaultEquipmentJson from '../data/equipment.json';
import defaultCraftingJson from '../data/crafting.json';

export class EquipmentAdminService {
  /**
   * Fetches the latest equipment and crafting data from the server / disk
   */
  async loadData(): Promise<{ equipment: EquipmentItem[]; craftingRecipes: CraftingRecipe[] }> {
    try {
      const res = await fetch('/api/admin/equipment', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.equipment)) {
          return {
            equipment: json.equipment,
            craftingRecipes: Array.isArray(json.craftingRecipes) ? json.craftingRecipes : []
          };
        }
      }
    } catch (err) {
      console.warn('Could not load equipment from /api/admin/equipment, falling back to bundled JSON', err);
    }

    return {
      equipment: defaultEquipmentJson as EquipmentItem[],
      craftingRecipes: defaultCraftingJson as CraftingRecipe[]
    };
  }

  /**
   * Persists equipment and crafting recipes to server disk via /api/admin/equipment
   */
  async saveToRepo(
    equipment: EquipmentItem[],
    craftingRecipes: CraftingRecipe[]
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipment, craftingRecipes })
      });

      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error saving equipment' };
    }
  }

  /**
   * Downloads the equipment and crafting JSON directly in the browser
   */
  downloadJson(equipment: EquipmentItem[], craftingRecipes: CraftingRecipe[]) {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ equipment, craftingRecipes }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dracoman_equipment_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
}

export const equipmentAdminService = new EquipmentAdminService();
