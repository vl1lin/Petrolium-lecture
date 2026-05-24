// ============================================
// ПЕРЕКЛЮЧЕНИЕ ТЕМЫ (СВЕТЛАЯ/ТЕМНАЯ)
// ============================================

// Получаем кнопку переключения темы
const themeToggle = document.getElementById('theme-toggle');

// Проверяем сохраненную тему в локальном хранилище
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    } else if (prefersDark) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
    
    updateThemeIcon();
}

// Обновляем иконку в зависимости от текущей темы
function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-theme');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
}

// Переключаем тему при клике
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
});

// Инициализируем тему при загрузке
document.addEventListener('DOMContentLoaded', initTheme);
