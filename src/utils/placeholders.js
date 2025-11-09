export function replacePlaceholders(text, user, dialog) {
  if (!text || typeof text !== 'string') return text;
  
  const now = new Date();
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('uk-UA');
  };
  
  return text
    // User placeholders
    .replace(/\{user\}/g, `@${user?.Link || 'unknown'}`)
    .replace(/\{\{user\.name\}\}/g, user?.Name || '')
    .replace(/\{\{user\.surname\}\}/g, user?.Surname || '')
    .replace(/\{\{user\.registration_at\}\}/g, user?.RegisterDate ? formatDate(user.RegisterDate) : '')
    .replace(/\{\{user\.id\}\}/g, user?.ID || '')
    .replace(/\{\{user\.about\}\}/g, user?.About || '')
    .replace(/\{\{user\.avatar\}\}/g, user?.Avatar || '')
    .replace(/\{\{user\.avatar\.url\}\}/g, user?.Avatar ? `https://cdn.yurba.one/photos/${user.Avatar}.jpg` : '')
    
    // Dialog placeholders
    .replace(/\{dialog\}/g, dialog?.Link || '')
    .replace(/\{\{dialog\.id\}\}/g, dialog?.ID || '')
    .replace(/\{\{dialog\.name\}\}/g, dialog?.Name || '')
    .replace(/\{\{dialog\.members\}\}/g, dialog?.Members || '')
    .replace(/\{\{dialog\.description\}\}/g, dialog?.Description || '')
    .replace(/\{\{dialog\.avatar\}\}/g, dialog?.Avatar || '')
    .replace(/\{\{dialog\.avatar\.url\}\}/g, dialog?.Avatar ? `https://cdn.yurba.one/photos/${dialog.Avatar}.jpg` : '')
    .replace(/\{\{dialog\.author\.name\}\}/g, dialog?.Author?.Name || '')
    .replace(/\{\{dialog\.author\.id\}\}/g, dialog?.Author?.ID || '')
    .replace(/\{\{dialog\.author\.link\}\}/g, dialog?.Author?.Link || '')
    
    // Time placeholder
    .replace(/\{time\}/g, now.toLocaleTimeString('uk-UA'));
}