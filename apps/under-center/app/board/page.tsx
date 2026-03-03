import type { Metadata } from "next";
import BoardView from "./BoardView";

export const metadata: Metadata = {
  title: "Prospect Board | Under Center",
  description:
    "The definitive QB prospect board — tiered rankings powered by verified DNA scores and composite analysis.",
};

export default function BoardPage() {
  return <BoardView />;
}
