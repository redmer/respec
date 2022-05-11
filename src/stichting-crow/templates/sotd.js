// @ts-check
import { W3CDate, getIntlData } from "../../core/utils.js";
import { html } from "../../core/import-maps.js";
import { specStatus2info } from "../headers.js";
// import { status2track } from "../headers.js";
const localizationStrings = {
  en: {
    sotd: "Status of This Document",
    status_at_publication: html`This section describes the status of this
      document at the time of its publication. A list of current W3C
      publications and the latest revision of this technical report can be found
      in the <a href="https://www.w3.org/TR/">W3C technical reports index</a> at
      https://www.w3.org/TR/.`,
    preview_summary: (
      /** @type string */ prUrl,
      /** @type number */ prNumber
    ) => {
      return html`This is a preview
      ${prUrl && prNumber
        ? html`
            of pull request
            <a href="${prUrl}">#${prNumber}</a>
          `
        : ""}`;
    },
    preview_details: (/** @type string */ edDraftURI) => {
      return html`Do not attempt to implement this version of the specification.
      Do not reference this version as authoritative in any way.
      ${edDraftURI
        ? html`
            Instead, see
            <a href="${edDraftURI}">${edDraftURI}</a> for the Working Draft.
          `
        : ""} `;
    },
    unofficial_disclaimer: html`This document is a draft of a potential
    specification. It has no official standing of any kind and does not
    represent the support or consensus of any standards organization.`,
    endorsement_specStatus: (
      /** @type {string} */ specStatus,
      /** @type {Conf} */ conf
    ) => {
      switch (specStatus) {
        case "DEF":
          return html`CROW recommends the wide usage of this specification.`;
        default:
          return html`An ${conf.specStatusInfo.name} does not imply endorsement
          by ${conf.publisher.name}.`;
      }
    },
    update_policy_specStatus: (/** @type {string} */ specStatus) => {
      switch (specStatus) {
        case "PFB":
        case "NP":
        case "WD":
        case "DRAFT":
          return html`This is a draft documentand may be updated, replaced or
          obsoleted by other documents at any time. It is inappropriate to cite
          this document as other than work in progress.`;
        case "LD":
        case "DOC":
        case "REG":
          return html`This document is maintained and updated at any time. Some
          parts of this document are work in progress.`;
        default:
          return "";
      }
    },
    review_policy_specStatus: (/** @type {string} */ specStatus, conf) => {
      switch (specStatus) {
        case "LD":
          return html`<p>Comments are welcome at any time.</p>`;
        case "IR":
        case "OR":
        case "CR":
        case "PR":
          return html`<p>
            Stakeholders and other interested parties are invited to review the
            document and send comments through
            ${W3CDate.format(conf.reviewDateEnd)}. Feedback on content,
            technical considerations as well as implementation reports are
            welcomed.
          </p> `;
        default:
          return "";
      }
    },
    desc_specStatus: (/** @type {string} */ specStatus) => {
      switch (specStatus) {
        case "DEF":
          return html`This document has been adopted by CROW, after approval of
          a CROW-working group and public consultation.`;
        case "REPL":
          return html`There is a newer and better document available, that
          replaces the contents of this present document.`;
        case "RESC":
          return html`This document has been rescinded. It should not be used or
          implemented any more, and only kept as a reference.`;
        case "IR":
          return html`This is a review version and this document has not yet
          been adopted.`;
        case "CR":
          return html`This is a committee review version and this document has
          not yet been adopted.`;
        case "PR":
          return html`This is a public review version and this document has not
          yet been adopted.`;
        case "OR":
          return html`This is an open review version and this document has not
          yet been adopted.`;
        case "RQR":
          return html`This document has been approved by a CROW-working group,
          but its contents may be no longer current. The date of the content
          review, to determine if an update is in order, has since passed.`;
        default:
          return "";
      }
    },
    proposed_additions: html`Proposed additions are marked in the document.`,
    proposed_corrections: html`Proposed corrections are marked in the document.`,
    comments_github: issueBase => html`<p>
      <a href="${issueBase}">GitHub Issues</a> are preferred for discussion of
      this specification. Please send in a ticket per issue to enable discussion
      and assessment.
    </p> `,
    comments_hypothesis: html`<p>
      Review comments may be left as <em>Hypothes.is</em> annotations. Please
      use a public channel for your review.
    </p>`,
    comments_email: (
      mailtoEmailCommentsWithSubject,
      emailComments,
      subjectPrefix
    ) => html`<p>
      If you wish to make private comments regarding this document, relay them
      through e-mail at
      <a href="${mailtoEmailCommentsWithSubject}">${emailComments}</a>
      with <code>${subjectPrefix}</code> at the start of your email's subject.
    </p>`,
  },
  nl: {
    sotd: "Status van dit document",
    status_at_publication: html`Deze paragraaf beschrijft de status van dit
      document ten tijde van publicatie. Het is mogelijk dat er actuelere
      versies van dit document bestaan. Bekijk de lijst van CROW technische
      standaarden op <a href="https://docs.crow.nl/">docs.crow.nl</a> en alle
      CROW-publicaties via <a href="https://crow.nl">crow.nl</a>.`,
    preview_summary: (
      /** @type {string} */ prUrl,
      /** @type {number} */ prNumber
    ) => {
      return html`Dit is een voorvertoning
      ${prUrl && prNumber
        ? html`
            van wijzigingsverzoek (PR)
            <a href="${prUrl}">#${prNumber}</a>
          `
        : ""}`;
    },
    preview_details: (/** @type {string} */ edDraftURI) => {
      return html`Implementeer deze versie van de specificatie niet; deze versie
      heeft geen status.
      ${edDraftURI
        ? html`
            Bekijk in plaats daarvan de werkversie op
            <a href="${edDraftURI}">${edDraftURI}</a>.
          `
        : ""} `;
    },
    unofficial_disclaimer: `Dit document is een concept van een mogelijke
    specificatie. Het heeft geen officiële status en vertegenwoordigt ook niet
    de standpunten of consensus van de meeschrijvende partijen.`,
    endorsement_specStatus: (
      /** @type {string} */ specStatus,
      /** @type {Conf} */ conf
    ) => {
      switch (specStatus) {
        case "DEF":
          return html`CROW beveelt het brede gebruik van deze vastgestelde
          standaardspecificatie aan.`;
        default:
          return html`Een publicatie als ${conf.specStatusInfo.name_nl}
          impliceert geen onderschrijven door ${conf.publisher.name}.`;
      }
    },
    update_policy_specStatus: (/** @type {string} */ specStatus) => {
      switch (specStatus) {
        case "PFB":
        case "NP":
        case "WD":
        case "DRAFT":
          return html`Dit is een conceptdocument en kan op elk moment worden
          gewijzigd of vervangen door andere documenten. Gebruik en citeer dit
          document niet anders dan als werk in uitvoering.`;
        case "LD":
        case "DOC":
        case "REG":
          return html`Dit document wordt continu onderhouden. Op elk moment
          kunnen wijzigingen worden doorgevoerd.`;
        default:
          return "";
      }
    },
    review_policy_specStatus: (/** @type {string} */ specStatus, conf) => {
      switch (specStatus) {
        case "LD":
          return html`<p>
            Commentaar is altijd welkom bij een Levend document.
          </p>`;
        case "IR":
        case "OR":
        case "CR":
        case "PR":
          return html`<p>
            Belanghebbenden, geïnteresseerde partijen en anderen worden
            uitgenodigd dit document te reviewen en hun commentaar in te zenden
            vóór ${W3CDate.format(conf.reviewDateEnd)}. Zowel inhoudelijk als
            technisch commentaar als commentaar betreffende de
            implementeerbaarheid is welkom.
          </p> `;
        default:
          return "";
      }
    },
    desc_specStatus: (/** @type {string} */ specStatus) => {
      switch (specStatus) {
        case "DEF":
          return html`Dit document is vastgesteld door CROW, na voorlegging van
          een CROW-werkgroep en consultatierondes.`;
        case "REPL":
          return html`Er is een nieuwer en beter document beschikbaar dat de
          kennis in het onderhavige vervangt.`;
        case "RESC":
          return html`Dit document is teruggetrokken. De kennis in het
          onderhavige zou niet meer gebruikt of geïmplementeerd moeten worden.`;
        case "IR":
          return html`Dit is een reviewversie en is nog niet vastgesteld.`;
        case "CR":
          return html`Dit is een consultatieversie en is nog niet vastgesteld.`;
        case "PR":
          return html`Deze versie is ter vaststelling en is nog niet
          vastgesteld.`;
        case "OR":
          return html`Deze versie is ter visie gelegd en is nog niet
          vastgesteld.`;
        case "RQR":
          return html`Dit document is vastgesteld door een CROW-werkgroep, maar
          mogelijk verouderd. De destijds vastgelegde datum waarop moeten worden
          bekeken, of de kennis in onderhavige nog actueel is, is verstreken.`;
        default:
          return "";
      }
    },
    proposed_additions: html`Voorgestelde toevoegingen zijn in het document
    gemarkeerd.`,
    proposed_corrections: html`Voorgestelde correcties zijn in het document
    gemarkeerd.`,
    comments_github: issueBase => html`<p>
      <a href="${issueBase}">GitHub Issues</a> wordt gebruikt voor de discussie
      van dit document. Eén issue per onderwerp vereenvoudigt de verwerking.
    </p> `,
    comments_hypothesis: html`<p>
      Reviewcommentaar mag ook achtergelaten worden als
      <em>Hypothes.is</em> annotaties. Gebruik het publieke kanaal voor je
      commentaar.
    </p> `,
    comments_email: (
      mailtoEmailCommentsWithSubject,
      emailComments,
      subjectPrefix
    ) => html`<p>
      Als je niet-openbaar commentaar wil achterlaten, geef dat dan door per
      e-mail aan
      <a href="${mailtoEmailCommentsWithSubject}">${emailComments}</a>
      met <code>${subjectPrefix}</code> aan het begin van het onderwerp van de
      e-mail. Geef daarbij ook aan welke onderdelen vertrouwelijk zijn.
    </p>`,
  },
};

