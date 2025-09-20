import 'dotenv/config';
import Snoowrap from 'snoowrap';

console.log('Testing Reddit credentials...');
console.log('Username:', process.env.REDDIT_USERNAME);
console.log('Client ID:', process.env.REDDIT_CLIENT_ID);
console.log('User Agent:', process.env.REDDIT_USER_AGENT);

const r = new Snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT,
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD
});

try {
    const me = await r.getMe();
    console.log('✅ Authentication successful!');
    console.log('Logged in as:', me.name);
    console.log('Account created:', new Date(me.created_utc * 1000));
} catch (error) {
    console.error('❌ Authentication failed:', error.message);
}