import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { projectSchema } from '@/lib/validation';

// Initialize Prisma client
const prisma = new PrismaClient();

// Set runtime to Node.js
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
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            });
        }

        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
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

        console.log('Fetching project with ID:', id);

        const project = await prisma.project.findUnique({
            where: { id },
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
        const validationResult = projectSchema.safeParse(project);
        if (!validationResult.success) {
            console.warn('Project validation failed:', validationResult.error);
            return new NextResponse(
                JSON.stringify({
                    ...project,
                    validationWarning: true,
                    validationErrors: validationResult.error.errors,
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

        return new NextResponse(JSON.stringify(project), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Error in GET /api/projects/[id]:', error);
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