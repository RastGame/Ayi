import pkg from '../../../package.json' with { type: 'json' };
import { Version } from 'yurba.js';

const clockIcons = [
  ':clock12:', ':clock1230:',
  ':clock1:', ':clock130:',
  ':clock2:', ':clock230:',
  ':clock3:', ':clock330:',
  ':clock4:', ':clock430:',
  ':clock5:', ':clock530:',
  ':clock6:', ':clock630:',
  ':clock7:', ':clock730:',
  ':clock8:', ':clock830:',
  ':clock9:', ':clock930:',
  ':clock10:', ':clock1030:',
  ':clock11:', ':clock1130:'
];

// вибирає іконку за часом роботи
function getClockIcon(uptimeSeconds) {
  const totalMinutes = Math.floor(uptimeSeconds / 60);
  const iconIndex = Math.floor((totalMinutes % (24 * 60)) / 30);
  return clockIcons[iconIndex];
}

// перетворює uptime у стиль "2 години", "1 день", "5 днів", "тиждень"
function formatRelativeTime(seconds) {
  const units = [
    { limit: 60, divisor: 1, singular: 'секунда', plural: 'секунди', plural5: 'секунд' },
    { limit: 3600, divisor: 60, singular: 'хвилина', plural: 'хвилини', plural5: 'хвилин' },
    { limit: 86400, divisor: 3600, singular: 'година', plural: 'години', plural5: 'годин' },
    { limit: 604800, divisor: 86400, singular: 'день', plural: 'дні', plural5: 'днів' },
    { limit: Infinity, divisor: 604800, singular: 'тиждень', plural: 'тижні', plural5: 'тижнів' }
  ];

  for (const unit of units) {
    if (seconds < unit.limit) {
      const value = Math.floor(seconds / unit.divisor);
      const word = getUkrainianPlural(value, unit.singular, unit.plural, unit.plural5);
      return `${value} ${word}`;
    }
  }
}

// правильні закінчення для українських числівників
function getUkrainianPlural(number, one, few, many) {
  const n = Math.abs(number);
  const lastDigit = n % 10;
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return many;
  if (lastDigit === 1) return one;
  if (lastDigit >= 2 && lastDigit <= 4) return few;
  return many;
}

export default {
  name: 'info',
  handler: async (client, message) => {
    const uptime = process.uptime();
    const commandsCount = client.getCommands?.().length || 0;

    const clockIcon = getClockIcon(uptime);
    const relativeTime = formatRelativeTime(uptime);

    const infoText = [
      `:flower: **Ayi\`v${pkg.version}\`**`,
      `╭───────────────────────────────╮`,
      `₊ :pigeon: ⊹ Розробник: @${pkg.author}`,
      `₊ :game_die: ⊹ Команд: *${commandsCount}*`,
      `₊ ${clockIcon} ⊹ У мережі: *${relativeTime}*`,
      ``,
      `• Node.js: ${process.version}`,
      `• Yurba.js: v${Version || 'N/A'}`,
      `╰───────────────────────────────╯`,
    ].join('\n');

    await message.reply(infoText);
  }
};
