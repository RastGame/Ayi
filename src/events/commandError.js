import {err} from '../utils/messages.js';
import util from 'util';

export default {
  name: 'commandError',
  handler: async (client, { error, message }) => {
    console.error('❌ Command Error:', util.inspect({ error, command: message }, { depth: null, colors: true }));

    // Обробка різних типів помилок
    if (error.message?.includes('User') && error.message?.includes('not found')) {
      return message.reply(err('Користувача не знайдено'));
    }
    
    if (error.message?.includes('Missing required argument')) {
      return message.reply(err('Не вистачає обов\'язкових аргументів'));
    }
    
    if (error.message?.includes('must be an integer')) {
      return message.reply(err('Аргумент повинен бути числом'));
    }
    
    if (error.message?.includes('must be a boolean')) {
      return message.reply(err('Аргумент повинен бути true/false'));
    }
    
  }
};