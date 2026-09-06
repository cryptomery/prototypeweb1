'use client';

import React from 'react';
import { Team } from '@/data/leagueData';
import { MatchWithExtras, useLeagueData } from '@/lib/leagueStore';

function BracketMatchCard({
  match,
  getTeamById,
}: {
  key?: React.Key;
  match: MatchWithExtras;
  getTeamById: (id: string) => Team | undefined;
}) {
  const home = getTeamById(match.homeTeamId);
  const away = getTeamById(match.awayTeamId);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden w-full">
      <div className="px-3 py-1.5 bg-primary/50 border-b border-border/50">
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
          {match.date.split('-').reverse().join('/')} · {match.time}
        </span>
      </div>
      <div className="px-3 py-2 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-bold text-foreground truncate flex-1">{home?.shortName}</span>
          <span className={`text-[13px] font-black flex-shrink-0 w-5 text-right ${match.homeScore !== null && match.awayScore !== null && match.homeScore > match.awayScore ? 'text-accent' : 'text-foreground'}`}>
            {match.homeScore ?? '-'}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-bold text-foreground truncate flex-1">{away?.shortName}</span>
          <span className={`text-[13px] font-black flex-shrink-0 w-5 text-right ${match.homeScore !== null && match.awayScore !== null && match.awayScore > match.homeScore ? 'text-accent' : 'text-foreground'}`}>
            {match.awayScore ?? '-'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function BracketDraw() {
  const { matches, getTeamById } = useLeagueData();
  const r16Matches = matches.filter((m) => m.stage === 'r16');

  if (r16Matches.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-[12px] font-black uppercase tracking-widest text-foreground">Bagan Fase Knock Out</h3>
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <p className="text-sm font-bold text-muted-foreground">Bagan belum tersedia.</p>
          <p className="mt-2 text-xs text-muted-foreground/70">Admin akan menambahkan jadwal fase knock out.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-[12px] font-black uppercase tracking-widest text-foreground">Bagan Fase Knock Out</h3>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-3">Knock Out</p>
          <div className="space-y-3">
            {r16Matches.map((match) => (
              <BracketMatchCard key={match.id} match={match} getTeamById={getTeamById} />
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-3">Perempat Final</p>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted/30 border border-border/40 rounded-xl px-4 py-3 flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Menunggu</p>
              <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/20">QF {i}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-accent/5 border border-accent/20 rounded-xl p-4 text-center space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-accent/50">Final</p>
          <p className="text-[22px] font-black text-foreground/10">🏆</p>
        </div>
      </div>
    </div>
  );
}
