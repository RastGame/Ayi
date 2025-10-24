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
        try {
          const module = await import(`file://${path}`);
          await handler(module.default, path);
        } catch (importError) {
          console.error(`[✘] Error importing ${path}:`, importError.message);
        }
      }
    }
  } catch (error) {
    // Тихо ігноруємо помилки читання папок (порожні папки тощо)
  }
}

export async function loadCommands(client, path = '../commands') {
  const commandsPath = resolve(__dirname, path);
  console.log(`Loading commands from: ${commandsPath}`);
  await loadFiles(commandsPath, (cmd, file) => {
    if (!cmd?.name || !cmd?.handler) {
      console.error(`〢 [✘] Invalid command in { ${file} }`);
      return;
    }
    client.registerCommand(cmd.name, cmd.args || {}, (message, args) => cmd.handler(client, message, args));
    console.log(`[✅] Command: < ${client.prefix}${cmd.name} >`);
  });
}

export async function loadEvents(client, path = '../events') {
  const eventsPath = resolve(__dirname, path);
  console.log(`Loading events from: ${eventsPath}`);
  await loadFiles(eventsPath, (event, file) => {
    if (!event?.name || !event?.handler) {
      console.error(`〢 [✘] Invalid event in { ${file} }`);
      return;
    }
    client[event.once ? 'once' : 'on'](event.name, (...args) => event.handler(client, ...args));
    console.log(`[✅] Event: < ${event.name} >`);
  });
}
