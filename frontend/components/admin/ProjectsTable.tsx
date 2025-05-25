'use client';

import { useState } from 'react';
import { Status } from '@/lib/validation';

interface Project {
    id: number;
    name: string;
    status: Status;
    overviewText: string | null;
    description: string | null;
    overviewImage1: string | null;
    overviewImage2: string | null;
    overviewImage3: string | null;
    link: string | null;
    gitHubLink: string | null;
}

interface ProjectsTableProps {
    initialProjects: Project[];
}

export function ProjectsTable({ initialProjects }: ProjectsTableProps) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedProject, setEditedProject] = useState<Project | null>(null);

    const handleEdit = (project: Project) => {
        setEditingId(project.id);
        setEditedProject({ ...project });
    };

    const handleSave = async (projectId: number) => {
        if (!editedProject) return;

        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedProject),
            });

            if (!response.ok) throw new Error('Failed to update project');

            setProjects(projects.map(p => 
                p.id === projectId ? editedProject : p
            ));
            setEditingId(null);
            setEditedProject(null);
        } catch (error) {
            console.error('Error updating project:', error);
            // TODO: Add error handling UI
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditedProject(null);
    };

    const handleChange = (field: keyof Project, value: string) => {
        if (!editedProject) return;
        setEditedProject({ ...editedProject, [field]: value });
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Overview</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Images</th>
                        <th className="px-4 py-2">Links</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id} className="border-t dark:border-gray-700">
                            <td className="px-4 py-2">
                                {editingId === project.id ? (
                                    <input
                                        type="text"
                                        value={editedProject?.name || ''}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    />
                                ) : (
                                    project.name
                                )}
                            </td>
                            <td className="px-4 py-2">
                                {editingId === project.id ? (
                                    <select
                                        value={editedProject?.status || ''}
                                        onChange={(e) => handleChange('status', e.target.value)}
                                        className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    >
                                        <option value="InProgress">In Progress</option>
                                        <option value="CompleteMaintained">Complete (Maintained)</option>
                                        <option value="CompleteUnmaintained">Complete (Unmaintained)</option>
                                        <option value="Planned">Planned</option>
                                    </select>
                                ) : (
                                    project.status
                                )}
                            </td>
                            <td className="px-4 py-2 max-w-xs">
                                {editingId === project.id ? (
                                    <textarea
                                        value={editedProject?.overviewText || ''}
                                        onChange={(e) => handleChange('overviewText', e.target.value)}
                                        className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        rows={3}
                                    />
                                ) : (
                                    <div className="truncate">{project.overviewText}</div>
                                )}
                            </td>
                            <td className="px-4 py-2 max-w-xs">
                                {editingId === project.id ? (
                                    <textarea
                                        value={editedProject?.description || ''}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        rows={3}
                                    />
                                ) : (
                                    <div className="truncate">{project.description}</div>
                                )}
                            </td>
                            <td className="px-4 py-2">
                                {editingId === project.id ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={editedProject?.overviewImage1 || ''}
                                            onChange={(e) => handleChange('overviewImage1', e.target.value)}
                                            placeholder="Image 1 URL"
                                            className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <input
                                            type="text"
                                            value={editedProject?.overviewImage2 || ''}
                                            onChange={(e) => handleChange('overviewImage2', e.target.value)}
                                            placeholder="Image 2 URL"
                                            className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <input
                                            type="text"
                                            value={editedProject?.overviewImage3 || ''}
                                            onChange={(e) => handleChange('overviewImage3', e.target.value)}
                                            placeholder="Image 3 URL"
                                            className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {project.overviewImage1 && <div className="truncate">Image 1: ✓</div>}
                                        {project.overviewImage2 && <div className="truncate">Image 2: ✓</div>}
                                        {project.overviewImage3 && <div className="truncate">Image 3: ✓</div>}
                                    </div>
                                )}
                            </td>
                            <td className="px-4 py-2">
                                {editingId === project.id ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={editedProject?.link || ''}
                                            onChange={(e) => handleChange('link', e.target.value)}
                                            placeholder="Project URL"
                                            className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <input
                                            type="text"
                                            value={editedProject?.gitHubLink || ''}
                                            onChange={(e) => handleChange('gitHubLink', e.target.value)}
                                            placeholder="GitHub URL"
                                            className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {project.link && <div className="truncate">Project: ✓</div>}
                                        {project.gitHubLink && <div className="truncate">GitHub: ✓</div>}
                                    </div>
                                )}
                            </td>
                            <td className="px-4 py-2">
                                {editingId === project.id ? (
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => handleSave(project.id)}
                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 