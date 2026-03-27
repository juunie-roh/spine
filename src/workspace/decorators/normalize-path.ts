import path from "node:path";
import { cwd } from "node:process";

import WorkspaceError from "../error";

/**
 * Normalizes the **first** argument of the decorated method to a path relative
 * to `this.rootDir`. Both absolute and relative paths are resolved against the
 * anchor before being made relative, so behavior is consistent across platforms.
 *
 * **NOTE**: The decorated class must expose a `rootDir` property.
 *
 * @throws If the resolved path escapes the root directory.
 */
function NormalizePath<
  This extends { rootDir: string },
  Args extends [string, ...unknown[]],
  Return,
>(
  target: (this: This, ...args: Args) => Return,
): (this: This, ...args: Args) => Return {
  return function (this: This, ...args: Args): Return {
    const anchor = path.resolve(cwd(), this.rootDir);
    const [first, ...rest] = args;
    const relative = path.relative(anchor, path.resolve(anchor, first));

    if (relative.startsWith("..")) {
      throw new WorkspaceError(
        "WORKSPACE_INVALID_ACCESS",
        `Access outside root is not allowed: "${first}"`,
      );
    }

    const normalized: Args = [relative, ...rest] as Args;
    return target.apply(this, normalized);
  };
}

export default NormalizePath;
