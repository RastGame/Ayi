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
      `₊ :id: ⊹ ID: [${user.ID}](https://yurba.one/user/${user.ID})`,
      `₊ :mountain: ⊹ Аватар: ${user.Avatar === 0 ? 'Немає' : `[${user.Avatar}](https://cdn.yurba.one/photos/${user.Avatar}.jpg)`}`,
      `₊ ${user.Sub === 0 ? 'x' : user.Sub === 1 ? ':dizzy:' : ':jumping_cat:'} ⊹ Підписка: ${user.Sub === 0 ? 'Немає' : user.Sub === 1 ? 'Yurba Plus' : 'Yurba Premium'}`,
      `₊ ${user.Verify === "" ? ':x:' : user.Verify === 'Default' ? '✅' : user.Verify === 'Organisation' ? '🏢' : '🏛️'} ⊹ Верифікація: ${user.Verify === "" ? 'Немає' : user.Verify === 'Default' ? 'Звичайна' : user.Verify === 'Organisation' ? 'Організація' : 'Уряд'}`,
      `₊ ${user.Ban ? '✅' : ':x:'} ⊹ Забанений: ${user.Ban ? 'Так' : 'Ні'}`,
      `╰───────────────────────────────╯`,
    ].join('\n');

    message.reply(response, user.Avatar === 0 ? [] : [ user.Avatar ])
  }
};