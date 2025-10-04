import { GreetingsCard } from "../../test.js";

export class RankCard {
  static create(avatarUrl, displayName, level, xp) {
    return new GreetingsCard()
      .setAvatar(avatarUrl)
      .setDisplayName(displayName)
      .setType("Рівень")
      .setMessage(`Рівень: ${level}`)
      .setMessage2(`XP: ${xp}`);
  }
}