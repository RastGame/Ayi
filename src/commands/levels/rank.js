import { RankCardBuilder } from "canvacord";
import { User } from '../../models/User.js';
import { Dialog } from '../../models/Dialog.js';

export default {
  name: 'rank',
  args: { user: {type: 'user', required: false} },
  handler: async (client, message, args) => {
    try {
      let targetUser = args.user || message.Author;

      console.log(targetUser)
      if (message.Dialog.Type !== 'group') {
        return message.reply('❌ Команда доступна тільки в групах!');
      }

      console.log(targetUser)

      const user = await User.findByDialogAndUser(message.Dialog.ID, targetUser.ID);

      let dialog = await Dialog.findById(message.Dialog.ID);
      console.log(dialog)
      if (!dialog.levels) {
        return message.reply(':x: Рівні вимкнені');
      }

      if (!user) {
        return message.reply(`@${targetUser.Link} користувача немає в рейтингу`);
      }

      const level = Math.floor(user.xp / 1000) + 1;
      const currentXP = user.xp % 1000;
      const requiredXP = 1000;
      
      const card = new RankCardBuilder()
        .setDisplayName(targetUser.Name + ' ' + targetUser.Surname)
        .setUsername("@" + targetUser.Link)
        .setAvatar(targetUser.Avatar === 0 ? "https://cdn.yurba.one/photos/3866.jpg?size=xlarge" : "https://cdn.yurba.one/photos/" + targetUser.Avatar + ".jpg")
        .setCurrentXP(currentXP)
        .setRequiredXP(requiredXP)
        .setLevel(level)
        .setRank(1)

        .setStatus(targetUser.Online.Status)
        .setProgressCalculator((currentXP, requiredXP) => {
          const progress = (currentXP / requiredXP) * 100;
          return Math.max(0, Math.min(progress, 100));
        })
        .setStyles({
          progressbar: {
            thumb: {
              style: {
                backgroundColor: '#ffffffff',
                
              },
            },
            track: {
              style: {
                backgroundColor: "#d1d1d4ff"
              },
            },
          },
          statistics: {
            level: {
              text: {
                style: {
                  color: "#ead2ffff",
                },
              },
            },
            xp: {
              text: {
                style: {
                  color: "#ead2ffff",
                },
              },
            },
            rank: {
              text: {
                style: {
                  color: "#ead2ffff",
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