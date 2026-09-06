'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  teams as defaultTeams,
  Team,
  Player,
  Standing,
  Match,
  getTeamById as fallbackGetTeamById,
} from '@/data/leagueData';
import { getLeagueGroupConfig, LeagueGroupConfig, LEAGUE_CONFIG_EVENT } from '@/lib/leagueConfig';

export interface Fixture {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  time: string;
  venue: string;
  group: string;
  matchDay: number;
  stage: string;
}

export type MatchWithExtras = Match & {
  homeGoalScorers?: string;
  awayGoalScorers?: string;
};

export const LEAGUE_DATA_EVENT = 'kanzler_league_data_updated';

export const defaultMatches: MatchWithExtras[] = [
  // Group A
  {
    id: 'm-a1',
    homeTeamId: 'persija',
    awayTeamId: 'persib',
    homeScore: 2,
    awayScore: 1,
    date: '2026-04-01',
    time: '19:00',
    venue: 'Stadion Utama GBK',
    matchDay: 1,
    stage: 'group',
    group: 'A',
    status: 'completed',
    homeGoalScorers: "Wahyu 23', Bima 67'",
    awayGoalScorers: "Fajri 45'",
  },
  {
    id: 'm-a2',
    homeTeamId: 'persis',
    awayTeamId: 'psis',
    homeScore: 1,
    awayScore: 1,
    date: '2026-04-01',
    time: '20:45',
    venue: 'Stadion Manahan Solo',
    matchDay: 1,
    stage: 'group',
    group: 'A',
    status: 'completed',
    homeGoalScorers: "Galih 54'",
    awayGoalScorers: "Taufik 80'",
  },
  {
    id: 'm-a3',
    homeTeamId: 'persija',
    awayTeamId: 'psis',
    homeScore: null,
    awayScore: null,
    date: '2026-04-05',
    time: '19:00',
    venue: 'Stadion Utama GBK',
    matchDay: 2,
    stage: 'group',
    group: 'A',
    status: 'upcoming',
  },
  {
    id: 'm-a4',
    homeTeamId: 'persib',
    awayTeamId: 'persis',
    homeScore: null,
    awayScore: null,
    date: '2026-04-05',
    time: '20:45',
    venue: 'Stadion Gelora Bandung Lautan Api',
    matchDay: 2,
    stage: 'group',
    group: 'A',
    status: 'upcoming',
  },
  {
    id: 'm-a5',
    homeTeamId: 'persis',
    awayTeamId: 'persija',
    homeScore: null,
    awayScore: null,
    date: '2026-04-09',
    time: '19:00',
    venue: 'Stadion Manahan Solo',
    matchDay: 3,
    stage: 'group',
    group: 'A',
    status: 'upcoming',
  },
  {
    id: 'm-a6',
    homeTeamId: 'psis',
    awayTeamId: 'persib',
    homeScore: null,
    awayScore: null,
    date: '2026-04-09',
    time: '20:45',
    venue: 'Stadion Jatidiri Semarang',
    matchDay: 3,
    stage: 'group',
    group: 'A',
    status: 'upcoming',
  },

  // Group B
  {
    id: 'm-b1',
    homeTeamId: 'arema',
    awayTeamId: 'persebaya',
    homeScore: 3,
    awayScore: 2,
    date: '2026-04-02',
    time: '19:00',
    venue: 'Stadion Kanjuruhan',
    matchDay: 1,
    stage: 'group',
    group: 'B',
    status: 'completed',
    homeGoalScorers: "Rizky 12', 45', 78'",
    awayGoalScorers: "Irfan 34', 60'",
  },
  {
    id: 'm-b2',
    homeTeamId: 'psbk',
    awayTeamId: 'psim',
    homeScore: 0,
    awayScore: 0,
    date: '2026-04-02',
    time: '20:45',
    venue: 'Stadion Gelora Supriyadi',
    matchDay: 1,
    stage: 'group',
    group: 'B',
    status: 'completed',
  },
  {
    id: 'm-b3',
    homeTeamId: 'arema',
    awayTeamId: 'psbk',
    homeScore: null,
    awayScore: null,
    date: '2026-04-06',
    time: '19:00',
    venue: 'Stadion Kanjuruhan',
    matchDay: 2,
    stage: 'group',
    group: 'B',
    status: 'upcoming',
  },
  {
    id: 'm-b4',
    homeTeamId: 'persebaya',
    awayTeamId: 'psim',
    homeScore: null,
    awayScore: null,
    date: '2026-04-06',
    time: '20:45',
    venue: 'Stadion Gelora Bung Tomo',
    matchDay: 2,
    stage: 'group',
    group: 'B',
    status: 'upcoming',
  },
  {
    id: 'm-b5',
    homeTeamId: 'psim',
    awayTeamId: 'arema',
    homeScore: null,
    awayScore: null,
    date: '2026-04-10',
    time: '19:00',
    venue: 'Stadion Mandala Krida',
    matchDay: 3,
    stage: 'group',
    group: 'B',
    status: 'upcoming',
  },
  {
    id: 'm-b6',
    homeTeamId: 'psbk',
    awayTeamId: 'persebaya',
    homeScore: null,
    awayScore: null,
    date: '2026-04-10',
    time: '20:45',
    venue: 'Stadion Gelora Supriyadi',
    matchDay: 3,
    stage: 'group',
    group: 'B',
    status: 'upcoming',
  },

  // Group C
  {
    id: 'm-c1',
    homeTeamId: 'psm',
    awayTeamId: 'persipura',
    homeScore: 2,
    awayScore: 0,
    date: '2026-04-03',
    time: '19:00',
    venue: 'Stadion Gelora B.J. Habibie',
    matchDay: 1,
    stage: 'group',
    group: 'C',
    status: 'completed',
    homeGoalScorers: "Hendra 19', 65'",
  },
  {
    id: 'm-c2',
    homeTeamId: 'sriwijaya',
    awayTeamId: 'borneo',
    homeScore: 1,
    awayScore: 2,
    date: '2026-04-03',
    time: '20:45',
    venue: 'Stadion Gelora Sriwijaya Jakabaring',
    matchDay: 1,
    stage: 'group',
    group: 'C',
    status: 'completed',
    homeGoalScorers: "Bagus 50'",
    awayGoalScorers: "Terens 28', Matheus 83'",
  },
  {
    id: 'm-c3',
    homeTeamId: 'psm',
    awayTeamId: 'sriwijaya',
    homeScore: null,
    awayScore: null,
    date: '2026-04-07',
    time: '19:00',
    venue: 'Stadion Gelora B.J. Habibie',
    matchDay: 2,
    stage: 'group',
    group: 'C',
    status: 'upcoming',
  },
  {
    id: 'm-c4',
    homeTeamId: 'persipura',
    awayTeamId: 'borneo',
    homeScore: null,
    awayScore: null,
    date: '2026-04-07',
    time: '20:45',
    venue: 'Stadion Mandala Jayapura',
    matchDay: 2,
    stage: 'group',
    group: 'C',
    status: 'upcoming',
  },
  {
    id: 'm-c5',
    homeTeamId: 'borneo',
    awayTeamId: 'psm',
    homeScore: null,
    awayScore: null,
    date: '2026-04-11',
    time: '19:00',
    venue: 'Stadion Segiri Samarinda',
    matchDay: 3,
    stage: 'group',
    group: 'C',
    status: 'upcoming',
  },
  {
    id: 'm-c6',
    homeTeamId: 'persipura',
    awayTeamId: 'sriwijaya',
    homeScore: null,
    awayScore: null,
    date: '2026-04-11',
    time: '20:45',
    venue: 'Stadion Mandala Jayapura',
    matchDay: 3,
    stage: 'group',
    group: 'C',
    status: 'upcoming',
  },

  // Group D
  {
    id: 'm-d1',
    homeTeamId: 'bali',
    awayTeamId: 'madura',
    homeScore: 1,
    awayScore: 0,
    date: '2026-04-04',
    time: '19:00',
    venue: 'Stadion Kapten I Wayan Dipta',
    matchDay: 1,
    stage: 'group',
    group: 'D',
    status: 'completed',
    homeGoalScorers: "Made 71'",
  },
  {
    id: 'm-d2',
    homeTeamId: 'persela',
    awayTeamId: 'pss',
    homeScore: 2,
    awayScore: 2,
    date: '2026-04-04',
    time: '20:45',
    venue: 'Stadion Surajaya Lamongan',
    matchDay: 1,
    stage: 'group',
    group: 'D',
    status: 'completed',
    homeGoalScorers: "Zulham 30', Dendi 75'",
    awayGoalScorers: "Hokky 15', Jihad 88'",
  },
  {
    id: 'm-d3',
    homeTeamId: 'bali',
    awayTeamId: 'persela',
    homeScore: null,
    awayScore: null,
    date: '2026-04-08',
    time: '19:00',
    venue: 'Stadion Kapten I Wayan Dipta',
    matchDay: 2,
    stage: 'group',
    group: 'D',
    status: 'upcoming',
  },
  {
    id: 'm-d4',
    homeTeamId: 'madura',
    awayTeamId: 'pss',
    homeScore: null,
    awayScore: null,
    date: '2026-04-08',
    time: '20:45',
    venue: 'Stadion Gelora Ratu Pamelingan',
    matchDay: 2,
    stage: 'group',
    group: 'D',
    status: 'upcoming',
  },
  {
    id: 'm-d5',
    homeTeamId: 'pss',
    awayTeamId: 'bali',
    homeScore: null,
    awayScore: null,
    date: '2026-04-12',
    time: '19:00',
    venue: 'Stadion Maguwoharjo Sleman',
    matchDay: 3,
    stage: 'group',
    group: 'D',
    status: 'upcoming',
  },
  {
    id: 'm-d6',
    homeTeamId: 'madura',
    awayTeamId: 'persela',
    homeScore: null,
    awayScore: null,
    date: '2026-04-12',
    time: '20:45',
    venue: 'Stadion Gelora Ratu Pamelingan',
    matchDay: 3,
    stage: 'group',
    group: 'D',
    status: 'upcoming',
  },

  // Knock Out / R16
  {
    id: 'r16-1',
    homeTeamId: 'persija',
    awayTeamId: 'persebaya',
    homeScore: null,
    awayScore: null,
    date: '2026-04-15',
    time: '19:00',
    venue: 'Stadion Utama GBK',
    matchDay: 1,
    stage: 'r16',
    status: 'upcoming',
  },
  {
    id: 'r16-2',
    homeTeamId: 'arema',
    awayTeamId: 'persib',
    homeScore: null,
    awayScore: null,
    date: '2026-04-15',
    time: '21:00',
    venue: 'Stadion Kanjuruhan',
    matchDay: 1,
    stage: 'r16',
    status: 'upcoming',
  },
  {
    id: 'r16-3',
    homeTeamId: 'psm',
    awayTeamId: 'madura',
    homeScore: null,
    awayScore: null,
    date: '2026-04-16',
    time: '19:00',
    venue: 'Stadion Gelora B.J. Habibie',
    matchDay: 1,
    stage: 'r16',
    status: 'upcoming',
  },
  {
    id: 'r16-4',
    homeTeamId: 'bali',
    awayTeamId: 'persipura',
    homeScore: null,
    awayScore: null,
    date: '2026-04-16',
    time: '21:00',
    venue: 'Stadion Kapten I Wayan Dipta',
    matchDay: 1,
    stage: 'r16',
    status: 'upcoming',
  },
  {
    id: 'r16-5',
    homeTeamId: 'psis',
    awayTeamId: 'psim',
    homeScore: null,
    awayScore: null,
    date: '2026-04-17',
    time: '19:00',
    venue: 'Stadion Jatidiri Semarang',
    matchDay: 1,
    stage: 'r16',
    status: 'upcoming',
  },
  {
    id: 'r16-6',
    homeTeamId: 'psbk',
    awayTeamId: 'persis',
    homeScore: null,
    awayScore: null,
    date: '2026-04-17',
    time: '21:00',
    venue: 'Stadion Gelora Supriyadi',
    matchDay: 1,
    stage: 'r16',
    status: 'upcoming',
  },
  {
    id: 'r16-7',
    homeTeamId: 'borneo',
    awayTeamId: 'pss',
    homeScore: null,
    awayScore: null,
    date: '2026-04-18',
    time: '19:00',
    venue: 'Stadion Segiri Samarinda',
    matchDay: 1,
    stage: 'r16',
    status: 'upcoming',
  },
  {
    id: 'r16-8',
    homeTeamId: 'persela',
    awayTeamId: 'sriwijaya',
    homeScore: null,
    awayScore: null,
    date: '2026-04-18',
    time: '21:00',
    venue: 'Stadion Surajaya Lamongan',
    matchDay: 1,
    stage: 'r16',
    status: 'upcoming',
  },
];

