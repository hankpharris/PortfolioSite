import { neon } from '@neondatabase/serverless';
import { StatusEnum, projectSchema, Project } from './validation';

// Validate required environment variables
const requiredEnvVars = {
    DATABASE_URL: process.env.DATABASE_URL
} as const;

// Check for missing environment variables
const missingEnvVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

if (missingEnvVars.length > 0) {
    throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(', ')}. ` +
        'Please check your .env file and ensure all required variables are set.'
    );
}

// Type assertion after validation
const DATABASE_URL = requiredEnvVars.DATABASE_URL as string;

export async function getProject(id: string): Promise<Project | null> {
    try {
        console.log('Fetching project with ID:', id);
        const sql = neon(DATABASE_URL);
        const result = await sql`
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
            WHERE id = ${parseInt(id)}
        `;
        
        console.log('Query result:', result);
        
        if (!result || result.length === 0) {
            console.log('No project found with ID:', id);
            return null;
        }

        const project = result[0];
        console.log('Raw project data:', project);

        // Validate the project data
        const validatedProject = projectSchema.parse(project);
        console.log('Validated project:', validatedProject);

        return validatedProject;
    } catch (error) {
        console.error('Error in getProject:', error);
        return null;
    }
}

export async function getProjects(): Promise<Project[]> {
    try {
        console.log('Fetching all projects');
        const sql = neon(DATABASE_URL);
        const result = await sql`
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
        
        console.log('Query result:', result);
        
        if (!result || result.length === 0) {
            console.log('No projects found');
            return [];
        }

        // Validate each project
        const validatedProjects = result
            .map(project => {
                try {
                    return projectSchema.parse(project);
                } catch (error) {
                    console.error('Error validating project:', project, error);
                    return null;
                }
            })
            .filter((project): project is Project => project !== null);

        console.log('Validated projects:', validatedProjects);
        return validatedProjects;
    } catch (error) {
        console.error('Error in getProjects:', error);
        return [];
    }
}

export async function updateProject(id: number, data: Partial<Project>) {
    const sql = neon(DATABASE_URL);
    const projects = await sql`
        UPDATE "Project"
        SET 
            name = ${data.name},
            status = ${data.status},
            "overviewText" = ${data.overviewText},
            description = ${data.description},
            "overviewImage1" = ${data.overviewImage1},
            "overviewImage2" = ${data.overviewImage2},
            "overviewImage3" = ${data.overviewImage3},
            link = ${data.link},
            "gitHubLink" = ${data.gitHubLink}
        WHERE id = ${id}
        RETURNING id, name, status, "overviewText", description, "overviewImage1", "overviewImage2", "overviewImage3", link, "gitHubLink"
    `;

    if (!projects || projects.length === 0) {
        throw new Error('Project not found');
    }

    const project = projects[0];
    const validationResult = projectSchema.safeParse(project);
    
    if (!validationResult.success) {
        console.warn('Project validation failed:', validationResult.error);
        throw new Error('Invalid project data');
    }

    return validationResult.data;
} 