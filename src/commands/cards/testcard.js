import { withCooldown } from '../../utils/decorators.js';
import { GreetingsCard } from "../../test.js";
import { CardService } from '../../modules/cards.js';

export default {
  name: 'testcard',
  handler: withCooldown(async function testcard(message) {
    try {
      const avatar = await message.client.getPhoto(message.Author.Avatar);

      const card = new GreetingsCard()
        .setAvatar(avatar.Url)
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
      console.error('Error in testcard command:', error);
      message.reply('❌ An error occurred while generating the card.');
    }
  }, 5000, 1)
};