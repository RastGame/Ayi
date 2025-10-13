export default {
  name: 'user',
  args: { user: {type: 'user', required: false} },
  handler: async (client, message, args) => {
    let user = args.user;
    if (!args.user) {
      user = message.Author;
    }
    const response = [
      `${user.Emoji || ''} ${user.Name} ${user.Surname} ( @${user.Link} )`,
      `╭───────────────────────────────╮`,
      `₊ ⊹ ID: [${user.ID}](https://yurba.one/user/${user.ID})`,
      `₊ ⊹ Аватар: [${user.Avatar}](https://cdn.yurba.one/photos/${user.Avatar}.jpg)`,
      `₊ ${user.Sub === 0 ? '⚪' : user.Sub === 1 ? '🟡' : '💎'} ⊹ Підписка: ${user.Sub === 0 ? 'Немає' : user.Sub === 1 ? 'Yurba Plus' : 'Yurba Premium'}`,
      `₊ ${user.Creative ? '🎨' : '⚪'} ⊹ Креатив: ${user.Creative ? 'Так' : 'Ні'}`,
      `₊ ${user.Verify === 'None' ? '⚪' : user.Verify === 'Default' ? '✅' : user.Verify === 'Organisation' ? '🏢' : '🏛️'} ⊹ Верифікація: ${user.Verify === 'None' ? 'Немає' : user.Verify === 'Default' ? 'Звичайна' : user.Verify === 'Organisation' ? 'Організація' : 'Уряд'}`,
      `₊ ${user.Ban ? '🚫' : '✅'} ⊹ Бан: ${user.Ban ? 'Так' : 'Ні'}`,
      `₊ ${user.Deleted ? '🗑️' : '✅'} ⊹ Видалено: ${user.Deleted ? 'Так' : 'Ні'}`,
      `₊ ⚠️ ⊹ Скарги: ${user.Reports}`,
      `₊ ${user.CosmeticAvatar ? '🖼️' : '⚪'} ⊹ Косметичний аватар: ${user.CosmeticAvatar ? 'Так' : 'Ні'}`,
      `₊ ${user.Online.Online ? '🟢' : '🔴'} ⊹ Онлайн: ${user.Online.Online ? 'Так' : 'Ні'} (${user.Online.Status || 'Немає статусу'})`,
      `₊ 🕐 ⊹ Останній раз: ${user.Online.LastBeen ? new Date(user.Online.LastBeen * 1000).toLocaleString('uk-UA') : 'Невідомо'}`,
      `₊ ${user.CommentsState === 0 ? '🌍' : user.CommentsState === 1 ? '👥' : '🚫'} ⊹ Стан коментарів: ${user.CommentsState === 0 ? 'Всі' : user.CommentsState === 1 ? 'Друзі' : 'Ніхто'}`,
      `₊ ${user.ViewAvatarState === 0 ? '🌍' : user.ViewAvatarState === 1 ? '👥' : '🚫'} ⊹ Стан перегляду аватара: ${user.ViewAvatarState === 0 ? 'Всі' : user.ViewAvatarState === 1 ? 'Друзі' : 'Ніхто'}`,
      `₊ ${user.RelationshipState === 'friends' ? '👥' : user.RelationshipState === 'me_subscribed' ? '➡️' : user.RelationshipState === 'he_subscribed' ? '⬅️' : user.RelationshipState === 'strangers' ? '👤' : '❓'} ⊹ Стан відносин: ${user.RelationshipState === 'friends' ? 'Друзі' : user.RelationshipState === 'me_subscribed' ? 'Я підписаний' : user.RelationshipState === 'he_subscribed' ? 'Підписаний на мене' : user.RelationshipState === 'strangers' ? 'Незнайомці' : 'Невідомо'}`,
      `╰───────────────────────────────╯`,
    ].join('\n');

    message.reply(response, [ user.Avatar ])
  }
};