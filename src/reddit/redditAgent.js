import 'dotenv/config';
import Snoowrap from 'snoowrap';
import { SUBREDDITS, BUSINESS_SUBREDDITS, HOBBY_SUBREDDITS } from './subs.js';
import { SUB_RULES } from './rules.js';
import { scorePost, containsConsent } from '../outreach/scorer.js';
import { policy, sleep, containsOptOut } from '../outreach/policy.js';
import { makeComment, makeConsentReply, maybeHobbyComment } from '../outreach/generator.js';
import { DMQueue } from '../outreach/dmQueue.js';
import { isDNC, addDNC, logAction, dailySummary } from '../storage/sqlite.js';

const r = new Snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});

const QUERY = "appointment OR reminder OR no-show OR no shows OR follow-up OR twilio OR dialer";
const AI_CALL_QUERY = "AI call OR voice AI OR automated call OR call automation OR AI phone OR voice bot OR conversational AI call";

async function fetchCandidates({ risingLimitPerSub = 15, searchLimitPerSub = 6 }) {
  const map = new Map();
  for (const sub of SUBREDDITS) {
    try {
      const rising = await r.getSubreddit(sub).getRising({ limit: risingLimitPerSub });
      rising.forEach(p => map.set(p.id, p));
      await sleep(700);
      const results = await r.getSubreddit(sub).search({ query: QUERY, sort: "new", time: "week", limit: searchLimitPerSub });
      results.forEach(p => map.set(p.id, p));
      await sleep(700);
    } catch (e) {
      console.warn(`[fetch] ${sub} error:`, e.message);
    }
  }
  return Array.from(map.values());
}

async function fetchAICallDiscussions({ searchLimitPerSub = 3 }) {
  const map = new Map();
  for (const sub of SUBREDDITS) {
    try {
      const results = await r.getSubreddit(sub).search({
        query: AI_CALL_QUERY,
        sort: "new",
        time: "day",
        limit: searchLimitPerSub
      });
      results.forEach(p => map.set(p.id, p));
      await sleep(700);
    } catch (e) {
      console.warn(`[fetch AI discussions] ${sub} error:`, e.message);
    }
  }
  return Array.from(map.values());
}

function inferPainPoint(post) {
  const text = `${post.title} ${post.selftext || ""}`.toLowerCase();

  // Property management pain points
  if (text.includes("tenant") || text.includes("rental") || text.includes("property management")) return "tenant management";
  if (text.includes("maintenance") || text.includes("repair") || text.includes("hvac")) return "maintenance coordination";
  if (text.includes("rent collection") || text.includes("late rent")) return "rent collection";
  if (text.includes("lease") || text.includes("eviction")) return "lease management";
  if (text.includes("yardi") || text.includes("appfolio") || text.includes("property management software")) return "pm software complexity";

  // Call/appointment pain points
  if (text.includes("no show")) return "no-shows";
  if (text.includes("voicemail")) return "voicemail callbacks";
  if (text.includes("follow")) return "lead follow-up";
  if (text.includes("twilio")) return "managing Twilio flows";
  if (text.includes("booking") || text.includes("schedule")) return "scheduling";

  return "misc pain points";
}

function getRelevantProduct(post) {
  const text = `${post.title} ${post.selftext || ""}`.toLowerCase();
  const subreddit = post.subreddit?.display_name?.toLowerCase() || "";

  // Property management focused subreddits and keywords
  const propertyKeywords = ["tenant", "rental", "property", "lease", "rent", "maintenance", "yardi", "appfolio"];
  const propertySubreddits = ["realestate", "landlord", "property", "investing"];

  const hasPropertyKeywords = propertyKeywords.some(keyword => text.includes(keyword));
  const isPropertySubreddit = propertySubreddits.some(sub => subreddit.includes(sub));

  if (hasPropertyKeywords || isPropertySubreddit) {
    return Math.random() < 0.7 ? rooming : heyway; // 70% Rooming for property content
  } else {
    return Math.random() < 0.8 ? heyway : rooming; // 80% HeyWay for other content
  }
}

async function scanReplies(dmQueue) {
  const inbox = await r.getUnreadMessages();
  for (const msg of inbox) {
    try {
      const body = (msg.body || "");
      const author = msg.author?.name;
      if (msg.was_comment) {
        if (containsConsent(body) && author) {
          await dmQueue.enqueue({ username: author, contextLink: msg.context || "https://reddit.com" });
          await logAction("consent", `Consent from ${author}`);
        }
        if (containsOptOut(body) && author) {
          await addDNC(author);
          await logAction("optout", `Opt-out by ${author}`);
        }
      } else {
        if (containsOptOut(body) && author) {
          await addDNC(author);
          await logAction("optout", `Opt-out (DM) by ${author}`);
        }
      }
      await msg.markAsRead();
    } catch (e) {
      console.warn("[inbox-scan] error:", e.message);
    }
    await sleep(350);
  }
}

function allowsPromoForSub(subName) {
  const key = (subName || "").toLowerCase();
  return (SUB_RULES[key]?.allowsPromotion ?? false);
}

let lastAIDiscussionCheck = 0;
const commentedPosts = new Set(); // Track posts we've already commented on

async function makeAIResponseComment(post) {
  const casual = [
    "yeah we've been testing some AI call stuff for our portfolio companies and honestly the results are pretty mixed. some clients love it, others still prefer human touch",
    "interesting thread - been investing in this space for a while now and the tech is getting way better but adoption is still slow in traditional industries",
    "we have a couple startups doing similar stuff in our portfolio. the key seems to be making it sound less robotic and more conversational",
    "been following AI call tech since like 2020 and its wild how far its come. still think theres room for improvement though",
    "curious what your experience has been with accuracy? our companies are seeing like 80-85% success rates which is decent but not perfect"
  ];

  return casual[Math.floor(Math.random() * casual.length)];
}

