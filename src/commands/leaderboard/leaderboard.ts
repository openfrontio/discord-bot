import {
  InteractionReplyOptions,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { getPublicFFALeaderboardMessage } from "../../messages/public_ffa_leaderboard";
import { CommandHandler } from "../../structures/command";

const command: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Top players/clans!")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Which leaderboard to show")
        .setChoices(
          { name: "Players", value: "players" },
          {
            name: "Clans",
            value: "clans",
          },
        )
        .setRequired(true),
    ),
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) {
      throw new Error("Interaction is not ChatInputCommand");
    }
    const type = interaction.options.getString("type", true);
    if (type === "players") {
      const message = await getPublicFFALeaderboardMessage(0);
      if (message === undefined) {
        interaction.reply({
          content: "Failed to fetch leaderboard",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
      interaction.reply(message as InteractionReplyOptions);
    } else if (type === "clans") {
      interaction.reply({ content: "soon", flags: MessageFlags.Ephemeral });
    } else {
      interaction.reply({
        content: `Unknown "type": "${type}"`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};

export default command;
