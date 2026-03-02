import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NIL Infrastructure | Under Center",
  description:
    "NIL compliance portal, agreement library, state law intelligence, and deal infrastructure for verified quarterbacks.",
};

export default function NilLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
