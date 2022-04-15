// @ts-check
// Module w3c/headers
// Generate the headers material based on the provided configuration.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)
//  - shortName: the small name that is used after /TR/ in published reports (required)
//  - editors: an array of people editing the document (at least one is required). People
//      are defined using:
//          - name: the person's name (required)
//          - url: URI for the person's home page
//          - company: the person's company
//          - companyURL: the URI for the person's company
//          - mailto: the person's email
//          - note: a note on the person (e.g. former editor)
//  - authors: an array of people who are contributing authors of the document.
//  - formerEditors: an array of people that had earlier edited the document but no longer edit.
//  - subtitle: a subtitle for the specification
//  - publishDate: the date to use for the publication, default to document.lastModified, and
//      failing that to now. The format is YYYY-MM-DD or a Date object.
//  - previousPublishDate: the date on which the previous version was published.
//  - previousMaturity: the specStatus of the previous version
//  - errata: the URI of the errata document, if any
//  - alternateFormats: a list of alternate formats for the document, each of which being
//      defined by:
//          - uri: the URI to the alternate
//          - label: a label for the alternate
//          - lang: optional language
//          - type: optional MIME type
//  - logos: a list of logos to use instead of the W3C logo, each of which being defined by:
//          - src: the URI to the logo (target of <img src=>)
//          - alt: alternate text for the image (<img alt=>), defaults to "Logo" or "Logo 1", "Logo 2", ...
//            if src is not specified, this is the text of the "logo"
//          - height: optional height of the logo (<img height=>)
//          - width: optional width of the logo (<img width=>)
//          - url: the URI to the organization represented by the logo (target of <a href=>)
//          - id: optional id for the logo, permits custom CSS (wraps logo in <span id=>)
//          - each logo element must specify either src or alt
//  - testSuiteURI: the URI to the test suite, if any
//  - implementationReportURI: the URI to the implementation report, if any
//  - noRecTrack: set to true if this document is not intended to be on the Recommendation track
//  - edDraftURI: the URI of the Editor's Draft for this document, if any. Required if
//      specStatus is set to "ED".
//  - additionalCopyrightHolders: a copyright owner in addition to W3C (or the only one if specStatus
//      is unofficial)
//  - copyrightStart: the year from which the copyright starts running
//  - prevED: the URI of the previous Editor's Draft if it has moved
//  - prevRecShortname: the short name of the previous Recommendation, if the name has changed
//  - prevRecURI: the URI of the previous Recommendation if not directly generated from
//    prevRecShortname.
//  - wg: the name of the WG in charge of the document. This may be an array in which case wgURI
//      and wgPatentURI need to be arrays as well, of the same length and in the same order
//  - wgURI: the URI to the group's page, or an array of such
//  - wgPatentURI: the URI to the group's patent information page, or an array of such. NOTE: this
//      is VERY IMPORTANT information to provide and get right, do not just paste this without checking
//      that you're doing it right
//  - wgPublicList: the name of the mailing list where discussion takes place. Note that this cannot
//      be an array as it is assumed that there is a single list to discuss the document, even if it
//      is handled by multiple groups
//  - charterDisclosureURI: used for IGs (when publishing IG-NOTEs) to provide a link to the IPR commitment
//      defined in their charter.
//  - thisVersion: the URI to the dated current version of the specification. ONLY ever use this for CG/BG
//      documents, for all others it is autogenerated.
//  - latestVersion: the URI to the latest version of the specification.
//  - prevVersion: the URI to the previous (dated) version of the specification. ONLY ever use this for CG/BG
//      documents, for all others it is autogenerated.
//  - subjectPrefix: the string that is expected to be used as a subject prefix when posting to the mailing
//      list of the group.
//  - otherLinks: an array of other links that you might want in the header (e.g., link github, twitter, etc).
//         Example of usage: [{key: "foo", href:"https://b"}, {key: "bar", href:"https://"}].
//         Allowed values are:
//          - key: the key for the <dt> (e.g., "Bug Tracker"). Required.
//          - value: The value that will appear in the <dd> (e.g., "GitHub"). Optional.
//          - href: a URL for the value (e.g., "https://foo.com/issues"). Optional.
//          - class: a string representing CSS classes. Optional.
//  - license: can be one of the following
//      - "cc-by", which is experimentally available in some groups (but likely to be phased out).
//          Note that this is a dual licensing regime.
//      - "document", which is the old, but still available, document license.
//      - "dual", dual license.
//      - "cc0", an extremely permissive license. It is only recommended if you are working on a document that is
//          intended to be pushed to the WHATWG.
//      - "w3c-software", a permissive and attributions license (but GPL-compatible).
//      - "w3c-software-doc", (default) the W3C Software and Document License
//            https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
import {
  ISODate,
  codedJoinAnd,
  codedJoinOr,
  concatDate,
  docLink,
  htmlJoinAnd,
  norm,
  showError,
  showWarning,
} from "../core/utils.js";
import cgbgHeadersTmpl from "./templates/cgbg-headers.js";
import cgbgSotdTmpl from "./templates/cgbg-sotd.js";
import headersTmpl from "./templates/headers.js";
import { html } from "../core/import-maps.js";
import { pub } from "../core/pubsubhub.js";
import sotdTmpl from "./templates/sotd.js";

