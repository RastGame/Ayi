export default {
  name: 'join',
  handler: (client, message) => {
    console.log('join', message);
    client.sendMessage(459, { text: `Новий користувач: ${client.user.Name}`})
  }
};