import { Dialog } from '../../models/Dialog.js';
import { Welcomer } from '../../models/Welcomer.js';
import { err, msg } from '../../utils/messages.js';

const ADMIN_ID = 1111;

export default {
  name: 'settings',
  args: { action: 'string', setting: {type: 'string', required: false}, value: {type: 'string', required: false, rest: true} },
  groupOnly: true,
  handler: async (client, message, args) => {
    try {
      if (message.Dialog.Type !== 'group') {
        return message.reply(err('Команда доступна **тільки в групах!**'));
      }

      const { action, setting, value } = args;
      const dialog = await Dialog.findById(message.Dialog.ID);
      if (!dialog) {
        return message.reply(err('Діалог не знайдено в базі даних'));
      }

      // Показ налаштувань
      if (action === 'show') {
        const welcomer = await Welcomer.findById(message.Dialog.ID);
        const tokenStatus = dialog.token ? '🔑 Встановлено' : '❌ Відсутній';
        const welcomeStatus = welcomer?.welcome?.enabled ? '✅' : '❌';
        const goodbyeStatus = welcomer?.goodbye?.enabled ? '✅' : '❌';
        
        const response = [
          `⚙️ Налаштування діалогу`,
          `╭───────────────────────────────╮`,
          `₊\`🔑\`⊹ Токен: ${tokenStatus}`,
          `₊\`🛡️\`⊹ Модерація: ${dialog.moderation ? '✅' : '❌'}`,
          `₊\`📊\`⊹ Рівні: ${dialog.levels ? '✅' : '❌'}`,
          `₊\`💰\`⊹ Економіка: ${dialog.economy ? '✅' : '❌'}`,
          `₊\`👋\`⊹ Привітання: ${welcomeStatus}`,
        ];
        
        if (welcomer?.welcome?.enabled && welcomer?.welcome?.text) {
          response.push(`\`${welcomer.welcome.text}\``);
        }
        
        response.push(`₊ 👋 ⊹ Прощавання: ${goodbyeStatus}`);
        
        if (welcomer?.goodbye?.enabled && welcomer?.goodbye?.text) {
          response.push(`\`${welcomer.goodbye.text}\``);
        }
        
        response.push(`╰───────────────────────────────╯`);
        
        return message.reply(response.join('\n'));
      }

      // Перевірка прав власника
      if (message.Author.ID !== message.Dialog.Owner?.ID && message.Author.ID !== ADMIN_ID) {
        return message.reply(err('Тільки власник діалогу може змінювати налаштування!'));
      }

      // Зміна налаштувань
      if (action === 'set') {
        if (!setting) {
          return message.reply(err('Використання: /settings set <moderation|levels|economy|welcome|goodbye> <true|false|text>'));
        }
        
        const validSettings = ['moderation', 'levels', 'economy', 'welcome', 'goodbye'];
        if (!validSettings.includes(setting)) {
          return message.reply(err('Доступні налаштування: moderation, levels, economy, welcome, goodbye'));
        }
        
        if (setting === 'welcome' || setting === 'goodbye') {
          let welcomer = await Welcomer.findById(message.Dialog.ID);
          if (!welcomer) {
            await Welcomer.create(message.Dialog.ID);
          }
          
          if (!value) {
            const currentText = setting === 'welcome' ? welcomer.welcome?.text : welcomer.goodbye?.text;
            return message.reply(msg('📝', `Поточний текст ${setting === 'welcome' ? 'привітання' : 'прощавання'}:\n${currentText || 'Не встановлено'}`));
          }
          
          if (value === 'true' || value === 'false') {
            const boolValue = value === 'true';
            if (setting === 'welcome') {
              await Welcomer.setWelcome(message.Dialog.ID, boolValue);
            } else {
              await Welcomer.setGoodbye(message.Dialog.ID, boolValue);
            }
            return message.reply(msg('✅', `${setting} встановлено на ${boolValue ? 'увімкнено' : 'вимкнено'}`));
          } else {
            const currentEnabled = setting === 'welcome' ? welcomer.welcome?.enabled : welcomer.goodbye?.enabled;
            if (setting === 'welcome') {
              await Welcomer.setWelcome(message.Dialog.ID, currentEnabled || false, value);
            } else {
              await Welcomer.setGoodbye(message.Dialog.ID, currentEnabled || false, value);
            }
            return message.reply(msg('✅', `Текст ${setting === 'welcome' ? 'привітання' : 'прощавання'} оновлено!`));
          }
        } else {
          if (!value) {
            return message.reply(err('Вкажіть значення: true або false'));
          }
          const boolValue = value === 'true';
          await Dialog.updateById(message.Dialog.ID, { [setting]: boolValue });
          return message.reply(msg('✅', `${setting} встановлено на ${boolValue ? 'увімкнено' : 'вимкнено'}`));
        }
      }

      return message.reply(err('Доступні дії: show, set'));
    } catch (error) {
      console.error('Settings error:', error);
      message.reply(err('Помилка при роботі з налаштуваннями'));
    }
  }
};