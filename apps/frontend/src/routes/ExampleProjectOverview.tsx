import React, { useEffect, useState } from "react";
import { ProjectOverview } from "@/components/ProjectOverview";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Header } from "@/components/Header";
import { useParams } from "react-router-dom";

const ExampleProjectOverview = () => {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error || !project) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error || "Project not found"}</div>;
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative">
      <AnimatedBackground />
      <Header />
      <div className="flex-grow flex items-center justify-center py-8">
        <ProjectOverview
          title={project.name}
          overview={project.overviewText || "No overview available."}
          overviewImage1={project.overviewImage1 ? `/images/${project.overviewImage1}` : undefined}
          overviewImage2={project.overviewImage2 ? `/images/${project.overviewImage2}` : undefined}
          overviewImage3={project.overviewImage3 ? `/images/${project.overviewImage3}` : undefined}
          link={project.link}
          gitHubLink={project.gitHubLink}
        />
      </div>
    </div>
  );
};

export default ExampleProjectOverview; 