import knowledgeBase from "../data/knowledgeBase.json";

export const getKnowledge = (intent: string) => {

  const item = knowledgeBase.intents.find(
    (data: any) => data.intent === intent
  );

  if (!item) {
    return null;
  }

  return item;
};
