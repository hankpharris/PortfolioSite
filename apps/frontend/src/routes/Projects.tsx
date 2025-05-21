import { useEffect, useState } from "react";
import { Project } from "database";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
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
    <div className="min-h-screen w-full flex flex-col items-center justify-between relative">
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-8 bg-white/30 rounded-xl shadow-lg backdrop-blur-md relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-center text-black drop-shadow-lg">My Projects</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/80 border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b text-left">Name</th>
                <th className="px-6 py-3 border-b text-left">Status</th>
                <th className="px-6 py-3 border-b text-left">Description</th>
                <th className="px-6 py-3 border-b text-left">Links</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{project.name}</td>
                  <td className="px-6 py-4 border-b">{project.status}</td>
                  <td className="px-6 py-4 border-b">{project.description || "No description"}</td>
                  <td className="px-6 py-4 border-b">
                    <div className="flex gap-2">
                      {project.overviewLink && (
                        <a
                          href={project.overviewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Overview
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Live
                        </a>
                      )}
                      {project.gitHubLink && (
                        <a
                          href={project.gitHubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Projects; 