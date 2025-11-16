import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  before.reverse().forEach((templateId) => {
    root[templateId] = cloneTemplate(templateId);
    root.container.prepend(root[templateId].container);
  });
  after.forEach((templateId)=>{
    root[templateId] = cloneTemplate(templateId);
    root.container.append(root[templateId].container);
  })

  root.container.addEventListener('change',(e)=>{
    onAction()
});
  root.container.addEventListener('reset',(e)=>{
    setTimeout(onAction);
});
  root.container.addEventListener('submit',(e)=>{
    e.preventDefault();
    onAction(e.submitter);
  })


  const render = (data) => {
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);
      Object.keys(item).forEach((key) => {
        if (row.elements && row.elements[key]) {
          row.elements[key].textContent = item[key];
        }
      });
      return row.container;
    });
    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}