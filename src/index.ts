import { Client, GatewayIntentBits } from "discord.js";
import config from "../config.json" with { type: "json" };
import { CommandHandler } from "./structures/command";
import { EventHandler } from "./structures/event";
import { discover_commands, discover_events } from "./util/file_discovery";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

export const commandsMap: Map<string, CommandHandler> = new Map();
export const eventsMap: Map<EventHandler["name"], EventHandler> = new Map();

async function load_stuff() {
  const commands = await discover_commands();
  const events = await discover_events();
  for (const command of commands) {
    commandsMap.set(command.data.name, command);
  }
  for (const event of events) {
    eventsMap.set(event.name, event);
  }
}

function register_events() {
  eventsMap.forEach((handler, name) => {
    const once: boolean =
      handler.options === undefined ? false : (handler.options.once ?? false);
    if (once) client.once(name, handler.execute);
    else client.on(name, handler.execute);
  });
}

async function main() {
  await load_stuff();
  register_events();
  client.login(config.token);
}

main().catch(console.error);
