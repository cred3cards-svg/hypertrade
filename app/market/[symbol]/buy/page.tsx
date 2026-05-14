import { notFound } from "next/navigation";
import { RiskDisclosureModal } from "@/components/risk-disclosure";
import { MarketOrderFlow } from "@/components/simple/MarketOrderFlow";
import { getMarketBySlug, getMarketSlug, marketStats } from "@/lib/mockData";

export function generateStaticParams() {
  return marketStats.map((market) => ({ symbol: getMarketSlug(market.symbol) }));
}

export default function BuyPage({ params }: { params: { symbol: string } }) {
  const market = getMarketBySlug(params.symbol);
  if (!market) notFound();
  return (
    <>
      <RiskDisclosureModal />
      <MarketOrderFlow market={market} action="buy" />
    </>
  );
}
