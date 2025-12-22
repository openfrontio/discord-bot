import { format } from "node:util";
import {
  ClanLeaderboardData,
  ClanStats,
  PlayerPublic,
  PlayerPublicRaw,
  playerPublicRawToPlayerPublic,
  PublicFFALeaderboardEntry,
} from "./api_schemas";

const API_PUBLIC_FFA_LEADERBOARD_PATH =
  "https://api.openfront.io/leaderboard/public/ffa";
const API_CLAN_LEADERBOARD_PATH =
  "https://api.openfront.io/public/clans/leaderboard";
const API_CLAN_STATS_PATH = "https://api.openfront.io/public/clan/%s";
const API_PLAYER_PATH = "https://api.openfront.io/player/%s";
const API_CACHE_UPDATE_TIME = 1000 * 60 * 10; // 10 minutes

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

const clanStatsCache: Record<string, [number, ClanStats]> = {};

const playerStatsCache: Record<string, [number, PlayerPublic]> = {};

export async function getPublicFFALeaderboard(): Promise<
  typeof publicFFALeaderboardCache | undefined
> {
  if (
    publicFFALeaderboardCache.last_updated + API_CACHE_UPDATE_TIME >
      Date.now() &&
    publicFFALeaderboardCache.data !== undefined
  ) {
    return structuredClone(publicFFALeaderboardCache);
  }
  const res = await fetch(API_PUBLIC_FFA_LEADERBOARD_PATH);
  if (res.status !== 200) return undefined;
  const json = (await res.json()) as PublicFFALeaderboardEntry[];
  json.forEach((value) => {
    if (value.user === null) value.user = undefined;
  });
  publicFFALeaderboardCache.data = json;
  publicFFALeaderboardCache.last_updated = Date.now();
  return structuredClone(publicFFALeaderboardCache);
}

export async function getClanLeaderboard(): Promise<
  typeof clanLeaderboardCache | undefined
> {
  if (
    clanLeaderboardCache.last_updated + API_CACHE_UPDATE_TIME > Date.now() &&
    clanLeaderboardCache.data !== undefined
  ) {
    return structuredClone(clanLeaderboardCache);
  }
  const res = await fetch(API_CLAN_LEADERBOARD_PATH);
  if (res.status !== 200) return undefined;
  const json = (await res.json()) as ClanLeaderboardData;
  clanLeaderboardCache.data = json;
  clanLeaderboardCache.last_updated = Date.now();
  return structuredClone(clanLeaderboardCache);
}

export async function getClanStats(
  clanTag: string,
): Promise<{ stats: ClanStats; lastUpdated: number } | undefined> {
  if (
    clanStatsCache[clanTag] !== undefined &&
    clanStatsCache[clanTag][0] + API_CACHE_UPDATE_TIME > Date.now()
  ) {
    return structuredClone({
      stats: clanStatsCache[clanTag][1],
      lastUpdated: clanStatsCache[clanTag][0],
    });
  }
  const url = format(API_CLAN_STATS_PATH, clanTag);
  const res = await fetch(url);
  if (res.status !== 200) return undefined;
  const json = (await res.json()).clan as ClanStats;
  clanStatsCache[clanTag] = [Date.now(), json];
  return structuredClone({
    stats: json,
    lastUpdated: clanStatsCache[clanTag][0],
  });
}

export async function getPlayerPublic(
  publicId: string,
): Promise<{ player: PlayerPublic; lastUpdated: number } | undefined> {
  if (
    playerStatsCache[publicId] !== undefined &&
    playerStatsCache[publicId][0] + API_CACHE_UPDATE_TIME > Date.now()
  ) {
    return structuredClone({
      player: playerStatsCache[publicId][1],
      lastUpdated: playerStatsCache[publicId][0],
    });
  }
  const url = format(API_PLAYER_PATH, publicId);
  const res = await fetch(url);
  if (res.status !== 200) return undefined;
  const json = (await res.json()) as PlayerPublicRaw;
  const playerPublic = playerPublicRawToPlayerPublic(json);
  playerStatsCache[publicId] = [Date.now(), playerPublic];
  return structuredClone({
    player: playerPublic,
    lastUpdated: playerStatsCache[publicId][0],
  });
}
