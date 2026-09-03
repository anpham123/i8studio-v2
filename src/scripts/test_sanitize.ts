import { sanitizeHtml } from "../lib/sanitize";

const testText = "<p>最初に、建築パースを「何のために、誰に、どのように見せるのか」を整理します。同じ建物でも、設計検討、コンペ、施主向けプレゼンテーション、不動産販売、広告など、用途によって重視すべき情報は異なります。</p>";

console.log("ORIGINAL:", testText);
console.log("SANITIZED & FORMATTED:", sanitizeHtml(testText));
