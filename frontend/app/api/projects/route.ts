import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { projectSchema, type Project } from '@/lib/validation';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);

// Set runtime to Node.js
export const runtime = 'nodejs';

export async function GET() {
    try {
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
            ORDER BY id DESC
        `;

        if (!projects || projects.length === 0) {
            return NextResponse.json({ projects: [] });
        }

        // Validate each project
        const validatedProjects = projects.map((project: unknown) => {
            const validationResult = projectSchema.safeParse(project);
            if (!validationResult.success) {
                console.warn('Project validation failed:', validationResult.error);
                return null;
            }
            return validationResult.data;
        }).filter((project): project is Project => project !== null);

        return NextResponse.json({ projects: validatedProjects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const project = await sql`
            INSERT INTO "Project" (name, status, "overviewText", description, "overviewImage1", "overviewImage2", "overviewImage3", link, "gitHubLink")
            VALUES (${body.name}, ${body.status}, ${body.overviewText}, ${body.description}, ${body.overviewImage1}, ${body.overviewImage2}, ${body.overviewImage3}, ${body.link}, ${body.gitHubLink})
            RETURNING id, name, status, "overviewText", description, "overviewImage1", "overviewImage2", "overviewImage3", link, "gitHubLink"
        `;
        return NextResponse.json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}