import { PLACEHOLDER_ATHLETES } from "@/lib/placeholder-data";
import ProfilePage from "./ProfileClient";

export function generateStaticParams() {
  return PLACEHOLDER_ATHLETES.map((a) => ({ id: a.id }));
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ProfilePage params={params} />;
}
