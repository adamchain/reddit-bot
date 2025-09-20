import dotenv from 'dotenv';
import snoowrap from 'snoowrap';

// Load environment variables
dotenv.config();

console.log('Testing Reddit credentials...');
console.log('Username:', process.env.REDDIT_USERNAME);
console.log('Client ID:', process.env.REDDIT_CLIENT_ID);
console.log('User Agent:', process.env.REDDIT_USER_AGENT);

try {
    const reddit = new snoowrap({
        userAgent: process.env.REDDIT_USER_AGENT,
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        username: process.env.REDDIT_USERNAME,
        password: process.env.REDDIT_PASSWORD
    });

    // Simple test - get user info
    const user = await reddit.getMe();
    console.log('✅ Authentication successful!');
    console.log('Logged in as:', user.name);
    console.log('Account created:', new Date(user.created_utc * 1000));

} catch (error) {
    console.log('❌ Authentication failed:');
    console.log('Error message:', error.message);

    if (error.message.includes('401')) {
        console.log('\n🔍 Troubleshooting suggestions:');
        console.log('1. Verify your Reddit username and password by logging into reddit.com');
        console.log('2. Check if you have 2FA enabled (needs to be disabled for API access)');
        console.log('3. Make sure your Reddit account email is verified');
        console.log('4. Try creating a new Reddit app with script type');
    }
}