'use client';
import React from 'react';
import { useLeagueData } from '@/lib/leagueStore';

export default function TopScorersWidget() {
  const { topScorers } = useLeagueData();
  const maxGoals = topScorers?.[0]?.goals ?? 1;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden card-glow">
      <div className="px-6 py-4 border-b border-border bg-primary/40">
        <h3 className="text-[12px] font-black uppercase tracking-widest text-foreground">Top Pencetak Gol</h3>
      </div>
      <div className="divide-y divide-border/50">
        {topScorers && topScorers.length > 0 ? (
          topScorers.map((scorer, index) => (
            <div key={scorer?.playerId || index} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/20 transition-colors">
              <span className={`text-[12px] font-black w-5 flex-shrink-0 ${index === 0 ? 'text-accent' : 'text-muted-foreground'}`}>
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-foreground truncate">{scorer?.playerName}</p>
                <p className="text-[11px] font-bold text-muted-foreground truncate">{scorer?.teamName}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="stat-bar-fill"
                    style={{ width: `${Math.min(100, (scorer?.goals / maxGoals) * 100)}%` }}
                  ></div>
                </div>
                <span className={`text-[14px] font-black w-6 text-right ${index === 0 ? 'text-accent' : 'text-foreground'}`}>
                  {scorer?.goals}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-xs text-muted-foreground text-center">Belum ada pencetak gol.</div>
        )}
      </div>
    </div>
  );
}