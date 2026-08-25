import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { prisma } from "../src/lib/prisma";

/**
 * Script: SEO Image Renamer
 * Reads Excel file (Column B = Old Filename, Column F = New Filename)
 * Renames physical files in public/uploads/ and updates Database URLs.
 */
async function main() {
  console.log("==================================================");
  console.log("   🚀 i8 STUDIO - SEO Image Rename & DB Update   ");
  console.log("==================================================\n");

  const possibleFiles = [
    path.join(process.cwd(), "seo-rename.xlsx"),
    path.join(process.cwd(), "rename.xlsx"),
    path.join(process.cwd(), "works-seo.xlsx"),
    path.join(process.cwd(), "scripts", "seo-rename.xlsx"),
  ];

  let excelPath = "";
  for (const p of possibleFiles) {
    if (fs.existsSync(p)) {
      excelPath = p;
      break;
    }
  }

  // Also check any .xlsx file in root
  if (!excelPath) {
    const rootFiles = fs.readdirSync(process.cwd());
    const foundXlsx = rootFiles.find((f) => f.endsWith(".xlsx") && !f.startsWith("~$"));
    if (foundXlsx) {
      excelPath = path.join(process.cwd(), foundXlsx);
    }
  }

  if (!excelPath) {
    console.error("❌ Không tìm thấy file Excel nào trong thư mục dự án!");
    console.log("👉 Vui lòng đặt file Excel vào thư mục gốc với tên: 'seo-rename.xlsx'");
    console.log("   Quy ước cột: Cột B = Tên file cũ, Cột F = Tên file mới.");
    process.exit(1);
  }

  console.log(`📁 Đang đọc file Excel: ${path.basename(excelPath)}`);

  const workbook = XLSX.readFile(excelPath);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (rows.length === 0) {
    console.error("❌ File Excel trống!");
    process.exit(1);
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const existingFiles = fs.readdirSync(uploadsDir);
  console.log(`📦 Thư mục public/uploads có tổng cộng: ${existingFiles.length} files\n`);

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  // Process each row
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    // Column B is index 1, Column F is index 5
    const rawOld = row[1] ? String(row[1]).trim() : "";
    const rawNew = row[5] ? String(row[5]).trim() : "";

    // Skip header or empty rows
    if (!rawOld || !rawNew || rawOld.toLowerCase().includes("tên") || rawOld.toLowerCase().includes("file cũ")) {
      continue;
    }

    // Clean filenames
    const oldBase = path.basename(rawOld);
    let newBase = path.basename(rawNew);

    // If new filename doesn't specify an extension, keep original extension
    const oldExt = path.extname(oldBase);
    if (!path.extname(newBase) && oldExt) {
      newBase = `${newBase}${oldExt}`;
    }

    if (oldBase === newBase) {
      console.log(`⏩ [Dòng ${i + 1}] Bỏ qua vì tên cũ và mới giống nhau: ${oldBase}`);
      skippedCount++;
      continue;
    }

    // Find actual old file in public/uploads (case-insensitive & substring match for timestamp prefixes)
    let matchedOldFile = existingFiles.find((f) => f === oldBase);
    if (!matchedOldFile) {
      matchedOldFile = existingFiles.find((f) => f.toLowerCase() === oldBase.toLowerCase());
    }
    if (!matchedOldFile) {
      matchedOldFile = existingFiles.find((f) => f.endsWith(oldBase) || oldBase.endsWith(f));
    }

    let finalNewFile = newBase;
    let fileRenamed = false;

    if (matchedOldFile) {
      const oldFilePath = path.join(uploadsDir, matchedOldFile);
      const newFilePath = path.join(uploadsDir, newBase);

      try {
        if (fs.existsSync(oldFilePath)) {
          fs.renameSync(oldFilePath, newFilePath);
          fileRenamed = true;
        }
      } catch (err: any) {
        console.error(`⚠️ Lỗi đổi tên file: ${matchedOldFile} -> ${newBase}`, err.message);
      }
    } else {
      console.warn(`⚠️ [Dòng ${i + 1}] Không tìm thấy file vật lý '${oldBase}' trong public/uploads (vẫn sẽ cập nhật Database nếu có link)`);
    }

    // Update in Database (Works, HomeMedia, Collections, etc.)
    const oldUrlPattern = oldBase;
    const newUrl = `/uploads/${newBase}`;

    let dbUpdated = false;

    try {
      // 1. Update Work table
      const works = await prisma.work.findMany({
        where: {
          image: { contains: oldUrlPattern },
        },
      });

      for (const w of works) {
        await prisma.work.update({
          where: { id: w.id },
          data: { image: newUrl },
        });
        dbUpdated = true;
      }

      // 2. Update HomeMedia table
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((prisma as any).homeMedia?.findMany) {
        const homeMedia = await (prisma as any).homeMedia.findMany({
          where: {
            image: { contains: oldUrlPattern },
          },
        });

        for (const hm of homeMedia) {
          await (prisma as any).homeMedia.update({
            where: { id: hm.id },
            data: { image: newUrl },
          });
          dbUpdated = true;
        }
      }

      // 3. Update CollectionItem table
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((prisma as any).collectionItem?.findMany) {
        const collectionItems = await (prisma as any).collectionItem.findMany({
          where: {
            image: { contains: oldUrlPattern },
          },
        });

        for (const ci of collectionItems) {
          await (prisma as any).collectionItem.update({
            where: { id: ci.id },
            data: { image: newUrl },
          });
          dbUpdated = true;
        }
      }

      console.log(`✅ [Dòng ${i + 1}] ${matchedOldFile || oldBase} ➔ ${newBase} ${dbUpdated ? "(Đã cập nhật DB)" : "(File renamed)"}`);
      successCount++;
    } catch (err: any) {
      console.error(`❌ [Dòng ${i + 1}] Lỗi cập nhật DB:`, err.message);
      errorCount++;
    }
  }

  console.log("\n==================================================");
  console.log("   🎉 BÁO CÁO KẾT QUẢ ĐỔI TÊN SEO FILE ẢNH       ");
  console.log("==================================================");
  console.log(`✅ Thành công: ${successCount}`);
  console.log(`⏩ Bỏ qua (trùng tên): ${skippedCount}`);
  console.log(`❌ Lỗi: ${errorCount}`);
  console.log("==================================================\n");
}

main()
  .catch((e) => {
    console.error("Lỗi khi chạy script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
