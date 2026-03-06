const fs = require('fs');
const path = require('path');

const srcMobile = 'C:\\Users\\abdel\\.gemini\\antigravity\\brain\\b7aec627-07ed-4895-9a6e-b5b4b6a7d9a0\\media__1772765660418.jpg';
const srcDesktop = 'C:\\Users\\abdel\\.gemini\\antigravity\\brain\\b7aec627-07ed-4895-9a6e-b5b4b6a7d9a0\\media__1772765923309.jpg';

const destDir = 'c:\\Users\\abdel\\Desktop\\تهنئة العيد\\public\\images\\hero';
const destMobile = path.join(destDir, 'hero-mobile.jpg');
const destDesktop = path.join(destDir, 'hero-desktop.jpg');

try {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.existsSync(srcMobile)) fs.copyFileSync(srcMobile, destMobile);
    if (fs.existsSync(srcDesktop)) fs.copyFileSync(srcDesktop, destDesktop);

    console.log('Images copied successfully!');
} catch (error) {
    console.error('Error copying images:', error);
}
