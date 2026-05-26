const QUESTIONS = [
    {
        text: 'Что обозначает параметр $P_b$ в PVT-анализе?',
        options: [
            'Плотность нефти при пластовых условиях',
            'Давление, при котором начинается массовое выделение газа из нефти',
            'Объёмный коэффициент расширения нефти',
            'Вязкость дегазированной нефти'
        ],
        correct: 1,
        explanation: '$P_b$ — давление насыщения, ниже которого начинается выделение свободного газа.'
    },
    {
        text: 'Почему объёмный коэффициент нефти $B_o$ всегда больше единицы?',
        options: [
            'Потому что нефть в пласте содержит растворённый газ, который при дегазации уходит',
            'Потому что плотность пластовой нефти всегда выше поверхностной',
            'Потому что температура в пласте всегда выше поверхностной',
            'Потому что $B_o$ измеряется в разных единицах'
        ],
        correct: 0,
        explanation: '$B_o > 1$, потому что пластовая нефть содержит растворённый газ, увеличивающий её объём.'
    },
    {
        text: 'Какая из перечисленных корреляций была разработана первой?',
        options: [
            'Glasø',
            'Vasquez-Beggs',
            'Standing',
            'Petrosky-Farshad'
        ],
        correct: 2,
        explanation: 'Standing (1947) — первая универсальная корреляция, остальные появились позже.'
    },
    {
        text: 'Что произойдёт с объёмным коэффициентом $B_o$ при снижении давления ниже $P_b$?',
        options: [
            '$B_o$ плавно увеличится',
            '$B_o$ останется постоянным',
            '$B_o$ резко уменьшится из-за выделения газа',
            '$B_o$ станет меньше единицы'
        ],
        correct: 2,
        explanation: 'При $P < P_b$ газ выделяется, жидкая фаза «схлопывается», $B_o$ резко падает.'
    },
    {
        text: 'Какая переменная НЕ используется в корреляции Standing для расчёта $P_b$?',
        options: [
            '$R_s$ (газосодержание)',
            '$\\gamma_g$ (удельный вес газа)',
            '$T$ (температура)',
            '$\\mu_o$ (вязкость нефти)'
        ],
        correct: 3,
        explanation: 'Standing использует $R_s$, $\\gamma_g$, $T$, $\\gamma_{\\text{API}}$, но не вязкость $\\mu_o$.'
    },
    {
        text: 'Почему корреляции, разработанные для нефтей Калифорнии (Standing), могут плохо работать для нефтей Северного моря?',
        options: [
            'Из-за разницы в глубине залегания пластов',
            'Из-за разного состава растворённых газов и полярных компонентов',
            'Из-за различий в методе отбора проб',
            'Из-за разной единицы измерения давления'
        ],
        correct: 1,
        explanation: 'Региональные различия в составе флюида (газ, смолы, асфальтены) требуют адаптации корреляций.'
    },
    {
        text: 'Какая из следующих ситуаций является категорически недопустимой при использовании корреляций?',
        options: [
            'Использование корреляции для чувствительного анализа',
            'Сравнение результатов нескольких корреляций',
            'Экстраполяция корреляции за пределы диапазона, на котором она была построена',
            'Калибровка корреляции по 2–3 лабораторным точкам'
        ],
        correct: 2,
        explanation: 'Экстраполяция за пределы обучающего диапазона даёт непредсказуемые ошибки ($>30–50\\%$).'
    },
    {
        text: 'Что из перечисленного НЕ является причиной использования корреляций вместо лабораторных PVT-исследований?',
        options: [
            'Высокая стоимость PVT-эксперимента',
            'Отсутствие глубинных проб на ранней стадии разведки',
            'Более высокая точность корреляций по сравнению с экспериментом',
            'Необходимость быстрых оценок при оперативном планировании'
        ],
        correct: 2,
        explanation: 'Корреляции менее точны, чем лабораторные данные; их используют из-за скорости, стоимости и доступности.'
    },
    {
        text: 'Какой параметр характеризует «тяжесть» нефти и используется во многих корреляциях?',
        options: [
            '$R_s$',
            '$^\\circ\\text{API}$',
            '$c_o$',
            '$\\gamma_g$'
        ],
        correct: 1,
        explanation: '$^\\circ\\text{API}$ — стандартизированная шкала плотности, ключевой параметр во многих корреляциях.'
    },
    {
        text: 'Для проектирования оборудования (сепараторы, ЭЦН) какая погрешность расчёта PVT-свойств считается допустимой?',
        options: [
            '$<5\\%$',
            '$10–15\\%$',
            '$20–30\\%$',
            'Любая, главное — использовать одну корреляцию'
        ],
        correct: 0,
        explanation: 'Для проектирования оборудования требуется высокая точность ($<5\\%$); для скрининга допустимо $10–15\\%$.'
    },
    {
        text: 'Какая корреляция лучше всего подходит для расчёта $P_b$ тяжёлой нефти ($\\text{API} < 20^\\circ$) Мексиканского залива?',
        options: [
            'Standing (1947)',
            'Glasø (1980)',
            'Vasquez-Beggs (1980)',
            'Petrosky-Farshad (1990)'
        ],
        correct: 3,
        explanation: 'Petrosky-Farshad показала высокую точность именно для тяжёлых нефтей Мексиканского залива.'
    }
];

