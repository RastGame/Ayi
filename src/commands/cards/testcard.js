import { GreetingsCard } from "../../test.js";
import { CardService } from '../../modules/cards.js';

export default {
  name: 'card',
  handler: async (message) => {
    try {
      console.log(JSON.stringify(message, null, 2))

      const card = new GreetingsCard()
        .setAvatar(message.Author.Avatar?.Url || '')
        .setDisplayName(' ' + message.Author.Name + message.Author.Surname)
        .setType("Вітаємо")
        .setMessage("Карточка створена з використанням:")
        .setMessage2("canvacord + yurba.js");
      const imageBuffer = await card.build({ format: "png" });
      
      const photo = await CardService.uploadPhoto(
        message.client,
        imageBuffer,
        `card-${Date.now()}.png`,
        'Ayi card for: ' + message.Author.Link + ', ' + new Date().toLocaleString(),
        'public'
      );

      await message.reply(``, [photo.ID]);
    } catch (error) {
      console.error('Error in card command:', error);
      message.reply('❌ Помилка при створенні карточки.');
    }
  }
};