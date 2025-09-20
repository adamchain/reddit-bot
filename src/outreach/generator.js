import { persona } from "../persona.js";
import { product, heyway, rooming } from "../valueProps.js";

function adamPrefix() {
  const bits = [
    `adam here from philly suburbs`,
    `philly area guy here`,
    `hey from outside philly`,
    `dallas born but live in philly area now`
  ];
  return bits[Math.floor(Math.random()*bits.length)];
}

export function makeComment({ postTitle, subreddit, painPoint, productChoice }) {
  const chosenProduct = productChoice || heyway; // Default to heyway if not specified

  // Property management specific openers
  const propertyOpeners = [
    `${adamPrefix()} - been dealing with ${painPoint || "property management headaches"} across several portfolio companies`,
    `${adamPrefix()} and yeah this is brutal. seen this exact issue at like 4 different property management companies we work with`,
    `${adamPrefix()} - angel investor here and property management pain points come up constantly with our real estate startups`
  ];

  // Call/appointment specific openers
  const callOpeners = [
    `${adamPrefix()} - been dealing with ${painPoint || "no shows and followups"} at some of our portfolio companies`,
    `${adamPrefix()} and yeah this is a real pain point. seen it across like 3-4 companies we invest in`,
    `${adamPrefix()} - angel investor here and this exact issue comes up constantly with our startups`
  ];

  const propertyBridges = [
    `honestly one of our companies built something specifically for this`,
    `we actually have a portfolio company that tackled this exact problem`,
    `been working on this problem through one of our investments`
  ];

  const callBridges = [
    `honestly we helped build something for this exact problem`,
    `one of our companies actually solved this pretty well`,
    `we've been working on this problem for a while now`
  ];

  const propertyBenefits = [
    `way simpler than yardi or appfolio, designed for mid-size portfolios that outgrew spreadsheets`,
    `handles tenant stuff, maintenance coordination, rent collection without all the bloat`,
    `streamlined for 10-100 unit portfolios, cuts through the traditional pm software complexity`
  ];

  const callBenefits = [
    `basically cuts no shows way down and automates most of the followup stuff`,
    `handles the reminder calls, followups, all that tedious stuff automatically`,
    `pretty solid at catching people before they ghost and keeping leads warm`
  ];

  const casual_closes = [
    `anyway thought id mention it since this thread hit close to home`,
    `not trying to spam just figured it might help since we went through the same thing`,
    `lmk if you want to check it out or whatever, no pressure`
  ];

  // Choose content based on product type
  const isPropertyProduct = chosenProduct.name === "Rooming";
  const openers = isPropertyProduct ? propertyOpeners : callOpeners;
  const bridges = isPropertyProduct ? propertyBridges : callBridges;
  const benefits = isPropertyProduct ? propertyBenefits : callBenefits;

  const opener = openers[Math.floor(Math.random() * openers.length)];
  const bridge = bridges[Math.floor(Math.random() * bridges.length)];
  const benefit = benefits[Math.floor(Math.random() * benefits.length)];
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

export function makeDM({ username, contextLink, productChoice }) {
  const chosenProduct = productChoice || heyway; // Default to heyway
  const isPropertyProduct = chosenProduct.name === "Rooming";

  const callIntros = [
    `hey ${username}, adam here from the philly suburbs - you seemed interested in the call automation stuff`,
    `${username} - adam here, you asked about the solution we built for no shows and followups`,
    `hey ${username}, following up on that thread about call automation - adam from philly area`
  ];

  const propertyIntros = [
    `hey ${username}, adam here from philly suburbs - you seemed interested in the property management solution`,
    `${username} - adam here, you asked about the property management tool we built`,
    `hey ${username}, following up on that property management thread - adam from philly area`
  ];

  const callBodies = [
    `basically we help companies automate their reminder calls and followup sequences. cuts no shows way down`,
    `short version - automated calling system that handles reminders, followups, all that tedious stuff`,
    `we built this for our portfolio companies who were losing money on no shows and manual followups`
  ];

  const propertyBodies = [
    `basically we built a simplified property management tool for mid-size portfolios. way less bloated than yardi`,
    `short version - property management software designed for 10-100 units that outgrew spreadsheets`,
    `we built this for portfolio companies tired of complex pm software that does too much`
  ];

  const callLinks = [
    `heres a quick demo if you want to check it out: https://example.com/heyway-demo (no signup required)`,
    `threw together a sandbox you can test: https://example.com/heyway-try (takes like 2 mins)`,
    `demo link here if interested: https://example.com/heyway-test (no email gate or anything)`
  ];

  const propertyLinks = [
    `heres a quick demo if you want to check it out: https://getrooming.com/demo (no signup required)`,
    `threw together a sandbox you can test: https://getrooming.com/try (takes like 2 mins)`,
    `demo link here if interested: https://getrooming.com (no email gate or anything)`
  ];

  const casual_outros = [
    `no worries if not relevant, just reply stop and ill leave you alone`,
    `if its not useful just say stop and i wont bug you again`,
    `feel free to ignore if not your thing, or reply stop to opt out`
  ];

  const intros = isPropertyProduct ? propertyIntros : callIntros;
  const bodies = isPropertyProduct ? propertyBodies : callBodies;
  const links = isPropertyProduct ? propertyLinks : callLinks;

  const intro = intros[Math.floor(Math.random() * intros.length)];
  const body = bodies[Math.floor(Math.random() * bodies.length)];
  const link = links[Math.floor(Math.random() * links.length)];
  const outro = casual_outros[Math.floor(Math.random() * casual_outros.length)];

  return `${intro}.\n\n${body}. ${link}.\n\n${outro}.\n\ncontext: ${contextLink}`;
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
