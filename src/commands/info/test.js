import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.AI_TOKEN,
  defaultHeaders: {
    "HTTP-Referer": "https://ani.pp.ua",
    "X-Title": "https://ani.pp.ua",
  },
});

async function main(prompt, imageUrl = null) {
  const content = [{ type: "text", text: prompt }];
  
  if (imageUrl) {
    content.push({
      type: "image_url",
      image_url: { url: imageUrl }
    });
  }

  const completion = await openai.chat.completions.create({
    model: "mistralai/mistral-small-3.2-24b-instruct:free",
    messages: [{ role: "user", content }]
  });

  return completion.choices[0].message.content;
}



export default {
  name: 'ask',
  args: { prompt: {type: 'string', rest: true, required: true} },
  handler: async (client, message, args) => {
    try {
        if (message.Author.ID !== 1111) return await message.reply(`Access denied`);
        
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
        await message.reply('API rate limit exceeded. Please try again later.');
      } else {
        await message.reply('An error occurred while processing your request.');
      }
      console.error('Error in ask command:', error);
    }
  }
};