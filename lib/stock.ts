export type StockState = "in_stock" | "low_stock" | "out_of_stock";

export type StockStatus = {
  concentration: number;
  status: StockState;
  low_stock_count: number | null;
};

export const STOCK_LABEL: Record<StockState, string> = {
  in_stock: "在庫あり",
  low_stock: "在庫僅か",
  out_of_stock: "品切れ中",
};

export function formatStockLabel(stock: StockStatus | undefined): string {
  if (!stock) return STOCK_LABEL.in_stock;
  if (stock.status === "low_stock" && stock.low_stock_count != null) {
    return `在庫僅か（残り${stock.low_stock_count}本）`;
  }
  return STOCK_LABEL[stock.status];
}
