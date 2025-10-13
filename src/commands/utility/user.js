export default {
  name: 'user',
  args: { user: {type: 'user', required: false} },
  handler: async (client, message, args) => {
    let user = args.user;
    if (!args.user) {
      user = message.Author;
    }
    const response = [
      `${user.Emoji || '-'} ${user.Name} ${user.Surname} ( @${user.Link} )`,
      `╭───────────────────────────────╮`,
      `₊ ⊹ ID: [${user.ID}](https://yurba.one/user/${user.ID})`,
      `₊ ⊹ Аватар: ${user.Avatar === 0 ? 'Немає' : `[${user.Avatar}](https://cdn.yurba.one/photos/${user.Avatar}.jpg)`}`,
      `₊ ${user.Sub === 0 ? '⚪' : user.Sub === 1 ? '🟡' : '💎'} ⊹ Підписка: ${user.Sub === 0 ? 'Немає' : user.Sub === 1 ? 'Yurba Plus' : 'Yurba Premium'}`,
      `₊ ${user.Verify === "" ? '⚪' : user.Verify === 'Default' ? '✅' : user.Verify === 'Organisation' ? '🏢' : '🏛️'} ⊹ Верифікація: ${user.Verify === "" ? 'Немає' : user.Verify === 'Default' ? 'Звичайна' : user.Verify === 'Organisation' ? 'Організація' : 'Уряд'}`,
      `₊ ${user.Ban ? '🚫' : '✅'} ⊹ Бан: ${user.Ban ? 'Так' : 'Ні'}`,
      `╰───────────────────────────────╯`,
    ].join('\n');

    message.reply(response, user.Avatar === 0 ? [] : [ user.Avatar ])
  }
};