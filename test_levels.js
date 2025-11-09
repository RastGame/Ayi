import { LevelUtils } from './src/utils/levels.js';

// Тестування локальних рівнів
console.log('=== ЛОКАЛЬНІ РІВНІ ===');
console.log('XP для рівня 1:', LevelUtils.getLocalXPForLevel(1)); // 1000
console.log('XP для рівня 2:', LevelUtils.getLocalXPForLevel(2)); // 1200
console.log('XP для рівня 3:', LevelUtils.getLocalXPForLevel(3)); // 1565
console.log('XP для рівня 4:', LevelUtils.getLocalXPForLevel(4)); // 2036
console.log('XP для рівня 25:', LevelUtils.getLocalXPForLevel(25))
console.log('XP для рівня 26:', LevelUtils.getLocalXPForLevel(26))


console.log('\n=== Тест визначення локального рівня ===');
console.log('500 XP = рівень', LevelUtils.getLocalLevel(500)); // 1
console.log('1000 XP = рівень', LevelUtils.getLocalLevel(1000)); // 1
console.log('1200 XP = рівень', LevelUtils.getLocalLevel(1200)); // 2
console.log('1565 XP = рівень', LevelUtils.getLocalLevel(1565)); 
console.log('25484 XP = рівень', LevelUtils.getLocalLevel(25484)); 

console.log('\n=== Тест локального прогресу ===');
console.log('1100 XP:');
console.log('  Рівень:', LevelUtils.getLocalLevel(1100));
console.log('  Прогрес:', LevelUtils.getLocalProgressXP(1100));
console.log('  Потрібно:', LevelUtils.getLocalRequiredXP(1100));

console.log('\n=== Тест локального прогресу ===');
console.log('25484 XP:');
console.log('  Рівень:', LevelUtils.getLocalLevel(25484));
console.log('  Прогрес:', LevelUtils.getLocalProgressXP(25484));
console.log('  Потрібно:', LevelUtils.getLocalRequiredXP(25484));

// Тестування глобальних рівнів
console.log('\n=== ГЛОБАЛЬНІ РІВНІ ===');
console.log('XP для рівня 1:', LevelUtils.getGlobalXPForLevel(1)); // 1000
console.log('XP для рівня 2:', LevelUtils.getGlobalXPForLevel(2)); // ~2639
console.log('XP для рівня 3:', LevelUtils.getGlobalXPForLevel(3)); // ~4932

console.log('\n=== Тест визначення глобального рівня ===');
console.log('500 XP = рівень', LevelUtils.getGlobalLevel(500)); // 1
console.log('1000 XP = рівень', LevelUtils.getGlobalLevel(1000)); // 1
console.log('2639 XP = рівень', LevelUtils.getGlobalLevel(2639)); // 2
console.log('4932 XP = рівень', LevelUtils.getGlobalLevel(4932)); // 3
console.log('8115 XP = рівень', LevelUtils.getGlobalLevel(8115)); 
console.log('25484 XP = рівень', LevelUtils.getGlobalLevel(25484)); 

console.log('\n=== Тест глобального прогресу ===');
console.log('2000 XP:');
console.log('  Рівень:', LevelUtils.getGlobalLevel(2000));
console.log('  Прогрес:', LevelUtils.getGlobalProgressXP(2000));
console.log('  Потрібно:', LevelUtils.getGlobalRequiredXP(2000));

console.log('\n=== Тест глобального прогресу ===');
console.log('8115 XP:');
console.log('  Рівень:', LevelUtils.getGlobalLevel(8115));
console.log('  Прогрес:', LevelUtils.getGlobalProgressXP(8115));
console.log('  Потрібно:', LevelUtils.getGlobalRequiredXP(8115));

console.log('\n=== Тест глобального прогресу ===');
console.log('25484 XP:');
console.log('  Рівень:', LevelUtils.getGlobalLevel(25484));
console.log('  Прогрес:', LevelUtils.getGlobalProgressXP(25484));
console.log('  Потрібно:', LevelUtils.getGlobalRequiredXP(25484));