import { redirect } from "next/navigation";

export default function WriteRedirect({
  searchParams,
}: {
  searchParams: { term?: string };
}) {
  const term = searchParams.term;
  redirect(term ? `/?term=${encodeURIComponent(term)}` : "/");
}