export const name = "w3c/headers";

/**
 * Resolves against https://www.w3.org.
 * @param {string} href
 */
function w3Url(href) {
  return new URL(href, "https://www.w3.org/").href;
}

const status2maturity = {
  LS: "WD",
  LD: "WD",
  FPWD: "WD",
};

export const status2text = {
  DNOTE: "Group Draft Note",
  NOTE: "Group Note",
  STMT: "Statement",
  "Member-SUBM": "Member Submission",
  MO: "Member-Only Document",
  ED: "Editor's Draft",
  LS: "Living Standard",
  LD: "Living Document",
  FPWD: "First Public Working Draft",
  WD: "Working Draft",
  CR: "Candidate Recommendation",
  CRD: "Candidate Recommendation",
  PR: "Proposed Recommendation",
  PER: "Proposed Edited Recommendation",
  REC: "Recommendation",
  DISC: "Discontinued Draft",
  RSCND: "Rescinded Recommendation",
  DRY: "Draft Registry",
  CRYD: "Candidate Registry",
  CRY: "Candidate Registry",
  RY: "Registry",
  unofficial: "Unofficial Draft",
  UD: "Unofficial Draft",
  base: "",
  finding: "TAG Finding",
  "draft-finding": "Draft TAG Finding",
  "editor-draft-finding": "Draft TAG Finding",
  "CG-DRAFT": "Draft Community Group Report",
  "CG-FINAL": "Final Community Group Report",
  "BG-DRAFT": "Draft Business Group Report",
  "BG-FINAL": "Final Business Group Report",
};
const status2long = {
  ...status2text,
  CR: "Candidate Recommendation Snapshot",
  CRD: "Candidate Recommendation Draft",
  CRY: "Candidate Registry Snapshot",
  CRYD: "Candidate Registry Draft",
};
export const status2track = {
  DNOTE: "Note",
  NOTE: "Note",
  STMT: "Note",
  "WG-NOTE": "Note",
  "IG-NOTE": "Note",
  FPWD: "Recommendation",
  WD: "Recommendation",
  CR: "Recommendation",
  CRD: "Recommendation",
  PR: "Recommendation",
  REC: "Recommendation",
  DISC: "Recommendation",
  RSCND: "Recommendation",
  DRY: "Registry",
  CRYD: "Registry",
  CRY: "Registry",
  RY: "Registry",
};
export const W3CNotes = ["DNOTE", "NOTE", "STMT"];
export const recTrackStatus = [
  "CR",
  "CRD",
  "DISC",
  "FPWD",
  "PER",
  "PR",
  "REC",
  "RSCND",
  "WD",
];
export const registryTrackStatus = ["DRY", "CRY", "CRYD", "RY"];
export const tagStatus = ["draft-finding", "finding", "editor-draft-finding"];
export const cgStatus = ["CG-DRAFT", "CG-FINAL"];
export const bgStatus = ["BG-DRAFT", "BG-FINAL"];
export const cgbgStatus = [...cgStatus, ...bgStatus];
export const trStatus = [
  ...W3CNotes,
  ...recTrackStatus,
  ...registryTrackStatus,
];
export const noTrackStatus = [
  "base",
  ...cgStatus,
  ...bgStatus,
  "editor-draft-finding",
  "draft-finding",
  "finding",
  "MO",
  "unofficial",
];
/** @type {Map<string, LicenseInfo>} */
export const licenses = new Map([
  [
    "cc0",
    {
      name: "Creative Commons 0 Public Domain Dedication",
      short: "CC0",
      url: "https://creativecommons.org/publicdomain/zero/1.0/",
    },
  ],
  [
    "w3c-software",
    {
      name: "W3C Software Notice and License",
      short: "W3C Software",
      url: "https://www.w3.org/Consortium/Legal/2002/copyright-software-20021231",
    },
  ],
  [
    "w3c-software-doc",
    {
      name: "W3C Software and Document Notice and License",
      short: "permissive document license",
      url: "https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document",
    },
  ],
  [
    "cc-by",
    {
      name: "Creative Commons Attribution 4.0 International Public License",
      short: "CC-BY",
      url: "https://creativecommons.org/licenses/by/4.0/legalcode",
    },
  ],
  [
    "document",
    {
      name: "W3C Document License",
      short: "document use",
      url: "https://www.w3.org/Consortium/Legal/copyright-documents",
    },
  ],
  [
    "dual",
    {
      name: "W3C Dual License",
      short: "dual license",
      url: "https://www.w3.org/Consortium/Legal/2013/copyright-documents-dual.html",
    },
  ],
  [
    undefined,
    {
      name: "unlicensed",
      url: null,
      short: "UNLICENSED",
    },
  ],
]);

