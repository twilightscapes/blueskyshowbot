// Quick test script to verify time-sensitive logic
const { getRandomResponse, USE_TIME_SENSITIVE_MODE } = require('./dist/responses.js');

console.log('🧪 Testing time-sensitive logic...');
console.log(`📅 USE_TIME_SENSITIVE_MODE: ${USE_TIME_SENSITIVE_MODE}`);

// Test with #theblueskyshow hashtag
const response = getRandomResponse('#theblueskyshow');

console.log('\n📋 Response data:');
console.log('Text:', response?.text);
console.log('Image:', response?.image);
console.log('Alt:', response?.alt);

const now = new Date();
console.log(`\n🕐 Current time: ${now.toISOString()}`);
console.log(`📅 Day: ${now.getDay()} (0=Sunday, 5=Friday)`);
console.log(`⏰ Hour: ${now.getHours()}, Minutes: ${now.getMinutes()}`);