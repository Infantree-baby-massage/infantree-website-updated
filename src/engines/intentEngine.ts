export const detectIntent = (message: string) => {

  const msg = message.toLowerCase().trim();

  // -----------------------------
  // Trial / Trial Price / Booking
  // -----------------------------
  if (
    msg.includes("trial") ||
    msg.includes("demo") ||
    msg.includes("sample session") ||
    msg.includes("trial session") ||
    msg.includes("price") ||
    msg.includes("cost") ||
    msg.includes("charge") ||
    msg.includes("charges") ||
    msg.includes("fee") ||
    msg.includes("book trial") ||
    msg.includes("trial booking") ||
    msg.includes("kitna") ||
    msg.includes("kitne") ||
    msg.includes("kitni")
  ) {
    return "TRIAL_PRICE";
  }

  // -----------------------------
  // Baby Massage
  // -----------------------------
  if (
    msg.includes("baby massage") ||
    msg.includes("newborn massage") ||
    msg.includes("infant massage") ||
    msg.includes("baby care") ||
    msg.includes("baby oil massage")
  ) {
    return "BABY_MASSAGE";
  }

  // -----------------------------
  // Mother Massage
  // -----------------------------
  if (
    msg.includes("mother massage") ||
    msg.includes("mom massage") ||
    msg.includes("postpartum massage") ||
    msg.includes("postnatal massage") ||
    msg.includes("delivery massage")
  ) {
    return "MOTHER_MASSAGE";
  }

  return "UNKNOWN";
};
