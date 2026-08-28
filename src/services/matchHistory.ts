export type Team = "us" | "them";

export type MatchEvent = {
  at: string;
  team: Team;
  action: string;
  points: number;
};

export type MatchRecord = {
  id: string;
  startedAt: string;
  endedAt: string | null;
  events: MatchEvent[];
  name?: string;
  teamNames?: Partial<Record<Team, string>>;
  favorite?: boolean;
};

const STORAGE_KEY = "tenteador/match-history";
const MAX_MATCHES = 50;
export const MAX_NAME_LENGTH = 20;
export const MAX_TEAM_NAME_LENGTH = 12;

export const DEFAULT_TEAM_LABELS: Record<Team, string> = {
  us: "Nós",
  them: "Eles",
};

const nowIso = () => {
  const shifted = new Date(Date.now() - 3 * 60 * 60 * 1000);
  return `${shifted.toISOString().slice(0, 23)}-03:00`;
};

export function createMatch(): MatchRecord {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    startedAt: nowIso(),
    endedAt: null,
    events: [],
  };
}

export function appendEvent(
  match: MatchRecord,
  team: Team,
  action: string,
  points: number,
): MatchRecord {
  return {
    ...match,
    events: [...match.events, { at: nowIso(), team, action, points }],
  };
}

export function finalizeMatch(match: MatchRecord): MatchRecord {
  if (match.endedAt) {
    return match;
  }
  return { ...match, endedAt: nowIso() };
}

export function renameMatch(match: MatchRecord, name: string): MatchRecord {
  const trimmed = name.trim();
  return { ...match, name: trimmed.length > 0 ? trimmed.slice(0, MAX_NAME_LENGTH) : undefined };
}

export function renameTeam(match: MatchRecord, team: Team, name: string): MatchRecord {
  const trimmed = name.trim();
  return {
    ...match,
    teamNames: {
      ...match.teamNames,
      [team]: trimmed.length > 0 ? trimmed.slice(0, MAX_TEAM_NAME_LENGTH) : undefined,
    },
  };
}

export function teamLabel(match: MatchRecord, team: Team): string {
  return match.teamNames?.[team] ?? DEFAULT_TEAM_LABELS[team];
}

export function toggleFavorite(match: MatchRecord): MatchRecord {
  return { ...match, favorite: !match.favorite };
}

export function clampScore(score: number): number {
  return Math.min(24, Math.max(0, score));
}

export function matchScore(match: MatchRecord): { us: number; them: number } {
  let us = 0;
  let them = 0;
  for (const event of match.events) {
    if (event.team === "us") {
      us = clampScore(us + event.points);
    } else {
      them = clampScore(them + event.points);
    }
  }
  return { us, them };
}

export function startNewMatch(previous: MatchRecord): MatchRecord {
  previous = finalizeMatch(previous);
  persistMatch(previous);
  return createMatch();
}

export function getMatchHistory(): MatchRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MatchRecord[]) : [];
  } catch {
    return [];
  }
}

export function persistMatch(match: MatchRecord): void {
  try {
    const history = getMatchHistory();
    const index = history.findIndex((item) => item.id === match.id);
    if (index >= 0) {
      history[index] = match;
    } else {
      history.push(match);
    }
    const trimmed = history.slice(-MAX_MATCHES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore persistence failures
  }
}
