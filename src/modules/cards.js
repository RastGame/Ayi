export class CardService {
  static async uploadPhoto(client, imageBuffer, filename, caption, mode = 'public') {
    return await client.api.photos.upload({
      photo: imageBuffer,
      filename,
      caption,
      mode
    });
  }
}