export const detectIntent = (message: string) => {
  const msg = message.toLowerCase();

  // Trial Price
  if (
    msg.includes("trial") &&
    (
      msg.includes("price") ||
      msg.includes("cost") ||
      msg.includes("charge") ||
      msg.includes("fee") ||
      msg.includes("kitne") ||
      msg.includes("kitna")
    )
  ) {
    return "TRIAL_PRICE";
  }

  return "UNKNOWN";
};
