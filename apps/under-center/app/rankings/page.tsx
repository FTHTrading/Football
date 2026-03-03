import type { Metadata } from "next";
import RankingsView from "./RankingsView";

export const metadata: Metadata = {
  title: "Rankings — Under Center",
  description:
    "QB DNA Rankings — the definitive verified quarterback leaderboard powered by Under Center metrics.",
};

export default function RankingsPage() {
  return <RankingsView />;
}
