// ============================================
// ЗАГРУЗКА ТЕКСТА ЛЕКЦИИ И ПЕРЕКЛЮЧЕНИЕ ЯЗЫКОВ
// ============================================

// Получаем элементы
const langButtons = document.querySelectorAll('.lang-btn');
const lectureTexts = document.querySelectorAll('.lecture-text');

/**
 * Загружает лекцию из markdown файлов или JSON
 * Приоритет: markdown файлы > JSON файл
 */
async function loadLecture() {
    try {
        let lectureData = null;

        // Пытаемся загрузить markdown файлы
        const enMarkdown = await window.MarkdownLoader.loadMarkdownFile('lectures/lecture.en.md');
        const ruMarkdown = await window.MarkdownLoader.loadMarkdownFile('lectures/lecture.ru.md');

        // Если оба файла успешно загружены
        if (enMarkdown && ruMarkdown) {
            console.log('📄 Загрузка из markdown файлов...');
            lectureData = {
                lecture: {
                    en: enMarkdown,
                    ru: ruMarkdown
                }
            };
        } else {
            // Если markdown файлов нет, используем JSON
            console.log('📋 Загрузка из lecture.json...');
            const response = await fetch('data/lecture.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            lectureData = await response.json();
        }

        // Преобразуем Markdown в HTML
        const htmlEn = window.MarkdownLoader.markdownToHtml(lectureData.lecture.en);
        const htmlRu = window.MarkdownLoader.markdownToHtml(lectureData.lecture.ru);

        // Вставляем преобразованный текст
        document.getElementById('lecture-en').innerHTML = htmlEn;
        document.getElementById('lecture-ru').innerHTML = htmlRu;

        // Рендерим LaTeX-формулы через MathJax
        if (window.MathJax && window.MathJax.typesetPromise) {
            await window.MathJax.typesetPromise();
        }

        console.log('✓ Лекция успешно загружена и преобразована');
    } catch (error) {
        console.error('✗ Ошибка при загрузке лекции:', error);
        const errorMessage = '<p style="color: red;">Ошибка при загрузке контента. Проверьте консоль браузера.</p>';
        document.getElementById('lecture-en').innerHTML = errorMessage;
        document.getElementById('lecture-ru').innerHTML = errorMessage;
    }
}

// ============================================
// ПЕРЕКЛЮЧЕНИЕ ЯЗЫКОВ
// ============================================

langButtons.forEach(button => {
    button.addEventListener('click', () => {
        const lang = button.dataset.lang;
        
        // Удаляем активный класс со всех кнопок
        langButtons.forEach(btn => btn.classList.remove('lang-btn-active'));
        
        // Добавляем активный класс к нажатой кнопке
        button.classList.add('lang-btn-active');
        
        // Скрываем все тексты лекции
        lectureTexts.forEach(text => text.classList.remove('active'));
        
        // Показываем выбранный текст
        document.getElementById(`lecture-${lang}`).classList.add('active');
        
        // Сохраняем выбор языка
        localStorage.setItem('lectureLanguage', lang);
    });
});

// ============================================
// ВОССТАНОВЛЕНИЕ ПОСЛЕДНЕГО ВЫБРАННОГО ЯЗЫКА
// ============================================

function restoreLanguage() {
    const savedLang = localStorage.getItem('lectureLanguage') || 'en';
    const button = document.querySelector(`[data-lang="${savedLang}"]`);
    if (button) {
        button.click();
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadLecture();
    restoreLanguage();
});