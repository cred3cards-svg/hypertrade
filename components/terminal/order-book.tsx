import { orderBookRows } from "@/lib/mockData";
import { formatNumber } from "@/lib/utils";

export function OrderBook() {
  const spread = orderBookRows[0].ask - orderBookRows[0].bid;
  return (
    <div className="terminal-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 p-3">
        <h2 className="text-sm font-medium">Order Book</h2>
        <span className="text-xs text-muted-foreground">Spread {formatNumber(spread, 2)}</span>
      </div>
      <table className="terminal-table w-full">
        <thead>
          <tr>
            <th>Ask</th>
            <th>Size</th>
            <th>Bid</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {orderBookRows.map((row, i) => (
            <tr key={i} className="border-t border-white/5 hover:bg-white/5">
              <td className="text-terminal-red">{formatNumber(row.ask, 2)}</td>
              <td>{formatNumber(row.askSize, 2)}</td>
              <td className="text-terminal-green">{formatNumber(row.bid, 2)}</td>
              <td>{formatNumber(row.bidSize, 2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
