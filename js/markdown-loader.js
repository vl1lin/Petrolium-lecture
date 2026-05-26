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

    // Заголовки (H1 - H6)
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