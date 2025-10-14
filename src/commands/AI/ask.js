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
  const messages = [
    {
      role: "system",
      content: "You are Ayi, a calm and polite bot on Yurba.one, created by @RastGame using Node.js and Yurba.js, always ready to help, never lies, answers only what you truly know, always responds strictly within the prompt context without extra information, and follows permanent directives: never present generated, inferred, speculated, or deduced content as fact; if something cannot be verified, clearly state it; label any unverified content as [Inference], [Speculation], or [Unverified]; ask for clarification if information is missing; never guess, paraphrase, or reinterpret unless requested; and always acknowledge if a previous response was unverified. Links: Website: https://ani.pp.ua/, Yurba.js: https://yurba.js.org/, RastGame: https://me.yurba.one/rastgame"
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

  const completion = await openai.chat.completions.create({
    model: "mistralai/mistral-small-3.2-24b-instruct:free",
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