export interface CommunicationResult {
  language:
    | "english"
    | "hindi"
    | "marathi"
    | "mixed"
    | "unknown";

  script:
    | "roman"
    | "devanagari"
    | "mixed"
    | "unknown";

  style:
    | "formal"
    | "messaging"
    | "mixed"
    | "unknown";

  supported: boolean;

  confidence: number;
}

export const detectCommunication = (
  message: string
): CommunicationResult => {

  const msg = message.trim().toLowerCase();

  const hasEnglish = /[a-z]/.test(msg);

  const hasDevanagari = /[\u0900-\u097F]/.test(msg);

  // Unsupported Scripts
  const hasBengali = /[\u0980-\u09FF]/.test(message);
  const hasTamil = /[\u0B80-\u0BFF]/.test(message);
  const hasTelugu = /[\u0C00-\u0C7F]/.test(message);
  const hasKannada = /[\u0C80-\u0CFF]/.test(message);

  if (
    hasBengali ||
    hasTamil ||
    hasTelugu ||
    hasKannada
  ) {
    return {
      language: "unknown",
      script: "unknown",
      style: "unknown",
      supported: false,
      confidence: 100
    };
  }

  // Mixed Script

  if (hasEnglish && hasDevanagari) {

    return {

      language: "mixed",

      script: "mixed",

      style: "mixed",

      supported: true,

      confidence: 98

    };

  }

  // Roman Messages

  if (hasEnglish) {

    const hindiWords = [

      "mera",
      "meri",
      "mujhe",
      "kitna",
      "kitne",
      "baby",
      "massage",
      "chahiye",
      "hai",
      "karna",
      "book",
      "trial"

    ];

    const marathiWords = [

      "majha",
      "majhi",
      "mala",
      "aahe",
      "karaycha",
      "pahije",
      "kimat"

    ];

    const isHindi =
      hindiWords.some(word => msg.includes(word));

    const isMarathi =
      marathiWords.some(word => msg.includes(word));

    if (isHindi) {

      return {

        language: "hindi",

        script: "roman",

        style: "messaging",

        supported: true,

        confidence: 90

      };

    }

    if (isMarathi) {

      return {

        language: "marathi",

        script: "roman",

        style: "messaging",

        supported: true,

        confidence: 90

      };

    }

    return {

      language: "english",

      script: "roman",

      style: "formal",

      supported: true,

      confidence: 100

    };

  }

  // Devanagari

  if (hasDevanagari) {

    return {

      language: "mixed",

      script: "devanagari",

      style: "formal",

      supported: true,

      confidence: 85

    };

  }

  return {

    language: "unknown",

    script: "unknown",

    style: "unknown",

    supported: false,

    confidence: 0

  };

};
