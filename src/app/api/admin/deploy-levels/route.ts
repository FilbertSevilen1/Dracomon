import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import levelsData from '@/game/levels.json';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { worlds } = body;

    if (!worlds || !Array.isArray(worlds)) {
      return NextResponse.json({ success: false, error: 'Invalid worlds array provided.' }, { status: 400 });
    }

    const updatedData = {
      themes: levelsData.themes,
      worlds: worlds
    };

    const filePath = path.join(process.cwd(), 'src', 'game', 'levels.json');
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Successfully deployed custom levels to src/game/levels.json!'
    });
  } catch (error: any) {
    console.error('Failed to deploy levels to repository:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to write levels.json to server disk.'
    }, { status: 500 });
  }
}
