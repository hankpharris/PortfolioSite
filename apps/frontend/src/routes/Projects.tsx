import { useEffect, useState } from "react";
import { Project } from "database";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ProjectLinkButton, ProjectGitHubButton, ProjectDetailsButton, ButtonContainer } from "@/components/buttons/ProjectButtons";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const formatStatus = (status: string) => {
    return status.replace(/([A-Z])/g, ' $1').trim();
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched projects:", data);
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative">
      <AnimatedBackground />
      <Header />
      <div className="flex-grow flex items-center justify-center py-8">
        <div className="container max-w-7xl mx-6 px-4 py-8 bg-white/30 rounded-xl shadow-lg backdrop-blur-md relative z-10">
          <h1 className="text-4xl font-bold mb-8 text-center text-black drop-shadow-lg">My Projects</h1>
          <div className="overflow-x-auto px-4 py-2">
            <table className="min-w-full bg-white/80 border border-gray-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 border-b text-left">Name</th>
                  <th className="px-6 py-3 border-b text-left">Status</th>
                  <th className="px-6 py-3 border-b text-left">Description</th>
                  <th className="px-6 py-3 border-b text-left">Links</th>
                  <th className="px-6 py-3 border-b text-left">Overviews</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">{project.name}</td>
                    <td className="px-6 py-4 border-b">{formatStatus(project.status)}</td>
                    <td className="px-6 py-4 border-b">{project.description || "No description"}</td>
                    <td className="px-6 py-4 border-b">
                      <ButtonContainer>
                        {project.link && (
                          <ProjectLinkButton href={project.link}>
                            Link
                          </ProjectLinkButton>
                        )}
                        {project.gitHubLink && (
                          <ProjectGitHubButton href={project.gitHubLink}>
                            GitHub
                          </ProjectGitHubButton>
                        )}
                      </ButtonContainer>
                    </td>
                    <td className="px-6 py-4 border-b">
                      <ProjectDetailsButton to={`/projects/${project.id}`}>
                        Details
                      </ProjectDetailsButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects; 