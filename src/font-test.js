import { Font, JSX, Builder } from "canvacord";
import { writeFile } from "fs/promises";
import { join } from "path";

// Завантаження шрифтів
async function loadFonts() {
  try {
    const font = await Font.fromFile('./src/fonts/DejaVuSans.ttf', 'DejaVuSans');
    console.log('Шрифт DejaVuSans успішно завантажено');
    return font;
  } catch (error) {
    console.log('Не вдалося завантажити шрифт DejaVuSans, використовується шрифт за замовчуванням');
    return Font.loadDefault();
  }
}

// Створення простої карточки для тестування
class TestCard extends Builder {
  constructor() {
    super(800, 200);
    this.bootstrap({
      text: "Тест українських літер: а б в г ґ д е є ж з и і ї й к л м н о п р с т у ф х ц ч ш щ ь ю я"
    });
  }

  async render() {
    const { text } = this.options.getOptions();

    return JSX.createElement(
      "div",
      {
        className: "h-full w-full flex items-center justify-center bg-[#23272A]",
        style: {
          fontFamily: "DejaVuSans, Arial, sans-serif"
        }
      },
      JSX.createElement(
        "h1",
        { 
          className: "text-3xl text-white",
          style: {
            fontFamily: "DejaVuSans, Arial, sans-serif"
          }
        },
        text
      )
    );
  }
}

// Генерація тестової карточки
async function generateTestCard() {
  try {
    // Завантаження шрифтів
    await loadFonts();
    
    const card = new TestCard();
    const imageBuffer = await card.build({ format: "png" });
    
    // Збереження зображення
    const outputPath = join(process.cwd(), "temp", "ukrainian-test-card.png");
    await writeFile(outputPath, imageBuffer);
    
    console.log(`Тестову карточку збережено до: ${outputPath}`);
    console.log("Перевірте, чи правильно відображаються українські літери на зображенні.");
  } catch (error) {
    console.error("Помилка при генерації тестової карточки:", error);
  }
}

// Запуск тесту
generateTestCard();