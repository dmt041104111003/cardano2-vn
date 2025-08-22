import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { withAdmin } from '~/lib/api-wrapper';

export const PUT = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  const body = await req.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const existingLocation = await prisma.eventLocation.findFirst({
    where: {
      name,
      id: { not: id }
    }
  });

  if (existingLocation) {
    return NextResponse.json({ error: 'Location name already exists' }, { status: 400 });
  }

  const updatedLocation = await prisma.eventLocation.update({
    where: { id },
    data: { name }
  });

  return NextResponse.json(updatedLocation);
});

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  await prisma.eventLocation.delete({
    where: { id }
  });

  return NextResponse.json({ success: true });
}); 