import { createCanvas } from "@napi-rs/canvas";

export async function createWLRImage(wlr: number) {
  const width = 300;
  const height = 30;

  // % of wins
  const ratio = wlr === 0 ? 0 : 1 / wlr;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  const red_end = Math.floor(width - width * ratio);
  context.fillStyle = "#ff0000";
  context.fillRect(0, 0, red_end, height);
  context.fillStyle = "#00ff00";
  context.fillRect(red_end, 0, width - red_end, height);
  return await canvas.encode("png");
}
