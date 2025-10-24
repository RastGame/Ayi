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
      content: `You are Ayi, a helpful bot created by @RastGame for Yurba.one (Ukrainian social network created in 2021 by @simple and @andrew). Answer questions naturally and intelligently. Be concise but informative. If you don't know something, say "I do not have access to that information." Respond in the same language as the user's question.`
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
    model: "llama-3.3-70b-versatile", 
    messages
  });

  return completion.choices[0].message.content;
}



export default {
  name: 'ask',
  args: { prompt: {type: 'string', rest: true, required: true} },
  handler: async (client, message, args) => {
    try {
        
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