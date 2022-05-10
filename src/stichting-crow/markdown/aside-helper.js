// @ts-check

import { makeSafeCopy } from "../../core/utils.js";

// Module stichting-crow/table-helper
export const name = "stichting-crow/table-helper";

const keyword2class = {
  NOTE: { node: "aside", classes: ["note"] },
  EXAMPLE: { node: "aside", classes: ["example"] },
  ILLEGAL: { node: "aside", classes: ["example", "illegal-example"] },
  ISSUE: { node: "aside", classes: ["issue"] },
  ADVISEMENT: { node: "aside", classes: ["advisement"] },
};
const firstWordRegex = /^([A-Z]{3,10})/;
const titleRegex = /^([A-Z]{3,10}\s+"([^\n]+)"\n)/;

/**
 * Change Markdown block quotes to <div>s as a NOTE, EXAMPLE, ISSUE, ADVISEMENT.
 *
 * Only top-level (i.e. section-level) blockquotes are supported.
 *
 * Syntax:
 *  .class Adds a css-class to the table. Supported:
 *      .data For general data tables
 *      .index For index tables
 *      .complex .data  For tables containing complex data
 *      .def For tables that define other entities.
 * @param {Conf} conf
 */
export function run(conf) {
  console.log("ahhahahaha");
  const quotes = document.querySelectorAll("section > blockquote");
  quotes.forEach(quote => {
    const keywordResults = firstWordRegex.exec(quote.textContent.trimStart());
    if (!keywordResults) return;
    let formatdesc;
    try {
      formatdesc = keyword2class[keywordResults[1]];
    } catch (e) {
      // This blockquote does not contain a keyword.
      return;
    }

    /** @type {HTMLDivElement} */
    const elem = document.createElement(formatdesc.node);
    elem.classList.add(formatdesc.classes);

    try {
      const titleResults = titleRegex.exec(quote.textContent.trimStart());
      elem.title = titleResults[2];
      quote.textContent = quote.textContent.replace(titleResults[1], "");
    } catch (e) {
      // this element does not appear to have a title.
      quote.textContent = quote.textContent.replace(keywordResults[1], "");
    }

    // @ts-ignore
    elem.append(...[...makeSafeCopy(quote).childNodes]);
    quote.parentNode.replaceChild(elem, quote);
  });
}
