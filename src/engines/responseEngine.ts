import { detectCommunication } from "./communicationEngine";
import { detectIntent } from "./intentEngine";
import { getKnowledge } from "./knowledgeEngine";
import { extractLead } from "./leadEngine";

export const generateResponse = (
  message: string,
  visitorId: string
) => {

  // Step 1
  const communication = detectCommunication(message);

  // Step 2
  const intent = detectIntent(message);

  // Step 3
  const knowledge = getKnowledge(intent);

  // Step 4
  const lead = extractLead(message);

  // Unsupported language
  if (!communication.supported) {
    return {
      reply:
        "I can currently assist you only in English, Hindi and Marathi. Please choose one of these languages.",
      intent,
      lead,
      communication
    };
  }

  // Unknown intent
  if (!knowledge) {
    return {
      reply:
        "Thank you for your message. I am still learning and will assist you shortly.",
      intent,
      lead,
      communication
    };
  }

  // Temporary: English response
  return {
    reply: knowledge.answers.en,
    intent,
    lead,
    communication
  };
};
