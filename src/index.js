import dotenv from 'dotenv';
dotenv.config();

import { Client } from 'yurba.js';
import { initFont } from './utils/font.js';
import { loadCommands, loadEvents } from './utils/loader.js';

const client = new Client(process.env.YURBA_TOKEN, { prefix: process.env.YURBA_PREFIX});

// Initialize font
await initFont();

// Auto-load events
await loadEvents(client);

// Auto-load commands
await loadCommands(client);

client.init();
