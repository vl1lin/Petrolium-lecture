// ============================================
// ЗАГРУЗКА ТЕКСТА ЛЕКЦИИ И ПЕРЕКЛЮЧЕНИЕ ЯЗЫКОВ
// ============================================

// Получаем элементы
const langButtons = document.querySelectorAll('.lang-btn');
const lectureTexts = document.querySelectorAll('.lecture-text');

// ============================================
// МЕСТО ДЛЯ PYSCRIPT: Инициализация данных
// ============================================

// Загружаем лекции из JSON
async function loadLectures() {
    try {
        const response = await fetch('data/lectures.json');
        const data = await response.json();
        
        // Вставляем английский текст
        document.getElementById('lecture-en').innerHTML = data.en;
        
        // Вставляем русский текст
        document.getElementById('lecture-ru').innerHTML = data.ru;
        
        console.log('Лекции успешно загружены');
    } catch (error) {
        console.error('Ошибка при загрузке лекций:', error);
        document.getElementById('lecture-en').innerHTML = '<p>Ошибка при загрузке контента.</p>';
        document.getElementById('lecture-ru').innerHTML = '<p>Ошибка при загрузке контента.</p>';
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
    loadLectures();
    restoreLanguage();
});
