import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
    // Настраиваем компаратор
    const compare = createComparison([
        rules.skipEmptyTargetValues,                                 // игнорируем пустые значения
        rules.searchMultipleFields(searchField, ['date','customer','seller'], false) // ищем по нескольким полям
    ]);

    return (data, state, action) => {
        const searchValue = state[searchField] || '';

        // Если поле поиска пустое, возвращаем все данные без фильтрации
        if (!searchValue.trim()) return data;

        return data.filter(row => compare(row, { [searchField]: searchValue }));
    };
}
