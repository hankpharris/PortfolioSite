import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { projectSchema, type Project } from '@/lib/validation';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);

// Set runtime to Node.js
export const runtime = 'nodejs';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        const projects = await sql`
            SELECT 
                id,
                name,
                status,
                "overviewText",
                description,
                "overviewImage1",
                "overviewImage2",
                "overviewImage3",
                link,
                "gitHubLink"
            FROM "Project" 
            WHERE id = ${id}
        `;

        if (!projects || projects.length === 0) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        const project = projects[0];
        const validationResult = projectSchema.safeParse(project);
        
        if (!validationResult.success) {
            console.warn('Project validation failed:', validationResult.error);
            return NextResponse.json(
                { error: 'Invalid project data' },
                { status: 500 }
            );
        }

        return NextResponse.json(validationResult.data);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { error: 'Failed to fetch project' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const projects = await sql`
            UPDATE "Project"
            SET 
                name = ${body.name},
                status = ${body.status},
                "overviewText" = ${body.overviewText},
                description = ${body.description},
                "overviewImage1" = ${body.overviewImage1},
                "overviewImage2" = ${body.overviewImage2},
                "overviewImage3" = ${body.overviewImage3},
                link = ${body.link},
                "gitHubLink" = ${body.gitHubLink}
            WHERE id = ${id}
            RETURNING id, name, status, "overviewText", description, "overviewImage1", "overviewImage2", "overviewImage3", link, "gitHubLink"
        `;

        if (!projects || projects.length === 0) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        const project = projects[0];
        const validationResult = projectSchema.safeParse(project);
        
        if (!validationResult.success) {
            console.warn('Project validation failed:', validationResult.error);
            return NextResponse.json(
                { error: 'Invalid project data' },
                { status: 500 }
            );
        }

        return NextResponse.json(validationResult.data);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        const projects = await sql`
            DELETE FROM "Project"
            WHERE id = ${id}
            RETURNING id
        `;

        if (!projects || projects.length === 0) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
} 