export async function runRedditOutreach() {
  const dmQueue = new DMQueue(r);
  dmQueue.process(); // background DM processor

  (async function inboxLoop(){
    while (true) {
      await scanReplies(dmQueue);
      await sleep(2 * 60 * 1000);
    }
  })();

  console.log("Starting sophisticated Reddit outreach strategy...");

  // Initial startup delay to avoid immediate rate limiting
  const startupDelay = 2 * 60 * 60 * 1000; // 2 hours on startup
  console.log(`Waiting ${startupDelay / 60000} minutes before starting to let account recover...`);
  await sleep(startupDelay);

  while (true) {
    try {
      // Check for AI call discussions every 2 hours (increased from 30 minutes)
      const now = Date.now();
      if (now - lastAIDiscussionCheck > 2 * 60 * 60 * 1000) {
        console.log("Checking for AI call discussions...");
        const aiPosts = await fetchAICallDiscussions({ searchLimitPerSub: 3 });

        for (const post of aiPosts) {
          if (commentedPosts.has(post.id)) continue;

          const author = post.author?.name;
          if (!author || await isDNC(author)) continue;

          const subName = post.subreddit?.display_name || "";
          const commentText = await makeAIResponseComment(post);

          try {
            await post.reply(commentText);
            await logAction("ai_response", `r/${subName} on ${post.id}`);
            commentedPosts.add(post.id);
            console.log(`[AI response] r/${subName} ${post.id} by u/${author}`);
            break; // Only comment on one AI discussion per cycle
          } catch (e) {
            console.warn("[AI response error]", e.message);
            if (e.message.includes('RATELIMIT')) {
              const match = e.message.match(/(\d+) minutes?/);
              const waitMinutes = match ? parseInt(match[1]) : 30;
              console.log(`Rate limited. Account needs recovery. Waiting ${waitMinutes + 60} minutes...`);
              await sleep((waitMinutes + 60) * 60 * 1000); // Add extra hour for recovery

              // Reset timers to be extra conservative after rate limit
              lastAIDiscussionCheck = Date.now();
              console.log("Resetting timers to be more conservative after rate limit...");
            }
          }
        }

        lastAIDiscussionCheck = now;
      }

      // Original comments on rising posts every 45-60 minutes
      console.log("Checking for rising posts to comment on...");
      const posts = await fetchCandidates({ risingLimitPerSub: 10, searchLimitPerSub: 4 });

      const scored = posts
        .filter(p => !commentedPosts.has(p.id))
        .map(p => ({
          post: p,
          score: scorePost({
            title: p.title,
            selftext: p.selftext || "",
            subreddit: p.subreddit?.display_name || "",
            flair: p.link_flair_text || ""
          })
        }))
        .sort((a,b) => b.score - a.score);

      if (scored.length > 0) {
        const { post, score } = scored[0];

        if (score >= policy.minRelevanceToComment) {
          const subName = post.subreddit?.display_name || "";
          const author = post.author?.name;

          if (author && !(await isDNC(author))) {
            const hobby = maybeHobbyComment(subName);
            const promoAllowed = allowsPromoForSub(subName);
            const isHobbySub = HOBBY_SUBREDDITS.includes(subName.toLowerCase());
            let commentText;

            if (hobby) {
              commentText = hobby;
            } else if (isHobbySub) {
              // For hobby subreddits, always use hobby comments, never business pitches
              commentText = maybeHobbyComment(subName) || "appreciate the discussion here, good community";
            } else {
              if (!promoAllowed) {
                const hobbyFallback = maybeHobbyComment(subName) || "appreciate the discussion here, sub rules look strict on promos so ill just listen and learn";
                commentText = hobbyFallback;
              } else {
                const selectedProduct = getRelevantProduct(post);
                commentText = makeComment({
                  postTitle: post.title,
                  subreddit: subName,
                  painPoint: inferPainPoint(post),
                  productChoice: selectedProduct
                }) + "\n\n" + makeConsentReply();
              }
            }

            try {
              await post.reply(commentText);
              await logAction("original_comment", `r/${subName} on ${post.id}`);
              commentedPosts.add(post.id);
              console.log(`[original comment] r/${subName} ${post.id} by u/${author} (score=${score})`);
            } catch (e) {
              console.warn("[original comment error]", e.message);
              if (e.message.includes('RATELIMIT')) {
                const match = e.message.match(/(\d+) minutes?/);
                const waitMinutes = match ? parseInt(match[1]) : 30;
                console.log(`Rate limited. Account needs recovery. Pausing bot for ${waitMinutes + 120} minutes...`);
                await sleep((waitMinutes + 120) * 60 * 1000); // Add extra 2 hours for recovery

                // Reset all timers to be ultra-conservative
                lastAIDiscussionCheck = Date.now();
                console.log("Account recovery mode: resetting all timers and being extra conservative...");
              }
            }
          }
        }
      }

      // Wait 3-4 hours before next cycle (much more conservative)
      const waitTime = (3 + Math.random() * 1) * 60 * 60 * 1000;
      console.log(`Waiting ${Math.round(waitTime / 60000)} minutes until next cycle...`);
      await sleep(waitTime);

    } catch (e) {
      console.error("[main loop error]", e.message);
      await sleep(5 * 60 * 1000); // Wait 5 minutes on error
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runRedditOutreach().catch(console.error);
}
