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

// Получаем API вместо прямых данных
const api = initData(sourceData);

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
 * Перерисовка таблицы (теперь асинхронная)
 */
async function render(action) {
    const state = collectState();
    let query = {}; // здесь будут формироваться параметры запроса

    // Применяем все параметры к query
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    // Получаем данные с сервера по собранным параметрам
    const { total, items } = await api.getRecords(query);

    // Обновляем пагинатор после получения данных
    updatePagination(total, query);

    sampleTable.render(items);
}

// Создаём таблицу
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render); // ← ИСПРАВЛЕНО: передаем render

// Инициализируем модули

// Сортировка
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// Пагинация
const { applyPagination, updatePagination } = initPagination(
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
const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);

/**
 * Асинхронная инициализация приложения
 */
async function init() {
    const indexes = await api.getIndexes();
    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
}

// Добавляем таблицу в DOM
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// Первая отрисовка через init()
init().then(render);