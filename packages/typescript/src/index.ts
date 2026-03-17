import { captureConfig } from "./capture";
import { convertConfig } from "./convert";
import { language, query } from "./query";
import type { PluginDescriptor } from "./types";

export const descriptor = {
  language,
  query,
  captureConfig,
  convertConfig,
} satisfies PluginDescriptor;

export default descriptor;
