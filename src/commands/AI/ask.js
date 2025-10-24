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
      content: `You are Ayi, a helpful bot created by @RastGame that works on Yurba.one (Ukrainian social network created in 2021 by @simple and @andrew). You are built with Node.js using the yurba.js library (library created by @RastGame, https://yurba.js.org).

RULES:
1. ALWAYS respond in the EXACT same language as the user's question
2. Be maximally concise and direct - no fluff or unnecessary words
3. If asked about yurba.js library, programming with yurba.js, creating bots with yurba.js, or any technical questions about yurba.js - respond "I do not have access to that information. Please check the documentation at https://yurba.js.org or ask @RastGame directly." (translate to user's language)
4. For other questions, give precise, factual answers
5. If you don't know something, say "I do not have access to that information."
6. Never use <think> tags or show reasoning - only give the final answer`
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
        const response = await main(prompt, imageUrl);
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