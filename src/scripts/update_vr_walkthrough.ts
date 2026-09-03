import { prisma } from "../lib/prisma";

async function main() {
  await prisma.service.updateMany({
    where: { slug: "vr-walkthrough" },
    data: { nameJa: "VRウォークスルー" },
  });
  console.log("Updated vr-walkthrough nameJa to VRウォークスルー in DB!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