const LABELS = ['A', 'B', 'C', 'D'];

function renderMath(element) {
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(element, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false }
            ],
            throwOnError: false
        });
    }
}

function renderQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = QUESTIONS.map((q, i) => `
        <div class="question-card" id="q-${i}">
            <div class="question-number">Вопрос ${i + 1} из ${QUESTIONS.length}</div>
            <div class="question-text">${q.text}</div>
            <ul class="options-list">
                ${q.options.map((opt, j) => `
                    <li class="option-item" id="q${i}-opt${j}">
                        <label class="option-label">
                            <input type="radio" name="q${i}" value="${j}" class="option-radio">
                            <span class="option-letter">${LABELS[j]}</span>
                            <span class="option-text">${opt}</span>
                        </label>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');

    renderMath(container);
}

function checkAnswers() {
    const unanswered = [];
    const chosen = QUESTIONS.map((_, i) => {
        const sel = document.querySelector(`input[name="q${i}"]:checked`);
        if (!sel) unanswered.push(i + 1);
        return sel ? parseInt(sel.value) : null;
    });

    if (unanswered.length > 0) {
        const nums = unanswered.join(', ');
        const word = unanswered.length === 1 ? 'вопрос' : 'вопросы';
        alert(`Пожалуйста, ответьте на все вопросы.\nНе отвечено: ${word} ${nums}`);
        return;
    }

    document.querySelectorAll('.option-radio').forEach(r => r.disabled = true);

    let correctCount = 0;

    QUESTIONS.forEach((q, i) => {
        const card = document.getElementById(`q-${i}`);
        const userAnswer = chosen[i];

        for (let j = 0; j < q.options.length; j++) {
            const item = document.getElementById(`q${i}-opt${j}`);
            if (j === q.correct) {
                item.classList.add('option-correct');
            } else if (j === userAnswer) {
                item.classList.add('option-wrong');
            }
        }

        if (userAnswer === q.correct) {
            card.classList.add('question-correct');
            correctCount++;
        } else {
            card.classList.add('question-wrong');
            const hint = document.createElement('div');
            hint.className = 'correct-hint';
            hint.innerHTML = `<strong>Правильный ответ: ${LABELS[q.correct]}</strong> — ${q.explanation}`;
            card.appendChild(hint);
        }
    });

    const pct = Math.round((correctCount / QUESTIONS.length) * 100);
    let grade;
    if (pct >= 90) grade = 'Отлично!';
    else if (pct >= 70) grade = 'Хорошо!';
    else if (pct >= 50) grade = 'Удовлетворительно';
    else grade = 'Нужно повторить материал';

    const scoreEl = document.getElementById('results-score');
    scoreEl.innerHTML = `
        <div class="score-circle">${correctCount}/${QUESTIONS.length}</div>
        <div class="score-label">${grade}</div>
        <div class="score-pct">${pct}% правильных ответов</div>
    `;

    const panel = document.getElementById('results-panel');
    panel.classList.remove('hidden');
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });

    renderMath(panel);

    document.getElementById('check-btn').style.display = 'none';
}

function retryTest() {
    QUESTIONS.forEach((_, i) => {
        const card = document.getElementById(`q-${i}`);
        card.classList.remove('question-correct', 'question-wrong');
        const hint = card.querySelector('.correct-hint');
        if (hint) hint.remove();

        for (let j = 0; j < 4; j++) {
            const item = document.getElementById(`q${i}-opt${j}`);
            if (item) item.classList.remove('option-correct', 'option-wrong');
        }
    });

    document.querySelectorAll('.option-radio').forEach(r => {
        r.disabled = false;
        r.checked = false;
    });

    document.getElementById('results-panel').classList.add('hidden');
    document.getElementById('check-btn').style.display = '';
    document.querySelector('.test-wrapper').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('DOMContentLoaded', () => {
    renderQuestions();
    document.getElementById('check-btn').addEventListener('click', checkAnswers);
    document.getElementById('retry-btn').addEventListener('click', retryTest);
});
