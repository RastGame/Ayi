import { Profile } from '../../models/Profile.js';

export default {
  name: 'profile',
  args: { user: {type: 'user', required: false} },
  handler: async (client, message, args) => {
    try {
      let user = args.user || message.Author;
      
      const profile = await Profile.findById(user.ID);
      if (!profile) {
        await Profile.create(user.ID);
        const newProfile = await Profile.findById(user.ID);
        return message.reply(`🎆 Профіль створено для @${user.Link}!`);
      }

      const level = Math.floor(profile.xp / 1000) + 1;
      const currentLevelXP = profile.xp % 1000;
      const isPremium = profile.premium.next && new Date(profile.premium.next) > new Date();
      
      const response = [
        `${user.Emoji || '👤'} ${user.Name} ${user.Surname} ( @${user.Link} )`,
        `╭───────────────────────────────╮`,
        `₊ :star2: ⊹ Рівень: ${level}`,
        `₊ ✨ ⊹ Досвід: ${profile.xp} (${currentLevelXP}/1000)`,
        `₊ 💰 ⊹ Монети: ${profile.coins}`,
        `₊ ${isPremium ? '💎' : ':x:'} ⊹ Преміум: ${isPremium ? `до ${new Date(profile.premium.next).toLocaleDateString('uk-UA')}` : 'Немає'}`,
        `₊ 📅 ⊹ Реєстрація: ${new Date(profile.date).toLocaleDateString('uk-UA')}`,
        `╰───────────────────────────────╯`,
      ].join('\n');

      message.reply(response);
    } catch (error) {
      console.error('Profile error:', error);
      message.reply('❌ Помилка при отриманні профілю');
    }
  }
};