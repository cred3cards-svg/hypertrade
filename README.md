# Derived Perps

Production-quality MVP for trading configurable USDC-margined derived perpetual markets through Hyperliquid. The app is designed for markets such as `AAPL-PERP`, `TSLA-PERP`, `NVDA-PERP`, `META-PERP`, `AMZN-PERP`, `MSFT-PERP`, `GOOGL-PERP`, and `SPY-PERP`, but the UI routes orders by configured Hyperliquid asset ID so it can support any verified perp or HIP-3 market.

This app is for derived perpetual futures only. It does not provide U.S. stock exposure, spot securities, tokenized securities, custody, investment advice, or a promise of profit.

## UX Philosophy

The default experience is intentionally simple and consumer-friendly:

1. Search for a familiar market such as Apple.
2. Open the market page.
3. Tap Buy.
4. Enter a dollar amount.
5. Confirm.
6. See success.

The UI uses friendly names like Apple and Tesla, labels collateral as buying power, and calls positions “Your position.” Perpetual-specific information such as funding, open interest, leverage, order book, reduce-only, margin, and liquidation risk is still available, but it is hidden behind Details or Advanced sections so beginners are not dropped into a professional derivatives terminal by default.

## Architecture

- Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn-style primitives, lucide-react
- wagmi + viem for wallet connection
- Zustand for local ticket state
- TanStack Query-ready provider for API state
- Prisma + PostgreSQL for persistence
- Zod validation for market and order safety gates
- Recharts chart adapter with a clean path to TradingView Lightweight Charts
- Hyperliquid clients under `lib/hyperliquid`
- WebSocket abstraction plus polling-compatible Info API functions
- Simple mobile-first market, buy, sell, and portfolio screens under `components/simple`

## Setup

