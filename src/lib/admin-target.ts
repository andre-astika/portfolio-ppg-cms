import { redirect } from "next/navigation";
import { requireSessionUser } from "./auth";
import { getPortfolio } from "./data";
import type { Portfolio, User } from "./types";

/**
 * Resolves which portfolio an /admin/{profile,hometown,tasks,media,appearance}
 * page should show:
 * - Regular users always manage their own portfolio — there's nothing to pick.
 * - Admins have no personal portfolio of their own to edit here. They must
 *   pick a user first (via Manajemen User → "Kelola Portofolio", which adds
 *   `?as=<username>` to the URL). Visiting these pages without `?as=` sends
 *   an admin back to the user list instead of silently creating/editing an
 *   "admin" portfolio that would otherwise become a stray public page.
 */
export async function resolveTargetPortfolio(searchParams: {
  as?: string;
}): Promise<{
  session: User;
  targetUsername: string;
  portfolio: Portfolio;
  managingOther: boolean;
}> {
  const session = await requireSessionUser();

  if (session.role === "admin") {
    const asParam = searchParams.as?.toLowerCase().trim();
    if (!asParam) {
      redirect("/admin/users");
    }
    const portfolio = await getPortfolio(asParam);
    if (!portfolio) {
      redirect("/admin/users");
    }
    return { session, targetUsername: asParam, portfolio, managingOther: true };
  }

  const portfolio = await getPortfolio(session.username);
  if (!portfolio) {
    // Shouldn't happen (every "user" account gets a portfolio on creation),
    // but fail safe instead of crashing.
    redirect("/admin");
  }
  return { session, targetUsername: session.username, portfolio, managingOther: false };
}
