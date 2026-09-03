import { prisma } from "../lib/prisma";

async function main() {
  const row = await prisma.companyContent.findUnique({
    where: { section: "workflow" },
  });
  console.log("WORKFLOW DB CONTENT:");
  console.log(row?.contentJson);
}

main().catch(console.error).finally(() => prisma.$disconnect());
