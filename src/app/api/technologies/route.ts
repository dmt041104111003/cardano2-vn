import {  NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';

export async function GET() {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ technologies });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 