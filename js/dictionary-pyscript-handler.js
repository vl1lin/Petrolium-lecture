// Загрузка и отображение словаря
let vocabularyData = [];
let filteredData = [];

// Загрузить словарь при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadVocabulary();
    setupEventListeners();
});

// Загрузка JSON файла со словарем
async function loadVocabulary() {
    try {
        const response = await fetch('data/vocabulary.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        vocabularyData = data.vocabulary;
        filteredData = [...vocabularyData];
        
        // Загружаем категории и отображаем словарь
        loadCategories();
        displayDictionary(filteredData);
    } catch (error) {
        console.error('Ошибка при загрузке словаря:', error);
        document.getElementById('dictionary-cards').innerHTML = 
            '<p style="color: red;">Ошибка при загрузке словаря. Пожалуйста, обновите страницу.</p>';
    }
}

// Загрузить уникальные категории
function loadCategories() {
    const categorySelect = document.getElementById('category-filter');
    const categories = new Set();
    
    vocabularyData.forEach(item => {
        if (item.partOfSpeech) {
            categories.add(item.partOfSpeech);
        }
    });
    
    // Добавить категории в select
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Отобразить карточки словаря
function displayDictionary(data) {
    const container = document.getElementById('dictionary-cards');
    
    if (data.length === 0) {
        container.innerHTML = '<p>По вашему запросу ничего не найдено.</p>';
        return;
    }
    
    container.innerHTML = data.map(item => `
        <div class="dictionary-card">
            <div class="card-header">
                <h3 class="card-title">${item.english}</h3>
                <span class="card-pos">${item.partOfSpeech}</span>
            </div>
            <div class="card-body">
                <div class="card-translation">
                    <strong>Русский:</strong> ${item.russian}
                </div>
                ${item.pronunciation ? `
                    <div class="card-pronunciation">
                        <strong>Произношение:</strong> ${item.pronunciation}
                    </div>
                ` : ''}
                <div class="card-definition">
                    <strong>Определение:</strong>
                    <div class="lang-content">
                        <span class="lang-label">EN:</span> ${item.definition.en}
                    </div>
                    <div class="lang-content">
                        <span class="lang-label">RU:</span> ${item.definition.ru}
                    </div>
                </div>
                <div class="card-example">
                    <strong>Пример:</strong>
                    <div class="lang-content">
                        <span class="lang-label">EN:</span> ${item.example.en}
                    </div>
                    <div class="lang-content">
                        <span class="lang-label">RU:</span> ${item.example.ru}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Функция поиска
function performSearch() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    
    filteredData = vocabularyData.filter(item => {
        const matchesSearch = !searchInput || 
            item.english.toLowerCase().includes(searchInput) ||
            item.russian.toLowerCase().includes(searchInput) ||
            item.definition.en.toLowerCase().includes(searchInput) ||
            item.definition.ru.toLowerCase().includes(searchInput);
        
        const matchesCategory = categoryFilter === 'all' || item.partOfSpeech === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    sortDictionary();
    displayDictionary(filteredData);
}

// Функция сортировки
function sortDictionary() {
    const sortSelect = document.getElementById('sort-select').value;
    
    switch(sortSelect) {
        case 'alpha-en':
            filteredData.sort((a, b) => a.english.localeCompare(b.english));
            break;
        case 'alpha-ru':
            filteredData.sort((a, b) => a.russian.localeCompare(b.russian, 'ru'));
            break;
        case 'original':
        default:
            filteredData.sort((a, b) => a.id - b.id);
    }
}

// Установить обработчики событий
function setupEventListeners() {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-select');
    
    // Поиск по клику на кнопку
    searchBtn.addEventListener('click', performSearch);
    
    // Поиск при вводе текста (с задержкой)
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });
    
    // Фильтрация по категориям
    categoryFilter.addEventListener('change', performSearch);
    
    // Сортировка
    sortSelect.addEventListener('change', () => {
        sortDictionary();
        displayDictionary(filteredData);
    });
    
    // Поиск при нажатии Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}
