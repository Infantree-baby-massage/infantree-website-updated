export const detectIntent = (message: string) => {

  const msg = message.toLowerCase();

  // Trial Price
  if (
    msg.includes("trial") &&
    (
      msg.includes("price") ||
      msg.includes("cost") ||
      msg.includes("charge") ||
      msg.includes("charges") ||
      msg.includes("fee") ||
      msg.includes("kitna") ||
      msg.includes("kitne")
    )
  ) {
    return "TRIAL_PRICE";
  }

  // Baby Massage
  if (
    msg.includes("baby massage") ||
    msg.includes("newborn massage") ||
    msg.includes("infant massage")
  ) {
    return "BABY_MASSAGE";
  }

  // Mother Massage
  if (
    msg.includes("mother massage") ||
    msg.includes("postpartum massage") ||
    msg.includes("postnatal massage")
  ) {
    return "MOTHER_MASSAGE";
  }

  return "UNKNOWN";
};
