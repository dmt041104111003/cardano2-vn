import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { withAdmin } from "~/lib/api-wrapper";

export const PUT = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  const { name, order } = await req.json();

  const tab = await prisma.tab.update({
    where: { id },
    data: {
      name,
      order
    }
  });

  return NextResponse.json({ tab });
});

export const DELETE = withAdmin(async (req) => {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  await prisma.member.updateMany({
    where: { tabId: id },
    data: { tabId: null }
  });

  await prisma.tab.delete({
    where: { id }
  });

  return NextResponse.json({ success: true });
});