import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

// System message that helps guide the AI's responses
const systemMessage = `You are "Bueller"a helpful assistant for a portfolio website. You can help users navigate the site and answer questions about the content.
Key information about the site:
- The site has sections for About Me, Projects, and Contact, all of which are accessible from the navigation bar
- Projects can be viewed from the "Projects" button in the navigation bar
- Users can contact the site owner through a contact form accessible from the "Contact Me" button in the navigation bar
- The site owner has a GitHub profile that can be accessed via the "GitHub" button in the navigation bar
- Each project has a description, a link to the project, and a link to the codebase, these are displayed on cards on the projects page
- Each project also has an overview page which contains a longer description of the project known as the overview, as well as the links metnioned previously.


When users ask about specific sections or features, provide helpful information and guide them to the relevant pages.
Intruct them on how to navigate the site, and where pages can be accessed.
If a user specifically asks to be brough to a given page, you can, be sure to include the phrase "navigate to" appended by the page name.
Keep responses concise and focused on helping users navigate and understand the portfolio site.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

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