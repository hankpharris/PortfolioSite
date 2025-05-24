import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
});

export async function GET() {
    try {
        // Log the database URL (with sensitive parts redacted)
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            console.error('DATABASE_URL is not set');
            return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
        }

        const projects = await prisma.project.findMany();
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        // Log more details about the error
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const project = await prisma.project.create({
            data: body
        });
        return NextResponse.json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}