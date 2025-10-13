import { RankCardBuilder } from "canvacord";

export default {
  name: 'rank',
  handler: async (client, message) => {
    try {
      let currentXP = 500;
      let requiredXP = 1000;
      console.log(JSON.stringify(message, null, 2))
      const card = new RankCardBuilder()
        .setDisplayName(message.Author.Name)
        .setUsername("@" + message.Author.Link)
        .setAvatar("https://cdn.yurba.one/photos/" + message.Author.Avatar)
        .setCurrentXP(currentXP)
        .setRequiredXP(requiredXP)
        .setLevel(1)
        .setRank(1)
        .setOverlay(90)
        .setBackground("#808080")
        .setStatus(message.Author.Online.Status)

        .setProgressCalculator((currentXP, requiredXP) => {
          const progress = (currentXP / requiredXP) * 100;
          return Math.max(0, Math.min(progress, 100));
        })
        .setStyles({
          progressbar: {
            thumb: {
              style: {
                backgroundColor: '#808080'
              },
            },
            track: {
              style: {
                backgroundColor: "#faa61a"
              },
            },
          },
          statistics: {
            level: {
              text: {
                style: {
                  color: "#faa61a",
                },
              },
            },
            xp: {
              text: {
                style: {
                  color: "#faa61a",
                },
              },
            },
            rank: {
              text: {
                style: {
                  color: "#faa61a",
                },
              },
            },
          },
        });

      const imageBuffer = await card.build({ format: "png" });
      
      const photo = await client.api.photos.upload(
        imageBuffer,
        'Ayi rank card for: ' + message.Author.Link + ', ' + new Date().toLocaleString(),
        'public'
      );
      
      await message.reply(``, [photo.ID]);
    } catch (error) {
      console.error('Error in card command:', error);
      message.reply('❌ Помилка при створенні rank карточки.');
    }
  }
};