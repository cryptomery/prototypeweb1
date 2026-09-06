'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLeagueData } from '@/lib/leagueStore';

export default function TeamsPage() {
  const { teams, standings, config } = useLeagueData();
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');

  const groups = ['ALL', ...config.groupNames];
  const filteredTeams = selectedGroup === 'ALL'
    ? teams
    : teams.filter((t) => t.group === selectedGroup);

  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-primary border border-border p-10 md:p-16">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <span className="text-[11px] font-black uppercase tracking-widest text-accent mb-3 block">
                Musim 2026 — {teams.length} Tim Berpartisipasi
              </span>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-foreground leading-none">
                Profil<br />
                <span className="text-gradient-gold">Tim Peserta</span>
              </h1>
              <p className="text-muted-foreground text-base mt-4 max-w-md leading-relaxed">
                Daftar lengkap tim dan kontestan yang berlaga di Kanzler eFootball League. Dikelola langsung melalui panel admin.
              </p>
            </div>
          </div>
        </div>

        {/* Group Filter Tabs */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {groups.map((grp) => (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                  selectedGroup === grp
                    ? 'bg-accent text-accent-foreground shadow-md'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent/40'
                }`}
              >
                {grp === 'ALL' ? 'Semua Grup' : `Grup ${grp}`}
              </button>
            ))}
          </div>
        </div>

        {/* Teams Grid */}
        <div className="max-w-7xl mx-auto px-6">
          {filteredTeams.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <p className="text-muted-foreground text-sm font-medium mb-4">
                Belum ada tim yang terdaftar di grup ini.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-xs font-black uppercase tracking-widest hover:bg-accent/90 transition-all"
              >
                Tambah Tim di Panel Admin →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTeams.map((team) => {
                const groupStandings = standings?.[team.group];
                const teamStat = groupStandings?.find((s) => s?.teamId === team.id);
                const rank = groupStandings ? groupStandings.findIndex((s) => s?.teamId === team.id) + 1 : 0;
                const qualified = rank > 0 && rank <= 2;

                return (
                  <Link
                    key={team.id}
                    href={`/team/${team.id}`}
                    className="bg-card border border-border rounded-xl p-5 hover:border-accent/40 hover:bg-card/80 transition-all block group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-[12px] font-black shadow-lg overflow-hidden"
                        style={{ backgroundColor: team?.colors?.primary || '#003366' }}
                      >
                        {team?.logo && team.logo.startsWith('http') ? (
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          team?.shortName?.[0] || 'T'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold text-foreground truncate group-hover:text-accent transition-colors">{team?.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{team?.city || '-'} · Grup {team?.group || 'A'}</p>
                      </div>
                      {qualified && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-accent bg-accent/10 px-2 py-1 rounded-full border border-accent/20 flex-shrink-0">
                          Lolos
                        </span>
                      )}
                    </div>
                    {teamStat && (
                      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border">
                        <div className="text-center">
                          <p className="text-[15px] font-black text-foreground">{teamStat?.points}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Pts</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[15px] font-black text-foreground">{teamStat?.won}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Menang</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[15px] font-black text-foreground">{teamStat?.gf}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Gol</p>
                        </div>
                        <div className="text-center">
                          <p className={`text-[15px] font-black ${(teamStat?.gd ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {(teamStat?.gd ?? 0) > 0 ? `+${teamStat?.gd}` : teamStat?.gd}
                          </p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">GD</p>
                        </div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
