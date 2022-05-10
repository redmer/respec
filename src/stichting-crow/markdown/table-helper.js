// @ts-check
// Module stichting-crow/table-helper
export const name = "stichting-crow/table-helper";

/**
 * Apply markup to <table>, usually for Markdown-generated tables.
 *
 * Syntax:
 *  add a final row to the table, with in the first column
 *   the following: `{ CONTENTS }` without the backticks.
 *   CONTENTS is a space-delimited list of .class and #id:
 *
 *  .class
 *      Adds a css-class to the table. Supported:
 *           .data For general data tables
 *           .index For index tables
 *           .complex .data  For tables containing complex data
 *           .def For tables that define other entities.
 *  #id
 *      Adds an element-id to the table, useful for referring.
 * @param {Conf} conf
 */
export function run(conf) {
  const tables = document.querySelectorAll("table");
  tables.forEach(table => {
    const lastRow = table.querySelector("tbody > tr:last-child");
    const lastRowFirstCell = lastRow.querySelector("td:nth-child(1)");
    if (
      /\\{.+}/.test(lastRowFirstCell.textContent) ||
      !/{.+}/.test(lastRowFirstCell.textContent)
    )
      return;
    lastRowFirstCell.textContent.split(" ").forEach(mark => {
      if (mark.startsWith(".")) table.classList.add(mark.slice(1));
      if (mark.startsWith("#")) table.id = mark;
    });
    lastRow.parentElement.removeChild(lastRow); // remove <tr>
  });
}
