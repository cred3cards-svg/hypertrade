import { recentTrades } from "@/lib/mockData";
import { cn, formatNumber } from "@/lib/utils";

export function RecentTrades() {
  return (
    <div className="terminal-panel overflow-hidden">
      <div className="border-b border-white/10 p-3">
        <h2 className="text-sm font-medium">Recent Trades</h2>
      </div>
      <table className="terminal-table w-full">
        <thead>
          <tr>
            <th>Price</th>
            <th>Size</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {recentTrades.map((trade, i) => (
            <tr key={i} className="border-t border-white/5 hover:bg-white/5">
              <td className={cn(trade.side === "BUY" ? "text-terminal-green" : "text-terminal-red")}>{formatNumber(trade.price, 2)}</td>
              <td>{formatNumber(trade.size, 2)}</td>
              <td className="text-muted-foreground">{trade.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
