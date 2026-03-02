import { athletes } from "@/lib/athletes";
import AthleteProfile from "./AthleteProfile";

export function generateStaticParams() {
  return athletes.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const athlete = athletes.find((a) => a.slug === params.slug);
  if (!athlete) return { title: "Athlete Not Found — Under Center" };
  return {
    title: `${athlete.name} — Verified QB Profile | Under Center`,
    description: `${athlete.name}, ${athlete.position}, Class of ${athlete.class}. ${athlete.highSchool}, ${athlete.city}, ${athlete.state}. Verified quarterback metrics, mechanics grade, NFL comparisons, and recruiting data.`,
  };
}

export default function AthletePage({ params }: { params: { slug: string } }) {
  const athlete = athletes.find((a) => a.slug === params.slug);
  if (!athlete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-uc-white mb-2">
            Athlete Not Found
          </h1>
          <p className="text-uc-muted mb-6">
            This profile doesn&apos;t exist or hasn&apos;t been verified yet.
          </p>
          <a
            href="/"
            className="text-uc-gold hover:text-uc-gold/80 text-sm transition-colors"
          >
            ← Back to Under Center
          </a>
        </div>
      </div>
    );
  }
  return <AthleteProfile athlete={athlete} />;
}
