// @ts-check
import { ISODate, W3CDate, getIntlData } from "../../core/utils.js";
import { html } from "../../core/import-maps.js";
import showLink from "../../core/templates/show-link.js";
import showLogo from "../../core/templates/show-logo.js";
import showPeople from "../../core/templates/show-people.js";
import { sub } from "../../core/pubsubhub.js";
import { lang } from "../../core/l10n.js";

const localizationStrings = {
  en: {
    archives: "archives",
    author: "Author:",
    authors: "Authors:",
    commit_history: "Commit history",
    edited_in_place: "edited in place",
    editor: "Editor:",
    editors: "Editors:",
    feedback: "Feedback:",
    former_editor: "Former editor:",
    former_editors: "Former editors:",
    history: "History:",
    implementation_report: "Implementation report:",
    latest_editors_draft: "Latest editor's draft:",
    latest_published_version: "Latest published version:",
    latest_recommendation: "Latest Recommendation:",
    message_topic: "… message topic …",
    more_details_about_this_doc: "More details about this document",
    multiple_alternates(plural) {
      return `This document is also available in ${
        plural ? "these non-normative formats" : "this non-normative format"
      }:`;
    },
    prev_editor_draft: "Previous editor's draft:",
    prev_recommendation: "Previous Recommendation:",
    prev_version: "Previous version:",
    replaced_by: "Replaced by:",
    publication_history: "Publication history",
    test_suite: "Test suite:",
    this_version: "This version:",
    with_subject_line: "with subject line",
    your_topic_here: "YOUR TOPIC HERE",
    view_annotations: "Show annotations",
    load_annotation_service: "Load annotation service",
    pull_requests: "pull requests",
    new_issue: "new issue",
    open_issues: "open issues",
    load_annotation_service_info: html`<small
      >Annotations by <a href="https://web.hypothes.is">Hypothes.is</a> (a third
      party,
      <a href="https://web.hypothes.is/privacy">privacy policy</a>).</small
    >`,
    total_annotation_count: count =>
      html`${count} annotation(s) with <em>Hypothes.is</em>`,
    unload_annotation: "Hide and reload",
    link_license: (url, short, licenseInfo) => html` and
      <a rel="license" href="${url}" title="${licenseInfo.name}">${short}</a>
      rules apply.`,
    unlicensed_notice: "THIS DOCUMENT IS UNLICENSED",
    errata_exist: "Errata exist",
  },
  nl: {
    author: "Auteur:",
    authors: "Auteurs:",
    editor: "Redacteur:",
    history: "Geschiedenis:",
    archives: "archieven",
    best_practice: "In de praktijk ",
    commit_history: "Wijzigingsgeschiedenis",
    edited_in_place: "wijzingen tussendoor",
    feedback: "Feedback:",
    former_editor: "Voormalige redacteur:",
    former_editors: "Voormalige redacteurs:",
    implementation_report: "Implementatierapport:",
    latest_recommendation: "Meest recente vastgestelde versie:",
    message_topic: "… onderwerp …",
    more_details_about_this_doc: "Meer informatie over dit document",
    prev_editor_draft: "Voorgaande consultatieversie:",
    prev_recommendation: "Voorgaande vastgestelde versie:",
    prev_version: "Voorgaande versie:",
    replaced_by: "Vervangen door:",
    publication_history: "Publicatiegeschiedenis",
    test_suite: "Testsuite:",
    test: "test",
    tests: "tests",
    with_subject_line: "met onderwerpregel",
    your_topic_here: "HIER JE ONDERWERP",
    pull_requests: "wijzigingsverzoeken",
    new_issue: "nieuw issue",
    open_issues: "openstaande issues",
    editors: "Redacteurs:",
    latest_editors_draft: "Laatste werkversie:",
    latest_published_version: "Laatst gepubliceerde versie:",
    this_version: "Deze versie:",
    view_annotations: "Toon annotatiebalk",
    load_annotation_service: "Laad annotatieservice",
    load_annotation_service_info: html`<small
      >Annotaties door <a href="https://web.hypothes.is">Hypothes.is</a> (<a
        href="https://web.hypothes.is/privacy"
        >privacybeleid</a
      >).</small
    >`,
    total_annotation_count: count =>
      html`${count} annotatie(s) met <em>Hypothes.is</em>`,
    unload_annotation: "Verberg en herlaad",
    link_license: (url, short, licenseInfo) => html`
      van toepassing en gedistribueerd onder
      <a rel="license" href="${url}" title="${licenseInfo.name_nl}">${short}</a>
    `,
    unlicensed_notice: "DIT DOCUMENT HEEFT GEEN LICENTIE",
    errata_exist: "Errata bestaan",
  },
};
export const l10n = getIntlData(localizationStrings);

