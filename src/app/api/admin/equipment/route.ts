import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const equipmentPath = path.join(process.cwd(), 'src', 'data', 'equipment.json');
    const craftingPath = path.join(process.cwd(), 'src', 'data', 'crafting.json');

    const equipmentData = fs.existsSync(equipmentPath)
      ? JSON.parse(fs.readFileSync(equipmentPath, 'utf-8'))
      : [];

    const craftingData = fs.existsSync(craftingPath)
      ? JSON.parse(fs.readFileSync(craftingPath, 'utf-8'))
      : [];

    return NextResponse.json({
      success: true,
      equipment: equipmentData,
      craftingRecipes: craftingData
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to read equipment and crafting data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { equipment, craftingRecipes } = body;

    if (!Array.isArray(equipment)) {
      return NextResponse.json(
        { success: false, error: 'Invalid equipment payload: must be an array' },
        { status: 400 }
      );
    }

    const equipmentPath = path.join(process.cwd(), 'src', 'data', 'equipment.json');
    const craftingPath = path.join(process.cwd(), 'src', 'data', 'crafting.json');

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write formatted JSON files
    fs.writeFileSync(equipmentPath, JSON.stringify(equipment, null, 2) + '\n', 'utf-8');

    if (Array.isArray(craftingRecipes)) {
      fs.writeFileSync(craftingPath, JSON.stringify(craftingRecipes, null, 2) + '\n', 'utf-8');
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully updated equipment and crafting recipes JSON files on disk.',
      count: equipment.length,
      recipesCount: Array.isArray(craftingRecipes) ? craftingRecipes.length : 0
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to save equipment data to disk' },
      { status: 500 }
    );
  }
}
