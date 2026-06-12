export const zodiacSigns = [
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
] as const;

export type ZodiacSign = (typeof zodiacSigns)[number];

export function normalizeZodiacSign(value: string): ZodiacSign | null {
  const normalized = value.trim().toLowerCase();
  return (
    zodiacSigns.find((zodiacSign) => zodiacSign.toLowerCase() === normalized) ?? null
  );
}
