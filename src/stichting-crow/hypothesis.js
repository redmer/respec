import { sub } from "../core/pubsubhub.js";
import { fetchBase } from "../core/text-loader.js";

// @ts-check
export const name = "stichting-crow/hypothesis";

/**
 * Add Hypothes.is feedback headers to <head> and async load their scripts.
 *
 * @param {Conf} conf
 * @returns
 */
export async function run(conf) {
  if (!conf.hypothesisComments) {
    // Only run when Hypothesis is configured
    return;
  }

  const script = document.createElement("script");
  script.id = "annotation-service-runtime";
  script.textContent = await loadScript();
  document.body.append(script);
}

async function loadScript() {
  try {
    return (await import("text!./hypothesis.runtime.js")).default;
  } catch {
    return fetchBase("./src/stichting-crow/hypothesis.runtime.js");
  }
}
