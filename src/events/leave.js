export default {
  name: 'leave',
  handler: (client, message) => {
    console.log('leave', message);
    client.sendMessage(459, { text: `Користувач вийшов: ${client.user.Name}`})
  }
};