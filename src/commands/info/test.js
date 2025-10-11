import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.AI_TOKEN,
  defaultHeaders: {
    "HTTP-Referer": "https://ani.pp.ua", // Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "https://ani.pp.ua", // Optional. Site title for rankings on openrouter.ai.
  },
});
async function main(prompt) {
  const completion = await openai.chat.completions.create({
    model: "qwen/qwen3-coder:free",
    messages: [
      {
        "role": "user",
        "content": prompt
      }
    ],
  });

  return completion.choices[0].message.content;
}


export default {
  name: 'ask',
  args: { prompt: 'string' },
  handler: async (client, message, args) => {
    try {
        if (message.Author.ID !== 1111) return await message.reply(`Access denied`);

        const response = await main(args.prompt);
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