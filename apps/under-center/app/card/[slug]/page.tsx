import { athletes } from "@/lib/athletes";
import VerifiedCard from "./VerifiedCard";

export function generateStaticParams() {
  return athletes.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const athlete = athletes.find((a) => a.slug === params.slug);
  if (!athlete) return { title: "Card Not Found — Under Center" };
  return {
    title: `${athlete.name} — Verified Card | Under Center`,
    description: `${athlete.name}'s verified quarterback card. ${athlete.starRating}-Star, ${athlete.position}, Class of ${athlete.class}. Share and verify.`,
  };
}

export default function CardPage({ params }: { params: { slug: string } }) {
  const athlete = athletes.find((a) => a.slug === params.slug);
  if (!athlete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-uc-white mb-2">
            Card Not Found
          </h1>
          <p className="text-uc-muted mb-6">
            This card doesn&apos;t exist or hasn&apos;t been verified yet.
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
  return <VerifiedCard athlete={athlete} />;
}
