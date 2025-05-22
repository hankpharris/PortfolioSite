import React from "react";
import { ProjectLinkButton, ProjectGitHubButton, ButtonContainer } from "@/components/buttons/ProjectButtons";

interface ProjectOverviewProps {
  title: string;
  overview: string;
  overviewImage1?: string;
  overviewImage2?: string;
  overviewImage3?: string;
  link?: string;
  gitHubLink?: string;
  children?: React.ReactNode;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ 
  title, 
  overview, 
  overviewImage1, 
  overviewImage2, 
  overviewImage3,
  link,
  gitHubLink,
  children 
}) => {
  return (
    <div className="container max-w-3xl mx-auto my-8 px-8 py-12 bg-white/90 rounded-2xl shadow-2xl backdrop-blur-md relative z-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-black drop-shadow-lg">{title}</h1>
        <ButtonContainer>
          {link && (
            <ProjectLinkButton href={link}>
              Link
            </ProjectLinkButton>
          )}
          {gitHubLink && (
            <ProjectGitHubButton href={gitHubLink}>
              GitHub
            </ProjectGitHubButton>
          )}
        </ButtonContainer>
      </div>
      {overviewImage1 && (
        <img src={overviewImage1} alt="Overview 1" className="w-full max-h-96 object-contain rounded-lg mb-8 mx-auto" />
      )}
      <div className="text-lg text-gray-800 leading-relaxed whitespace-pre-line mb-8">
        {overview}
      </div>
      {overviewImage2 && (
        <img src={overviewImage2} alt="Overview 2" className="w-full max-h-96 object-contain rounded-lg mb-8 mx-auto" />
      )}
      {overviewImage3 && (
        <div className="w-full flex justify-center">
          <img src={overviewImage3} alt="Overview 3" className="w-2/3 max-h-96 object-contain rounded-lg mx-auto" />
        </div>
      )}
      {children}
    </div>
  );
}; 