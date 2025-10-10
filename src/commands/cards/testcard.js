import { GreetingsCard } from "../../test.js";

export default {
  name: 'card',
  handler: async (client, message) => {
    try {

      const card = new GreetingsCard()
        .setAvatar(`https://cdn.yurba.one/photos/${message.Author.Avatar}`)
        .setDisplayName(' ' + message.Author.Name + message.Author.Surname)
        .setType("Вітаємо")
        .setMessage("Карточка створена з використанням:")
        .setMessage2("canvacord + yurba.js");
      const imageBuffer = await card.build({ format: "png" });
      
      const photo = await client.api.photos.upload(
        imageBuffer,
        'Ayi card for: ' + message.Author.Link + ', ' + new Date().toLocaleString(),
        'public'
      );

     console.log(JSON.stringify(photo, null, 2))

      await message.reply(``, [photo.ID]);
    } catch (error) {
      console.error('Error in card command:', error);
      message.reply('❌ Помилка при створенні карточки.');
    }
  }
};