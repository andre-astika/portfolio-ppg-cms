import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, canManagePortfolio } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Anda harus masuk untuk mengunggah file." }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const username = String(formData.get("username") || session.username).toLowerCase();

  if (!canManagePortfolio(session, username)) {
    return NextResponse.json({ error: "Anda tidak memiliki izin mengunggah ke portofolio ini." }, { status: 403 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak valid." }, { status: 400 });
  }

  const result = await saveUploadedFile(file, username);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ item: result.item });
}
