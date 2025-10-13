import { ErrorHandler } from '../utils/errorHandler.js';

export default {
  name: 'unknownCommand',
  handler: async (client, command, message) => {
    await ErrorHandler.handleUnknownCommand(command, message, client);
  }
};