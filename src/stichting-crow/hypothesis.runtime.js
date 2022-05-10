// @ts-check
const SETTING_KEY = "annotation-service-hypothesis";
const SETTING_VALUE_ALLOWED = "allowed";
const hClientDefault = {
  openSidebar: false,
  showHighlights: true,
  theme: "clean",
  branding: {
    accentColor: "rgb(0, 157, 224)",
    appBackgroundColor: "white",
    ctaBackgroundColor: "rgb(255, 110, 26)",
    ctaTextColor: "white",
    selectionFontFamily: "'Museo Sans', Museo, Helvetica, Arial, sans serif",
    annotationFontFamily: "'Museo Sans', Museo, Helvetica, Arial, sans serif",
  },
};

if (document.respec) {
  document.respec.ready.then(render);
} else {
  render();
}

/** Render the placeholder (Load Service Button) or annotation info (# annotations, Show Annotation Button). */
function render() {
  if (localStorage.getItem(SETTING_KEY) == SETTING_VALUE_ALLOWED) {
    renderAnnotationServiceInfo();
  } else {
    renderPlaceholder();
  }
}

/** Render Load Service Button, with privacy info. */
function renderPlaceholder() {
  localStorage.removeItem(SETTING_KEY);

  /** @type {HTMLElement} */
  const placeholder = document.querySelector("#annotation-service-placeholder");
  placeholder.hidden = false;

  const listener = loadButtonListener();
  document
    .querySelector("[data-load-annotation-service]")
    .addEventListener("keydown", listener);
  document
    .querySelector("[data-load-annotation-service]")
    .addEventListener("click", listener);

  /** @type {HTMLElement} */
  const serviceInfo = document.querySelector("#annotation-service-loaded");
  serviceInfo.hidden = true;
}

function loadButtonListener() {
  return event => {
    /** @type {{ target?: HTMLButtonElement; type?: any; }} */
    const { target, type } = event;

    if (!(target instanceof HTMLElement)) return;

    // For keys, we only care about Enter key to activate the panel
    // otherwise it's activated via a click.
    if (type === "keydown" && event.key !== "Enter") return;

    target.disabled = true;
    localStorage.setItem(SETTING_KEY, SETTING_VALUE_ALLOWED);
    renderAnnotationServiceInfo();
  };
}

function unloadButtonListener() {
  return event => {
    /** @type {{ target?: HTMLButtonElement; type?: any; }} */
    const { target, type } = event;

    if (!(target instanceof HTMLElement)) return;

    // For keys, we only care about Enter key to activate the panel
    // otherwise it's activated via a click.
    if (type === "keydown" && event.key !== "Enter") return;

    target.disabled = true;
    localStorage.removeItem(SETTING_KEY);
    removeHScript();
  };
}

function renderAnnotationServiceInfo() {
  addHConfig(document);
  addHScript(document);
}

/**
 *
 * @param {Document} doc
 * @param {*} conf
 */
function addHScript(doc, conf) {
  const script = doc.createElement("script");
  script.src = "https://hypothes.is/embed.js";
  script.async = true;
  doc.body.appendChild(script);

  script.addEventListener("load", event => {
    /** @type {HTMLElement} */
    const placeholder = document.querySelector(
      "#annotation-service-placeholder"
    );
    placeholder.hidden = true;

    /** @type {HTMLElement} */
    const serviceInfo = document.querySelector("#annotation-service-loaded");
    serviceInfo.hidden = false;

    const unloadListener = unloadButtonListener();
    document
      .querySelector("[data-unload-annotation-service]")
      .addEventListener("keydown", unloadListener);
    document
      .querySelector("[data-unload-annotation-service]")
      .addEventListener("click", unloadListener);
  });
}

/**
 * Retract Hypothesis permission.
 */
function removeHScript() {
  // Deleting the hypothesis-script, does not undo its changes, listeners etc.
  // Instead, reload the frame.
  window.location.reload();
}

/**
 *
 * @param {Document} doc
 * @param {*} conf
 */
function addHConfig(doc, conf) {
  const script = doc.createElement("script");
  script.className = "js-hypothesis-config";
  script.type = "application/json";
  script.innerText = JSON.stringify(hClientDefault);
  doc.body.appendChild(script);
}
