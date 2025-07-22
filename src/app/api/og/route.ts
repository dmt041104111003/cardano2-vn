
export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response('Not found', { status: 404 });
} 