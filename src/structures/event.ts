import { ClientEvents } from "discord.js";

export interface EventHandler<
  E extends keyof ClientEvents = keyof ClientEvents,
> {
  name: E;
  options?: {
    once?: boolean;
  };
  execute(...args: ClientEvents[E]): Promise<void>;
}
