import { readdirSync } from "node:fs";
import { join } from "node:path";
import { CommandHandler } from "../structures/command";
import { EventHandler } from "../structures/event";

/**
 * Loads all commands and returns them
 */
export async function discover_commands(): Promise<CommandHandler[]> {
  const commands: CommandHandler[] = [];
  const commandsRootDir = join(import.meta.dirname, "..", "commands");
  const commandDirs = readdirSync(commandsRootDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  for (const commandDir of commandDirs) {
    const commandFiles = readdirSync(join(commandsRootDir, commandDir), {
      withFileTypes: true,
    })
      .filter(
        (dirent) =>
          dirent.isFile() &&
          (dirent.name.endsWith(".js") || dirent.name.endsWith(".ts")),
      )
      .map((dirent) => dirent.name);
    for (const commandFile of commandFiles) {
      const filePath = join(commandsRootDir, commandDir, commandFile);
      const importedFile = await import(filePath);
      if (importedFile === undefined) {
        console.warn(`Failed to import ${filePath}`);
        continue;
      }
      const command: CommandHandler = importedFile.default;
      if (command === undefined) {
        console.warn(`${filePath} does not have the default export`);
        continue;
      }
      commands.push(command);
    }
  }
  return commands;
}

export async function discover_events(): Promise<EventHandler[]> {
  const events: EventHandler[] = [];
  const eventsRootDir = join(import.meta.dirname, "..", "events");
  const eventFiles = readdirSync(eventsRootDir, {
    withFileTypes: true,
  })
    .filter(
      (dirent) =>
        dirent.isFile() &&
        (dirent.name.endsWith(".js") || dirent.name.endsWith(".ts")),
    )
    .map((dirent) => dirent.name);
  for (const eventFile of eventFiles) {
    const filePath = join(eventsRootDir, eventFile);
    const importedFile = await import(filePath);
    if (importedFile === undefined) {
      console.warn(`Failed to import ${filePath}`);
      continue;
    }
    const event: EventHandler = importedFile.default;
    if (event === undefined) {
      console.warn(`${filePath} does not have the default export`);
      continue;
    }
    events.push(event);
  }

  return events;
}
