import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';
import { prisma } from '~/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, image, isActive, order, title, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const existingCourse = await prisma.course.findFirst({
      where: {
        name,
        id: { not: id }
      }
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: 'Course with this name already exists' },
        { status: 400 }
      );
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        name,
        image,
        title,
        description,
        isActive: isActive !== undefined ? isActive : true,
        order: order !== undefined ? order : 0
      }
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deletedCourse = await prisma.course.update({
      where: { id },
      data: { isActive: false }
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
} 