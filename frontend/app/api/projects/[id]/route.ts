import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { projectSchema, projectIdSchema } from '@/lib/validation';

// Initialize Prisma client
const prisma = new PrismaClient();

// Use Node.js runtime
export const runtime = 'nodejs';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            });
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
                        'Access-Control-Allow-Origin': '*',
                    },
                }
            );
        }

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
                        'Access-Control-Allow-Origin': '*',
                    },
                }
            );
        }

        // Validate project data
        const validatedProject = projectSchema.safeParse(project);
        if (!validatedProject.success) {
            console.error('Project validation error:', validatedProject.error);
            // Return the project data anyway, but with a warning
            return new NextResponse(
                JSON.stringify({
                    ...project,
                    validationWarning: 'Project data may not meet all validation requirements'
                }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
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
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (error) {
        console.error('Error fetching project:', error);
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