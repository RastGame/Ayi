import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_TOKEN,
});

async function main(prompt, imageUrl = null) {
  const messages = [
    {
      role: "system",
      content: `You are Ayi, a bot in the social network Yurba, created by @rastgame using the yurba.js library.

RULES:
1. ALWAYS respond in the EXACT same language as the user's question
2. Be maximally concise and direct - no fluff or unnecessary words
3. If asked about yurba.js library, programming with yurba.js, creating bots with yurba.js, or any technical questions about yurba.js - respond "I do not have access to that information. Please check the documentation at https://yurba.js.org or ask @RastGame directly." (translate to user's language)
4. For other questions, give precise, factual answers
5. If you don't know something, say "I do not have access to that information."
6. Never introduce yourself unless specifically asked "who are you" or similar questions
7. ALWAYS use formatting: [text](url) for links, **text** for bold, *text* for italic, ^^^text^^^ for quotes. Make responses visually appealing with proper formatting`
    }
  ];

  
  const content = [{ type: "text", text: prompt }];
  
  if (imageUrl) {
    content.push({
      type: "image_url",
      image_url: { url: imageUrl }
    });
  }
  
  messages.push({ role: "user", content });

  const completion = await groq.chat.completions.create({
    model: "qwen/qwen3-32b", 
    messages
  });

  return completion.choices[0].message.content;
}



export default {
  name: 'ask',
  args: { prompt: {type: 'string', rest: true, required: true} },
  handler: async (client, message, args) => {
    try {
        client.typing(message.Dialog.ID);

        let prompt = args.prompt;
        let imageUrl = null;
        
        if (message.Photos && message.Photos.length > 0) {
          imageUrl = `https://cdn.yurba.one/photos/${message.Photos[0]}.jpg`;
        }

        if (!prompt) {
          return await message.reply('Please provide a prompt. Usage: !ask <your question>');
        }
        
        console.log('Prompt:', prompt);
        let response = await main(prompt, imageUrl);
        
        // Remove <think> tags and content
        response = response.replace(/<think>.*?<\/think>/gs, '').trim();
        
        await message.reply(`${response}`);
    } catch (error) {
      if (error.status === 429) {
        await message.reply('Ліміт.');
      } else {
        await message.reply('An error occurred while processing your request.');
      }
      console.error('Error in ask command:', error);
    }
  }
};