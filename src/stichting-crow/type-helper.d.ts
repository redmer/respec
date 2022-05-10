type SpecStatusInfo = {
  /** The English name of the status. */
  name: string;
  /** The NL name of the status. */
  name_nl: string;

  /** Maturity level of the status. May be NaN */
  level?: number;

  /** CSS hexadecimal color notation. */
  hex: string;
};

type SpecTrack = "versioned" | "unversioned" | "registry";

type ImprintInfo = {
  /** Name of the imprint */
  name: string;

  /** URL of the imprint's logo */
  logo: string;

  /** Homepage of the imprint */
  url?: string;

  /** Disclaimer */
  disclaimer?: string;
};

interface UserConf extends Object {
  /** Specify the document status (enumerated list). */
  specStatus: string;
  /** The content type of the document. */
  specType: string;
  /** The publisher imprint (enumerated list). */
  imprint?: string;
  /** Specify "group/document" identifier. */
  shortName: string;
  /** Activate comments with Hypothes.is */
  hypothesisComments?: boolean;
  /** Specify a license code. */
  license: string;
  /** E-mail address for private e-mail feedback. */
  emailComments?: string;
  /** Date of publication. */
  publishDate?: string;
  /** Date of latest modification. */
  modificationDate?: string;
  /** Subject prefix of an e-mail. Defaults to shortName. */
  subjectPrefix: string;
  /** URL of latest DEF/DOC version of this document. */
  latestVersion: string;
  /** URL to this version of this document. */
  thisVersion: string;
  /** URL to latest editorial draft version of this document. */
  edDraftURI: string;
  /** Previous maturity version of this document. */
  prevVersion: string;
  /** Date before which review comments must be submitted. */
  reviewDateEnd?: string;

  /** Alternative formats for this document. */
  alternateFormats: {
    uri: string;
    label: string;
    lang?: string;
    /** mimetype */
    type?: string;
  }[];

  copyrightStart: string | number;
}

interface Conf extends UserConf {
  /** Inferred from document type. */
  isInReview: boolean;
  /** Inferred: detailed info on document type. */
  specStatusInfo: SpecStatusInfo;
  /** Inferred: detailed info on license. */
  licenseInfo: LicenseInfo;
  /** Inferred: detailed info on imprint. */
  publisher: ImprintInfo;
  /** Date, ISO-formatted */
  dashDate: string | Date;
  publishDate: Date;
  publishYear: number;
  modificationDate: Date;
  publishISODate: string;
  shortISODate: string;
  reviewDateEnd: Date;
  // [key: string]: any;
}
