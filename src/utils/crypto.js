import crypto from 'crypto';

export function encryptToken(token) {
  const key = crypto.createHash('sha256').update(process.env.ENC).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

export function decryptToken(encryptedToken) {
  const [ivHex, encrypted] = encryptedToken.split(':');
  const key = crypto.createHash('sha256').update(process.env.ENC).digest();
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}