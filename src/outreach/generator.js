import { persona } from "../persona.js";
import { product } from "../valueProps.js";

function adamPrefix() {
  const bits = [
    `adam here from philly suburbs`,
    `philly area guy here`,
    `hey from outside philly`,
    `dallas born but live in philly area now`
  ];
  return bits[Math.floor(Math.random()*bits.length)];
}

export function makeComment({ postTitle, subreddit, painPoint }) {
  const casual_openers = [
    `${adamPrefix()} - been dealing with ${painPoint || "no shows and followups"} at some of our portfolio companies`,
    `${adamPrefix()} and yeah this is a real pain point. seen it across like 3-4 companies we invest in`,
    `${adamPrefix()} - angel investor here and this exact issue comes up constantly with our startups`
  ];

  const casual_bridges = [
    `honestly we helped build something for this exact problem`,
    `one of our companies actually solved this pretty well`,
    `we've been working on this problem for a while now`
  ];

  const casual_benefits = [
    `basically cuts no shows way down and automates most of the followup stuff`,
    `handles the reminder calls, followups, all that tedious stuff automatically`,
    `pretty solid at catching people before they ghost and keeping leads warm`
  ];

  const casual_closes = [
    `anyway thought id mention it since this thread hit close to home`,
    `not trying to spam just figured it might help since we went through the same thing`,
    `lmk if you want to check it out or whatever, no pressure`
  ];

  const opener = casual_openers[Math.floor(Math.random() * casual_openers.length)];
  const bridge = casual_bridges[Math.floor(Math.random() * casual_bridges.length)];
  const benefit = casual_benefits[Math.floor(Math.random() * casual_benefits.length)];
  const close = casual_closes[Math.floor(Math.random() * casual_closes.length)];

  return `${opener}. ${bridge} - ${benefit}. ${close}`;
}

export function makeConsentReply() {
  const casual_consent = [
    "dm me if you want more info or whatever",
    "happy to share more details if interested just say the word",
    "let me know if you want to check it out, can send you a link"
  ];
  return casual_consent[Math.floor(Math.random() * casual_consent.length)];
}

export function makeDM({ username, contextLink }) {
  const intro = `Hey ${username}, Scott from Philly here — you asked for details.`;
  const body  = `Short version: ${product.elevator}. Typical teams see fewer no-shows and faster lead cycles.`;
  const bullets = product.bullets.map(b => `• ${b}`).join("\n");
  const linkish = "Here’s a brief explainer + sandbox: https://example.com/heyway (no email gate).";
  const outro = "If not useful, just reply 'stop' and I won’t reach out again.";
  return [intro, body, "", bullets, "", linkish, "", product.disclosure, outro, `Context: ${contextLink}`].join("\n");
}

// Hobby comments by category
const sportsComments = [
  "eagles fan since moving here from dallas, that defense is looking solid this year",
  "phillies games at cbp are the best, nothing like summer nights at the ballpark",
  "sixers need to figure out their rotation but embiid is still a beast",
  "flyers have been rebuilding forever but hey at least tickets are cheap",
  "philly sports fans are intense but honestly its part of what makes this city great"
];

const startupComments = [
  "angel investing in philly has been good to me, lots of undervalued companies here",
  "been looking at early stage companies, ai and fintech seem hot right now",
  "portfolio company just raised their series a, always exciting to see founders succeed",
  "startup scene in nyc vs philly is interesting, both have different advantages",
  "restaurant tech investments have been hit or miss but when they work they really work"
];

const volunteeringComments = [
  "been volunteering with local food banks, crazy how much need there is even in suburbs",
  "animal shelter work is rewarding but man some of these stories break your heart",
  "mentor young entrepreneurs through local programs, next generation has some great ideas",
  "community cleanup events are good way to meet neighbors and actually make a difference",
  "nonprofit board work takes time but seeing direct impact makes it worth it"
];

const dogComments = [
  "golden retriever owner here, best dogs ever but the hair situation is real",
  "dog parks around philly suburbs are pretty solid, dogs love the space",
  "rescue dogs are the way to go, so many good ones need homes",
  "training a new puppy right now, forgot how much work it is but worth every minute",
  "anyone know good dog friendly trails around here? mine needs more exercise"
];

const automotiveComments = [
  "been investing in automotive tech lately, evs and autonomous driving are wild",
  "car scene has changed so much since i was growing up in dallas",
  "some of our portfolio companies are working on fleet management stuff, interesting space",
  "classic car investments have been solid but storage costs in this area are brutal",
  "dealership software is ripe for disruption, so much legacy tech still being used"
];

function getHobbyComment(subreddit) {
  const sub = subreddit.toLowerCase();

  if (['eagles', 'phillies', 'sixers', 'flyers', 'philadelphia'].includes(sub)) {
    return sportsComments[Math.floor(Math.random() * sportsComments.length)];
  }

  if (['startups', 'entrepreneur', 'angelinvesting', 'venturecapital', 'investing'].includes(sub)) {
    return startupComments[Math.floor(Math.random() * startupComments.length)];
  }

  if (['volunteering', 'nonprofit', 'charity'].includes(sub)) {
    return volunteeringComments[Math.floor(Math.random() * volunteeringComments.length)];
  }

  if (['dogs', 'goldenretrievers'].includes(sub)) {
    return dogComments[Math.floor(Math.random() * dogComments.length)];
  }

  if (['automotive', 'cars'].includes(sub)) {
    return automotiveComments[Math.floor(Math.random() * automotiveComments.length)];
  }

  // Fallback to general hobby comments
  const generalHobby = [
    "anyone else investing in philly area startups? deal flow has been interesting lately",
    "been looking at some automotive tech investments, industry is wild right now",
    "restaurant space is tough but some cool concepts coming out of the city",
    "nyc vs philly for startup scene... honestly both have their advantages",
    "born in dallas but philly suburbs grew on me, good mix of city access and space"
  ];
  return generalHobby[Math.floor(Math.random() * generalHobby.length)];
}

export function maybeHobbyComment(subreddit = "") {
  const roll = Math.random();
  if (roll < 0.30) return getHobbyComment(subreddit); // Increased to 30%
  return null;
}
