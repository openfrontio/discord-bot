import {
  CacheType,
  Events,
  Interaction,
  InteractionReplyOptions,
  InteractionUpdateOptions,
  MessageFlags,
} from "discord.js";
import { commandsMap } from "../index";
import { getPublicFFALeaderboardMessage } from "../messages/public_ffa_leaderboard";
import { EventHandler } from "../structures/event";

const command_error_message: InteractionReplyOptions = {
  content: "There was an error while executing this command :(",
  flags: MessageFlags.Ephemeral,
};

const event: EventHandler = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction<CacheType>) {
    if (interaction.isCommand()) {
      try {
        const command = commandsMap.get(interaction.commandName);
        if (command === undefined) {
          console.warn(`Unknown command: "${interaction.commandName}".`);
          return;
        }
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(command_error_message);
        } else {
          await interaction.reply(command_error_message);
        }
      }
    } else if (interaction.isButton()) {
      if (interaction.customId.startsWith("lb-view-page-")) {
        const pageNumber = parseInt(
          interaction.customId.substring("lb-view-page-".length),
        );
        const message = await getPublicFFALeaderboardMessage(pageNumber);
        if (message === undefined) return;
        interaction.update(message as InteractionUpdateOptions);
      }
    }
  },
};

export default event;
