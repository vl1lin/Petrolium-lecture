// ============================================
// АВТОМАТИЧЕСКАЯ ЗАГРУЗКА MARKDOWN ФАЙЛОВ
// ============================================
// Этот скрипт преобразует markdown файлы в HTML автоматически

/**
 * Преобразует markdown в HTML
 * @param {string} markdown - markdown текст
 * @returns {string} HTML
 */
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
    
    // Ссылки
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Разрывы строк
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Очищаем пустые теги
    html = html.replace(/<p><\/p>/g, '');
    
    return html;
}

/**
 * Загружает markdown файл
 * @param {string} path - путь к файлу
 * @returns {Promise<string>} содержимое файла
 */
async function loadMarkdownFile(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            console.warn(`⚠️ Не удалось загрузить ${path}`);
            return '';
        }
        return await response.text();
    } catch (error) {
        console.error(`❌ Ошибка при загрузке ${path}:`, error);
        return '';
    }
}

// Экспортируем функции для использования
window.MarkdownLoader = {
    markdownToHtml,
    loadMarkdownFile
};