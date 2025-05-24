import { neon } from '@neondatabase/serverless';
import { projectSchema, type Project } from './validation';

const sql = neon(process.env.DATABASE_URL!);

export async function getProject(id: string): Promise<Project | null> {
    try {
        const result = await sql`
            SELECT * FROM "Project" 
            WHERE id = ${parseInt(id)}
            LIMIT 1
        `;
        
        if (!result || result.length === 0) {
            return null;
        }

        const validation = projectSchema.safeParse(result[0]);
        if (!validation.success) {
            console.error('Project validation failed:', validation.error);
            return null;
        }

        return validation.data;
    } catch (error) {
        console.error('Error fetching project:', error);
        return null;
    }
}

export async function getProjects(): Promise<(Project & { validationWarning?: boolean })[]> {
    try {
        const result = await sql`
            SELECT * FROM "Project"
            ORDER BY "createdAt" DESC
        `;

        return result.map((project: any) => {
            const validation = projectSchema.safeParse(project);
            if (!validation.success) {
                console.error('Project validation failed:', validation.error);
                return { ...project, validationWarning: true };
            }
            return validation.data;
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
} 