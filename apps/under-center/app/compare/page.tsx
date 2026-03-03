import type { Metadata } from "next";
import CompareView from "./CompareView";

export const metadata: Metadata = {
  title: "Compare QBs — Under Center",
  description:
    "Head-to-head quarterback comparison powered by verified Under Center metrics and DNA analysis.",
};

export default function ComparePage() {
  return <CompareView />;
}