/**
 * Dispatch event to sync same-tab and other components
 */
export function dispatchLeagueDataUpdate(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(LEAGUE_DATA_EVENT));
  }
}

/**
 * Get teams: checks admin_teams in localStorage first, falls back to defaultTeams
 */
export function getLeagueTeams(): Team[] {
  if (typeof window === 'undefined') return defaultTeams;
  try {
    const raw = localStorage.getItem('admin_teams');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return defaultTeams;
}

/**
 * Get matches: checks admin_matches and admin_fixtures in localStorage.
 * Seamlessly merges any fixtures created in admin_fixtures into the match list.
 */
export function getLeagueMatches(): MatchWithExtras[] {
  if (typeof window === 'undefined') return defaultMatches;
  try {
    const rawMatches = localStorage.getItem('admin_matches');
    const rawFixtures = localStorage.getItem('admin_fixtures');

    let matchesList: MatchWithExtras[] = [];
    if (rawMatches) {
      const parsed = JSON.parse(rawMatches);
      if (Array.isArray(parsed) && parsed.length > 0) {
        matchesList = parsed;
      }
    }

    if (matchesList.length === 0) {
      matchesList = [...defaultMatches];
    }

    // Merge any fixtures created via the Fixtures tab
    if (rawFixtures) {
      const fixtures: Fixture[] = JSON.parse(rawFixtures);
      if (Array.isArray(fixtures) && fixtures.length > 0) {
        const existingIds = new Set(matchesList.map(m => m.id));
        for (const f of fixtures) {
          if (!existingIds.has(f.id)) {
            matchesList.push({
              id: f.id,
              homeTeamId: f.homeTeamId,
              awayTeamId: f.awayTeamId,
              homeScore: null,
              awayScore: null,
              date: f.date,
              time: f.time,
              venue: f.venue,
              matchDay: f.matchDay,
              stage: (f.stage as any) || 'group',
              group: f.group,
              status: 'upcoming',
            });
          }
        }
      }
    }

    return matchesList;
  } catch {
    return defaultMatches;
  }
}

/**
 * Get fixtures: reads fixtures from matches
 */
export function getLeagueFixtures(): Fixture[] {
  const matches = getLeagueMatches();
  return matches.map(m => ({
    id: m.id,
    homeTeamId: m.homeTeamId,
    awayTeamId: m.awayTeamId,
    date: m.date,
    time: m.time,
    venue: m.venue,
    group: m.group || 'A',
    matchDay: m.matchDay || 1,
    stage: m.stage,
  }));
}

/**
 * Get team by ID, checking dynamic teams first, then static fallback
 */
export function getLeagueTeamById(id: string, customTeams?: Team[]): Team | undefined {
  const teamList = customTeams || getLeagueTeams();
  const found = teamList.find(t => t.id === id);
  if (found) return found;
  return fallbackGetTeamById(id);
}

/**
 * Compute standings per group dynamically from actual teams & completed matches
 */
export function computeLeagueStandings(
  teamsList: Team[],
  matchesList: MatchWithExtras[],
  config?: LeagueGroupConfig
): Record<string, Standing[]> {
  const cfg = config || getLeagueGroupConfig();
  const standingsMap: Record<string, Standing[]> = {};

  // Initialize all configured groups or groups found in teams
  const allGroups = new Set<string>();
  cfg.groupNames.forEach(g => allGroups.add(g));
  teamsList.forEach(t => {
    if (t.group) allGroups.add(t.group);
  });

  for (const group of allGroups) {
    const groupTeams = teamsList.filter(t => t.group === group);
    const table: Standing[] = groupTeams.map(team => {
      let played = 0;
      let won = 0;
      let drawn = 0;
      let lost = 0;
      let gf = 0;
      let ga = 0;

      for (const m of matchesList) {
        // Only count completed matches within the same group or stage 'group'
        if (m.status !== 'completed' || m.homeScore === null || m.awayScore === null) continue;
        if (m.group && m.group !== group) continue;

        if (m.homeTeamId === team.id) {
          played++;
          gf += m.homeScore;
          ga += m.awayScore;
          if (m.homeScore > m.awayScore) won++;
          else if (m.homeScore === m.awayScore) drawn++;
          else lost++;
        } else if (m.awayTeamId === team.id) {
          played++;
          gf += m.awayScore;
          ga += m.homeScore;
          if (m.awayScore > m.homeScore) won++;
          else if (m.awayScore === m.homeScore) drawn++;
          else lost++;
        }
      }

      const gd = gf - ga;
      const points = won * 3 + drawn * 1;

      return {
        teamId: team.id,
        played,
        won,
        drawn,
        lost,
        gf,
        ga,
        gd,
        points,
      };
    });

    // Sort table: points desc, gd desc, gf desc, team name asc
    table.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      const teamA = teamsList.find(t => t.id === a.teamId)?.name || '';
      const teamB = teamsList.find(t => t.id === b.teamId)?.name || '';
      return teamA.localeCompare(teamB);
    });

    standingsMap[group] = table;
  }

  return standingsMap;
}

