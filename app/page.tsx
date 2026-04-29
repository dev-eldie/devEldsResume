import { Portfolio } from "@/components/Portfolio";
import { readContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await readContent();
  return <Portfolio content={content} />;
}
