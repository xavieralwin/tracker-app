import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id: taskId } = await params;
        const token = (await cookies()).get('tracker_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        
        const user = verifyToken(token) as any;
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.taskRecord.delete({
            where: { id: taskId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
}