export const l10n = getIntlData(localizationStrings);

export default (conf, opts) => {
  return html`
    <h2>${l10n.sotd}</h2>
    ${conf.isPreview ? renderPreviewWarning(conf) : ""}
    <p><em>${l10n.status_at_publication}</em></p>
    ${conf.isUnofficial ? renderIsUnofficialDisclaimer(conf) : ""}
    <p>
      ${l10n.desc_specStatus(conf.specStatus)}
      ${l10n.endorsement_specStatus(conf.specStatus, conf)}
    </p>
    ${l10n.update_policy_specStatus(conf.specStatus)}
    ${conf.isInReview ? renderReviewElements(conf) : ""}
    ${l10n.review_policy_specStatus(conf.specStatus, conf)}
    ${linkToCommunity(conf, opts)} ${opts.additionalSections}
  `;
};

export function renderPreviewWarning(conf) {
  const { prUrl, prNumber, edDraftURI } = conf;
  return html`<details class="annoying-warning" open="">
    <summary>${l10n.preview_summary(prUrl, prNumber)}</summary>
    <p>${l10n.preview_details(edDraftURI)}</p>
  </details>`;
}

function renderIsUnofficialDisclaimer(conf) {
  return html` <p>${l10n.unofficial_disclaimer}</p> `;
}

function renderReviewElements(conf) {
  const { revisionTypes = [] } = conf;
  return html`
    ${revisionTypes.includes("addition")
      ? html`<p class="addition">${l10n.proposed_additions}</p>`
      : ""}
    ${revisionTypes.includes("correction")
      ? html`<p class="correction">${l10n.proposed_corrections}</p>`
      : ""}
  `;
}

function linkToCommunity(conf, opts) {
  const { mailtoEmailCommentsWithSubject, subjectPrefix } = opts;

  return html`
    ${conf.github ? l10n.comments_github(conf.issueBase) : ""}
    ${conf.hypothesisComments && conf.isInReview
      ? l10n.comments_hypothesis
      : ""}
    ${conf.emailComments && conf.isInReview
      ? l10n.comments_email(
          mailtoEmailCommentsWithSubject,
          conf.emailComments,
          subjectPrefix
        )
      : ""}
  `;
}
