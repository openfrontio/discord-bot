import { time, TimestampStylesString } from "discord.js";

export function dateToDiscordTimestamp(
  date: Date,
  style: TimestampStylesString,
): string {
  return time(date, style);
}
