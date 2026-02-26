import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const token = (await cookies()).get('tracker_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        
        const user = verifyToken(token) as any;
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const whereClause = user.role === 'ADMIN' ? {} : { userId: user.id };

        const tasks = await prisma.taskRecord.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get('tracker_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        
        const user = verifyToken(token) as any;
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();

        // Parse dates if they are provided as strings
        const raisedDate = body.raisedDate ? new Date(body.raisedDate) : null;
        const startDate = body.startDate ? new Date(body.startDate) : null;
        const deliveredDate = body.deliveredDate ? new Date(body.deliveredDate) : null;

        const newTask = await prisma.taskRecord.create({
            data: {
                market: body.market,
                almTaskNumber: body.almTaskNumber,
                resourceName: body.resourceName,
                wmrDescription: body.wmrDescription,
                raisedDate,
                startDate,
                deliveredDate,
                slaBreach: body.slaBreach,
                type: body.type,
                tool: body.tool,
                pageCategory: body.pageCategory,
                existingNewPage: body.existingNewPage,
                noOfIterations: body.noOfIterations,
                jobType: body.jobType,
                changesCountEfforts: body.changesCountEfforts,
                qcStatus: body.qcStatus,
                currentStatus: body.currentStatus,
                userId: user.id // Tie task to the logged in user
            }
        });
        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}
