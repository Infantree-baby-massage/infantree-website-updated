export const detectCommunication = (message: string) => {

  const msg = message.trim();

  // Devanagari (Hindi / Marathi)
  const hasDevanagari = /[\u0900-\u097F]/.test(msg);

  // English letters
  const hasEnglish = /[a-zA-Z]/.test(msg);

  if (hasDevanagari && hasEnglish) {
    return {
      language: "mixed",
      script: "mixed",
      supported: true
    };
  }

  if (hasDevanagari) {
    return {
      language: "devanagari",
      script: "devanagari",
      supported: true
    };
  }

  if (hasEnglish) {
    return {
      language: "roman",
      script: "roman",
      supported: true
    };
  }

  return {
    language: "unknown",
    script: "unknown",
    supported: false
  };
};
