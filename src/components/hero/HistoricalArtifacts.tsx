"use client";

import Image from "next/image";
import { Landmark } from "lucide-react";

interface ArtifactImage {
  _id: string;
  imageId: string;
  title: string;
  url: string;
  altText: string;
  imageType: string;
}

interface HistoricalArtifact {
  title: string;
  type: string;
  description: string;
  year: string;
  issuer: string;
  denomination: string;

  imageId?: ArtifactImage;

  status: string;
}

interface HistoricalArtifactsProps {
  artifacts?: HistoricalArtifact[];
}

export function HistoricalArtifacts({
  artifacts,
}: HistoricalArtifactsProps) {
  if (!artifacts || artifacts.length === 0) {
    return null;
  }

  return (
    <section className="section-card-hover p-8 md:p-10 mt-6">
      {/* SECTION HEADER */}

      <div className="flex items-center gap-3 mb-8">
        <Landmark className="w-5 h-5 text-[#D4AF37]" />

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-2">
            Legacy Preserved
          </p>

          <h2 className="font-serif text-3xl font-bold">
            Historical Artifacts
          </h2>
        </div>
      </div>

      {/* ARTIFACTS */}

      <div className="flex flex-wrap justify-center gap-6">
        {artifacts.map((artifact, index) => (
          <article
            key={`${artifact.title}-${index}`}
            className="w-full max-w-[390px] overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-[#17130F]"
          >
            {/* IMAGE */}

            {artifact.imageId?.url && (
              <div className="relative aspect-[4/3] bg-[#0F0F0F]">
                <Image
                  src={artifact.imageId.url}
                  alt={
                    artifact.imageId.altText ||
                    artifact.title
                  }
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 390px"
                  className="object-contain p-4"
                />
              </div>
            )}

            {/* CONTENT */}

            <div className="p-5 md:p-6">

              {artifact.type && (
                <span className="inline-flex mb-4 px-3 py-1 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/5 text-[10px] uppercase tracking-[0.15em] text-[#D4AF37]">
                  {artifact.type}
                </span>
              )}

              <h3 className="font-serif text-xl md:text-2xl font-bold text-[#F8F5F0] leading-snug">
                {artifact.title}
              </h3>

              {artifact.description && (
                <p className="mt-4 text-sm leading-6 text-[#D7C9A5]">
                  {artifact.description}
                </p>
              )}

              {(artifact.issuer ||
                artifact.denomination ||
                artifact.year) && (
                <div className="mt-5 pt-4 border-t border-[#D4AF37]/10 space-y-2 text-sm">

                  {artifact.year && (
                    <div className="flex gap-2">
                      <span className="text-[#A09682]">
                        Year:
                      </span>

                      <span className="text-[#D7C9A5]">
                        {artifact.year}
                      </span>
                    </div>
                  )}

                  {artifact.issuer && (
                    <div className="flex gap-2">
                      <span className="text-[#A09682]">
                        Issued by:
                      </span>

                      <span className="text-[#D4AF37]">
                        {artifact.issuer}
                      </span>
                    </div>
                  )}

                  {artifact.denomination && (
                    <div className="flex gap-2">
                      <span className="text-[#A09682]">
                        Denomination:
                      </span>

                      <span className="text-[#D7C9A5]">
                        {artifact.denomination}
                      </span>
                    </div>
                  )}

                </div>
              )}

            </div>
          </article>
        ))}
      </div>
    </section>
  );
}