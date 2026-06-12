export type AiMode = "ai" | "mock";

export type SpreadType =
  | "one-card"
  | "three-card"
  | "love"
  | "career"
  | "yes-no";

export type TarotCardData = {
  id: string;
  name: string;
  keywords: string[];
  uprightMeaning: string;
  symbol: string;
  gradientClass: string;
};

export type DrawnTarotCard = TarotCardData & {
  position: string;
};

export type TarotReadingInput = {
  question: string;
  spreadType: SpreadType;
  cards: DrawnTarotCard[];
};

export type TarotReadingResult = {
  title: string;
  summary: string;
  cards: {
    cardName: string;
    position: string;
    interpretation: string;
  }[];
  practicalReflection: string;
  gentleAdvice: string;
};

export type HoroscopeInput = {
  sign: string;
};

export type HoroscopeResult = {
  title: string;
  overallEnergy: string;
  love: string;
  career: string;
  money: string;
  luckyColor: string;
  luckyNumber: number;
};

export type DreamReadingInput = {
  dream: string;
};

export type DreamReadingResult = {
  title: string;
  keySymbols: string[];
  emotionalTheme: string;
  possibleMeaning: string;
  reflectionQuestion: string;
};

export type CompatibilityInput = {
  nameA: string;
  nameB: string;
  signA?: string;
  signB?: string;
  birthDateA?: string;
  birthDateB?: string;
};

export type CompatibilityResult = {
  title: string;
  score: number;
  emotionalDynamic: string;
  strengths: string[];
  challenges: string[];
  advice: string;
};

export type AiResult<T> = {
  mode: AiMode;
  data: T;
  warning?: string;
};
