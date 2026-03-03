import DnaLabView from "./DnaLabView";

export const metadata = {
  title: "DNA Lab — Under Center",
  description:
    "Interactive QB DNA simulator. Adjust metrics in real-time and see how they affect the composite DNA score.",
};

export default function DnaLabPage() {
  return <DnaLabView />;
}
