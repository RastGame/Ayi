export function replacePlaceholders(text, message) {
  return text
    .replace(/\{\{user\}\}/g, message.Author.Link )
    .replace(/\{\{dialog\}\}/g, message.Dialog.Name)
    .replace(/\{\{userId\}\}/g, message.Author.ID)
    .replace(/\{\{dialogId\}\}/g, message.Dialog.ID)
    .replace(/\{user\}/g, message.Author.Name);
}