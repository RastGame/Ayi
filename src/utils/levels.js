class LevelUtils {
  // ======================
  // ЛОКАЛЬНІ РІВНІ (групи)
  // ======================
  static getLocalLevel(xp) {
    if (xp < 1000) return 0;
    let level = 1;
    while (xp >= this.getLocalXPForLevel(level + 1)) {
      level++;
    }
    return level;
  }

  static getLocalXPForLevel(level) {
    if (level <= 1) return 1000;
    // Оновлена формула для більш реалістичного прогресу на високих рівнях
    return Math.floor(1000 + 300 * Math.pow(level - 1, 1.6));
  }

  static getLocalNextLevelXP(currentXP) {
    const currentLevel = this.getLocalLevel(currentXP);
    return this.getLocalXPForLevel(currentLevel + 1);
  }

  static getLocalCurrentLevelXP(xp) {
    const level = this.getLocalLevel(xp);
    return level <= 0 ? 0 : this.getLocalXPForLevel(level);
  }

  static getLocalProgressXP(xp) {
    const currentLevelXP = this.getLocalCurrentLevelXP(xp);
    return xp - currentLevelXP;
  }

  static getLocalRequiredXP(xp) {
    const nextLevelXP = this.getLocalNextLevelXP(xp);
    const currentLevelXP = this.getLocalCurrentLevelXP(xp);
    return nextLevelXP - currentLevelXP;
  }

  // ======================
  // ГЛОБАЛЬНІ РІВНІ (профілі)
  // ======================
  static getGlobalLevel(xp) {
    if (xp < 1000) return 0;
    let level = 1;
    while (xp >= this.getGlobalXPForLevel(level + 1)) {
      level++;
    }
    return level;
  }

  static getGlobalXPForLevel(level) {
    // Глобальна система з експоненційним ростом
    return Math.floor(1000 * Math.pow(level, 1.4));
  }

  static getGlobalNextLevelXP(currentXP) {
    const currentLevel = this.getGlobalLevel(currentXP);
    return this.getGlobalXPForLevel(currentLevel + 1);
  }

  static getGlobalCurrentLevelXP(xp) {
    const level = this.getGlobalLevel(xp);
    return level <= 0 ? 0 : this.getGlobalXPForLevel(level);
  }

  static getGlobalProgressXP(xp) {
    const currentLevelXP = this.getGlobalCurrentLevelXP(xp);
    return xp - currentLevelXP;
  }

  static getGlobalRequiredXP(xp) {
    const nextLevelXP = this.getGlobalNextLevelXP(xp);
    const currentLevelXP = this.getGlobalCurrentLevelXP(xp);
    return nextLevelXP - currentLevelXP;
  }
}

export { LevelUtils };
