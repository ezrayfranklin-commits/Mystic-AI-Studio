"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CalendarDays,
  Coins,
  Copy,
  Gift,
  Hand,
  Hash,
  HeartHandshake,
  Moon,
  RefreshCcw,
  ScanFace,
  ScanLine,
  Share2,
  Sparkles,
  SunMedium,
  Upload,
  UserRound,
  X
} from "lucide-react";

import { TarotCard } from "@/components/TarotCard";
import { tarotDeck } from "@/data/tarotDeck";
import { cn } from "@/lib/utils";
import type { DrawnTarotCard } from "@/types/reading";

type ReadingKind =
  | "tarot"
  | "palm"
  | "horoscope"
  | "match"
  | "dream"
  | "numerology"
  | "face"
  | "bazi"
  | "almanac";

type StudioFeature = {
  kind: ReadingKind;
  title: string;
  description: string;
  badge: string;
  action: string;
  icon: ReactNode;
  accent: string;
};

const features: StudioFeature[] = [
  {
    kind: "tarot",
    title: "Tarot Reading",
    description: "Reveal a three-card past, present, and path spread with a quick AI-style reflection.",
    badge: "Live tool",
    action: "Start Reading",
    icon: <Sparkles className="h-6 w-6" aria-hidden="true" />,
    accent: "from-brass/30 via-aura/20 to-tide/10"
  },
  {
    kind: "palm",
    title: "Palm Reading",
    description: "Upload-ready palm analysis placeholder for life, heart, head, and fate lines.",
    badge: "Demo module",
    action: "Scan Palm",
    icon: <Hand className="h-6 w-6" aria-hidden="true" />,
    accent: "from-tide/25 via-emerald-300/15 to-brass/15"
  },
  {
    kind: "horoscope",
    title: "Daily Horoscope",
    description: "Choose a zodiac sign for a daily, weekly, or monthly celestial note.",
    badge: "Live tool",
    action: "Check Today",
    icon: <SunMedium className="h-6 w-6" aria-hidden="true" />,
    accent: "from-amber-300/30 via-orange-300/15 to-rose-300/15"
  },
  {
    kind: "match",
    title: "Zodiac Match",
    description: "Explore a playful sign-to-sign compatibility dynamic for love or friendship.",
    badge: "Live tool",
    action: "Match Now",
    icon: <HeartHandshake className="h-6 w-6" aria-hidden="true" />,
    accent: "from-rose-300/25 via-aura/20 to-brass/15"
  },
  {
    kind: "dream",
    title: "Dream Oracle",
    description: "Decode recurring symbols and emotional themes from a remembered dream.",
    badge: "Live tool",
    action: "Interpret Dream",
    icon: <Moon className="h-6 w-6" aria-hidden="true" />,
    accent: "from-indigo-300/30 via-sky-300/15 to-tide/15"
  },
  {
    kind: "numerology",
    title: "Name Numerology",
    description: "Turn a name into a symbolic number profile and reflection prompt.",
    badge: "Demo module",
    action: "Analyze Name",
    icon: <Hash className="h-6 w-6" aria-hidden="true" />,
    accent: "from-brass/25 via-yellow-200/10 to-aura/20"
  },
  {
    kind: "face",
    title: "AI Face Reading",
    description: "Photo-upload placeholder for future physiognomy-style feature packaging.",
    badge: "Demo module",
    action: "Scan Face",
    icon: <ScanFace className="h-6 w-6" aria-hidden="true" />,
    accent: "from-cyan-300/25 via-aura/15 to-rose-300/15"
  },
  {
    kind: "bazi",
    title: "BaZi Birth Chart",
    description: "Birth date and time intake for a four-pillars style destiny preview.",
    badge: "Demo module",
    action: "Calculate Destiny",
    icon: <CalendarDays className="h-6 w-6" aria-hidden="true" />,
    accent: "from-orange-300/20 via-brass/15 to-tide/15"
  },
  {
    kind: "almanac",
    title: "Daily Almanac",
    description: "A daily lucky activities and timing panel for quick repeat visits.",
    badge: "Demo module",
    action: "Check Today",
    icon: <UserRound className="h-6 w-6" aria-hidden="true" />,
    accent: "from-tide/20 via-blue-300/15 to-brass/20"
  }
];

