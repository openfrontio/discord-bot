import { REST, Routes } from "discord.js";
import config from "../../config.json" with { type: "json" };
import { discover_commands } from "../util/file_discovery";

async function deploy_commands() {
  const commands = (await discover_commands()).map((command) =>
    command.data.toJSON(),
  );

  const rest = new REST().setToken(config.token);

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );
    const data: unknown[] = (await rest.put(
      Routes.applicationCommands(config.client_id),
      { body: commands },
    )) as unknown[];
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    console.error(error);
  }
}

await deploy_commands();
