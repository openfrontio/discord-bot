import dedent from "dedent";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { MessageType } from "../structures/message";
import { getPublicFFALeaderboard } from "../util/api_util";

const LEADERBOARD_PAGE_ENTRIES = 5;
const LEADERBOARD_MAX_ENTRY = 39;
const LEADERBOARD_MAX_PAGE =
  (LEADERBOARD_MAX_ENTRY + 1) / LEADERBOARD_PAGE_ENTRIES - 1;

export async function getPublicFFALeaderboardMessage(
  page: number,
): Promise<MessageType | undefined> {
  const pageData = await getPublicFFALeaderboard();
  if (
    pageData === undefined ||
    pageData.data === undefined ||
    pageData.last_updated === undefined
  )
    return undefined;
  const original_page_len = pageData.data.length;
  pageData.data = pageData.data.filter(
    (_value, index) =>
      index >= page * LEADERBOARD_PAGE_ENTRIES &&
      index < page * LEADERBOARD_PAGE_ENTRIES + LEADERBOARD_PAGE_ENTRIES,
  );
  let str = "";
  pageData.data.forEach((entry) => {
    const user_str =
      entry.user === undefined
        ? undefined
        : `**Discord**: <@${entry.user.id}> (\`@${entry.user.username}\`)\n`;
    str +=
      dedent`
      **PublicId**: \`${entry.public_id}\`
      **Win-Loss-Ratio**: \`${entry.wlr}\`
      **Wins**: \`${entry.wins}\`
      **Losses**: \`${entry.losses}\`
      **Total games played**: \`${entry.total}\`\n
      ` +
      (user_str ?? "*(No Discord account associated)*\n") +
      "\n";
  });
  const backButton = new ButtonBuilder()
    .setEmoji("⬅️")
    .setStyle(ButtonStyle.Primary);
  if (page === 0) {
    backButton.setDisabled(true);
    backButton.setCustomId("lb-view-page-0");
  } else {
    backButton.setCustomId("lb-view-page-" + (page - 1));
  }
  const nextButton = new ButtonBuilder()
    .setEmoji("➡️")
    .setStyle(ButtonStyle.Primary);
  if (page === LEADERBOARD_MAX_PAGE) {
    nextButton.setDisabled(true);
    nextButton.setCustomId("lb-view-page-" + page);
  } else {
    nextButton.setCustomId("lb-view-page-" + (page + 1));
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
        .setTitle("Public FFA Leaderboard")
        .setDescription(str)
        .setFooter({ text: "OpenFront" })
        .setTimestamp(pageData.last_updated)
        .setColor("#ffffff"),
    ],
    components: [
      new ActionRowBuilder()
        .addComponents(backButton, pageButton, nextButton)
        .toJSON(),
    ],
  };
}
