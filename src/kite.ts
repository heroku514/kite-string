export type KiteState = {
  out: number;
};

export const EMPTY_KITE: KiteState = { out: 0 };

const LINES = [
  "The kite is in hand.",
  "One length out.",
  "Two lengths out.",
  "Three lengths out.",
  "Four lengths out.",
  "Five lengths out.",
  "The kite is high.",
] as const;

export function kiteLine(state: KiteState): string {
  return LINES[state.out] ?? LINES[0];
}

export function heightLine(state: KiteState): string {
  if (state.out <= 0) return "Holding.";
  if (state.out >= 6) return "High up.";
  return "Flying.";
}

export function hasProgress(state: KiteState): boolean {
  return state.out > 0;
}

export function parseKite(raw: string | null): KiteState {
  if (!raw) return EMPTY_KITE;
  try {
    const value = JSON.parse(raw) as { out?: unknown };
    if (typeof value.out !== "number" || !Number.isInteger(value.out) || value.out < 0 || value.out > 6) {
      return EMPTY_KITE;
    }
    return { out: value.out };
  } catch {
    return EMPTY_KITE;
  }
}

export function letOut(state: KiteState): { state: KiteState; note: string } {
  if (state.out >= 6) return { state, note: "Already out." };
  return { state: { out: state.out + 1 }, note: "Let out." };
}

export function reelIn(state: KiteState): { state: KiteState; note: string } {
  if (state.out <= 0) return { state, note: "Already in." };
  return { state: { out: state.out - 1 }, note: "Reeled in." };
}

export function resetKite(): { state: KiteState; note: string } {
  return { state: EMPTY_KITE, note: "Look at the kite." };
}
