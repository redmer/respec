// @ts-check
/**
 * Sets the defaults for W3C specs
 */
export const name = "stichting-crow/defaults";
import { coreDefaults } from "../core/defaults.js";
import { showError } from "../core/utils.js";

/** @type {Record<string, ImprintInfo>} */
const imprints = {
  crow: {
    name: "CROW",
    logo: "https://docs.crow.nl/respec-design/stichting-crow/logo/crow.svg",
    disclaimer: "https://www.crow.nl/disclaimer",
    url: "https://www.crow.nl/",
  },
  "crow-academie": {
    name: "CROW-academie",
    logo: "https://docs.crow.nl/respec-design/stichting-crow/logo/crow-academie.svg",
  },
  "crow-cur": {
    name: "CROW-CUR",
    logo: "https://docs.crow.nl/respec-design/stichting-crow/logo/crow-cur.svg",
  },
  "crow-fietsberaad": {
    name: "CROW-Fietsberaad",
    logo: "https://docs.crow.nl/respec-design/stichting-crow/logo/crow-fietsberaad.svg",
    url: "https://www.fietsberaad.nl",
    disclaimer: "https://www.fietsberaad.nl/disclaimer",
  },
  "crow-innovatie-in-de-infra": {
    name: "Innovatie in de Infra",
    logo: "https://docs.crow.nl/respec-design/stichting-crow/logo/crow-innovatie-in-de-infra.svg",
  },
  "crow-kpvv": {
    name: "CROW-KpVV",
    logo: "https://docs.crow.nl/respec-design/stichting-crow/logo/crow-kpvv.svg",
  },
  "crow-levende-stad": {
    name: "CROW Levende Stad",
    logo: "https://docs.crow.nl/respec-design/stichting-crow/logo/crow-levende-stad.svg",
  },
  "crow-platform": {
    name: "CROW Platform",
    logo: "https://docs.crow.nl/respec-design/stichting-crow/logo/crow-platform.svg",
    url: "https://crowplatform.com/",
  },
  "crow-raw": {
    name: "CROW-RAW",
    logo: "https://docs.crow.nl/respec-design/stichting-crow/logo/crow-raw.svg",
    url: "https://raw.nl/",
  },
  iampro: {
    name: "iAMPro",
    logo: "https://docs.crow.nl/respec-design/stichting-crow/logo/iampro.svg",
    url: "https://www.iampro-portaal.nl/",
  },
  knspv: {
    name: "Kennisnetwerk SPV",
    logo: "https://docs.crow.nl/respec-design/stichting-crow/logo/knspv.png",
    url: "https://www.kennisnetwerkspv.nl/",
    disclaimer: "https://www.kennisnetwerkspv.nl/disclaimer",
  },
};

const crowDefaults = {
  specStatus: "DOC",
  lint: {
    "privsec-section": false,
    "required-sections": true,
    "wpt-tests-exist": false,
    "no-unused-dfns": "warn",
    a11y: false,
  },
  doJsonLd: false,
  logos: [],
  xref: true,
  wgId: "",
  otherLinks: [],
  excludeGithubLinks: true,
  subtitle: "",
  prevVersion: "",
  formerEditors: [],
  editors: [],
  authors: [],
};

export function run(conf) {
  // assign the defaults
  const lint =
    conf.lint === false
      ? false
      : {
          ...coreDefaults.lint,
          ...crowDefaults.lint,
          ...conf.lint,
        };

  Object.assign(conf, {
    ...coreDefaults,
    ...crowDefaults,
    ...conf,
    lint,
  });

  processLogos(conf);
}

function processLogos(conf) {
  const defaultImprint = imprints["crow"];
  let imprintInfo = imprints[conf.imprint];
  if (!imprintInfo) {
    const msg = `The \`"imprint"\` configuration value is not recognized.`;
    const hint = `Select a known imprint from <https://docs.crow.nl/respec-design/stichting-crow/#logos>.`;
    showError(msg, name, { hint });
    imprintInfo = defaultImprint;
  }

  conf.publisher = {
    ...defaultImprint,
    ...imprintInfo,
  };

  const logo = {
    src: conf.publisher.logo,
    alt: conf.publisher.name,
    height: 75,
    width: 150,
    url: conf.publisher.url,
  };

  conf.logos.unshift(logo);
}
