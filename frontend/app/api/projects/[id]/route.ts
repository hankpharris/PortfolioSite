import { NextResponse } from 'next/server';
import { PrismaClient } from 'database';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from root .env
config({ path: resolve(process.cwd(), '../../.env') });

const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
});

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
        }

        const project = await prisma.project.findUnique({
            where: { id }
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
} 