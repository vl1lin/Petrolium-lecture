// ============================================
// ЗАГРУЗКА ТЕКСТА ЛЕКЦИИ И ПЕРЕКЛЮЧЕНИЕ ЯЗЫКОВ
// ============================================

// Получаем элементы
const langButtons = document.querySelectorAll('.lang-btn');
const lectureTexts = document.querySelectorAll('.lecture-text');

// ============================================
// MARKDOWN ПРЕОБРАЗОВАТЕЛЬ
// ============================================

function markdownToHtml(markdown) {
    let html = markdown;
    
    // Заголовки (H1 - H6)
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    // Жирный текст
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // Курсив
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Код (одна строка)
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Блок кода (многострочный)
    html = html.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
    
    // Списки (ненумерованные)
    html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\n<ul>/g, '');
    
    // Таблицы (простые)
    html = html.replace(/\| (.*?) \|/g, '<tr><td>$1</td></tr>');
    
    // Ссылки
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Разрывы строк
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Очищаем пустые теги
    html = html.replace(/<p><\/p>/g, '');
    
    return html;
}

// ============================================
// ЗАГРУЗКА ЛЕКЦИИ ИЗ JSON
// ============================================

async function loadLecture() {
    try {
        const response = await fetch('data/lecture.json');
        const data = await response.json();
        
        // Конвертируем Markdown в HTML
        const htmlEn = markdownToHtml(data.lecture.en);
        const htmlRu = markdownToHtml(data.lecture.ru);
        
        // Вставляем преобразованный текст
        document.getElementById('lecture-en').innerHTML = htmlEn;
        document.getElementById('lecture-ru').innerHTML = htmlRu;
        
        console.log('✓ Лекция успешно загружена и преобразована');
    } catch (error) {
        console.error('✗ Ошибка при загрузке лекции:', error);
        document.getElementById('lecture-en').innerHTML = '<p style="color: red;">Ошибка при загрузке контента. Попробуйте позже.</p>';
        document.getElementById('lecture-ru').innerHTML = '<p style="color: red;">Ошибка при загрузке контента. Попробуйте позже.</p>';
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
