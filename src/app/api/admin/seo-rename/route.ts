import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (rows.length === 0) {
      return NextResponse.json({ error: "Excel file is empty" }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const existingFiles = fs.readdirSync(uploadsDir);
    const logs: string[] = [];
    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // 1. Tự động nhận diện chỉ số cột (Column Index Auto-detection)
    let oldColIdx = 1; // Default Col B (index 1)
    let newColIdx = 5; // Default Col F (index 5)
    let headerRowIdx = -1;

    // Scan first 5 rows to find header
    for (let r = 0; r < Math.min(rows.length, 5); r++) {
      const row = rows[r];
      if (!row) continue;
      for (let c = 0; c < row.length; c++) {
        const val = String(row[c] || "").toLowerCase().trim();
        if (val.includes("file cũ") || val.includes("tên cũ") || val.includes("old") || val.includes("link cũ") || val.includes("url cũ")) {
          oldColIdx = c;
          headerRowIdx = r;
        }
        if (val.includes("file mới") || val.includes("tên mới") || val.includes("new") || val.includes("seo") || val.includes("tiếng nhật") || val.includes("ja")) {
          newColIdx = c;
          headerRowIdx = r;
        }
      }
      if (headerRowIdx !== -1) break;
    }

    logs.push(`🔍 Nhận diện cột: Cột file cũ = Cột ${String.fromCharCode(65 + oldColIdx)}, Cột file mới = Cột ${String.fromCharCode(65 + newColIdx)}`);

    const invalidNewKeywords = ["interior", "exterior", "vr360", "animation", "photo composite", "ar", "digital model", "tĩnh", "động"];

    for (let i = 0; i < rows.length; i++) {
      if (i <= headerRowIdx) continue; // Skip header

      const row = rows[i];
      if (!row || row.length === 0) continue;

      let rawOld = row[oldColIdx] ? String(row[oldColIdx]).trim() : "";
      let rawNew = row[newColIdx] ? String(row[newColIdx]).trim() : "";

      // Fallback: if rawOld is empty or doesn't have filename, scan row for an image filename
      if (!rawOld || (!rawOld.includes(".webp") && !rawOld.includes(".jpg") && !rawOld.includes(".png") && !rawOld.includes("/uploads/"))) {
        for (let c = 0; c < row.length; c++) {
          const item = String(row[c] || "").trim();
          if (item.includes("/uploads/") || (item.match(/\.(webp|jpg|png|jpeg)$/i) && !item.includes(" "))) {
            rawOld = item;
            break;
          }
        }
      }

      if (!rawOld || !rawNew) {
        continue;
      }

      // Skip header words
      if (rawOld.toLowerCase().includes("tên") || rawOld.toLowerCase().includes("file cũ") || rawNew.toLowerCase().includes("tên mới")) {
        continue;
      }

      // Safety: check if rawNew is just a category name
      if (invalidNewKeywords.includes(rawNew.toLowerCase())) {
        logs.push(`⚠️ [Dòng ${i + 1}] Bỏ qua vì tên mới '${rawNew}' là tên danh mục, không phải tên file`);
        skippedCount++;
        continue;
      }

      // Clean filenames
      const oldBase = path.basename(rawOld).replace(/[?#].*$/, "");
      let newBase = path.basename(rawNew).replace(/[?#].*$/, "");

      const oldExt = path.extname(oldBase);
      if (!path.extname(newBase) && oldExt) {
        newBase = `${newBase}${oldExt}`;
      }

      if (oldBase === newBase) {
        logs.push(`⏩ [Dòng ${i + 1}] Bỏ qua vì trùng tên: ${oldBase}`);
        skippedCount++;
        continue;
      }

      // 1. Rename physical file in public/uploads/
      let matchedOldFile = existingFiles.find((f) => f === oldBase);
      if (!matchedOldFile) {
        matchedOldFile = existingFiles.find((f) => f.toLowerCase() === oldBase.toLowerCase());
      }
      if (!matchedOldFile) {
        matchedOldFile = existingFiles.find((f) => f.endsWith(oldBase) || oldBase.endsWith(f));
      }

      if (matchedOldFile) {
        const oldFilePath = path.join(uploadsDir, matchedOldFile);
        const newFilePath = path.join(uploadsDir, newBase);
        try {
          if (fs.existsSync(oldFilePath)) {
            fs.renameSync(oldFilePath, newFilePath);
          }
        } catch (err: any) {
          logs.push(`⚠️ [Dòng ${i + 1}] Lỗi đổi tên file ${matchedOldFile}: ${err.message}`);
        }
      }

      // 2. Update database
      const oldUrlPattern = oldBase;
      const newUrl = `/uploads/${newBase}`;
      let dbUpdated = false;

      try {
        const works = await prisma.work.findMany({
          where: { image: { contains: oldUrlPattern } },
        });

        for (const w of works) {
          await prisma.work.update({
            where: { id: w.id },
            data: { image: newUrl },
          });
          dbUpdated = true;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((prisma as any).homeMedia?.findMany) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const homeMedia = await (prisma as any).homeMedia.findMany({
            where: { image: { contains: oldUrlPattern } },
          });
          for (const hm of homeMedia) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (prisma as any).homeMedia.update({
              where: { id: hm.id },
              data: { image: newUrl },
            });
            dbUpdated = true;
          }
        }

        logs.push(`✅ [Dòng ${i + 1}] ${matchedOldFile || oldBase} ➔ ${newBase} ${dbUpdated ? "(Đã cập nhật DB)" : ""}`);
        successCount++;
      } catch (err: any) {
        logs.push(`❌ [Dòng ${i + 1}] Lỗi DB: ${err.message}`);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      successCount,
      skippedCount,
      errorCount,
      logs,
    });
  } catch (err: any) {
    console.error("SEO rename error:", err);
    return NextResponse.json({ error: err.message || "Failed to process" }, { status: 500 });
  }
}
