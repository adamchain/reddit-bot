export const policy = {
  maxCommentsPerHour: 8,
  maxDMsPerDay: 10,
  minRelevanceToComment: 3,
  requireConsentBeforeDM: true,
  identifyAsBuilder: true
};

export async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export function containsOptOut(text="") {
  const t = text.toLowerCase();
  return /(stop|dont contact|do not contact|unsubscribe|no thanks|leave me alone|go away)/.test(t);
}