const patentPolicies = ["PP2017", "PP2020"];

/**
 * @param {*} conf
 * @param {string} prop
 * @param {string | number | Date} fallbackDate
 */
function validateDateAndRecover(conf, prop, fallbackDate = new Date()) {
  const date = conf[prop] ? new Date(conf[prop]) : new Date(fallbackDate);
  // if date is valid
  if (Number.isFinite(date.valueOf())) {
    const formattedDate = ISODate.format(date);
    return new Date(formattedDate);
  }
  const msg = docLink`${prop} is not a valid date: "${conf[prop]}". Expected format 'YYYY-MM-DD'.`;
  showError(msg, name);
  return new Date(ISODate.format(new Date()));
}

function deriveLicenseInfo(conf) {
  let license = undefined;
  if (typeof conf.license === "string") {
    const lCaseLicense = conf.license.toLowerCase();
    if (!licenses.has(lCaseLicense)) {
      const msg = `The license "\`${conf.license}\`" is not supported.`;
      const choices = codedJoinOr(
        [...licenses.keys()].filter(k => k),
        {
          quotes: true,
        }
      );
      const hint = docLink`Please set
        ${"[license]"} to one of: ${choices}. If in doubt, remove \`license\` and let ReSpec pick one for you.`;
      showError(msg, name, { hint });
    } else {
      license = lCaseLicense;
    }
  }

  if (conf.isUnofficial && !license) {
    license = "cc-by";
  }

  // W3C docs can't be CC-BY or CC0
  if (!conf.isUnofficial && ["cc-by", "cc0"].includes(license)) {
    const msg = docLink`License "\`${conf.license}\`" is not allowed for W3C Specifications.`;
    const hint = docLink`Please set ${"[license]"} to \`"w3c-software-doc"\` instead.`;
    showError(msg, name, { hint });
  }
  const licenseInfo = licenses.get(license);
  return licenseInfo;
}

