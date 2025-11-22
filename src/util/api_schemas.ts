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
