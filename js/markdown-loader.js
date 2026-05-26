// ============================================
// АВТОМАТИЧЕСКАЯ ЗАГРУЗКА MARKDOWN ФАЙЛОВ
// ============================================
// Этот скрипт преобразует markdown файлы в HTML автоматически
// с поддержкой LaTeX формул и таблиц

// Загружаем внешние библиотеки
const script1 = document.createElement('script');
script1.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
document.head.appendChild(script1);

const script2 = document.createElement('script');
script2.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js';
document.head.appendChild(script2);

const script3 = document.createElement('script');
script3.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/auto-render.min.js';
document.head.appendChild(script3);

// Загружаем стили KaTeX
const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css';
document.head.appendChild(style);

/**
 * Преобразует markdown в HTML с поддержкой таблиц и формул
 * @param {string} markdown - markdown текст
 * @returns {string} HTML
 */
function markdownToHtml(markdown) {
    // Проверяем, загружен ли marked
    if (typeof marked === 'undefined') {
        console.warn('⚠️ marked.js еще не загружен, используем встроенный парсер');
        return basicMarkdownToHtml(markdown);
    }

    // Конфигурируем marked для поддержки таблиц
    marked.setOptions({
        breaks: true,
        gfm: true, // GitHub Flavored Markdown (таблицы, зачеркивание и т.д.)
        pedantic: false
    });

    try {
        let html = marked.parse(markdown);

        // Оборачиваем блоки кода в специальные контейнеры
        html = html.replace(/<pre><code class="language-([^"]+)">([^<]+)<\/code><\/pre>/g, 
            '<pre class="code-block language-$1"><code>$2</code></pre>');
        
        html = html.replace(/<pre><code>([^<]+)<\/code><\/pre>/g, 
            '<pre class="code-block"><code>$1</code></pre>');

        return html;
    } catch (error) {
        console.error('❌ Ошибка при парсинге markdown:', error);
        return basicMarkdownToHtml(markdown);
    }
}

/**
 * Резервный встроенный парсер markdown
 * (используется если marked.js не загружен)
 */
function basicMarkdownToHtml(markdown) {
    let html = markdown;
    
    // Заголовки (H1 - H6) - обработка в правильном порядке
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
 * Рендерит LaTeX формулы в HTML
 * @param {HTMLElement} element - элемент, содержащий формулы
 */
function renderMathFormulas(element) {
    // Ждем загрузки KaTeX
    const checkKaTeX = setInterval(() => {
        if (typeof window.renderMathInElement !== 'undefined') {
            clearInterval(checkKaTeX);
            try {
                window.renderMathInElement(element, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false}
                    ],
                    throwOnError: false
                });
                console.log('✓ LaTeX формулы успешно отрендерены');
            } catch (error) {
                console.warn('⚠️ Ошибка при рендеринге формул:', error);
            }
        }
    }, 100);

    // Таймаут на случай, если KaTeX не загружается
    setTimeout(() => clearInterval(checkKaTeX), 5000);
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
    loadMarkdownFile,
    renderMathFormulas
};
