import OpenAI from 'openai';
import dotenv from 'dotenv';
import { err, msg } from '../../utils/messages.js';
dotenv.config();

// Store conversation history per dialog
const dialogHistory = new Map();

const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_TOKEN,
});

async function main(prompt, dialogId) {
  const history = dialogHistory.get(dialogId) || [];
  
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
7. formatting: [text](url) for links, **text** for bold, *text* for italic, ^^^text^^^ for quotes.`
    },
    ...history,
    { role: "user", content: prompt }
  ];

  const completion = await groq.chat.completions.create({
    model: "qwen/qwen3-32b", 
    messages
  });

  const response = completion.choices[0].message.content;
  return response;
}



export default {
  name: 'ask',
  args: { prompt: {type: 'string', rest: true, required: true} },
  handler: async (client, message, args) => {
    try {
        client.typing(message.Dialog.ID);

        let prompt = args.prompt;

        if (!prompt) {
          return await message.reply(err('Надайте запитання. Використання: /ask <ваше запитання>'));
        }
        
        console.log('Prompt:', prompt);
        let response = await main(prompt, message.Dialog.ID);
        
        // Store conversation history
        const history = dialogHistory.get(message.Dialog.ID) || [];
        console.log(history)
        history.push({ role: "user", content: prompt });
        history.push({ role: "assistant", content: response });
        


        // Keep only last 10 messages (5 exchanges)
        if (history.length > 10) {
          history.splice(0, history.length - 10);
        }
        
        dialogHistory.set(message.Dialog.ID, history);
        
        // Remove <think> tags and content
        response = response.replace(/<think>.*?<\/think>/gs, '').trim();
        
        await message.reply(`${response}`);
    } catch (error) {
      if (error.status === 429) {
        await message.reply('Ліміт запітів, спробуйте пізнише.');
      } else {
        await message.reply(err('Помилка при обробці запиту'));
      }
      console.error('Error in ask command:', error);
    }
  }
};