import './fonts/ys-display/fonts.css';
import './style.css';

import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";

// Исходные данные
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка таблицы
 */
function render(action) {
    const state = collectState();
    let result = [...data];

    // Порядок обработки: поиск → фильтры → сортировка → пагинация
    result = applySearching(result, state, action);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);

    sampleTable.render(result);
}

// 1️⃣ Создаём таблицу
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, null); // render вызываем вручную после инициализации модулей

// 2️⃣ Инициализируем модули

// Сортировка
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// Пагинация
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

// Поиск
const applySearching = initSearching('search');

// Фильтрация
const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
});

// 3️⃣ Добавляем таблицу в DOM
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// 4️⃣ Первая отрисовка
render();
