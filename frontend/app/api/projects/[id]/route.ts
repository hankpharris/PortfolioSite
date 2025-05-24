import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { projectSchema, projectIdSchema } from '@/lib/validation';

// Initialize Prisma client
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

        // Validate project ID
        const id = projectIdSchema.safeParse(params.id);
        if (!id.success) {
            return new NextResponse(
                JSON.stringify({ error: 'Invalid project ID' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        console.log(`Fetching project with ID: ${id.data}`);
        const project = await prisma.project.findUnique({
            where: { id: id.data }
        });

        if (!project) {
            return new NextResponse(
                JSON.stringify({ error: 'Project not found' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // Validate project data
        const validatedProject = projectSchema.safeParse(project);
        if (!validatedProject.success) {
            console.error('Project validation error:', validatedProject.error);
            return new NextResponse(
                JSON.stringify({ error: 'Invalid project data' }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        return new NextResponse(
            JSON.stringify(validatedProject.data),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error('Error fetching project:', error);
        // Log more details about the error
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch project' }),
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