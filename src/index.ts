import {
  Client,
  Events,
  GatewayIntentBits,
  InteractionReplyOptions,
  MessageFlags,
} from "discord.js";
import config from "../config.json" with { type: "json" };
import { Command, discover_commands } from "./commands/command_util";

const command_error_message: InteractionReplyOptions = {
  content: "There was an error while executing this command :(",
  flags: MessageFlags.Ephemeral,
};

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = await discover_commands();
const commandsMap: Map<string, Command["execute"]> = new Map();
for (const command of commands) {
  commandsMap.set(command.data.name, command.execute);
}

client.on(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (!commandsMap.has(interaction.commandName)) {
    console.warn(`Unknown command: "${interaction.commandName}".`);
    return;
  }
  try {
    await commandsMap.get(interaction.commandName)!(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(command_error_message);
    } else {
      await interaction.reply(command_error_message);
    }
  }
});

client.login(config.token);
