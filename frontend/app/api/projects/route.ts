import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { projectSchema } from '@/lib/validation';

// Initialize Prisma client
const prisma = new PrismaClient();

// Use Node.js runtime
export const runtime = 'nodejs';

export async function GET() {
    try {
        console.log('Fetching all projects...');
        const projects = await prisma.project.findMany();
        console.log(`Found ${projects.length} projects`);

        // Validate each project
        const validatedProjects = projects.map(project => {
            const result = projectSchema.safeParse(project);
            if (!result.success) {
                console.error('Project validation error:', result.error);
                // Return the project data anyway, but with a warning
                return {
                    ...project,
                    validationWarning: 'Project data may not meet all validation requirements'
                };
            }
            return result.data;
        });

        return new NextResponse(
            JSON.stringify(validatedProjects),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (error) {
        console.error('Error fetching projects:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Internal server error' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
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