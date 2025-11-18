import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { CommandHandler } from "../../structures/command";

const command: CommandHandler = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
  async execute(ctx) {
    ctx.reply({ content: "Pong!", flags: MessageFlags.Ephemeral });
  },
};

export default command;
