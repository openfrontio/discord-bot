import dedent from "dedent";
import { EmbedBuilder, TimestampStyles } from "discord.js";
import { format } from "node:util";
import { MessageType } from "../structures/message";
import { GameDifficulty, GameMode } from "../util/api_schemas";
import { getPlayerPublic } from "../util/api_util";
import { dateToDiscordTimestamp } from "../util/date_format";

const RECENT_GAMES_LEN = 5;

const GAME_REPLAY_URL = "https://openfront.io/#join=%s";

export async function getPlayerPublicMessage(
  publicId: string,
): Promise<MessageType | undefined> {
  const playerPublic = await getPlayerPublic(publicId);
  if (playerPublic === undefined) return undefined;
  const recent_games = playerPublic.games
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .filter((_value, index) => index < RECENT_GAMES_LEN);
  let recent_games_str = "";
  recent_games.forEach((game) => {
    recent_games_str += dedent`
        \n**${game.gameId}** ${dateToDiscordTimestamp(
          game.start,
          TimestampStyles.RelativeTime,
        )}
            ${game.mode} - ${game.difficulty} - ${game.map} - ${game.type}
            [Watch replay](${format(GAME_REPLAY_URL, game.gameId)})
        `;
  });
  let statistics_str = "";
  if (playerPublic.stats.Public !== undefined) {
    const publicStats = playerPublic.stats.Public;
    for (const gameModeKey in publicStats) {
      if (publicStats[gameModeKey] !== undefined) {
        const stat = publicStats[gameModeKey as GameMode];
        const summary: {
          wins: number;
          losses: number;
          total: number;
        } = {
          wins: 0,
          losses: 0,
          total: 0,
        };
        for (const key in stat) {
          const entry = stat[key as GameDifficulty];
          if (entry === undefined) continue;
          summary.wins += entry.wins ?? 0;
          summary.losses += entry.losses ?? 0;
          summary.total += entry.total ?? 0;
        }
        statistics_str += dedent`
                \n**${gameModeKey} (summary)**
                __Wins__: \`${summary.wins}\`
                __Losses__: \`${summary.losses}\`
                __Total__: \`${summary.total}\`
            `;
      }
    }
  } else {
    statistics_str = "*(No data to show)*";
  }
  const str = dedent`
        **PublicID**: ||\`${publicId}\`||
        **Created**: ${
          playerPublic.createdAt === undefined
            ? "*(No data)*"
            : dateToDiscordTimestamp(
                playerPublic.createdAt,
                TimestampStyles.RelativeTime,
              )
        }
    
        **__Recent Games__**
        ${recent_games_str}

        **__Statistics__**
        ${statistics_str}
    `;

  return {
    embeds: [
      new EmbedBuilder()
        .setTitle(`Player summary`)
        .setDescription(str)
        .setTimestamp()
        .setColor("#ffffff")
        .setFooter({ text: "OpenFront" }),
    ],
  };
}
