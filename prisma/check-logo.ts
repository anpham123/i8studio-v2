import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const r = await p.setting.findMany();
const m: Record<string,string> = {};
for (const s of r) m[s.key] = s.value;
console.log("logoImage:", m.logoImage || "EMPTY");
console.log("footerLogoImage:", m.footerLogoImage || "EMPTY");
console.log("logoFooterHeight:", m.logoFooterHeight || "EMPTY");
await p.$disconnect();
