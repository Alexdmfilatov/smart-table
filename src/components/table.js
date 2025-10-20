import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);
    
// Добавляем шаблоны "до" таблицы (в обратном порядке)
before.reverse().forEach(subName => {
  root[subName] = cloneTemplate(subName);
  root.container.prepend(root[subName].container);
});

// Добавляем шаблоны "после" таблицы
after.forEach(subName => {
  root[subName] = cloneTemplate(subName);
  root.container.append(root[subName].container);
});


    // Добавляем обработчики событий к таблице
root.container.addEventListener('change', () => {
  onAction(); // просто вызываем без аргументов
});

root.container.addEventListener('reset', () => {
  setTimeout(onAction); // вызываем с небольшой задержкой
});

root.container.addEventListener('submit', (e) => {
  e.preventDefault(); // предотвращаем стандартное поведение формы
  onAction(e.submitter); // передаем элемент, который отправил форму
});


   const render = (data) => {
  // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
  const nextRows = data.map(item => {
    // Клонируем шаблон строки
    const row = cloneTemplate(rowTemplate);

    // Перебираем все ключи объекта item (например name, value, price и т.д.)
    Object.keys(item).forEach(key => {
      // Проверяем, есть ли в шаблоне элемент с таким именем
      if (row.elements[key]) {
        // Заполняем его текстом из данных
        row.elements[key].textContent = item[key];
      }
    });

    // Возвращаем готовую строку
    return row.container;
  });

  // Заменяем старые строки новыми
  root.elements.rows.replaceChildren(...nextRows);
};



    return {...root, render};
}