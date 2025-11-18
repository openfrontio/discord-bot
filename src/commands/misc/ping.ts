import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
  async execute(interaction: ChatInputCommandInteraction) {
    interaction.reply({ content: "Pong!", flags: MessageFlags.Ephemeral });
  },
};