export async function run(conf) {
  conf.isBasic = conf.specStatus === "base";
  conf.isCGBG = cgbgStatus.includes(conf.specStatus);
  conf.isCGFinal = conf.isCGBG && conf.specStatus.endsWith("G-FINAL");
  conf.isCR = conf.specStatus === "CR" || conf.specStatus === "CRD";
  conf.isCRDraft = conf.specStatus === "CRD";
  conf.isCRY = conf.specStatus === "CRY" || conf.specStatus === "CRYD";
  conf.isEd = conf.specStatus === "ED";
  conf.isMemberSubmission = conf.specStatus === "Member-SUBM";
  conf.isMO = conf.specStatus === "MO";
  conf.isNote = W3CNotes.includes(conf.specStatus);
  conf.isNoTrack = noTrackStatus.includes(conf.specStatus);
  conf.isPER = conf.specStatus === "PER";
  conf.isPR = conf.specStatus === "PR";
  conf.isRecTrack = recTrackStatus.includes(conf.specStatus);
  conf.isRec = conf.isRecTrack && conf.specStatus === "REC";
  conf.isRegistry = registryTrackStatus.includes(conf.specStatus);
  conf.isRegular = !conf.isCGBG && !conf.isBasic;
  conf.isTagEditorFinding = conf.specStatus === "editor-draft-finding";
  conf.isTagFinding = tagStatus.includes(conf.specStatus);
  conf.isUnofficial = conf.specStatus === "unofficial";
  conf.licenseInfo = deriveLicenseInfo(conf);
  conf.prependW3C = !conf.isBasic && !conf.isUnofficial;
  conf.longStatus = status2long[conf.specStatus];
  conf.textStatus = status2text[conf.specStatus];
  conf.showPreviousVersion = false;

  if (conf.isRegular && !conf.shortName) {
    const msg = docLink`The ${"[shortName]"} configuration option is required for this kind of document.`;
    const hint = docLink`Please set ${"[shortName]"} to a short name for the specification.`;
    showError(msg, name, { hint });
  }

  conf.publishDate = validateDateAndRecover(
    conf,
    "publishDate",
    document.lastModified
  );
  conf.publishYear = conf.publishDate.getUTCFullYear();
  if (conf.modificationDate) {
    conf.modificationDate = validateDateAndRecover(
      conf,
      "modificationDate",
      document.lastModified
    );
  }

  if (conf.isRecTrack && !conf.github && !conf.wgPublicList) {
    const msg =
      "W3C Process requires a either a link to a public repository or mailing list.";
    const hint = docLink`Use the ${"[github]"} configuration option to add a link to a repository. Alternatively use ${"[wgPublicList]"} to link to a mailing list.`;
    showError(msg, name, {
      hint,
    });
  }

  if (conf.isEd && !conf.edDraftURI) {
    const msg = docLink`Editor's Drafts should set ${"[edDraftURI]"} configuration option.`;
    const hint = docLink`Please set ${"[edDraftURI]"} to the URL of the Editor's Draft. Alternatively, use the set ${"[github]"} option, which automatically sets it for you.`;
    showWarning(msg, name, { hint });
  }

  const pubSpace = derivePubSpace(conf);
  if (pubSpace && !conf.thisVersion) {
    const maturity = status2maturity[conf.specStatus] || conf.specStatus;
    const { shortName, publishDate } = conf;
    const date = concatDate(publishDate);
    const docVersion = `${maturity}-${shortName}-${date}`;
    const year = [...trStatus, "Member-SUBM"].includes(conf.specStatus)
      ? `${publishDate.getUTCFullYear()}/`
      : "";
    conf.thisVersion = w3Url(`${pubSpace}/${year}${docVersion}/`);
  }

  if (conf.isEd) conf.thisVersion = conf.edDraftURI;
  if (conf.isCGBG) validateCGBG(conf);
  if (conf.latestVersion !== null) {
    conf.latestVersion = conf.latestVersion
      ? w3Url(conf.latestVersion)
      : w3Url(`${pubSpace}/${conf.shortName}/`);
  }

  if (conf.latestVersion) validateIfAllowedOnTR(conf);

  const latestPath = `${pubSpace}/${conf.shortName}`;
  if (conf.previousPublishDate) {
    if (!conf.previousMaturity && !conf.isTagFinding) {
      const msg = docLink`${"[`previousPublishDate`]"} is set, but missing ${"[`previousMaturity`]"}.`;
      showError(msg, name);
    }

    conf.previousPublishDate = validateDateAndRecover(
      conf,
      "previousPublishDate"
    );

    const prevMaturity =
      status2maturity[conf.previousMaturity] ?? conf.previousMaturity;
    if (conf.isTagFinding && conf.latestVersion) {
      const pubDate = ISODate.format(conf.publishDate);
      conf.thisVersion = w3Url(`${latestPath}-${pubDate}`);
      const prevPubDate = ISODate.format(conf.previousPublishDate);
      conf.prevVersion = w3Url(`${latestPath}-${prevPubDate}}`);
    } else if (conf.isCGBG || conf.isBasic) {
      conf.prevVersion = conf.prevVersion || "";
    } else {
      const year = conf.previousPublishDate.getUTCFullYear();
      const { shortName } = conf;
      const date = concatDate(conf.previousPublishDate);
      conf.prevVersion = w3Url(
        `${pubSpace}/${year}/${prevMaturity}-${shortName}-${date}/`
      );
    }
  }
  if (conf.prevRecShortname && !conf.prevRecURI)
    conf.prevRecURI = w3Url(`${pubSpace}/${conf.prevRecShortname}`);

  // Move any editors with retiredDate to formerEditors.
  for (let i = 0; i < conf.editors.length; i++) {
    const editor = conf.editors[i];
    if ("retiredDate" in editor) {
      conf.formerEditors.push(editor);
      conf.editors.splice(i--, 1);
    }
  }

  if (conf.editors.length === 0) {
    const msg = "At least one editor is required.";
    const hint = docLink`Add one or more editors using the ${"[editors]"} configuration option.`;
    showError(msg, name, { hint });
  } else if (conf.editors.length && conf.isRecTrack) {
    // check that every editor has w3cid
    conf.editors.forEach((editor, i) => {
      if (editor.w3cid) return;
      const msg = docLink`Editor ${
        editor.name ? `"${editor.name}"` : `number ${i + 1}`
      } is missing their ${"[w3cid]"}.`;
      const hint = docLink`See ${"[`w3cid`]"} for instructions for how to retrieve it and add it.`;
      showError(msg, name, { hint });
    });
  }

  if (conf.alternateFormats?.some(({ uri, label }) => !uri || !label)) {
    const msg = docLink`Every ${"[`alternateFormats`]"} entry must have a \`uri\` and a \`label\`.`;
    showError(msg, name);
  }
  if (conf.copyrightStart == conf.publishYear) conf.copyrightStart = "";
  if (conf.isRec && !conf.errata) {
    const msg = "Recommendations must have an errata link.";
    const hint = docLink`Add an ${"[errata]"} URL to your ${"[respecConfig]"}.`;
    showError(msg, name, { hint });
  }
  conf.dashDate = ISODate.format(conf.publishDate);
  conf.publishISODate = conf.publishDate.toISOString();
  conf.shortISODate = ISODate.format(conf.publishDate);
  validatePatentPolicies(conf);
  await deriveHistoryURI(conf);
  if (conf.isTagEditorFinding) {
    delete conf.thisVersion;
    delete conf.latestVersion;
  }
  if (conf.isTagFinding) {
    conf.showPreviousVersion = conf.previousPublishDate ? true : false;
  }
  // configuration done - yay!

  const options = {
    get multipleAlternates() {
      return conf.alternateFormats && conf.alternateFormats.length > 1;
    },
    get alternatesHTML() {
      return (
        conf.alternateFormats &&
        htmlJoinAnd(
          // We need to pass a string here...
          conf.alternateFormats.map(({ label }) => label),
          (_, i) => {
            const alt = conf.alternateFormats[i];
            return html`<a
              rel="alternate"
              href="${alt.uri}"
              hreflang="${alt?.lang ?? null}"
              type="${alt?.type ?? null}"
              >${alt.label}</a
            >`;
          }
        )
      );
    },
  };

  // insert into document
  const header = (conf.isCGBG ? cgbgHeadersTmpl : headersTmpl)(conf, options);
  document.body.prepend(header);
  document.body.classList.add("h-entry");

  // handle SotD
  const sotd =
    document.getElementById("sotd") || document.createElement("section");
  if ((conf.isCGBG || !conf.isNoTrack || conf.isTagFinding) && !sotd.id) {
    const msg =
      "A Status of This Document must include at least on custom paragraph.";
    const hint =
      "Add a `<p>` in the 'sotd' section that reflects the status of this specification.";
    showError(msg, name, { elements: [sotd], hint });
  }
  sotd.id = sotd.id || "sotd";
  sotd.classList.add("introductory");
  // NOTE:
  //  When arrays, wg and wgURI have to be the same length (and in the same order).
  //  Technically wgURI could be longer but the rest is ignored.
  //  However wgPatentURI can be shorter. This covers the case where multiple groups
  //  publish together but some aren't used for patent policy purposes (typically this
  //  happens when one is foolish enough to do joint work with the TAG). In such cases,
  //  the groups whose patent policy applies need to be listed first, and wgPatentURI
  //  can be shorter — but it still needs to be an array.
  const wgPotentialArray = [conf.wg, conf.wgURI, conf.wgPatentURI];
  if (
    wgPotentialArray.some(item => Array.isArray(item)) &&
    !wgPotentialArray.every(item => Array.isArray(item))
  ) {
    const msg = docLink`If one of ${"[wg]"}, ${"[wgURI]"}, or ${"[wgPatentURI]"} is an array, they all have to be.`;
    const hint = docLink`Use the ${"[group]"} option with an array instead.`;
    showError(msg, name, { hint });
  }
  if (Array.isArray(conf.wg)) {
    conf.multipleWGs = conf.wg.length > 1;
    conf.wgHTML = htmlJoinAnd(conf.wg, (wg, idx) => {
      return html`the <a href="${conf.wgURI[idx]}">${wg}</a>`;
    });

    conf.wgPatentHTML = htmlJoinAnd(conf.wg, (wg, i) => {
      return html`a
        <a href="${conf.wgPatentURI[i]}" rel="disclosure"
          >public list of any patent disclosures (${wg})</a
        >`;
    });
  } else {
    conf.multipleWGs = false;
    if (conf.wg) {
      conf.wgHTML = html`the <a href="${conf.wgURI}">${conf.wg}</a>`;
    }
  }
  if (conf.isPR && !conf.crEnd) {
    const msg = docLink`${"[specStatus]"} is "PR" but no ${"[crEnd]"} is specified in the ${"[respecConfig]"} (needed to indicate end of previous CR).`;
    showError(msg, name);
  }

  if (conf.isCR && !conf.crEnd) {
    const msg = docLink`${"[specStatus]"} is "CR", but no ${"[crEnd]"} is specified in the ${"[respecConfig]"}.`;
    showError(msg, name);
  }
  conf.crEnd = validateDateAndRecover(conf, "crEnd");

  if (conf.isPr && !conf.prEnd) {
    const msg = docLink`${"[specStatus]"} is "PR" but no ${"[prEnd]"} is specified in the ${"[respecConfig]"}.`;
    showError(msg, name);
  }
  conf.prEnd = validateDateAndRecover(conf, "prEnd");

  if (conf.isPER && !conf.perEnd) {
    const msg = docLink`${"[specStatus]"} is "PER", but no ${"[perEnd]"} is specified.`;
    showError(msg, name);
  }
  conf.perEnd = validateDateAndRecover(conf, "perEnd");

  if (conf.hasOwnProperty("updateableRec")) {
    const msg = "Configuration option `updateableRec` is deprecated.";
    const hint = docLink`Add an ${"[`updateable-rec`|#updateable-rec-class]"} CSS class to the Status of This Document section instead.`;
    showWarning(msg, name, { hint });
    if (conf.updateableRec) {
      sotd.classList.add("updateable-rec");
    }
  }

  conf.updateableRec = sotd.classList.contains("updateable-rec");
  const revisionTypes = ["addition", "correction"];
  if (conf.isRec && conf.revisionTypes?.length > 0) {
    if (conf.revisionTypes.some(x => !revisionTypes.includes(x))) {
      const unknownRevisionTypes = conf.revisionTypes.filter(
        x => !revisionTypes.includes(x)
      );
      const msg = docLink`${"[specStatus]"} is "REC" with unknown ${"[revisionTypes]"}: '${codedJoinOr(
        unknownRevisionTypes
      )}'.`;
      const hint = docLink`The valid values for ${"[revisionTypes]"} are: ${codedJoinOr(
        revisionTypes
      )}.`;
      showError(msg, name, { hint });
    }
    if (conf.revisionTypes.includes("addition") && !conf.updateableRec) {
      const msg = docLink`${"[specStatus]"} is "REC" with proposed additions but the Recommendation is not marked as a allowing new features.`;
      showError(msg, name);
    }
  }

  if (
    conf.specStatus === "REC" &&
    conf.updateableRec &&
    conf.revisionTypes &&
    conf.revisionTypes.length > 0 &&
    !conf.revisedRecEnd
  ) {
    const msg = docLink`${"[specStatus]"} is "REC" with proposed corrections or additions but no ${"[revisedRecEnd]"} is specified in the ${"[respecConfig]"}.`;
    showError(msg, name);
  }
  conf.revisedRecEnd = validateDateAndRecover(conf, "revisedRecEnd");

  if (conf.noRecTrack && recTrackStatus.includes(conf.specStatus)) {
    const msg = docLink`Document configured as ${"[noRecTrack]"}, but its status ("${
      conf.specStatus
    }") puts it on the W3C Rec Track.`;
    const notAllowed = codedJoinOr(recTrackStatus, { quotes: true });
    const hint = `Status **can't** be any of: ${notAllowed}.`;
    showError(msg, name, { hint });
  }
  if (!sotd.classList.contains("override")) {
    html.bind(sotd)`${populateSoTD(conf, sotd)}`;
  }

  if (!conf.implementationReportURI && conf.isCR) {
    const msg = docLink`Missing ${"[implementationReportURI]"} configuration option in ${"[respecConfig]"}.`;
    const hint = docLink`CR documents must have an ${"[implementationReportURI]"} that describes the [implementation experience](https://www.w3.org/2019/Process-20190301/#implementation-experience).`;
    showError(msg, name, { hint });
  }
  if (!conf.implementationReportURI && conf.isPR) {
    const msg = docLink`PR documents should include an ${"[implementationReportURI]"}, which needs to link to a document that describes the [implementation experience](https://www.w3.org/2019/Process-20190301/#implementation-experience).`;
    showWarning(msg, name);
  }

  // Requested by https://github.com/w3c/respec/issues/504
  // Makes a record of a few auto-generated things.
  pub("amend-user-config", {
    publishISODate: conf.publishISODate,
    generatedSubtitle: norm(
      document.getElementById("w3c-state")?.textContent ?? ""
    ),
  });
}