export function getSpecSubTitleElem(conf) {
  let specSubTitleElem = document.querySelector("h2#subtitle");

  if (specSubTitleElem && specSubTitleElem.parentElement) {
    specSubTitleElem.remove();
    conf.subtitle = specSubTitleElem.textContent.trim();
  } else if (conf.subtitle) {
    specSubTitleElem = document.createElement("h2");
    specSubTitleElem.textContent = conf.subtitle;
    specSubTitleElem.id = "subtitle";
  }
  if (specSubTitleElem) {
    specSubTitleElem.classList.add("subtitle");
  }
  return specSubTitleElem;
}

export default (conf, options) => {
  /**
   * After export, we let fixup.js handle the <details>.
   */
  sub("beforesave", doc => {
    const details = doc.querySelector(".head details");
    details.open = true;
  });
  return html`<div class="head">
    ${conf.logos.length
      ? html`<p class="logos">${conf.logos.map(showLogo)}</p>`
      : ""}
    ${document.querySelector("h1#title")} ${getSpecSubTitleElem(conf)}
    <p id="w3c-state">${renderSpecTitle(conf)}</p>
    <details open="${localStorage.getItem("tr-metadata") || "true"}">
      <summary>${l10n.more_details_about_this_doc}</summary>
      <dl>
        ${conf.thisVersion
          ? html`<dt>${l10n.this_version}</dt>
              <dd>
                <a class="u-url" href="${conf.thisVersion}"
                  >${conf.thisVersion}</a
                >
              </dd>`
          : ""}
        ${"latestVersion" in conf // latestVersion can be falsy
          ? html`<dt>${l10n.latest_published_version}</dt>
              <dd>
                ${conf.latestVersion
                  ? html`<a href="${conf.latestVersion}"
                      >${conf.latestVersion}</a
                    >`
                  : "none"}
              </dd>`
          : ""}
        ${conf.replacedBy
          ? html`<dt>${l10n.latest_published_version}</dt>
              <dd>
                ${conf.latestVersion
                  ? html`<a href="${conf.latestVersion}"
                      >${conf.latestVersion}</a
                    >`
                  : "none"}
              </dd>`
          : ""}
        ${conf.edDraftURI
          ? html`
              <dt>${l10n.latest_editors_draft}</dt>
              <dd><a href="${conf.edDraftURI}">${conf.edDraftURI}</a></dd>
            `
          : ""}
        ${conf.historyURI || conf.github
          ? html`<dt>${l10n.history}</dt>
              ${conf.historyURI
                ? html`<dd>
                    <a href="${conf.historyURI}">${conf.historyURI}</a>
                  </dd>`
                : ""}
              ${conf.github
                ? html`<dd>
                    <a href="${conf.github.commitHistoryURL}"
                      >${l10n.commit_history}</a
                    >
                  </dd>`
                : ""}`
          : ""}
        ${conf.testSuiteURI
          ? html`
              <dt>${l10n.test_suite}</dt>
              <dd><a href="${conf.testSuiteURI}">${conf.testSuiteURI}</a></dd>
            `
          : ""}
        ${conf.implementationReportURI
          ? html`
              <dt>${l10n.implementation_report}</dt>
              <dd>
                <a href="${conf.implementationReportURI}"
                  >${conf.implementationReportURI}</a
                >
              </dd>
            `
          : ""}
        ${conf.prevVersion
          ? html`
              <dt>${l10n.prev_version}</dt>
              <dd><a href="${conf.prevVersion}">${conf.prevVersion}</a></dd>
            `
          : ""}
        ${conf.editors.length
          ? html`
              <dt>${conf.editors.length > 1 ? l10n.editors : l10n.editor}</dt>
              ${showPeople(conf, "editors")}
            `
          : ""}
        ${conf.formerEditors.length
          ? html`
              <dt>
                ${conf.formerEditors.length > 1
                  ? l10n.former_editors
                  : l10n.former_editor}
              </dt>
              ${showPeople(conf, "formerEditors")}
            `
          : ""}
        ${conf.authors.length
          ? html`
              <dt>${conf.authors.length > 1 ? l10n.authors : l10n.author}</dt>
              ${showPeople(conf, "authors")}
            `
          : ""}
        ${conf.github || conf.emailComments || conf.hypothesisComments
          ? html`<dt>${l10n.feedback}</dt>
              ${renderFeedback(conf)}`
          : ""}
        ${conf.errata
          ? html`<dt>Errata:</dt>
              <dd><a href="${conf.errata}">${l10n.errata_exist}</a>.</dd>`
          : ""}
        ${conf.otherLinks ? conf.otherLinks.map(showLink) : ""}
      </dl>
    </details>
    ${conf.alternateFormats
      ? html`<p>
          ${l10n.multiple_alternates(options.multipleAlternates)}
          ${options.alternatesHTML}
        </p>`
      : ""}
    ${renderCopyright(conf)}
    <hr title="Separator for header" />
  </div>`;
};

