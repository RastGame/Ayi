import { RankCardBuilder } from "canvacord";
import { User } from '../../models/User.js';
import { Profile } from '../../models/Profile.js';

export default {
  name: 'rank',
  args: { user: {type: 'user', required: false} },
  handler: async (client, message, args) => {
    try {
      let targetUser = args.user || message.Author;
      
      if (message.Dialog.Type !== 'group') {
        return message.reply('❌ Команда доступна тільки в групах!');
      }

      const user = await User.findByDialogAndUser(message.Dialog.ID, targetUser.ID);
      if (!user) {
        await User.create(message.Dialog.ID, targetUser.ID);
        return message.reply(`🎆 Користувач @${targetUser.Link} доданий до рейтингу!`);
      }

      const level = Math.floor(user.xp / 1000) + 1;
      const currentXP = user.xp % 1000;
      const requiredXP = 1000;
      
      const card = new RankCardBuilder()
        .setDisplayName(targetUser.Name)
        .setUsername("@" + targetUser.Link)
        .setAvatar(targetUser.Avatar === 0 ? "https://via.placeholder.com/128" : "https://cdn.yurba.one/photos/" + targetUser.Avatar + ".jpg")
        .setCurrentXP(currentXP)
        .setRequiredXP(requiredXP)
        .setLevel(level)
        .setRank(1)
        .setOverlay(90)
        .setBackground("#808080")
        .setStatus(targetUser.Online?.Status || 'offline')

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
        'Ayi rank card for: ' + targetUser.Link + ', ' + new Date().toLocaleString(),
        'public'
      );
      
      await message.reply(``, [photo.ID]);
    } catch (error) {
      console.error('Error in card command:', error);
      message.reply('❌ Помилка при створенні rank карточки.');
    }
  }
};