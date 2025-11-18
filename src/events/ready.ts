import { Client, Events } from "discord.js";
import { EventHandler } from "../structures/event";

const event: EventHandler = {
  name: Events.ClientReady,
  options: {
    once: true,
  },
  async execute(client: Client<true>) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};

export default event;
