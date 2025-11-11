export function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remainingHours = hours % 24;
    if (remainingHours > 0) {
      return `${days} д. ${remainingHours} год.`;
    }
    return `${days} д.`;
  }
  
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    if (remainingMinutes > 0) {
      return `${hours} год. ${remainingMinutes} хв.`;
    }
    return `${hours} год.`;
  }
  
  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    if (remainingSeconds > 0) {
      return `${minutes} хв. ${remainingSeconds} с.`;
    }
    return `${minutes} хв.`;
  }
  
  return `${seconds} с.`;
}