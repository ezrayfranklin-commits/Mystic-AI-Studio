import type { DrawnTarotCard, TarotCardData } from "@/types/reading";
import { cn } from "@/lib/utils";

export function TarotCard({
  card,
  compact = false
}: {
  card: TarotCardData | DrawnTarotCard;
  compact?: boolean;
}) {
  const position = "position" in card ? card.position : undefined;

  return (
    <article
      className={cn(
        "panel overflow-hidden rounded-lg",
        compact ? "p-3" : "p-4"
      )}
    >
      <div
        className={cn(
          "relative grid aspect-[3/4] place-items-center overflow-hidden rounded-md border border-white/10 bg-gradient-to-br",
          card.gradientClass
        )}
      >
        <div className="absolute inset-3 rounded-md border border-white/15" />
        <div className="absolute left-1/2 top-5 h-px w-20 -translate-x-1/2 bg-brass/60" />
        <div className="text-center">
          <div className="text-4xl font-semibold text-white sm:text-5xl">
            {card.symbol}
          </div>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-brass/70" />
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-center text-xs uppercase tracking-[0.2em] text-white/75">
          Major Arcana
        </div>
      </div>

      <div className="mt-4">
        {position ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
            {position}
          </p>
        ) : null}
        <h3 className="mt-1 text-base font-semibold text-white">{card.name}</h3>
        <p className="mt-2 text-xs leading-5 text-stone-300">
          {card.keywords.join(" / ")}
        </p>
      </div>
    </article>
  );
}
