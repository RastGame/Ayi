export default {
  name: 'commandError',
  handler: async (client, { error, message }) => {
    console.error('❌ Command Error:', {
      error: error,
      command: message
    });
    
    // Обробка різних типів помилок
    if (error.message?.includes('User') && error.message?.includes('not found')) {
      return message.reply('❌ Користувача не знайдено');
    }
    
    if (error.message?.includes('Missing required argument')) {
      return message.reply('❌ Не вистачає обов\'язкових аргументів');
    }
    
    if (error.message?.includes('must be an integer')) {
      return message.reply('❌ Аргумент повинен бути числом');
    }
    
    if (error.message?.includes('must be a boolean')) {
      return message.reply('❌ Аргумент повинен бути true/false');
    }
    
  }
};