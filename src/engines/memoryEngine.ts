export interface ConversationMemory {
  visitorId: string;
  name?: string;
  mobile?: string;
  babyAge?: string;
  relationship?: string;
  location?: string;
  service?: string;
  language?: string;
  lastIntent?: string;
}

const memoryStore: Record<string, ConversationMemory> = {};

export const getMemory = (visitorId: string) => {
  return memoryStore[visitorId] || { visitorId };
};

export const updateMemory = (
  visitorId: string,
  data: Partial<ConversationMemory>
) => {

  memoryStore[visitorId] = {
    ...getMemory(visitorId),
    ...data
  };

  return memoryStore[visitorId];
};
