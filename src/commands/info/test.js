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
async function main(promt) {
  const completion = await openai.chat.completions.create({
    model: "qwen/qwen3-coder:free",
    messages: [
      {
        "role": "user",
        "content": promt
      }
    ],
    
  });

  console.log(completion.choices[0].message);
}


export default {
  name: 'ask',
  args: { prompt: 'string' },
  handler: async (client, message, args) => {
    try {
        if (message.Author.ID !== 1111) await message.reply(`False: `);

        const response = await main(args.prompt);

        await message.reply(`True: ${response}`);
    } catch (error) {
      console.error('Error in ask command:', error);
    }
  }
};