export function replaceTemplateVariables(text, variables = {}) {
  if (typeof text !== 'string') return text;
  
  return text.replace(/\{([^}]+)\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
}

export function processCommandData(data, variables = {}) {
  if (Array.isArray(data)) {
    return data.map(item => processCommandData(item, variables));
  }
  
  if (typeof data === 'object' && data !== null) {
    const processed = {};
    for (const [key, value] of Object.entries(data)) {
      processed[key] = processCommandData(value, variables);
    }
    return processed;
  }
  
  return replaceTemplateVariables(data, variables);
}