/**
 * Compute top scorers dynamically from matches (goals in players + match goal scorers)
 */
export function computeLeagueTopScorers(
  matchesList: MatchWithExtras[],
  teamsList: Team[]
) {
  const scorerMap: Record<string, { playerName: string; teamId: string; teamName: string; goals: number }> = {};

  // First aggregate goals recorded on players in teams
  for (const team of teamsList) {
    for (const player of team.players || []) {
      if (player.goals > 0) {
        scorerMap[player.name] = {
          playerName: player.name,
          teamId: team.id,
          teamName: team.name,
          goals: player.goals,
        };
      }
    }
  }

  // Next, parse goal scorers from matches
  const parseScorers = (str: string | undefined, teamId: string) => {
    if (!str) return;
    const team = teamsList.find(t => t.id === teamId);
    const teamName = team ? team.name : teamId;
    const parts = str.split(',').map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      // e.g. "Wahyu 23'" or "Rizky 12', 45'"
      const nameMatch = part.match(/^([A-Za-z\s]+)/);
      if (nameMatch) {
        const name = nameMatch[1].trim();
        if (name) {
          if (!scorerMap[name]) {
            scorerMap[name] = { playerName: name, teamId, teamName, goals: 0 };
          }
          scorerMap[name].goals += 1;
        }
      }
    }
  };

  for (const m of matchesList) {
    if (m.status === 'completed') {
      parseScorers(m.homeGoalScorers, m.homeTeamId);
      parseScorers(m.awayGoalScorers, m.awayTeamId);
    }
  }

  const list = Object.values(scorerMap)
    .filter(s => s.goals > 0)
    .sort((a, b) => b.goals - a.goals);

  if (list.length > 0) {
    return list.slice(0, 10).map((item, idx) => ({
      playerId: `scorer-${idx + 1}`,
      playerName: item.playerName,
      teamId: item.teamId,
      teamName: item.teamName,
      goals: item.goals,
    }));
  }

  // Fallback defaults
  return [
    { playerId: 'p10', playerName: 'Rizky Pratama', teamId: 'arema', teamName: 'Player 5', goals: 3 },
    { playerId: 'p14', playerName: 'Hendra Wijaya', teamId: 'psm', teamName: 'Player 9', goals: 2 },
    { playerId: 'p11', playerName: 'Irfan Maulana', teamId: 'persebaya', teamName: 'Player 6', goals: 2 },
    { playerId: 'p4', playerName: 'Wahyu Gunawan', teamId: 'persija', teamName: 'Player 1', goals: 1 },
    { playerId: 'p7', playerName: 'Fajri Santoso', teamId: 'persib', teamName: 'Player 2', goals: 1 },
    { playerId: 'p18', playerName: 'Made Suardana', teamId: 'bali', teamName: 'Player 13', goals: 1 },
  ];
}

