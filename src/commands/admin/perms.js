import { User } from '../../models/User.js';
import { PERMS, PERM_NAMES, hasPermission, addPermission, removePermission, getPermissionsList } from '../../utils/permissions.js';
import { err, msg } from '../../utils/messages.js';

export default {
  name: 'perms',
  args: { action: 'string', user: {type: 'user', required: false}, permissions: {type: 'string', required: false, rest: true} },
  groupOnly: true,
  handler: async (client, message, args) => {
    try {
      if (message.Dialog.Type !== 'group') {
        return message.reply(err('Команда доступна **тільки в групах!**'));
      }

      const { action, user, permissions } = args;

      // Перевірка прав для дій, крім show
      if (action !== 'show') {
        const authorData = await User.findByDialogAndUser(message.Dialog.ID, message.Author.ID);
        const authorPerms = authorData?.permissions || 0;
        const isOwner = message.Author.ID === message.Dialog.Owner?.ID;
        const isSuperAdmin = message.Author.ID === 1111;
        
        if (!hasPermission(authorPerms, PERMS.MANAGE_PERMS) && !isOwner && !isSuperAdmin) {
          return message.reply(err('Недостатньо прав для керування правами'));
        }
      }
      
      // Показ прав користувача
      if (action === 'show') {
        const targetUser = user || message.Author;
        
        // Перевірка чи може користувач дивитись чужі права
        const authorData = await User.findByDialogAndUser(message.Dialog.ID, message.Author.ID);
        const authorPerms = authorData?.permissions || 0;
        const isOwner = message.Author.ID === message.Dialog.Owner?.ID;
        const isSuperAdmin = message.Author.ID === 1111;
        const canManagePerms = hasPermission(authorPerms, PERMS.MANAGE_PERMS) || isOwner || isSuperAdmin;
        
        if (targetUser.ID !== message.Author.ID && !canManagePerms) {
          return message.reply(err('Ви можете переглядати тільки свої права'));
        }
        
        // Якщо це власник групи
        if (targetUser.ID === message.Dialog.Owner?.ID) {
          const response = [
            `👤 Права користувача ${targetUser.Name}:`,
            `╭──────────────────────────────╮`,
            `₊ 👑 ⊹ Власник групи`,
            `₊ 📋 ⊹ Права: Всі права`,
            `╰──────────────────────────────╯`
          ].join('\n');
          return message.reply(response);
        }
        
        const userData = await User.findByDialogAndUser(message.Dialog.ID, targetUser.ID);
        
        if (!userData) {
          return message.reply(err('Користувач не знайдений в базі даних'));
        }

        const userPerms = userData.permissions || 0;
        const permsList = getPermissionsList(userPerms);
        
        const response = [
          `👤 Права користувача ${targetUser.Name}:`,
          `╭──────────────────────────────╮`,
          `₊ 🔢 ⊹ Числове значення: ${userPerms}`,
          `₊ 📋 ⊹ Права:`,
          ...permsList.map(perm => `  • ${perm}`),
          `╰──────────────────────────────╯`
        ].join('\n');

        return message.reply(response);
      }



      // Надання/забирання прав
      if (action === 'give' || action === 'take') {
        if (!user || !permissions) {
          return message.reply(err('Використання: /perms give/take [user] [permissions...]'));
        }

        const authorData = await User.findByDialogAndUser(message.Dialog.ID, message.Author.ID);
        const authorPerms = authorData?.permissions || 0;
        const isOwner = message.Author.ID === message.Dialog.Owner?.ID;
        const isSuperAdmin = message.Author.ID === 1111;

        let userData = await User.findByDialogAndUser(message.Dialog.ID, user.ID);
        if (!userData) {
          await User.create(message.Dialog.ID, user.ID);
          userData = await User.findByDialogAndUser(message.Dialog.ID, user.ID);
        }

        let currentPerms = userData.permissions || 0;
        const permissionsList = permissions.split(' ');
        const processedPerms = [];
        
        // Обробка ALL
        if (permissionsList.includes('ALL')) {
          if (!isOwner && !isSuperAdmin && !hasPermission(authorPerms, PERMS.ADMIN)) {
            return message.reply(err('Тільки власник або адміністратор може керувати всіма правами'));
          }
          
          if (action === 'take') {
            currentPerms = 0;
            await User.setPermissions(message.Dialog.ID, user.ID, currentPerms);
            return message.reply(msg('✅', `Всі права забрано у користувача ${user.Name}`));
          } else {
            const allPerms = Object.values(PERMS).reduce((sum, perm) => sum | perm, 0);
            await User.setPermissions(message.Dialog.ID, user.ID, allPerms);
            return message.reply(msg('✅', `Всі права надано користувачу ${user.Name}`));
          }
        }
        
        // Обробка Moderator (згустка прав)
        if (permissionsList.includes('MODERATOR')) {
          const moderatorPerms = [PERMS.DELETE_MSG, PERMS.KICK, PERMS.MUTE];
          
          // Перевірка прав для надання модераторських прав
          if (action === 'give' && !isOwner && !isSuperAdmin && !hasPermission(authorPerms, PERMS.ADMIN)) {
            for (const modPerm of moderatorPerms) {
              if (!hasPermission(authorPerms, modPerm)) {
                return message.reply(err('Ви не можете надати права модератора, оскільки у вас немає всіх необхідних прав'));
              }
            }
          }
          
          for (const modPerm of moderatorPerms) {
            currentPerms = action === 'give' 
              ? addPermission(currentPerms, modPerm)
              : removePermission(currentPerms, modPerm);
          }
          
          processedPerms.push('Модератор (DELETE_MSG, KICK, MUTE)');
          
          // Видаляємо MODERATOR зі списку для подальшої обробки
          const index = permissionsList.indexOf('MODERATOR');
          if (index > -1) {
            permissionsList.splice(index, 1);
          }
        }
        
        // Обробка окремих прав
        for (const perm of permissionsList) {
          let permValue = PERMS[perm.toUpperCase()];
          
          // Якщо не знайдено по назві, спробуємо як число
          if (!permValue) {
            const numValue = parseInt(perm);
            if (!isNaN(numValue) && Object.values(PERMS).includes(numValue)) {
              permValue = numValue;
            }
          }
          
          if (!permValue) {
            return message.reply(err(`Невідоме право: ${perm}. Доступні: ${Object.keys(PERMS).join(', ')}, числа (${Object.values(PERMS).join(', ')}), MODERATOR, ALL`));
          }
          
          // Перевірка ієрархії прав
          if (action === 'give' && !isOwner && !isSuperAdmin) {
            // Перевірка спеціальних прав
            if (permValue === PERMS.ADMIN && !hasPermission(authorPerms, PERMS.ADMIN)) {
              return message.reply(err('Тільки адміністратор може надавати права ADMIN'));
            }
            if (permValue === PERMS.MANAGE_ADMINS && !hasPermission(authorPerms, PERMS.ADMIN)) {
              return message.reply(err('Тільки адміністратор може надавати права MANAGE_ADMINS'));
            }
            if (permValue === PERMS.MANAGE_PERMS && !hasPermission(authorPerms, PERMS.MANAGE_ADMINS) && !hasPermission(authorPerms, PERMS.ADMIN)) {
              return message.reply(err('Потрібно мати права MANAGE_ADMINS або ADMIN для надання MANAGE_PERMS'));
            }
            
            // Перевірка чи є у автора право яке він хоче надати
            if (!hasPermission(authorPerms, permValue) && !hasPermission(authorPerms, PERMS.ADMIN)) {
              return message.reply(err(`Ви не можете надати право ${PERM_NAMES[permValue]}, якого у вас немає`));
            }
          }
          
          currentPerms = action === 'give' 
            ? addPermission(currentPerms, permValue)
            : removePermission(currentPerms, permValue);
            
          processedPerms.push(PERM_NAMES[permValue]);
        }

        await User.setPermissions(message.Dialog.ID, user.ID, currentPerms);
        
        const actionText = action === 'give' ? 'надано' : 'забрано';
        const permsText = processedPerms.join(', ');
        
        return message.reply(msg('✅', `Права "${permsText}" ${actionText} користувачу ${user.Name}`));
      }

      return message.reply(err('Доступні дії: show, give, take'));
    } catch (error) {
      console.error('Perms error:', error);
      message.reply(err('Помилка при роботі з правами'));
    }
  }
};