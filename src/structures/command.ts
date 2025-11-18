import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export interface CommandHandler {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  options?: {};
  execute(interaction: CommandInteraction): Promise<void>;
}
