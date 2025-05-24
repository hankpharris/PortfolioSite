import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from root .env
config({ path: resolve(process.cwd(), '../../../.env') });

const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
});

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Log the database URL (with sensitive parts redacted)
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            console.error('DATABASE_URL is not set');
            return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
        }

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
        // Log more details about the error
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
} 