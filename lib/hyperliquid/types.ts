export type NumericString = string;

export type UniverseAsset = {
  name: string;
  szDecimals: number;
  maxLeverage: number;
  marginTableId?: number;
  onlyIsolated?: boolean;
  isDelisted?: boolean;
};

export type HyperliquidMeta = {
  universe: UniverseAsset[];
};

export type AllMids = Record<string, NumericString>;

export type UserPosition = {
  type: "oneWay";
  position: {
    coin: string;
    szi: NumericString;
    entryPx?: NumericString;
    positionValue?: NumericString;
    unrealizedPnl?: NumericString;
    returnOnEquity?: NumericString;
    liquidationPx?: NumericString;
    marginUsed?: NumericString;
    maxLeverage?: number;
  };
};

export type UserState = {
  assetPositions: UserPosition[];
  crossMarginSummary: {
    accountValue: NumericString;
    totalMarginUsed: NumericString;
    totalNtlPos: NumericString;
    totalRawUsd: NumericString;
  };
  withdrawable: NumericString;
  marginSummary?: UserState["crossMarginSummary"];
};

export type ClearinghouseState = UserState;

export type OpenOrder = {
  coin: string;
  limitPx: NumericString;
  oid: number;
  side: "A" | "B";
  sz: NumericString;
  timestamp: number;
  reduceOnly?: boolean;
};

export type Fill = {
  coin: string;
  px: NumericString;
  sz: NumericString;
  side: "A" | "B";
  time: number;
  startPosition: NumericString;
  dir: string;
  closedPnl: NumericString;
  hash: string;
  oid: number;
};

export type L2BookLevel = {
  px: NumericString;
  sz: NumericString;
  n: number;
};

export type L2Book = {
  coin: string;
  time: number;
  levels: [L2BookLevel[], L2BookLevel[]];
};

export type FundingHistoryItem = {
  coin: string;
  fundingRate: NumericString;
  premium: NumericString;
  time: number;
};

export type Candle = {
  T: number;
  c: NumericString;
  h: NumericString;
  i: string;
  l: NumericString;
  n: number;
  o: NumericString;
  s: string;
  t: number;
  v: NumericString;
};

export type OrderRequest = {
  asset: number;
  isBuy: boolean;
  sz: string;
  limitPx: string;
  orderType: { limit: { tif: "Alo" | "Ioc" | "Gtc" } };
  reduceOnly: boolean;
  cloid?: string;
};

export type CancelRequest = {
  asset: number;
  oid: number;
};

export type ExchangeResponse = {
  status: "ok" | "err";
  response?: unknown;
  error?: string;
};

export type SignedExchangePayload = {
  action: unknown;
  nonce: number;
  signature: {
    r: string;
    s: string;
    v: number;
  };
  vaultAddress?: string | null;
  expiresAfter?: number;
};
