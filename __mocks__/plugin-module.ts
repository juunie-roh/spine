import type TSParser from "tree-sitter";
import { vi } from "vitest";

import type { PluginDescriptor } from "@/models";

const mockPlugin = vi.mockObject({
  language: vi.mockObject({} as TSParser.Language),
} as unknown as PluginDescriptor);

const mockPlugin_no_language = vi.mockObject({});
