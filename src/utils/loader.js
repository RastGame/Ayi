import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadCommands(client, commandsPath = '../commands') {
  const commandsDir = path.resolve(__dirname, commandsPath);
  
  if (!fs.existsSync(commandsDir)) {
    console.warn(`Commands folder not found: ${commandsDir}`);
    return;
  }
  
  async function loadFromDir(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        await loadFromDir(itemPath);
      } else if (item.isFile() && item.name.endsWith('.js')) {
        try {
          const module = await import(`file://${itemPath}`);
          const command = module.default;
          
          if (!command?.name || !command?.handler) {
            console.error(`Error in ${itemPath}: command must have 'name' and 'handler' properties`);
            continue;
          }
          
          client.registerCommand(command.name, command.args || {}, command.handler);
          console.log(`✅ Loaded command: ${command.name}`);
        } catch (error) {
          console.error(`❌ Error loading command from ${itemPath}:`, error.message);
        }
      }
    }
  }
  
  await loadFromDir(commandsDir);
}

export async function loadEvents(client, eventsPath = '../events') {
  const eventsDir = path.resolve(__dirname, eventsPath);
  
  if (!fs.existsSync(eventsDir)) {
    console.warn(`Events folder not found: ${eventsDir}`);
    return;
  }
  
  const items = fs.readdirSync(eventsDir);
  
  for (const item of items) {
    if (item.endsWith('.js')) {
      try {
        const itemPath = path.join(eventsDir, item);
        const module = await import(`file://${itemPath}`);
        const event = module.default;
        
        if (!event?.name || !event?.handler) {
          console.error(`Error in ${item}: event must have 'name' and 'handler' properties`);
          continue;
        }
        
        if (event.once) {
          client.once(event.name, event.handler);
        } else {
          client.on(event.name, event.handler);
        }
        
        console.log(`✅ Loaded event: ${event.name}`);
      } catch (error) {
        console.error(`❌ Error loading event from ${item}:`, error.message);
      }
    }
  }
}