```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Environment Variables

```bash
DATABASE_URL=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_HYPERLIQUID_ENV=testnet
NEXT_PUBLIC_ENABLE_MAINNET_TRADING=false
HYPERLIQUID_MAINNET_API_URL=https://api.hyperliquid.xyz
HYPERLIQUID_TESTNET_API_URL=https://api.hyperliquid-testnet.xyz
NEXT_PUBLIC_APP_NAME=Derived Perps
NEXT_PUBLIC_DEFAULT_COLLATERAL=USDC
```

Testnet is the default. Mainnet calls throw unless `NEXT_PUBLIC_ENABLE_MAINNET_TRADING=true`.

## WalletConnect

WalletConnect is used only for wallet connection and signing. The app does not embed WalletConnect/Reown market, swap, on-ramp, or portfolio surfaces.

1. Create a WalletConnect/Reown project ID.
2. Set:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

3. Restart the dev server.

The Connect button opens this app's own minimal wallet sheet with two choices:

- WalletConnect: QR/mobile wallet connection.
- Browser wallet: injected wallets such as MetaMask, Rabby, or Coinbase Wallet.

The user's wallet address is then used by the Hyperliquid account and order flow. Private keys are never stored or sent to the server.

## Database Migration

The Prisma schema includes:

- `User`
- `Wallet`
- `TradingAccount`
- `Market`
- `OrderIntent`
- `TradeLog`
- `PositionSnapshot`
- `RiskAcknowledgement`
- `AppSetting`
- `AuditLog`

Run:

```bash
pnpm db:migrate
```

## Seeding Markets

Run:

```bash
pnpm db:seed
```

Seeded derived markets are disabled by default and have `hyperliquidAssetId: null`. Do not enable a market until the correct asset ID is verified from Hyperliquid meta for the selected environment.

## Running Testnet

Set:

```bash
NEXT_PUBLIC_HYPERLIQUID_ENV=testnet
NEXT_PUBLIC_ENABLE_MAINNET_TRADING=false
```

The UI can connect a wallet, display configured derived markets, validate simple market buy/sell flows, create local order intents, and use Hyperliquid Info API clients. Exchange submission is structured around signed payloads so private keys never touch the server.

## Switching To Mainnet

Set:

```bash
NEXT_PUBLIC_HYPERLIQUID_ENV=mainnet
NEXT_PUBLIC_ENABLE_MAINNET_TRADING=true
```

Only do this after production controls are complete. The app displays explicit mainnet warnings and requires final confirmation for mainnet order submissions.

## Hyperliquid Integration Notes

`lib/hyperliquid/infoClient.ts` implements:

- `getMeta()`
- `getAllMids()`
- `getUserState(address)`
- `getOpenOrders(address)`
- `getUserFills(address)`
- `getClearinghouseState(address)`
- `getOrderBook(asset)`
- `getFundingHistory(asset)`
- `getCandles(symbol, interval)`

`lib/hyperliquid/exchangeClient.ts` provides action builders and exchange submission helpers for:

- Limit orders
- Market orders using IOC semantics
- Cancels
- Cancel all payload submission
- Leverage updates
- Agent wallet approval payloads

Signing must happen client-side or through an approved agent/API wallet flow. Do not send private keys to any server route.

## HIP-3 Notes

HIP-3 markets use Hyperliquid's unified HyperCore trading API once deployed and configured. This repository does not deploy HIP-3 markets. Deployment and operation require market definition, oracle design, leverage configuration, liquidity planning, ongoing monitoring, and incident response.

## Configuring Real Market Asset IDs

1. Query `getMeta()` for the target environment.
2. Locate the exact universe entry for the perp or HIP-3 market.
3. Confirm symbol, decimals, leverage, and market status.
4. Set `Market.hyperliquidAssetId` to the verified universe index.
5. Enable the market only after test orders and risk checks are complete.

Correct asset ID selection is critical. Never hardcode blindly from another environment.

For Hyperliquid's documented HIP-3 testnet example:

```ts
const meta = await getMeta("testnet", "test");
const index = meta.universe.findIndex((asset) => asset.name === "test:ABC");
const assetId = 100000 + 1 * 10000 + index; // 110000 when index is 0
```

The app includes `test:ABC` on testnet as an enabled example market with `hyperliquidAssetId = 110000`. In admin copy this is shown as the verified asset ID.

The stock-style testnet examples currently wired in this MVP use the verified `xyz` HIP-3 testnet dex:

| Friendly market | Hyperliquid coin | Asset ID |
| --- | --- | --- |
| Apple | `xyz:AAPL` | `750009` |
| Tesla | `xyz:TSLA` | `750001` |
| Nvidia | `xyz:NVDA` | `750002` |
| Microsoft | `xyz:MSFT` | `750010` |
| Amazon | `xyz:AMZN` | `750013` |
| Meta | `xyz:META` | `750008` |
| Google | `xyz:GOOGL` | `750012` |

These are testnet HIP-3 markets and should be treated as development configuration, not production listings.

## Risk And Compliance Checklist

- Perpetual futures risk disclosure shown before trading
- No custody and no private key storage
- Mainnet environment gate
- Final mainnet confirmation
- Disabled markets rejected
- Missing asset IDs rejected
- Restricted jurisdiction messaging
- No investment advice language

## Known Limitations

- Admin edits are UI-only in this MVP pass unless wired to authenticated server mutations.
- The chart uses a Recharts adapter and placeholder candle data until live candles are fully connected.
- The order book component has production structure but is hidden under Advanced and uses mocked rows when live L2 data is unavailable.
- Agent wallet approval is explained and typed, but not forced for MVP.
- Geo-restriction controls are represented as product requirements and warnings, not full compliance infrastructure.

## Production Launch Checklist

- Verify Hyperliquid asset IDs from meta
- Confirm HIP-3 market deployment if using custom markets
- Oracle design and monitoring
- Market operations plan
- Market maker/liquidity plan
- Legal review
- Geo-restriction controls
- Risk disclosures
- Monitoring/alerts
- WebSocket reliability
- Error handling
- Rate limit handling
- Secure agent wallet design
- Incident response plan

## Testing

```bash
pnpm test
```

Coverage includes market validation, order validation, leverage validation, reduce-only behavior, environment gating, disabled market rejection, mainnet confirmation requirements, missing asset ID rejection, local order intent creation, and mocked Hyperliquid Info/Exchange calls.
