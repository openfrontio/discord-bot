import { Interaction, SlashCommandBuilder } from "discord.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: Interaction) => Promise<void>;
}

/**
 * Loads all commands and returns them
 */
export async function discover_commands(): Promise<Command[]> {
  const commands: Command[] = [];
  const commandsRootDir = import.meta.dirname;
  const commandDirs = readdirSync(commandsRootDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  for (const commandDir of commandDirs) {
    const commandFiles = readdirSync(join(commandsRootDir, commandDir), {
      withFileTypes: true,
    })
      .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".js"))
      .map((dirent) => dirent.name);
    for (const commandFile of commandFiles) {
      const command: Command = (
        await import(join(commandsRootDir, commandDir, commandFile))
      ).default;
      if (!("data" in command && "execute" in command)) continue;
      commands.push(command);
    }
  }
  return commands;
}
