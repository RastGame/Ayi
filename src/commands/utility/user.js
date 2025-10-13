export default {
  name: 'user',
  args: { user: {type: 'user', required: false} },
  handler: async (client, message, args) => {
    let user = args.user;
    if (!args.user) {
      user = message.Author;
    }
    const response = [
      `╭───────────────────────────────╮`,
      `₊ ⊹ ID: ${user.ID}`,
      `₊ ⊹ Ім'я: ${user.Name}`,
      `₊ ⊹ Прізвище: ${user.Surname}`,
      `₊ ⊹ Посилання: ${user.Link}`,
      `₊ ⊹ Аватар: ${user.Avatar}`,
      `₊ ⊹ Підписка: ${user.Sub}`,
      `₊ ⊹ Креатив: ${user.Creative}`,
      `₊ ⊹ Верифікація: ${user.Verify}`,
      `₊ ⊹ Бан: ${user.Ban}`,
      `₊ ⊹ Видалено: ${user.Deleted}`,
      `₊ ⊹ Скарги: ${user.Reports}`,
      `₊ ⊹ Емодзі: ${user.Emoji}`,
      `₊ ⊹ Косметичний аватар: ${user.CosmeticAvatar}`,
      `₊ ${user.Online.Online ? '🟢' : '🔴'} ⊹ Онлайн: ${user.Online.Online ? 'Так' : 'Ні'} (${user.Online.Status || 'Немає статусу'})`,
      `₊ ⊹ Останній раз: ${user.Online.LastBeen ? new Date(user.Online.LastBeen * 1000).toLocaleString('uk-UA') : 'Невідомо'}`,
      `₊ ⊹ Стан коментарів: ${user.CommentsState}`,
      `₊ ⊹ Стан перегляду аватара: ${user.ViewAvatarState}`,
      `₊ ${user.RelationshipState === 'friends' ? '👥' : user.RelationshipState === 'me_subscribed' ? '➡️' : user.RelationshipState === 'he_subscribed' ? '⬅️' : user.RelationshipState === 'strangers' ? '👤' : '❓'} ⊹ Стан відносин: ${user.RelationshipState === 'friends' ? 'Друзі' : user.RelationshipState === 'me_subscribed' ? 'Я підписаний' : user.RelationshipState === 'he_subscribed' ? 'Підписаний на мене' : user.RelationshipState === 'strangers' ? 'Незнайомці' : 'Невідомо'}`,
      `╰───────────────────────────────╯`,
    ].join('\n');

    message.reply(response)
  }
};