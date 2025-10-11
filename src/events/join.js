export default {
  name: 'join',
  handler: async (client, message) => {
    console.log('join', message);
    await client.sendMessage(459, { text: `Новий користувач: ${client.user.Name}`})
  }
};