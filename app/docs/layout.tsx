"use client";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Print-optimized styles injected globally for /docs routes */}
      <style jsx global>{`
        @media print {
          nav, footer, .no-print { display: none !important; }
          body { background: #fff !important; color: #111 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          main { padding-top: 0 !important; }
          .print-page-break { page-break-before: always; }
          .glass { background: #f8f8f8 !important; border: 1px solid #ddd !important; }
          .gradient-text-dna, .gradient-text { -webkit-text-fill-color: #111 !important; }
          @page { margin: 0.75in; size: letter; }
        }
        @media screen {
          .doc-container { max-width: 900px; margin: 0 auto; }
        }
      `}</style>
      {children}
    </>
  );
}
