import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = `${process.env.BACKEND_BASE_URL}/events/stream`;
    const apiKey = process.env.BACKEND_API_KEY;
    
    if (!apiKey) {
      return new Response('Backend API key not configured', { status: 500 });
    }
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    });
    
    if (!response.ok) {
      return new Response('Backend stream error', { status: response.status });
    }
    
    const stream = new ReadableStream({
      start(controller) {
        const reader = response.body?.getReader();
        
        if (!reader) {
          controller.close();
          return;
        }
        
        function pump(): Promise<void> {
          return reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            
            controller.enqueue(value);
            return pump();
          });
        }
        
        pump().catch(() => controller.close());
      },
    });
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
    
  } catch (error) {
    console.error('Event stream error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}