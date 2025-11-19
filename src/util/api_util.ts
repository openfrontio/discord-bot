const API_PUBLIC_FFA_LEADERBOARD_PATH =
  "https://api.openfront.io/leaderboard/public/ffa";
const API_PUBLIC_FFA_LEADERBOARD_CACHE_UPDATE_TIME = 1000 * 60 * 10; // 10 minutes

const publicFFALeaderboardCache: {
  data: undefined | PublicFFALeaderboardEntry[];
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

export async function getPublicFFALeaderboard(): Promise<
  PublicFFALeaderboardEntry[] | undefined
> {
  if (
    publicFFALeaderboardCache.last_updated +
      API_PUBLIC_FFA_LEADERBOARD_CACHE_UPDATE_TIME >
    Date.now()
  )
    return publicFFALeaderboardCache.data;
  const res = await fetch(API_PUBLIC_FFA_LEADERBOARD_PATH);
  if (res.status !== 200) return undefined;
  const json = (await res.json()) as PublicFFALeaderboardEntry[];
  json.forEach((value) => {
    if (value.user === null) value.user = undefined;
  });
  publicFFALeaderboardCache.data = json;
  publicFFALeaderboardCache.last_updated = Date.now();
  return json;
}
