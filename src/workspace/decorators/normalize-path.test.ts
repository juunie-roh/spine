import path from "node:path";
import { cwd } from "node:process";

import { describe, expect, it } from "vitest";

import WorkspaceError from "../error";
import NormalizePath from "./normalize-path";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeHost(rootDir: string) {
  class Host {
    rootDir = rootDir;
    @NormalizePath
    receive(filePath: string): string {
      return filePath;
    }
  }
  return new Host();
}

const ROOT = "src/__mocks__";
const anchor = path.resolve(cwd(), ROOT);

// ---------------------------------------------------------------------------
// NormalizePath
// ---------------------------------------------------------------------------

describe("NormalizePath", () => {
  describe("relative paths", () => {
    it("passes a plain relative path through unchanged", () => {
      const host = makeHost(ROOT);
      expect(host.receive("foo.ts")).toBe("foo.ts");
    });

    it("strips a leading ./", () => {
      const host = makeHost(ROOT);
      expect(host.receive("./foo.ts")).toBe("foo.ts");
    });

    it("preserves nested relative paths", () => {
      const host = makeHost(ROOT);
      expect(host.receive("a/b/c.ts")).toBe("a/b/c.ts");
    });
  });

  describe("absolute paths", () => {
    it("converts an absolute path inside rootDir to a relative one", () => {
      const host = makeHost(ROOT);
      const abs = path.join(anchor, "foo.ts");
      expect(host.receive(abs)).toBe("foo.ts");
    });

    it("converts a nested absolute path to a relative one", () => {
      const host = makeHost(ROOT);
      const abs = path.join(anchor, "a", "b.ts");
      expect(host.receive(abs)).toBe(path.join("a", "b.ts"));
    });
  });

  describe("escape detection", () => {
    it("throws WORKSPACE_INVALID_ACCESS for a relative path that escapes", () => {
      const host = makeHost(ROOT);
      try {
        host.receive("../../secret.ts");
        expect.unreachable("should have thrown");
      } catch (e) {
        expect(e).toBeInstanceOf(WorkspaceError);
        expect((e as WorkspaceError).code).toBe("WORKSPACE_INVALID_ACCESS");
      }
    });

    it("throws WORKSPACE_INVALID_ACCESS for an absolute path outside rootDir", () => {
      const host = makeHost(ROOT);
      const outside = path.resolve("/tmp/secret.ts");
      expect(() => host.receive(outside)).toThrow(WorkspaceError);
    });
  });

  describe("extra arguments", () => {
    it("forwards additional arguments unchanged", () => {
      class Host {
        rootDir = ROOT;
        @NormalizePath
        receive(filePath: string, encoding: string): string {
          return `${filePath}:${encoding}`;
        }
      }
      const host = new Host();
      expect(host.receive("./foo.ts", "utf-8")).toBe("foo.ts:utf-8");
    });
  });
});
