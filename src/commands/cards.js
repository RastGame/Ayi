import { withCooldown } from '../utils/decorators.js';
import { GreetingsCard } from "../test.js";

export function registerCardCommands(client) {
  client.registerCommand('testcard', {}, withCooldown(async function testcard(message) {
    try {
      const avatar = await client.getPhoto(message.Author.Avatar)

      const card = new GreetingsCard()
        .setAvatar(avatar.Url)
        .setDisplayName(' ' + message.Author.Name + message.Author.Surname)
        .setType("Вітаємо")
        .setMessage("Карточка створена з використанням:")
        .setMessage2("canvacord + yurba.js")
      const imageBuffer = await card.build({ format: "png" });
      
      const photo = await client.api.photos.upload({
        photo: imageBuffer,
        filename: `card-${Date.now()}.png`,
        caption: 'Ayi card for: ' + message.Author.Link + ', ' + new Date().toLocaleString(),
        mode: 'public'
      });

      await message.reply(``, [photo.ID]);
    } catch (error) {
      console.error('Error in testcard command:', error);
      message.reply('❌ An error occurred while generating the card.');
    }
  }, 5000, 1));

  client.registerCommand('testfont', {}, withCooldown(async function testfont(message) {
    try {
      const card = new GreetingsCard()
        .setAvatar('https://via.placeholder.com/150')
        .setDisplayName('Тест')
        .setType("Вітаємо")
        .setMessage("Тест українських літер: а б в г ґ д е є ж з и і ї й к л м н о п р с т у ф х ц ч ш щ ь ю я");
      
      const imageBuffer = await card.build({ format: "png" });
      
      const formData = new FormData();
      const blob = new Blob([imageBuffer], { type: 'image/png' });
      formData.append('photo', blob, `font-test-${Date.now()}.png`);
      formData.append('caption', 'Тест шрифту з українськими літерами');
      formData.append('mode', 'private');

      const response = await fetch('https://api.yurba.one/photos', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'token': process.env.TOKEN
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const photo = await response.json();
      await message.reply('Тест шрифту завершено', [photo.ID]);
    } catch (error) {
      console.error('Error in testfont command:', error);
      message.reply('❌ Помилка при тестуванні шрифту.');
    }
  }));
}