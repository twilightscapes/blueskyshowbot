// Test image retrieval for blueskyshow-today.webp
const { getImageBuffer, ENCODED_IMAGES } = require('./dist/images.js');

console.log('🧪 Testing image retrieval for blueskyshow-today.webp...');

// Check if the image exists in ENCODED_IMAGES
console.log('\n📁 Available images:');
console.log(Object.keys(ENCODED_IMAGES));

// Test retrieval
const imageBuffer = getImageBuffer('blueskyshow-today.webp');
console.log('\n🖼️ Image retrieval result:');
console.log('Image buffer exists:', !!imageBuffer);
console.log('Buffer type:', typeof imageBuffer);
if (imageBuffer) {
  console.log('Buffer length:', imageBuffer.length);
  console.log('Is Buffer instance:', Buffer.isBuffer(imageBuffer));
}

// Test all time-sensitive images
const timeSensitiveImages = [
  'blueskyshow-week.webp',
  'blueskyshow-tomorrow.webp', 
  'blueskyshow-today.webp',
  'blueskyshow-live.webp',
  'blueskyshow-replays.webp'
];

console.log('\n🕐 Testing all time-sensitive images:');
timeSensitiveImages.forEach(imageName => {
  const buffer = getImageBuffer(imageName);
  console.log(`${imageName}: ${!!buffer ? '✅' : '❌'}`);
});