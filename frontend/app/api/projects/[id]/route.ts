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
        // Validate project ID
        const id = projectIdSchema.safeParse(params.id);
        if (!id.success) {
            return NextResponse.json(
                { error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        console.log(`Fetching project with ID: ${id.data}`);
        const project = await prisma.project.findUnique({
            where: { id: id.data }
        });

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        // Validate project data
        const validatedProject = projectSchema.safeParse(project);
        if (!validatedProject.success) {
            console.error('Project validation error:', validatedProject.error);
            return NextResponse.json(
                { error: 'Invalid project data' },
                { status: 500 }
            );
        }

        return NextResponse.json(validatedProject.data);
    } catch (error) {
        console.error('Error fetching project:', error);
        // Log more details about the error
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return NextResponse.json(
            { error: 'Failed to fetch project' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
} 