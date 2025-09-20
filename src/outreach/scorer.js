const KEYWORDS = [
  "no-show", "no shows", "noshow", "reminder", "appointment", "appointments",
  "outbound calls", "outbound", "lead follow", "follow-up", "follow up",
  "cold call", "phone tree", "ivr", "twilio", "dialer", "dialling",
  "sales calls", "voicemail", "appointment scheduling", "booking", "no show"
];

export function scorePost({ title = "", selftext = "", subreddit = "", flair = "" }) {
  const blob = [title, selftext, subreddit, flair].join(" ").toLowerCase();
  let score = 0;
  for (const kw of KEYWORDS) if (blob.includes(kw)) score += 2;
  if (/health|clinic|dental|medspa|salon|spa|real estate|property|law|therapy|vet|veterinary/.test(blob)) score += 1;
  if (/help|how do i|tool|software|recommend|solution/.test(blob)) score += 1;
  return score;
}

export function containsConsent(text="") {
  const t = text.toLowerCase();
  return /(dm me|please dm|send me a dm|message me|shoot me a dm|yes,? dm|ok to dm|reach out)/.test(t);
}
