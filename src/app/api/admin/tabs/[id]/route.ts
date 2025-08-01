import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, color, order } = await request.json();

    const tab = await prisma.tab.update({
      where: { id: params.id },
      data: {
        name,
        description,
        color,
        order
      }
    });

    return NextResponse.json({ tab });
  } catch (error) {
    console.error('Error updating tab:', error);
    return NextResponse.json(
      { error: 'Failed to update tab' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.member.updateMany({
      where: { tabId: params.id },
      data: { tabId: null }
    });

    await prisma.tab.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tab:', error);
    return NextResponse.json(
      { error: 'Failed to delete tab' },
      { status: 500 }
    );
  }
} 