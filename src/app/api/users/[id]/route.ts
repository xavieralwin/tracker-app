import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id: userIdToDelete } = await params;
        const token = (await cookies()).get('tracker_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        
        const user = verifyToken(token) as any;
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Prevent self-deletion for safety
        if (userIdToDelete === user.id) {
            return NextResponse.json({ error: 'Cannot delete your own admin account' }, { status: 400 });
        }

        // Delete user's tasks first to satisfy foreign key constraints
        await prisma.taskRecord.deleteMany({
            where: { userId: userIdToDelete }
        });
        
        await prisma.user.delete({
            where: { id: userIdToDelete }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
