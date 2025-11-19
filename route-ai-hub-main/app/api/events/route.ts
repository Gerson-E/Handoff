import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    
    const backendUrl = `${process.env.BACKEND_BASE_URL}/events?limit=${limit}`;
    const apiKey = process.env.BACKEND_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Backend API key not configured' }, { status: 500 });
    }
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
    });
    
  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}