import { Project } from './validation';

export async function getProject(id: string): Promise<Project | null> {
    try {
        // Use absolute URL in production
        const baseUrl = typeof window !== 'undefined' 
            ? window.location.origin
            : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            
        const url = `${baseUrl}/api/projects/${id}`;
        console.log('Fetching project with ID:', id, 'from:', url);
        
        const res = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!res.ok) {
            if (res.status === 404) {
                return null;
            }
            const errorText = await res.text();
            console.error('API Error Response:', errorText);
            throw new Error(`Failed to fetch project: ${res.status} - ${errorText}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching project:', error);
        throw error;
    }
}

export async function getProjects(): Promise<Project[]> {
    try {
        // Use absolute URL in production
        const baseUrl = typeof window !== 'undefined'
            ? window.location.origin
            : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            
        const url = `${baseUrl}/api/projects`;
        console.log('Fetching from:', url);
        
        const res = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('API Error Response:', errorText);
            throw new Error(`Failed to fetch projects: ${res.status} - ${errorText}`);
        }
        
        const data = await res.json();
        if (!Array.isArray(data)) {
            throw new Error('Invalid response format');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
} 