// @ts-check
// Module stichting-crow/style
// Inserts a link to the appropriate W3C style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

import { html } from "../core/import-maps.js";
import { lang } from "../core/l10n.js";
import { sub } from "../core/pubsubhub.js";
import { createResourceHint } from "../core/utils.js";
export const name = "stichting-crow/style";

function attachFixupScript() {
  const script = html`<script src="https://docs.crow.nl/respec-design/fixup.js">`;
  if (location.hash) {
    script.addEventListener(
      "load",
      () => {
        window.location.href = location.hash;
      },
      { once: true }
    );
  }
  document.body.appendChild(script);
}

function createResourceHints() {
  /** @type ResourceHintOption[]  */
  const opts = [
    {
      hint: "preconnect", // for styles and scripts.
      href: "https://docs.crow.nl",
    },
    {
      hint: "preload", // all specs need it, and we attach it on end-all.
      href: "https://docs.crow.nl/respec-design/fixup.js",
      as: "script",
    },
    {
      hint: "preload", // all specs include on base.css.
      href: "https://docs.crow.nl/respec-design/stichting-crow/base.min.css",
      as: "style",
    },
    {
      hint: "preload", // all specs include on base.css.
      href: "https://docs.crow.nl/webfonts/webfonts.css",
      as: "style",
    },
  ];
  const resourceHints = document.createDocumentFragment();
  for (const link of opts.map(createResourceHint)) {
    resourceHints.appendChild(link);
  }
  return resourceHints;
}
// Collect elements for insertion (document fragment)
const elements = createResourceHints();

// Opportunistically apply base style
elements.appendChild(html`<link
  rel="stylesheet"
  href="https://docs.crow.nl/webfonts/webfonts.css"
/>`);
elements.appendChild(html`<link
  rel="stylesheet"
  href="https://docs.crow.nl/respec-design/stichting-crow/base.min.css"
/>`);
elements.appendChild(html`<link
  rel="stylesheet"
  media="(prefers-color-scheme: dark);"
  href="https://docs.crow.nl/respec-design/stichting-crow/dark.min.css"
/>`);
if (!document.head.querySelector("meta[name=viewport]")) {
  // Make meta viewport the first element in the head.
  elements.prepend(
    html`<meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />`
  );
}

document.head.prepend(elements);

export function run(conf) {
  const canonicalStatus = conf.specStatus?.toUpperCase() ?? "DOC";
  const banner = `https://docs.crow.nl/respec-design/stichting-crow/status-${lang}/${canonicalStatus}.svg`;
  document.body.style.backgroundImage = `url("${banner}")`;

  // Attach W3C fixup script after we are done.
  if (!conf.noToc) {
    sub("end-all", attachFixupScript, { once: true });
  }
}
