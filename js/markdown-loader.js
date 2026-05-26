// ============================================
// АВТОМАТИЧЕСКАЯ ЗАГРУЗКА MARKDOWN ФАЙЛОВ
// ============================================
// Этот скрипт преобразует markdown файлы в HTML автоматически
// с поддержкой LaTeX формул и таблиц

// KaTeX CSS
const katexStyle = document.createElement('link');
katexStyle.rel = 'stylesheet';
katexStyle.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css';
document.head.appendChild(katexStyle);

// marked.js (v4 — стабильное API)
const scriptMarked = document.createElement('script');
scriptMarked.src = 'https://cdn.jsdelivr.net/npm/marked@4/marked.min.js';
document.head.appendChild(scriptMarked);

// KaTeX → после загрузки KaTeX загружаем auto-render (порядок важен!)
const scriptKatex = document.createElement('script');
scriptKatex.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js';
scriptKatex.onload = function () {
    const scriptAutoRender = document.createElement('script');
    scriptAutoRender.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/auto-render.min.js';
    document.head.appendChild(scriptAutoRender);
};
document.head.appendChild(scriptKatex);

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
        // Защищаем LaTeX-формулы до того, как marked обработает текст
        const latexPlaceholders = [];

        let protected_md = markdown;

        protected_md = protected_md.replace(/\$\$([\s\S]+?)\$\$/g, (match) => {
            const key = `LATEX_BLOCK_${latexPlaceholders.length}_ENDLATEX`;
            latexPlaceholders.push({ key, content: match });
            return key;
        });

        protected_md = protected_md.replace(/\$([^\$\n]+?)\$/g, (match) => {
            const key = `LATEX_INLINE_${latexPlaceholders.length}_ENDLATEX`;
            latexPlaceholders.push({ key, content: match });
            return key;
        });

        let html = marked.parse(protected_md);

        // Восстанавливаем LaTeX-формулы
        latexPlaceholders.forEach(({ key, content }) => {
            html = html.split(key).join(content);
        });

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

    // Шаг 1: Защищаем LaTeX-формулы от markdown-преобразований
    const latexPlaceholders = [];

    // Сначала — блочные формулы $$...$$
    html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match) => {
        const key = `LATEX_BLOCK_${latexPlaceholders.length}_ENDLATEX`;
        latexPlaceholders.push({ key, content: match });
        return key;
    });

    // Затем — строчные формулы $...$
    html = html.replace(/\$([^\$\n]+?)\$/g, (match) => {
        const key = `LATEX_INLINE_${latexPlaceholders.length}_ENDLATEX`;
        latexPlaceholders.push({ key, content: match });
        return key;
    });

    // Заголовки (H1 - H6) - обработка в правильном порядке
    html = html.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    // Блок кода (многострочный) — до жирного/курсива
    html = html.replace(/```[\s\S]*?```/g, (match) => {
        const inner = match.replace(/^```\w*\n?/, '').replace(/\n?```$/, '');
        return `<pre><code>${inner}</code></pre>`;
    });

    // Жирный текст
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Курсив
    html = html.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');

    // Код (одна строка)
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Горизонтальная черта
    html = html.replace(/^---$/gm, '<hr>');

    // Таблицы
    html = html.replace(/^(\|.+\|\n)(\|[-| :]+\|\n)((?:\|.+\|\n?)*)/gm, (match, headerRow, sepRow, bodyRows) => {
        const parseCells = (row) => row.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1).map(c => c.trim());
        const headers = parseCells(headerRow);
        const rows = bodyRows.trim().split('\n').filter(Boolean);
        let table = '<table>\n<thead>\n<tr>';
        headers.forEach(h => { table += `<th>${h}</th>`; });
        table += '</tr>\n</thead>\n<tbody>\n';
        rows.forEach(row => {
            const cells = parseCells(row);
            table += '<tr>';
            cells.forEach(c => { table += `<td>${c}</td>`; });
            table += '</tr>\n';
        });
        table += '</tbody>\n</table>';
        return table;
    });

    // Цитаты
    html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

    // Нумерованные списки
    html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (match) => {
        const items = match.trim().split('\n').map(l => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('\n');
        return `<ol>\n${items}\n</ol>`;
    });

    // Ненумерованные списки
    html = html.replace(/((?:^- .+\n?)+)/gm, (match) => {
        const items = match.trim().split('\n').map(l => `<li>${l.replace(/^- /, '')}</li>`).join('\n');
        return `<ul>\n${items}\n</ul>`;
    });

    // Ссылки
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Параграфы — двойной перенос строки, не касаясь блочных тегов
    html = html.replace(/\n\n(?!<(?:h[1-6]|ul|ol|li|table|blockquote|pre|hr))/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // Очищаем пустые и лишние теги
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<(?:h[1-6]|ul|ol|table|blockquote|pre|hr)[^>]*>)/g, '$1');
    html = html.replace(/(<\/(?:h[1-6]|ul|ol|table|blockquote|pre)>)<\/p>/g, '$1');

    // Шаг 2: Восстанавливаем LaTeX-формулы
    latexPlaceholders.forEach(({ key, content }) => {
        html = html.split(key).join(content);
    });

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