const zodiacSigns = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces"
];

const tarotPositions = ["Past", "Present", "Path"];

function drawStudioCards(): DrawnTarotCard[] {
  const pool = [...tarotDeck];
  return tarotPositions.map((position) => {
    const index = Math.floor(Math.random() * pool.length);
    const [card] = pool.splice(index, 1);
    return { ...card, position };
  });
}

function nameNumber(name: string) {
  if (!name.trim()) {
    return 7;
  }
  return (
    (name
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .split("")
      .reduce((total, letter) => total + letter.charCodeAt(0) - 96, 0) %
      9) +
    1
  );
}

export function HomeReadingStudio() {
  const [selected, setSelected] = useState<StudioFeature | null>(null);
  const [giftOpen, setGiftOpen] = useState(false);
  const [credits, setCredits] = useState(3);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedCreditValue = window.localStorage.getItem("mystic-demo-credits");
      const storedCredits = Number(storedCreditValue);
      if (storedCreditValue !== null && Number.isFinite(storedCredits)) {
        setCredits(Math.max(0, storedCredits));
      }

      const dismissed = window.localStorage.getItem("mystic-welcome-gift-dismissed");
      if (!dismissed) {
        setGiftOpen(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const updateCredits = (nextCredits: number) => {
    const normalized = Math.max(0, nextCredits);
    setCredits(normalized);
    window.localStorage.setItem("mystic-demo-credits", normalized.toString());
  };

  return (
    <>
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-brass">
              Choose Your Reading
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Multiple oracle tools in one studio
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300">
              Start with the quick modal experience, then open the full page when
              you want a deeper reading. Four tools are fully wired; the rest
              are clearly marked demo modules for future expansion.
            </p>
          </div>
          <div className="panel flex flex-col gap-3 rounded-lg px-4 py-3 text-sm text-stone-200 sm:items-end">
            <span>
              <span className="font-semibold text-brass">{credits}</span> local demo credits
            </span>
            {credits <= 0 ? (
              <button
                type="button"
                className="focus-ring rounded-md border border-brass/40 px-3 py-2 text-xs font-semibold text-brass transition hover:bg-brass/10"
                onClick={() => updateCredits(3)}
              >
                Reset Demo Credits
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <button
              key={feature.kind}
              type="button"
              aria-label={`Open ${feature.title} quick preview`}
              className="group panel animate-fade-up relative flex min-h-72 overflow-hidden rounded-lg p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-brass/45 hover:shadow-glow"
              style={{ animationDelay: `${index * 60}ms` }}
              onClick={() => setSelected(feature)}
            >
              <span
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-70 transition duration-500 group-hover:opacity-100",
                  feature.accent
                )}
              />
              <span className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.12),transparent)] transition duration-700 group-hover:translate-x-[120%]" />
              <span className="relative flex h-full w-full flex-col">
                <span className="grid h-12 w-12 place-items-center rounded-md border border-brass/30 bg-black/25 text-brass">
                  {feature.icon}
                </span>
                <span className="mt-5 text-xl font-semibold text-white">
                  {feature.title}
                </span>
                <span className="mt-3 flex-1 text-sm leading-6 text-stone-300">
                  {feature.description}
                </span>
                <span className="mt-5 flex items-center justify-between gap-3">
                  <span className="rounded-md border border-white/10 bg-black/25 px-3 py-1 text-xs font-semibold text-brass">
                    {feature.badge}
                  </span>
                  <span className="rounded-md bg-brass px-3 py-2 text-sm font-semibold text-night">
                    {feature.action}
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <FloatingCredits credits={credits} />

      {giftOpen ? (
        <WelcomeGiftModal
          onClose={() => {
            window.localStorage.setItem("mystic-welcome-gift-dismissed", "true");
            setGiftOpen(false);
          }}
          onClaim={() => {
            updateCredits(credits + 3);
            window.localStorage.setItem("mystic-welcome-gift-dismissed", "true");
            setGiftOpen(false);
          }}
        />
      ) : null}

      {selected ? (
        <ReadingModal
          feature={selected}
          credits={credits}
          onClose={() => setSelected(null)}
          onAddCredits={() => updateCredits(3)}
          onSpendCredit={() => {
            if (credits <= 0) {
              return false;
            }
            updateCredits(credits - 1);
            return true;
          }}
        />
      ) : null}
    </>
  );
}

