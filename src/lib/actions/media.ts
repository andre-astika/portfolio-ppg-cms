"use server";

import { revalidatePath } from "next/cache";
import { requireSessionUser, canManagePortfolio } from "@/lib/auth";
import { deleteMediaFile } from "@/lib/upload";

export async function deleteMediaAction(username: string, id: string) {
  const session = await requireSessionUser();
  if (!canManagePortfolio(session, username)) {
    throw new Error("Anda tidak memiliki izin untuk mengedit media ini.");
  }
  await deleteMediaFile(username, id);
  revalidatePath("/admin/media");
}
