# AI Reddit Bot

Automated Reddit outreach bot with sophisticated commenting strategy.

## Features

- **Two-tier commenting strategy**: AI call discussions (30min) + original posts (45-60min)
- **Hobby engagement**: 30% hobby comments across sports, startups, volunteering, dogs, automotive
- **Smart targeting**: Rising posts in business and hobby subreddits
- **Rate limit handling**: Automatic backoff and retry logic
- **Casual tone**: Relaxed grammar, authentic engagement

## Railway Deployment

### 1. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### 2. Deploy from GitHub
- Connect your GitHub repo to Railway
- Railway will auto-detect this as a Node.js project

### 3. Set Environment Variables
In Railway dashboard, add these variables:
```
REDDIT_USER_AGENT=adam-chain-app/1.0 by u/PipeNext7514
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USERNAME=your_username
REDDIT_PASSWORD=your_password
OPENAI_API_KEY=your_openai_key
```

### 4. Deploy
- Railway will automatically build and deploy
- Bot runs 24/7 with automatic restarts on failure

## Local Development

```bash
npm install
npm run reddit
```

## Bot Strategy

- **AI Response Comments** (every 30min): Responds to AI call system discussions
- **Original Comments** (every 45-60min): Comments on rising business posts
- **Hobby Comments** (30% of all comments): Engages in sports, startup, volunteering topics
- **Rate Limiting**: 10-minute delays between comments, automatic rate limit handling

## Monitoring

Check Railway logs to monitor bot activity and performance.