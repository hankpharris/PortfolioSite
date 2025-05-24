import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { projectSchema } from '@/lib/validation';

// Initialize Prisma client
const prisma = new PrismaClient();

// Set runtime to Node.js
export const runtime = 'nodejs';

export async function GET(request: Request) {
    try {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            });
        }

        console.log('Fetching all projects...');
        const projects = await prisma.project.findMany();
        console.log('Found', projects.length, 'projects');

        // Validate each project
        const validatedProjects = projects.map(project => {
            const validationResult = projectSchema.safeParse(project);
            if (!validationResult.success) {
                console.warn('Project validation failed:', validationResult.error);
                return {
                    ...project,
                    validationWarning: true,
                    validationErrors: validationResult.error.errors,
                };
            }
            return project;
        });

        return new NextResponse(JSON.stringify(validatedProjects), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Error in GET /api/projects:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Internal Server Error' }),
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