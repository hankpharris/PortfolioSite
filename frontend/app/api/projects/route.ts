import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { projectSchema } from '@/lib/validation';

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
            return new NextResponse(
                JSON.stringify({ error: 'Database configuration error' }), 
                { 
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        console.log('Fetching all projects...');
        const projects = await prisma.project.findMany();
        console.log(`Found ${projects.length} projects`);

        // Validate each project
        const validatedProjects = projects.map(project => {
            try {
                return projectSchema.parse(project);
            } catch (error) {
                console.error('Project validation error:', error);
                return null;
            }
        }).filter(Boolean);

        return new NextResponse(
            JSON.stringify(validatedProjects),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error('Error fetching projects:', error);
        // Log more details about the error
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch projects' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
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