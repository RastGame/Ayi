export const PERMS = {
  WRITE: 1,          // 2^0 — може писати повідомлення
  DELETE_MSG: 2,     // 2^1 — може видаляти повідомлення
  EDIT_MSG: 4,       // 2^2 — може редагувати чужі повідомлення
  EDIT_GROUP: 8,     // 2^3 — може змінювати назву, опис, аватар групи
  KICK: 16,          // 2^4 — може вигнати користувача
  BAN: 32,           // 2^5 — може забанити користувача
  MUTE: 64,          // 2^6 — може тимчасово зам'ютити користувача
  MANAGE_PERMS: 128, // 2^7 — може надавати/забирати права
  MANAGE_ADMINS: 256,// 2^8 — може додавати/прибирати адміністраторів
  ADMIN: 512         // 2^9 — має всі права
};

export const PERM_NAMES = {
  [PERMS.WRITE]: 'Писати повідомлення',
  [PERMS.DELETE_MSG]: 'Видаляти повідомлення',
  [PERMS.EDIT_MSG]: 'Редагувати повідомлення',
  [PERMS.EDIT_GROUP]: 'Редагувати групу',
  [PERMS.KICK]: 'Вигнати користувача',
  [PERMS.BAN]: 'Забанити користувача',
  [PERMS.MUTE]: 'Зам\'ютити користувача',
  [PERMS.MANAGE_PERMS]: 'Керувати правами',
  [PERMS.MANAGE_ADMINS]: 'Керувати адмінами',
  [PERMS.ADMIN]: 'Адміністратор'
};

export function hasPermission(userPerms, requiredPerm) {
  return (userPerms & requiredPerm) === requiredPerm || (userPerms & PERMS.ADMIN) === PERMS.ADMIN;
}

export function addPermission(userPerms, perm) {
  return userPerms | perm;
}

export function removePermission(userPerms, perm) {
  return userPerms & ~perm;
}

export function getPermissionsList(userPerms) {
  const perms = [];
  for (const [value, name] of Object.entries(PERM_NAMES)) {
    if (hasPermission(userPerms, parseInt(value))) {
      perms.push(name);
    }
  }
  return perms;
}