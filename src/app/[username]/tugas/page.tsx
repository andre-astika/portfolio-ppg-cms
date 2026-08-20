import { notFound } from "next/navigation";
import TugasContent from "@/components/TugasContent";
import { getPortfolio } from "@/lib/data";

export default async function UserTugasPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const portfolio = await getPortfolio(username);
  if (!portfolio) notFound();

  return <TugasContent tasks={portfolio.tasks} categories={portfolio.taskCategories} />;
}
