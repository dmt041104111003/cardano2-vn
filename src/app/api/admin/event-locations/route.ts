import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';
import { prisma } from '~/lib/prisma';

export async function GET() {
  try {
    const eventLocations = await prisma.eventLocation.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(eventLocations);
  } catch (error) {
    console.error('Error fetching event locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event locations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || typeof session !== 'object' || !('user' in session) || typeof session.user !== 'object' || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const sessionUser = session.user as { address?: string; email?: string };
    let currentUser = null;
    
    if (sessionUser.address) {
      currentUser = await prisma.user.findUnique({
        where: { wallet: sessionUser.address },
        include: { role: true },
      });
    } else if (sessionUser.email) {
      currentUser = await prisma.user.findUnique({
        where: { email: sessionUser.email },
        include: { role: true },
      });
    }
    
    if (!currentUser || !currentUser.role || String(currentUser.role.name).toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const existingLocation = await prisma.eventLocation.findUnique({
      where: { name }
    });

    if (existingLocation) {
      return NextResponse.json(
        { error: 'Event location with this name already exists' },
        { status: 400 }
      );
    }

    const maxOrder = await prisma.eventLocation.aggregate({
      _max: { order: true }
    });

    const newEventLocation = await prisma.eventLocation.create({
      data: {
        name,
        order: (maxOrder._max.order || 0) + 1
      }
    });

    return NextResponse.json(newEventLocation);
  } catch (error) {
    console.error('Error creating event location:', error);
    return NextResponse.json(
      { error: 'Failed to create event location' },
      { status: 500 }
    );
  }
} 