/**
 * Save Teams to localStorage and notify app
 */
export function saveLeagueTeams(teams: Team[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_teams', JSON.stringify(teams));
  dispatchLeagueDataUpdate();
}

/**
 * Save Matches to localStorage and notify app
 */
export function saveLeagueMatches(matches: MatchWithExtras[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_matches', JSON.stringify(matches));
  // Keep admin_fixtures in sync
  const fixtures: Fixture[] = matches.map(m => ({
    id: m.id,
    homeTeamId: m.homeTeamId,
    awayTeamId: m.awayTeamId,
    date: m.date,
    time: m.time,
    venue: m.venue,
    group: m.group || 'A',
    matchDay: m.matchDay || 1,
    stage: m.stage,
  }));
  localStorage.setItem('admin_fixtures', JSON.stringify(fixtures));
  dispatchLeagueDataUpdate();
}

/**
 * Save Fixture to localStorage and notify app (syncs to both fixtures & matches)
 */
export function saveLeagueFixture(fixture: Fixture): void {
  if (typeof window === 'undefined') return;
  const currentMatches = getLeagueMatches();
  const existingIdx = currentMatches.findIndex(m => m.id === fixture.id);

  let updatedMatches: MatchWithExtras[];
  if (existingIdx >= 0) {
    const existing = currentMatches[existingIdx];
    updatedMatches = currentMatches.map((m, i) =>
      i === existingIdx
        ? {
            ...existing,
            homeTeamId: fixture.homeTeamId,
            awayTeamId: fixture.awayTeamId,
            date: fixture.date,
            time: fixture.time,
            venue: fixture.venue,
            group: fixture.group,
            matchDay: fixture.matchDay,
            stage: (fixture.stage as any) || 'group',
          }
        : m
    );
  } else {
    updatedMatches = [
      ...currentMatches,
      {
        id: fixture.id,
        homeTeamId: fixture.homeTeamId,
        awayTeamId: fixture.awayTeamId,
        homeScore: null,
        awayScore: null,
        date: fixture.date,
        time: fixture.time,
        venue: fixture.venue,
        group: fixture.group,
        matchDay: fixture.matchDay,
        stage: (fixture.stage as any) || 'group',
        status: 'upcoming',
      },
    ];
  }

  saveLeagueMatches(updatedMatches);
}

/**
 * Delete fixture/match
 */
export function deleteLeagueFixture(id: string): void {
  if (typeof window === 'undefined') return;
  const currentMatches = getLeagueMatches().filter(m => m.id !== id);
  saveLeagueMatches(currentMatches);
}

/**
 * Delete team
 */
export function deleteLeagueTeam(id: string): void {
  if (typeof window === 'undefined') return;
  const currentTeams = getLeagueTeams().filter(t => t.id !== id);
  saveLeagueTeams(currentTeams);
}

/**
 * Reset all league data back to default
 */
export function resetLeagueData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_teams');
  localStorage.removeItem('admin_matches');
  localStorage.removeItem('admin_fixtures');
  dispatchLeagueDataUpdate();
}

/**
 * Custom React Hook: gives reactive access to all league teams, matches, standings, and helpers
 */
export function useLeagueData() {
  const [teams, setTeams] = useState<Team[]>(() => getLeagueTeams());
  const [matches, setMatches] = useState<MatchWithExtras[]>(() => getLeagueMatches());
  const [config, setConfig] = useState<LeagueGroupConfig>(() => getLeagueGroupConfig());
  const [standings, setStandings] = useState<Record<string, Standing[]>>(() =>
    computeLeagueStandings(teams, matches, config)
  );
  const [topScorers, setTopScorers] = useState(() => computeLeagueTopScorers(matches, teams));
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    const currentTeams = getLeagueTeams();
    const currentMatches = getLeagueMatches();
    const currentConfig = getLeagueGroupConfig();
    const currentStandings = computeLeagueStandings(currentTeams, currentMatches, currentConfig);
    const currentScorers = computeLeagueTopScorers(currentMatches, currentTeams);

    setTeams(currentTeams);
    setMatches(currentMatches);
    setConfig(currentConfig);
    setStandings(currentStandings);
    setTopScorers(currentScorers);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refresh();

    const handleUpdate = () => refresh();
    window.addEventListener(LEAGUE_DATA_EVENT, handleUpdate);
    window.addEventListener(LEAGUE_CONFIG_EVENT, handleUpdate);

    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === 'admin_teams' ||
        e.key === 'admin_matches' ||
        e.key === 'admin_fixtures' ||
        e.key === 'admin_league_config'
      ) {
        refresh();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(LEAGUE_DATA_EVENT, handleUpdate);
      window.removeEventListener(LEAGUE_CONFIG_EVENT, handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refresh]);

  const getTeam = useCallback(
    (id: string) => {
      return teams.find(t => t.id === id) || fallbackGetTeamById(id);
    },
    [teams]
  );

  return {
    teams,
    matches,
    fixtures: getLeagueFixtures(),
    standings,
    topScorers,
    config,
    isLoaded,
    getTeamById: getTeam,
    saveTeams: saveLeagueTeams,
    saveMatches: saveLeagueMatches,
    saveFixture: saveLeagueFixture,
    deleteFixture: deleteLeagueFixture,
    deleteTeam: deleteLeagueTeam,
    resetData: resetLeagueData,
    refresh,
  };
}