function validateIfAllowedOnTR(conf) {
  const latestVersionURL = new URL(conf.latestVersion);
  const isW3C =
    latestVersionURL.origin === "https://www.w3.org" ||
    latestVersionURL.origin === "https://w3.org/";
  if (
    isW3C &&
    latestVersionURL.pathname.startsWith("/TR/") &&
    ["ED", ...trStatus].includes(conf.specStatus) === false
  ) {
    const msg = docLink`Documents with a status of \`"${conf.specStatus}"\` can't be published on the W3C's /TR/ (Technical Report) space.`;
    const hint = docLink`Ask a W3C Team Member for a W3C URL where the report can be published and change ${"[latestVersion]"} to something else.`;
    showError(msg, name, { hint });
    return;
  }
}

function derivePubSpace(conf) {
  const { specStatus, group } = conf;
  if (recTrackStatus.includes(specStatus) || conf.groupType === "wg") {
    return `/TR`;
  }

  switch (specStatus) {
    case "CG-FINAL":
    case "BG-FINAL":
      return `/community/reports/${group}`;
    case "finding":
    case "draft-finding":
      return "/2001/tag/doc";
    case "Member-SUBM":
      return `/Submission`;
  }

  return "";
}

function validateCGBG(conf) {
  const reportType = status2text[conf.specStatus];
  const latestVersionURL = conf.latestVersion
    ? new URL(w3Url(conf.latestVersion))
    : null;

  if (!conf.wg) {
    const msg = docLink`The ${"[group]"} configuration option is required for this kind of document (${reportType}).`;
    showError(msg, name);
    return;
  }

  // Deal with final reports
  if (conf.isCGFinal) {
    // Final report require a w3.org URL.
    const isW3C =
      latestVersionURL?.origin === "https://www.w3.org" ||
      latestVersionURL?.origin === "https://w3.org/";
    if (isW3C === false) {
      const msg = docLink`For ${reportType}, the ${"[latestVersion]"} URL must point to somewhere at https://www.w3.org/.`;
      const hint = `Ask a W3C Team Member for a W3C URL where the report can be published.`;
      showError(msg, name, { hint });
      return;
    }
  }
}