export function renderFeedback(conf) {
  const definitions = [];
  // Github feedback...
  if (conf.github) {
    const { repoURL, issuesURL, newIssuesURL, pullsURL, fullName } =
      conf.github;
    definitions.push(
      html`<dd>
        <a href="${repoURL}">GitHub ${fullName}</a>
        (<a href="${pullsURL}">${l10n.pull_requests}</a>,
        <a href="${newIssuesURL}">${l10n.new_issue}</a>,
        <a href="${issuesURL}">${l10n.open_issues}</a>)
      </dd>`
    );
  }

  // Mailing list feedback
  if (conf.emailComments) {
    const mailToURL = new URL(`mailto:${conf.emailComments}`);
    const subject =
      conf.subjectPrefix ?? `[${conf.shortName}] ${l10n.your_topic_here}`;
    const mailingListLink = html`<a
      href="${mailToURL.href}?subject=${encodeURIComponent(subject)}"
      >${mailToURL.pathname}</a
    >`;

    // The subject line...
    const subjectLine =
      conf.subjectPrefix ||
      html`[${conf.shortName}] <em>${l10n.message_topic}</em>`;
    const emailSubject = html`${l10n.with_subject_line}${" "}
      <kbd>${subjectLine}</kbd>`;

    definitions.push(html`<dd>${mailingListLink} ${emailSubject}</dd>`);
  }

  if (conf.hypothesisComments && conf.isInReview) {
    definitions.push(
      html` <dd hidden id="annotation-service-placeholder">
        <button type="button" data-load-annotation-service>
          ${l10n.load_annotation_service}
        </button>
        <span>${l10n.load_annotation_service_info}</span>
      </dd>`,
      html` <dd hidden id="annotation-service-loaded">
        ${l10n.total_annotation_count(
          html`<span data-hypothesis-annotation-count>...</span>`
        )}
        <button type="button" data-hypothesis-trigger>
          ${l10n.view_annotations}
        </button>
        <button type="button" data-unload-annotation-service>
          ${l10n.unload_annotation}
        </button>
      </dd>`
    );
  }

  return definitions;
}

/**
 * @param {Conf} conf
 */
function renderSpecTitle(conf) {
  let specStatusName;
  if (lang === "nl") {
    specStatusName = conf.specStatusInfo.name_nl;
  } else {
    specStatusName = conf.specStatusInfo.name;
  }

  const specType = conf.specStatusInfo.name;
  const preamble = html`${conf.publisher.name}${" "}${conf.specType},
  ${specStatusName}`;
  return html`${preamble}${" "}
    <time
      style="white-space: pre;"
      class="dt-published"
      datetime="${conf.dashDate}"
      >${W3CDate.format(conf.publishDate)}</time
    >${conf.modificationDate
      ? html`, ${l10n.edited_in_place}${" "}
          <time
            class="dt-modified"
            datetime="${ISODate.format(conf.modificationDate)}"
            >${W3CDate.format(conf.modificationDate)}</time
          >`
      : ""}`;
}

/**
 * @param { LicenseInfo } licenseInfo license information
 */
function linkLicense(licenseInfo) {
  const { url, short, name } = licenseInfo;
  if (short === "UNLICENSED") {
    return html`. <span class="issue">${l10n.unlicensed_notice}</span>.`;
  }
  return html`${l10n.link_license(url, short, licenseInfo)}`;
}

function renderCopyright(conf) {
  // If there is already a copyright, let's relocate it.
  const existingCopyright = document.querySelector(".copyright");
  if (existingCopyright) {
    existingCopyright.remove();
    return existingCopyright;
  }
  return renderOfficialCopyright(conf);
}

function renderOfficialCopyright(conf) {
  return html`<p class="copyright">
    Copyright &copy;
    ${conf.copyrightStart ? `${conf.copyrightStart}-` : ""}${conf.publishYear}
    ${conf.additionalCopyrightHolders
      ? html` ${[conf.additionalCopyrightHolders]} &amp; `
      : ""}
    <a href="${conf.publisher.url}">${conf.publisher.name}</a>.
    ${conf.publisher.name}
    <a href="${conf.publisher.disclaimer}">disclaimer</a>${linkLicense(
      conf.licenseInfo
    )}
  </p>`;
}
