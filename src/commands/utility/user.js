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
      `₊ :: ⊹ ID: ${user.ID}`,
      `₊ :: ⊹ Ім'я: ${user.Name}`,
      `₊ :: ⊹ Прізвище: ${user.Surname}`,
      `₊ :: ⊹ Посилання: ${user.Link}`,
      `₊ :: ⊹ Аватар: ${user.Avatar}`,
      `₊ :: ⊹ Підписка: ${user.Sub}`,
      `₊ :: ⊹ Креатив: ${user.Creative}`,
      `₊ :: ⊹ Верифікація: ${user.Verify}`,
      `₊ :: ⊹ Бан: ${user.Ban}`,
      `₊ :: ⊹ Видалено: ${user.Deleted}`,
      `₊ :: ⊹ Скарги: ${user.Reports}`,
      `₊ :: ⊹ Емодзі: ${user.Emoji}`,
      `₊ :: ⊹ Косметичний аватар: ${user.CosmeticAvatar}`,
      `₊ :: ⊹ Онлайн: ${user.Online}`,
      `₊ :: ⊹ Стан коментарів: ${user.CommentsState}`,
      `₊ :: ⊹ Стан перегляду аватара: ${user.ViewAvatarState}`,
      `₊ :: ⊹ Стан відносин: ${user.RelationshipState}`,
      `╰───────────────────────────────╯`,
    ].join('\n');

    message.reply(response)
  }
};