import dedent from "dedent";
import { EmbedBuilder } from "discord.js";
import { MessageType } from "../structures/message";
import { getClanStats } from "../util/api_util";

export async function getClanStatsMessage(
  clanTag: string,
): Promise<MessageType | undefined> {
  const clanStats = await getClanStats(clanTag);
  if (clanStats === undefined) {
    return undefined;
  }
  const desc = dedent`
    **Games played**: \`${clanStats.stats.games}\`
    **Total sessions**: \`${clanStats.stats.playerSessions}\`
    **Wins**: \`${clanStats.stats.wins}\` (**Weighted**: \`${clanStats.stats.weightedWins}\`)
    **Losses**: \`${clanStats.stats.losses}\` (**Weighted**: \`${clanStats.stats.weightedLosses}\`)
    **Weighted win-loss-ratio**: \`${clanStats.stats.weightedWLRatio}\`
    `;
  const embed = new EmbedBuilder()
    .setTitle(`[${clanStats.stats.clanTag}] Statistics`)
    .setDescription(desc)
    .setFooter({ text: "OpenFront" })
    .setTimestamp(clanStats.lastUpdated)
    .setColor("#ffffff");
  return {
    embeds: [embed],
  };
}

/*
clanTag: string;
games: number;
playerSessions: number;
wins: number;
losses: number;
weightedWins: number;
weightedLosses: number;
weightedWLRatio: number;
teamTypeWL: Record<string, {
    wl: [number, number];
    weightedWL: [number, number];
}>;
teamCountWL: Record<number, {
    wl: [number, number];
    weightedWL: [number, number];
}>;
*/
