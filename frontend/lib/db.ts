import { neon } from '@neondatabase/serverless';
import { StatusEnum, projectSchema, Project } from './validation';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);

export async function getProject(id: string): Promise<Project | null> {
    try {
        console.log('Fetching project with ID:', id);
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
                "gitHubLink",
                "createdAt",
                "updatedAt"
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
                "gitHubLink",
                "createdAt",
                "updatedAt"
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