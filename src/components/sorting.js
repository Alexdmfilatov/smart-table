import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки
            action.dataset.value = sortMap[action.dataset.value];    // обновляем состояние кнопки
            field = action.dataset.field;                            // сохраняем поле сортировки
            order = action.dataset.value;                            // и направление сортировки

            // @todo: #3.2 — сбросить сортировки остальных колонок
            columns.forEach(column => {                               // перебираем все кнопки
                if (column.dataset.field !== action.dataset.field) {  // кроме нажатой
                    column.dataset.value = 'none';                    // сбрасываем состояние
                }
            });

        } else {
            // @todo: #3.3 — получить выбранный режим сортировки
            columns.forEach(column => {                        // ищем активную кнопку сортировки
                if (column.dataset.value !== 'none') {         // та, что сейчас активна
                    field = column.dataset.field;              // сохраняем поле
                    order = column.dataset.value;              // и направление
                }
            });
        }

        return sortCollection(data, field, order);
    };
}
