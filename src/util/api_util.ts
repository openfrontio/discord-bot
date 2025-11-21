const API_PUBLIC_FFA_LEADERBOARD_PATH =
  "https://api.openfront.io/leaderboard/public/ffa";
const API_CLAN_LEADERBOARD_PATH =
  "https://api.openfront.io/public/clans/leaderboard";
const API_PUBLIC_FFA_LEADERBOARD_CACHE_UPDATE_TIME = 1000 * 60 * 10; // 10 minutes
const API_CLAN_LEADERBOARD_CACHE_UPDATE_TIME = 1000 * 60 * 10;

const publicFFALeaderboardCache: {
  data: undefined | PublicFFALeaderboardEntry[];
  last_updated: number;
} = {
  data: undefined,
  last_updated: 0,
};

const clanLeaderboardCache: {
  data: undefined | ClanLeaderboardData;
  last_updated: number;
} = {
  data: undefined,
  last_updated: 0,
};

export interface PublicFFALeaderboardEntry {
  wlr: number;
  wins: number;
  losses: number;
  total: number;
  public_id: string;
  user?: {
    id: string;
    username: string;
    discriminator: string;
    global_name: string;
    avatar: string;
  };
}

export interface ClanLeaderboardData {
  start: string;
  end: string;
  clans: {
    clanTag: string;
    games: number;
    wins: number;
    losses: number;
    playerSessions: number;
    weightedWins: number;
    weightedLosses: number;
    weightedWLRatio: number;
  }[];
}

export async function getPublicFFALeaderboard(): Promise<
  PublicFFALeaderboardEntry[] | undefined
> {
  if (
    publicFFALeaderboardCache.last_updated +
      API_PUBLIC_FFA_LEADERBOARD_CACHE_UPDATE_TIME >
      Date.now() &&
    publicFFALeaderboardCache.data !== undefined
  ) {
    return structuredClone(publicFFALeaderboardCache.data);
  }
  const res = await fetch(API_PUBLIC_FFA_LEADERBOARD_PATH);
  if (res.status !== 200) return undefined;
  const json = (await res.json()) as PublicFFALeaderboardEntry[];
  json.forEach((value) => {
    if (value.user === null) value.user = undefined;
  });
  publicFFALeaderboardCache.data = json;
  publicFFALeaderboardCache.last_updated = Date.now();
  return structuredClone(json);
}

export async function getClanLeaderboard(): Promise<
  ClanLeaderboardData | undefined
> {
  if (
    clanLeaderboardCache.last_updated + API_CLAN_LEADERBOARD_CACHE_UPDATE_TIME >
      Date.now() &&
    clanLeaderboardCache.data !== undefined
  ) {
    return structuredClone(clanLeaderboardCache.data);
  }
  const res = await fetch(API_CLAN_LEADERBOARD_PATH);
  if (res.status !== 200) return undefined;
  const json = (await res.json()) as ClanLeaderboardData;
  clanLeaderboardCache.data = json;
  clanLeaderboardCache.last_updated = Date.now();
  return structuredClone(json);
}