async function deriveHistoryURI(conf) {
  if (!conf.shortName || conf.historyURI === null || !conf.latestVersion) {
    return; // Nothing to do
  }

  const canShowHistory = conf.isEd || trStatus.includes(conf.specStatus);

  if (conf.historyURI && !canShowHistory) {
    const msg = docLink`The ${"[historyURI]"} can't be used with non /TR/ documents.`;
    const hint = docLink`Please remove ${"[historyURI]"}.`;
    showError(msg, name, { hint });
    conf.historyURI = null;
    return;
  }

  const historyURL = new URL(
    conf.historyURI ?? conf.shortName,
    "https://www.w3.org/standards/history/"
  );

  // If it's on the Rec Track or it's TR worthy, then allow history override.
  // Also make a an exception for FPWD, DNOTE, NOTE and DRY.
  if (
    (conf.historyURI && canShowHistory) ||
    ["FPWD", "DNOTE", "NOTE", "DRY"].includes(conf.specStatus)
  ) {
    conf.historyURI = historyURL.href;
    return;
  }

  // Let's get the history from the W3C.
  // Do a fetch HEAD request to see if the history exists...
  // We don't discriminate... if it's on the W3C website with a history,
  // we show it.
  try {
    const response = await fetch(historyURL, { method: "HEAD" });
    if (response.ok) {
      conf.historyURI = response.url;
    }
  } catch {
    // Ignore fetch errors
  }
}

