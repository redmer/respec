// @ts-check

import { showError } from "../../core/utils.js";

// Module stichting-crow/table-helper
export const name = "stichting-crow/linter-rules/images";

/**
 * Checks if no images aren't loaded.
 *
 * @param {Conf} conf
 */
export function run(conf) {
  const images = document.querySelectorAll("img");
  images.forEach(image => {
    if (image.naturalHeight > 0) return;

    const msg = `Linked image is 0 px high; check resource URL: \`"${image.src}"\``;
    showError(msg, name, { elements: [image] });
  });
}
