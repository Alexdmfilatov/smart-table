import { createComparison, defaultRules } from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach(elementName => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    // Возвращаем функцию применения фильтрации к данным
    return (data, state, action) => {
        // @todo: #4.2 — обработка очистки поля
        if (action && action.name === 'clear') {
            const input = action.parentElement.querySelector(`[data-field="${action.dataset.field}"]`);
            if (input) {
                input.value = '';
                state[action.dataset.field] = '';
            }
        }

        // @todo: #4.3 — настроить компаратор
        const compare = createComparison(defaultRules);

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    };
}
    