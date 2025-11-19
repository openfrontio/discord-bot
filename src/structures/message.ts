import {
  InteractionEditReplyOptions,
  InteractionReplyOptions,
  InteractionUpdateOptions,
  MessageEditOptions,
  MessagePayload,
} from "discord.js";

export type MessageType =
  | MessagePayload
  | InteractionReplyOptions
  | MessageEditOptions
  | string
  | InteractionEditReplyOptions
  | InteractionUpdateOptions;