function validatePatentPolicies(conf) {
  if (!conf.wgPatentPolicy) return;
  const policies = new Set([].concat(conf.wgPatentPolicy));
  if (
    policies.size &&
    ![...policies].every(policy => patentPolicies.includes(policy))
  ) {
    const invalidPolicies = [...policies].filter(
      policy => !patentPolicies.includes(policy)
    );
    const msg = docLink`Invalid ${"[wgPatentPolicy]"} value(s): ${codedJoinAnd(
      invalidPolicies
    )}.`;
    const hint = `Please use one of: ${codedJoinOr(patentPolicies)}.`;
    showError(msg, name, { hint });
  }
  if (policies.size !== 1) {
    const msg =
      "When collaborating across multiple groups, they must use the same patent policy.";
    const hint = docLink`For ${"[wgPatentPolicy]"}, please check the patent policies of each group. The patent policies were: ${[
      ...policies,
    ].join(", ")}.`;
    showError(msg, name, { hint });
  }
  // We take the first policy
  conf.wgPatentPolicy = [...policies][0];
}

/**
 * @param {*} conf
 * @param {HTMLElement} sotd
 */
function populateSoTD(conf, sotd) {
  const options = {
    ...collectSotdContent(sotd, conf),

    get mailToWGPublicList() {
      return `mailto:${conf.wgPublicList}@w3.org`;
    },
    get mailToWGPublicListWithSubject() {
      const fragment = conf.subjectPrefix
        ? `?subject=${encodeURIComponent(conf.subjectPrefix)}`
        : "";
      return this.mailToWGPublicList + fragment;
    },
    get mailToWGPublicListSubscription() {
      return `mailto:${conf.wgPublicList}-request@w3.org?subject=subscribe`;
    },
  };
  const template = conf.isCGBG ? cgbgSotdTmpl : sotdTmpl;
  return template(conf, options);
}

/**
 * @param {HTMLElement} sotd
 */
function collectSotdContent(sotd, { isTagFinding = false }) {
  const sotdClone = sotd.cloneNode(true);
  const additionalContent = document.createDocumentFragment();
  // we collect everything until we hit a section,
  // that becomes the custom content.
  while (sotdClone.hasChildNodes()) {
    if (
      sotdClone.nodeType === Node.ELEMENT_NODE &&
      // @ts-ignore
      sotdClone.firstChild.localName === "section"
    ) {
      break;
    }
    additionalContent.appendChild(sotdClone.firstChild);
  }
  if (isTagFinding && !additionalContent.hasChildNodes()) {
    const msg = docLink`ReSpec does not support automated SotD generation for TAG findings.`;
    const hint = `Please add the prerequisite content in the 'sotd' section.`;
    showWarning(msg, name, { hint });
  }
  return {
    additionalContent,
    // Whatever sections are left, we throw at the end.
    additionalSections: sotdClone.childNodes,
  };
}
