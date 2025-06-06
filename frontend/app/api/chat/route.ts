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

When users ask about specific sections or features, provide helpful information and guide them to the relevant pages.
When users ask about specific projects, use the project information provided above to give detailed answers.
If a user asks to see a specific project, you can navigate them to the project page using the project ID.
Instruct them on how to navigate the site, and where pages can be accessed.
If a user specifically asks to be brought to a given page, you can, be sure to include the phrase "navigate to" appended by the page name (route) directly, for example: "navigate to projects" or "navigate to /projects/1" for a specific project.
Keep responses concise and focused on helping users navigate and understand the portfolio site.`;
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