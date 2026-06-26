export interface LeadData {
  name?: string;
  mobile?: string;
  babyAge?: string;
  location?: string;
  relationship?: string;
  service?: string;
}

export const extractLead = (message: string): LeadData => {

  const lead: LeadData = {};

  // Mobile Number
  const mobileMatch = message.match(/\b[6-9]\d{9}\b/);
  if (mobileMatch) {
    lead.mobile = mobileMatch[0];
  }

  // Baby Age
  const ageMatch = message.match(/\b(\d+)\s*(day|days|month|months|year|years)\b/i);
  if (ageMatch) {
    lead.babyAge = ageMatch[0];
  }

  // Relationship
  if (message.toLowerCase().includes("mother")) {
    lead.relationship = "Mother";
  }

  if (message.toLowerCase().includes("father")) {
    lead.relationship = "Father";
  }

  // Service
  if (message.toLowerCase().includes("baby massage")) {
    lead.service = "Baby Massage";
  }

  if (message.toLowerCase().includes("mother massage")) {
    lead.service = "Mother Massage";
  }

  return lead;
};
