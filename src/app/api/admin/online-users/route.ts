import { NextResponse } from 'next/server';
import { withAdmin } from '~/lib/api-wrapper';
import { createSuccessResponse, createErrorResponse } from '~/lib/api-response';

const NEXT_PUBLIC_WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:4001';

export const GET = withAdmin(async () => {
  try {
    const response = await fetch(`${NEXT_PUBLIC_WEBSOCKET_URL}/api/online-users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WebSocket server responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(createSuccessResponse(data));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse('Failed to fetch online users', 'WEBSOCKET_ERROR'),
      { status: 500 }
    );
  }
});
