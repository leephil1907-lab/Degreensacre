import { NextResponse } from 'next/server';

export async function GET() {
  // Quick search widget is static — no DB needed, but we provide a payload for Adaptive Card
  return NextResponse.json({
    // The widget template uses Input.ChoiceSet, so this endpoint just confirms availability
    available: true,
    states: ['Lagos', 'Abuja', 'Enugu', 'Akwa Ibom', 'Port Harcourt', 'Rivers', 'Delta'],
    types: ['sale', 'rent', 'land', 'commercial', 'short-let'],
    action: '/properties?source=widget-search',
  });
}
