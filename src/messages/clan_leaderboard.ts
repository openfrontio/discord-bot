import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  TimestampStyles,
} from "discord.js";
import { MessageType } from "../structures/message";
import { getClanLeaderboard } from "../util/api_util";
import { dateToDiscordTimestamp } from "../util/date_format";

const LEADERBOARD_PAGE_ENTRIES = 5;

export async function getClanLeaderboardMessage(
  page: number,
): Promise<MessageType | undefined> {
  const pageData = await getClanLeaderboard();
  if (pageData === undefined) return undefined;
  const original_page_len = pageData.clans.length;
  pageData.clans = pageData.clans.filter(
    (_value, index) =>
      index >= page * LEADERBOARD_PAGE_ENTRIES &&
      index < page * LEADERBOARD_PAGE_ENTRIES + LEADERBOARD_PAGE_ENTRIES,
  );
  const start_date = new Date(pageData.start);
  const end_date = new Date(pageData.end);
  let str = `Data from ${dateToDiscordTimestamp(
    start_date,
    TimestampStyles.FullDateShortTime,
  )} to ${dateToDiscordTimestamp(
    end_date,
    TimestampStyles.FullDateShortTime,
  )}\n`;
  pageData.clans.forEach((entry) => {
    str += `
                    **Tag**: \`[${entry.clanTag}]\`
                    **Wins**: \`${entry.wins}\` (**Weighted**: \`${entry.weightedWins}\`)
                    **Losses**: \`${entry.losses}\` (**Weighted**: \`${entry.weightedLosses}\`)
                    **Total games played**: \`${entry.games}\`
                    **Total sessions**: \`${entry.playerSessions}\`
                    **Weighted win-loss-ratio**: \`${entry.weightedWLRatio}\`
                    `;
  });
  const backButton = new ButtonBuilder()
    .setEmoji("⬅️")
    .setStyle(ButtonStyle.Primary);
  if (page === 0) {
    backButton.setDisabled(true);
    backButton.setCustomId("clan-lb-view-page-0");
  } else {
    backButton.setCustomId("clan-lb-view-page-" + (page - 1));
  }
  const nextButton = new ButtonBuilder()
    .setEmoji("➡️")
    .setStyle(ButtonStyle.Primary);
  if ((page + 1) * LEADERBOARD_PAGE_ENTRIES >= original_page_len) {
    nextButton.setDisabled(true);
    nextButton.setCustomId("clan-lb-view-page-" + page);
  } else {
    nextButton.setCustomId("clan-lb-view-page-" + (page + 1));
  }

  const pageButton = new ButtonBuilder()
    .setLabel(
      `${page + 1} / ${Math.ceil(original_page_len / LEADERBOARD_PAGE_ENTRIES)}`,
    )
    .setStyle(ButtonStyle.Secondary)
    .setCustomId("x")
    .setDisabled(true);

  return {
    embeds: [
      new EmbedBuilder()
        .setTitle("Clan Leaderboard")
        .setDescription(str)
        .setFooter({ text: "OpenFront" })
        .setTimestamp()
        .setColor("#ffffff"),
    ],
    components: [
      new ActionRowBuilder()
        .addComponents(backButton, pageButton, nextButton)
        .toJSON(),
    ],
  };
}
