const cooldowns = new Map();

export function withCooldown(handler, cooldownTime = 5000, maxUses = 3) {
  return (message, args) => {
    const userId = message.Author.ID;
    const now = Date.now();
    const key = `${handler.name}_${userId}`;
    
    if (!cooldowns.has(key)) {
      cooldowns.set(key, { uses: 0, resetTime: now + cooldownTime });
    }
    
    const userCooldown = cooldowns.get(key);
    
    if (now > userCooldown.resetTime) {
      userCooldown.uses = 0;
      userCooldown.resetTime = now + cooldownTime;
    }
    
    if (userCooldown.uses >= maxUses) {
      const timeLeft = Math.ceil((userCooldown.resetTime - now) / 1000);
      message.reply(`⏰ Зачекайте ${timeLeft} секунд`);
      return;
    }
    
    userCooldown.uses++;
    return handler(message, args);
  };
}

export function adminOnly(handler) {
  return (message, args) => {
    if (message.Author.ID !== 1111) {
      message.reply('❌ У вас не достатньо прав');
      return;
    }
    return handler(message, args);
  };
}