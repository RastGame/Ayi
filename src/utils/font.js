import { Font } from "canvacord";

export async function initFont() {
  try {
    await Font.fromFile('./src/fonts/DejaVuSans.ttf', 'DejaVuSans');
    console.log('Шрифт DejaVuSans успішно завантажено');
  } catch (error) {
    console.log('Не вдалося завантажити шрифт DejaVuSans, використовується шрифт за замовчуванням');
    Font.loadDefault();
  }
}