export const CONCENTRATIONS = [10, 15, 20, 35, 45] as const;
export type Concentration = (typeof CONCENTRATIONS)[number];

export type Plan = 2 | 4 | 8;

export const PLANS: Record<Plan, { amount: number; packs: number; label: string }> = {
  2: { amount: 3980, packs: 1, label: "2本セット" },
  4: { amount: 6980, packs: 2, label: "4本セット" },
  8: { amount: 13480, packs: 4, label: "8本セット" },
};

export function isValidPlan(value: unknown): value is Plan {
  return value === 2 || value === 4 || value === 8;
}

export function isValidConcentration(value: unknown): value is Concentration {
  return CONCENTRATIONS.includes(value as Concentration);
}

export type ConcentrationMixItem = { pct: Concentration; qty: number };

/**
 * パック単位（1パック=2本、同一濃度）の配列から、
 * ordersテーブルに保存するconcentration_mix（濃度ごとの本数）を作る。
 */
export function buildConcentrationMix(
  packConcentrations: Concentration[]
): ConcentrationMixItem[] {
  const counts = new Map<Concentration, number>();
  for (const pct of packConcentrations) {
    counts.set(pct, (counts.get(pct) ?? 0) + 2);
  }
  return Array.from(counts.entries())
    .map(([pct, qty]) => ({ pct, qty }))
    .sort((a, b) => a.pct - b.pct);
}

export function formatConcentrationMix(mix: ConcentrationMixItem[]): string {
  return mix.map((m) => `${m.pct}%×${m.qty}本`).join(" + ");
}
