import dotenv from 'dotenv';
dotenv.config();

import { Client } from 'yurba.js';
import { initFont } from './utils/font.js';
import { registerEventHandlers } from './events/handlers.js';
import { registerBasicCommands } from './commands/basic.js';
import { registerDatabaseCommands } from './commands/database.js';
import { registerCardCommands } from './commands/cards.js';

const client = new Client(process.env.TOKEN, { prefix: '' });

// Initialize font
await initFont();

// Register event handlers
registerEventHandlers(client);

// Register commands
registerBasicCommands(client);
registerDatabaseCommands(client);
registerCardCommands(client);

client.init();