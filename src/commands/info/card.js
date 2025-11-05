import { GreetingsCard } from "../../modules/cards.js";
import { err, msg } from '../../utils/messages.js';

export default {
  name: 'card',
  args: { user: {type: 'user', required: false} },
  handler: async (client, message, args) => {
    try {
      let user = args.user;
      if (!args.user) {
        user = message.Author;
      }

      const card = new GreetingsCard()
        .setAvatar(user.Avatar === 0 ? "https://cdn.yurba.one/photos/3866.jpg?size=xlarge" : "https://cdn.yurba.one/photos/" + user.Avatar + ".jpg")
        .setDisplayName(' ' + user.Name + user.Surname)
        .setType("Вітаємо")
        .setMessage("Карточка створена з використанням:")
        .setMessage2("canvacord + yurba.js");
      const imageBuffer = await card.build({ format: "png" });
      
      const photo = await client.api.photos.upload(
        imageBuffer,
        'Ayi card for: ' + user.Link + ', ' + new Date().toLocaleString(),
        'public'
      );
      
     console.log(JSON.stringify(photo, null, 2))

      await message.reply(``, [photo.ID]);
    } catch (error) {
      console.error('Error in card command:', error);
      message.reply(err('Помилка при створенні карточки'));
    }
  }
};