import { captureConfig } from "./capture";
import { convertConfig } from "./convert";
import { language, query } from "./query";
import type { Descriptor } from "./types";

export const descriptor: Descriptor = {
  language,
  query,
  captureConfig,
  convertConfig,
  references(node) {
    return [];
  },
};

export default descriptor;