function FloatingCredits({ credits }: { credits: number }) {
  return (
    <div className="fixed bottom-5 right-5 z-40 hidden rounded-lg border border-brass/30 bg-night/85 px-4 py-3 text-sm font-semibold text-brass shadow-glow backdrop-blur md:flex">
      <Coins className="mr-2 h-4 w-4" aria-hidden="true" />
      {credits} credits
    </div>
  );
}

function WelcomeGiftModal({
  onClose,
  onClaim
}: {
  onClose: () => void;
  onClaim: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-md">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-gift-title"
        className="animate-modal-slide panel relative w-full max-w-md rounded-lg p-6 text-center"
      >
        <button
          type="button"
          aria-label="Close welcome gift"
          className="button-ghost absolute right-3 top-3 h-9 w-9 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-md border border-brass/35 bg-brass/15 text-brass">
          <Gift className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 id="welcome-gift-title" className="mt-5 text-2xl font-semibold text-white">Welcome gift</h2>
        <p className="mt-3 text-sm leading-6 text-stone-300">
          Start with three local demo credits for quick preview interactions in
          this template. They are stored only in this browser.
        </p>
        <p className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4 text-xs leading-5 text-stone-400">
          No account, payment, or daily reset is active in this open template.
          The timer-free demo keeps the experience honest while you test it.
        </p>
        <button type="button" className="button-primary mt-5 w-full" onClick={onClaim}>
          Add Local Demo Credits
        </button>
      </section>
    </div>
  );
}

function ReadingModal({
  feature,
  credits,
  onClose,
  onAddCredits,
  onSpendCredit
}: {
  feature: StudioFeature;
  credits: number;
  onClose: () => void;
  onAddCredits: () => void;
  onSpendCredit: () => boolean;
}) {
  const [status, setStatus] = useState("");

  const handleCopy = async () => {
    const url = `${window.location.origin}/#features`;
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Preview link copied.");
    } catch {
      setStatus("Copy failed. You can copy the page URL from the address bar.");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${feature.title} preview`,
      text: "Try this AI divination template preview.",
      url: `${window.location.origin}/#features`
    };

    if ("share" in navigator) {
      try {
        await navigator.share(shareData);
        setStatus("Share sheet opened.");
        return;
      } catch {
        setStatus("Share was canceled.");
        return;
      }
    }

    await handleCopy();
  };

  return (
    <div className="fixed inset-0 z-[65] grid place-items-center bg-black/70 p-4 backdrop-blur-md">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reading-modal-title"
        className="animate-modal-slide panel relative max-h-[88svh] w-full max-w-3xl overflow-y-auto rounded-lg p-5 sm:p-6"
      >
        <button
          type="button"
          aria-label="Close reading modal"
          className="button-ghost absolute right-3 top-3 h-9 w-9 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="pr-10">
          <div className="grid h-12 w-12 place-items-center rounded-md border border-brass/30 bg-brass/10 text-brass">
            {feature.icon}
          </div>
          <h2 id="reading-modal-title" className="mt-4 text-2xl font-semibold text-white">{feature.title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-300">{feature.description}</p>
        </div>

        <div className="mt-6">
          {feature.kind === "tarot" ? <QuickTarot /> : null}
          {feature.kind === "palm" ? <UploadDemo title="Palm scan preview" /> : null}
          {feature.kind === "horoscope" ? <QuickHoroscope /> : null}
          {feature.kind === "match" ? <QuickMatch /> : null}
          {feature.kind === "dream" ? <QuickDream /> : null}
          {feature.kind === "numerology" ? <QuickNumerology /> : null}
          {feature.kind === "face" ? <UploadDemo title="Face reading preview" face /> : null}
          {feature.kind === "bazi" ? <QuickBazi /> : null}
          {feature.kind === "almanac" ? <QuickAlmanac /> : null}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
          <button
            type="button"
            className="button-primary disabled:cursor-not-allowed disabled:opacity-60"
            disabled={credits <= 0}
            onClick={() => {
              const spent = onSpendCredit();
              setStatus(
                spent
                  ? "Demo credit used. In production, this is where entitlement logic would run."
                  : "No demo credits left."
              );
            }}
          >
            <Coins className="h-4 w-4" aria-hidden="true" />
            {credits > 0 ? "Use Demo Credit" : "No Credits Left"}
          </button>
          {credits <= 0 ? (
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                onAddCredits();
                setStatus("Three local demo credits were added in this browser.");
              }}
            >
              <Gift className="h-4 w-4" aria-hidden="true" />
              Reset Demo Credits
            </button>
          ) : null}
          <button type="button" className="button-secondary" onClick={handleShare}>
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share Preview
          </button>
          <button type="button" className="button-secondary" onClick={handleCopy}>
            <Copy className="h-4 w-4" aria-hidden="true" />
            Copy Link
          </button>
        </div>
        {status ? (
          <p className="mt-4 rounded-md border border-white/10 bg-black/20 p-3 text-sm leading-6 text-stone-200">
            {status}
          </p>
        ) : null}
      </section>
    </div>
  );
}

