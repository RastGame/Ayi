import { GreetingsCard } from "../../test.js";

export class ProfileCard {
  static create(avatarUrl, displayName) {
    return new GreetingsCard()
      .setAvatar(avatarUrl)
      .setDisplayName(displayName)
      .setType("Профіль")
      .setMessage("Ваш профіль користувача")
      .setMessage2("Створено за допомогою Ayi");
  }
}