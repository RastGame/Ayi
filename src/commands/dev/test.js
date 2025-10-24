import { Client, fetchRandom } from "nekos-best.js";

export default {
  name: 'test',
  args: {},
  handler: async (client, message, args) => {
    if (message.Author.ID !== 1111) await message.reply(`False: `);

    


    // You can use the `fetchRandom()` function to fetch a random neko.
    console.log(await fetchRandom("neko")); // { results: [{ artist_href: '···', artist_name: '···', source_url: '···', url: 'https://nekos.best/api/v2/neko/XXXXXX-XXXXX.png' }] }

    // Alternatively, you can initialize a new client which offers more features.
    const nekosBest = new Client();

    // Such as the `<Client>.fetch()` method.
    console.log(await nekosBest.fetch("neko", 1)); // { results: [{ artist_href: '···', artist_name: '···', source_url: '···', url: 'https://nekos.best/api/v2/neko/XXXXXX-XXXXX.png' }] }
    console.log(await nekosBest.fetch("hug", 10)); // { results: [{ artist_href: '···', artist_name: '···', source_url: '···', url: 'https://nekos.best/api/v2/hug/XXXXXX-XXXXX.gif' }, ···] }

    // Or the `<Client>.fetchFile()` method to get a single file.
    console.log(await nekosBest.fetchFile("neko")); // { artist_href: '···', ···, data: <Buffer> }


  }
};