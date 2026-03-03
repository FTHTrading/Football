import type { Metadata } from "next";
import WatchlistView from "./WatchlistView";

export const metadata: Metadata = {
  title: "Watchlist | Under Center",
  description:
    "Your personal QB prospect watchlist. Track, compare, and monitor the quarterbacks on your radar.",
};

export default function WatchlistPage() {
  return <WatchlistView />;
}