function QuickTarot() {
  const [cards, setCards] = useState<DrawnTarotCard[]>(() => drawStudioCards());
  const [flipped, setFlipped] = useState<number[]>([]);

  return (
    <div>
      <p className="text-sm text-stone-300">Click each card to reveal a quick reflection.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {cards.map((card, index) => (
          <button
            key={`${card.id}-${index}`}
            type="button"
            aria-label={`Reveal ${card.position} tarot card`}
            className="group h-full min-h-64 rounded-lg text-left"
            onClick={() => setFlipped((value) => Array.from(new Set([...value, index])))}
          >
            <div
              className={cn(
                "relative h-full min-h-64 transition duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(10deg)_scale(1.01)]",
                flipped.includes(index) && "[transform:rotateY(180deg)] group-hover:[transform:rotateY(180deg)_scale(1.01)]"
              )}
            >
              <div className="panel absolute inset-0 grid place-items-center rounded-lg p-4 [backface-visibility:hidden]">
                <div className="text-center">
                  <p className="text-sm font-semibold text-brass">{card.position}</p>
                  <div className="mx-auto mt-5 grid h-20 w-20 place-items-center rounded-md border border-brass/30 bg-brass/10">
                    <Sparkles className="h-8 w-8 text-brass" aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-xs text-stone-400">Tap to reveal</p>
                </div>
              </div>
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <TarotCard card={card} compact />
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-white/10 bg-black/15 p-4 text-sm leading-6 text-stone-300">
        Your spread suggests looking at the past pattern, the present signal, and
        the most practical next step with curiosity rather than certainty.
      </div>
      <button
        type="button"
        className="button-secondary mt-4"
        onClick={() => {
          setCards(drawStudioCards());
          setFlipped([]);
        }}
      >
        <RefreshCcw className="h-4 w-4" aria-hidden="true" />
        New Reading
      </button>
    </div>
  );
}

function QuickHoroscope() {
  const [sign, setSign] = useState("Aries");

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {zodiacSigns.map((zodiacSign) => (
          <button
            key={zodiacSign}
            type="button"
            className={cn(
              "focus-ring rounded-md border px-3 py-3 text-sm transition",
              sign === zodiacSign
                ? "border-brass bg-brass text-night"
                : "border-white/10 bg-black/20 text-stone-200 hover:border-brass/50"
            )}
            onClick={() => setSign(zodiacSign)}
          >
            {zodiacSign}
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-white/10 bg-black/15 p-4 text-sm leading-6 text-stone-300">
        {sign} energy favors a clear priority, gentle communication, and one
        grounded choice before the day gets noisy.
      </div>
    </div>
  );
}

function QuickMatch() {
  const [first, setFirst] = useState("Aries");
  const [second, setSecond] = useState("Libra");
  const score = useMemo(() => 64 + ((first.length * 7 + second.length * 5) % 31), [first, second]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SelectSign label="First sign" value={first} onChange={setFirst} />
      <SelectSign label="Second sign" value={second} onChange={setSecond} />
      <div className="sm:col-span-2 rounded-lg border border-white/10 bg-black/15 p-4">
        <div className="flex items-center justify-between text-sm text-stone-200">
          <span>Compatibility score</span>
          <span className="font-semibold text-brass">{score}/100</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-md bg-white/10">
          <div className="h-full rounded-md bg-gradient-to-r from-tide via-brass to-ember" style={{ width: `${score}%` }} />
        </div>
        <p className="mt-4 text-sm leading-6 text-stone-300">
          This pairing reads as complementary when both people keep expectations explicit.
        </p>
      </div>
    </div>
  );
}

function SelectSign({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-stone-200">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring w-full rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white"
      >
        {zodiacSigns.map((zodiacSign) => (
          <option key={zodiacSign}>{zodiacSign}</option>
        ))}
      </select>
    </label>
  );
}

function QuickDream() {
  const [dream, setDream] = useState("");

  return (
    <div>
      <textarea
        value={dream}
        onChange={(event) => setDream(event.target.value)}
        className="focus-ring min-h-32 w-full resize-y rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white placeholder:text-stone-500"
        placeholder="Describe a symbol, place, or feeling from the dream"
      />
      <div className="mt-4 rounded-lg border border-white/10 bg-black/15 p-4 text-sm leading-6 text-stone-300">
        {dream.trim()
          ? "The strongest symbol may be less about prediction and more about a feeling asking for attention."
          : "Add a few details to turn this into a symbolic reflection preview."}
      </div>
    </div>
  );
}

function QuickNumerology() {
  const [name, setName] = useState("Mystic Studio");
  const number = nameNumber(name);

  return (
    <div>
      <label>
        <span className="mb-2 block text-sm font-medium text-stone-200">Name</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="focus-ring w-full rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white"
        />
      </label>
      <div className="mt-4 rounded-lg border border-white/10 bg-black/15 p-4 text-sm leading-6 text-stone-300">
        <p className="text-3xl font-semibold text-brass">{number}</p>
        <p className="mt-2">
          This number suggests a theme of focus, rhythm, and naming what matters.
        </p>
      </div>
    </div>
  );
}

function QuickBazi() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label>
        <span className="mb-2 block text-sm font-medium text-stone-200">Birth date</span>
        <input type="date" className="focus-ring w-full rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white" />
      </label>
      <label>
        <span className="mb-2 block text-sm font-medium text-stone-200">Birth time</span>
        <input type="time" className="focus-ring w-full rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white" />
      </label>
      <p className="sm:col-span-2 rounded-lg border border-white/10 bg-black/15 p-4 text-sm leading-6 text-stone-300">
        This premium-style intake is ready to connect to a deeper BaZi prompt or
        rules engine later.
      </p>
    </div>
  );
}

function QuickAlmanac() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        ["Favorable", "Planning, writing, quiet outreach"],
        ["Pause On", "Rushed promises and reactive spending"],
        ["Peak Window", "10:00-12:00 for focused work"]
      ].map(([label, value]) => (
        <div key={label} className="rounded-lg border border-white/10 bg-black/15 p-4">
          <p className="text-sm font-semibold text-brass">{label}</p>
          <p className="mt-2 text-sm leading-6 text-stone-300">{value}</p>
        </div>
      ))}
    </div>
  );
}

function UploadDemo({ title, face = false }: { title: string; face?: boolean }) {
  return (
    <div className="rounded-lg border border-dashed border-brass/35 bg-black/15 p-7 text-center">
      <div className="relative mx-auto grid h-28 w-28 place-items-center rounded-full border border-brass/30 bg-brass/10">
        <span className="absolute inset-2 animate-scan-pulse rounded-full border border-brass/40" />
        {face ? (
          <ScanLine className="h-10 w-10 text-brass" aria-hidden="true" />
        ) : (
          <Upload className="h-10 w-10 text-brass" aria-hidden="true" />
        )}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-300">
        Upload handling is intentionally a placeholder in this open template.
        Connect storage and privacy consent before accepting real images.
      </p>
    </div>
  );
}
