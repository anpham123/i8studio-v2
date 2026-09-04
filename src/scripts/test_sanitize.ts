import { sanitizeHtml } from "../lib/sanitize";

// Case 1: 1 image without caption
console.log("CASE 1 (1 img, no cap):", sanitizeHtml("<p><img src='1.jpg'/></p>"));

// Case 2: 1 image with caption
console.log("CASE 2 (1 img, with cap):", sanitizeHtml("<p><img src='1.jpg'/></p><p>鳥瞰パース</p>"));

// Case 3: 2 images with captions
console.log("CASE 3 (2 imgs, with caps):", sanitizeHtml("<p><img src='1.jpg'/></p><p>内観パース</p><p><img src='2.jpg'/></p><p>外観パース</p>"));

// Case 4: 3 images with captions
console.log("CASE 4 (3 imgs, with caps):", sanitizeHtml("<p><img src='1.jpg'/></p><p>A</p><p><img src='2.jpg'/></p><p>B</p><p><img src='3.jpg'/></p><p>C</p>"));


