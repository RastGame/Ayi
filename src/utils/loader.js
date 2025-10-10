import { readdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function loadFiles(dir, handler) {
  try {
    const items = readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const path = join(dir, item.name);
      if (item.isDirectory()) {
        await loadFiles(path, handler);
      } else if (item.name.endsWith('.js')) {
        const module = await import(`file://${path}`);
        await handler(module.default, path);
      }
    }
  } catch (error) {
    console.warn(`Folder not found: ${dir}`);
  }
}

export async function loadCommands(client, path = '../commands') {
  await loadFiles(resolve(__dirname, path), (cmd, file) => {
    if (!cmd?.name || !cmd?.handler) {
      console.error(`Invalid command in ${file}`);
      return;
    }
    client.registerCommand(cmd.name, cmd.args || {}, (message, args) => cmd.handler(client, message, args));
    console.log(`✅ Command: ${cmd.name}`);
  });
}

export async function loadEvents(client, path = '../events') {
  await loadFiles(resolve(__dirname, path), (event, file) => {
    if (!event?.name || !event?.handler) {
      console.error(`Invalid event in ${file}`);
      return;
    }
    client[event.once ? 'once' : 'on'](event.name, (...args) => event.handler(client, ...args));
    console.log(`✅ Event: ${event.name}`);
  });
}

export async function loadSlashCommands(client, path = '../slash') {
  await loadFiles(resolve(__dirname, path), (slash, file) => {
    if (!slash?.data || !slash?.execute) {
      console.error(`Invalid slash command in ${file}`);
      return;
    }
    client.slashCommands.set(slash.data.name, slash);
    console.log(`✅ Slash: ${slash.data.name}`);
  });
}