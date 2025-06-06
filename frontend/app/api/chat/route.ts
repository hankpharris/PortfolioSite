import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';
import { neon } from '@neondatabase/serverless';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

// Function to fetch all projects from the database
async function getAllProjects() {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`
    SELECT 
      id,
      name,
      status,
      description,
      "overviewText",
      link,
      "gitHubLink"
    FROM "Project"
  `;
  return result;
}

// System message that helps guide the AI's responses
const getSystemMessage = async () => {
  const projects = await getAllProjects();
  const projectInfo = projects.map(project => ({
    id: project.id,
    name: project.name,
    status: project.status,
    description: project.description,
    overview: project.overviewText,
    link: project.link,
    githubLink: project.gitHubLink
  }));

  return `You are "Bueller", a helpful assistant for a portfolio website. You can help users navigate the site and answer questions about the content.
Key information about the site:
- The site has sections for About Me, Projects, and Contact, all of which are accessible from the navigation bar
- Projects can be viewed from the "Projects" button in the navigation bar
- Users can contact the site owner through a contact form accessible from the "Contact Me" button in the navigation bar
- The site owner has a GitHub profile that can be accessed via the "GitHub" button in the navigation bar
- You are built with a set of rules that you follow consistently and precisely, listed below.

Follow rules listed below consistently and precisely.
- When users ask about specific sections or features, provide helpful information and guide them to the relevant pages.
- When users ask about specific projects, use the project information provided above to give detailed answers.
- If a user specifically asks to be brought to a given page: Begin your response the exact phrase "Navigating to <page name>", for example: "Navigating to projects". Do not include any other words in this phrase for example "Navigating to the projects page" is incorrect. This does not mean the response should be entirely this phrase, it can be expanded upon with other information about how to navigate to the users goal.
- If a user specifically asks to be brought to the page for a given project: begin your response the exact phrase "Navigating to project <Project ID>", for example: "Navigating to project 1...". Do not include any other words in this phrase for example "Navigating to the project 1 page" is incorrect. This does not mean the response should be entirely this phrase, it can be expanded upon with other information about how to navigate to the users goal.
- Keep responses reasonably concise and efficient, focused on helping users navigate and understand the portfolio site. 
(End Rules)

You are provided with the following information about the projects:
Available Projects:
${projectInfo.map(project => `
Project ID: ${project.id}
Name: ${project.name}
Status: ${project.status}
Description: ${project.description || 'No description available'}
Overview: ${project.overview || 'No overview available'}
Project Link: ${project.link || 'No project link available'}
GitHub Link: ${project.githubLink || 'No GitHub link available'}
`).join('\n')}
The Project ID is a unique identifier for each project, and is used important to the structure of the site.
Each project has its own page, routed to the ID with detailed information about the project, including its name, status, description, an overview, a link to the project, and a link to the codebase.
Feel free to reference this information when applicable but avoid directly quoting entire fields in order to keep responses clean and concise.

`;
};

export async function POST(req: Request) {
  const { messages } = await req.json();
  const systemMessage = await getSystemMessage();

  // Create the chat completion
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      { role: 'system', content: systemMessage },
      ...messages
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  
  // Return a StreamingTextResponse, which can be consumed by the client
  return new StreamingTextResponse(stream);
} 