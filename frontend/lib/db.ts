import { neon } from '@neondatabase/serverless';
import { projectSchema, type Project } from './validation';

const sql = neon(process.env.DATABASE_URL!);

export async function getProject(id: string): Promise<Project | null> {
    try {
        console.log('Fetching project with ID:', id);
        const result = await sql`
            SELECT * FROM "Project" 
            WHERE id = ${parseInt(id)}
            LIMIT 1
        `;
        
        console.log('Raw project result:', result);
        
        if (!result || result.length === 0) {
            console.log('No project found');
            return null;
        }

        const validation = projectSchema.safeParse(result[0]);
        if (!validation.success) {
            console.error('Project validation failed:', validation.error);
            return null;
        }

        console.log('Validated project:', validation.data);
        return validation.data;
    } catch (error) {
        console.error('Error fetching project:', error);
        return null;
    }
}

export async function getProjects(): Promise<(Project & { validationWarning?: boolean })[]> {
    try {
        console.log('Fetching all projects');
        const result = await sql`
            SELECT * FROM "Project"
            ORDER BY "createdAt" DESC
        `;

        console.log('Raw projects result:', result);

        const validatedProjects = result.map((project: any) => {
            const validation = projectSchema.safeParse(project);
            if (!validation.success) {
                console.error('Project validation failed:', validation.error);
                return { ...project, validationWarning: true };
            }
            return validation.data;
        });

        console.log('Validated projects:', validatedProjects);
        return validatedProjects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
} 