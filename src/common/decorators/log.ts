import Logger from "../logger";
import type {
  AbstractConstructor,
  ClassAccessorDecorator,
  ClassDecorator,
  ClassFieldDecorator,
  ClassMethod,
  ClassMethodDecorator,
  Decorator,
} from "./shared";

namespace Log {
  export interface Options {
    /** Which level to emit log. */
    level?: keyof typeof Logger.Level;
    /** A representative of target. */
    label?: string;
    /** Customized message to be shown in log. */
    message?: string;
  }
}

/**
 * Factory form: returns a configured decorator.
 * @param options See {@link Log.Options | `Log.Options`}.
 */
function Log(options: Log.Options): any;

/** Logs class instantiation via `addInitializer`. `@Log class Foo {}`. */
function Log<Class extends AbstractConstructor>(
  target: Class,
  context: ClassDecoratorContext<Class>,
): ClassDecorator;

/** Wraps a method to log invocation and elapsed time. */
function Log<This, Args extends unknown[], Return>(
  target: ClassMethod<This, Args, Return>,
  context: ClassMethodDecoratorContext<This, ClassMethod<This, Args, Return>>,
): ClassMethodDecorator;

/** Logs the initial value assigned to a class field. */
function Log<This, Value>(
  target: undefined,
  context: ClassFieldDecoratorContext<This, Value>,
): ClassFieldDecorator;

/** Wraps an auto-accessor to log getter and setter access. */
function Log<This, Value>(
  target: ClassAccessorDecoratorTarget<This, Value>,
  context: ClassAccessorDecoratorContext<This, Value>,
): ClassAccessorDecorator;

function Log(targetOrOptions: any, context?: DecoratorContext): any {
  if (context === undefined) {
    const options = targetOrOptions as Log.Options;
    return (target: any, ctx: DecoratorContext) => apply(target, ctx, options);
  }
  return apply(targetOrOptions, context);
}

function apply(
  _target: any,
  context: DecoratorContext,
  options?: Log.Options,
): Decorator | void {
  const logger = Logger.get();
  const level = options?.level ?? "info";
  const name = String(context.name ?? "anonymous");
  const message = options?.message;

  const qualify = (self: unknown): string => {
    const cls = (self as object).constructor?.name;
    return cls ? `${cls}.${name}` : name;
  };

  switch (context.kind) {
    case "class":
      context.addInitializer(() => {
        logger[level](`new ${name}`);
        if (message) logger[level](message);
      });
      return;

    case "method":
      return function (target) {
        return function (this, ...args) {
          const name = options?.label ?? qualify(this);
          logger[level](`${name} called`);
          // check performance only at the "debug" level.
          const s = level === "debug" ? performance.now() : undefined;
          try {
            const result = target.apply(this, args);
            if (result instanceof Promise) {
              return result
                .then((value) => {
                  if (message) logger[level](message);
                  logger[level](`${name} ended ${elapsed(s)}`);
                  return value;
                })
                .catch((err) => {
                  logger.error(`${name} threw`, err);
                  throw err;
                }) as typeof result;
            }
            if (message) logger[level](message);
            logger[level](`${name} ended ${elapsed(s)}`);
            return result;
          } catch (err) {
            logger.error(`${name} threw`, err);
            throw err;
          }
        };
      } satisfies ClassMethodDecorator;

    case "field":
      return function () {
        return function (this, initialValue) {
          const name = qualify(this);
          logger[level](`${name} =`, initialValue);
          if (message) logger[level](message);
          return initialValue;
        };
      } satisfies ClassFieldDecorator;

    case "accessor":
      return function (target) {
        const { get, set } = target;
        return {
          get() {
            const value = get.call(this);
            logger[level](`get ${qualify(this)}`, value);
            if (message) logger[level](message);
            return value;
          },
          set(this, value): void {
            logger[level](`set ${qualify(this)}`, value);
            if (message) logger[level](message);
            set.call(this, value);
          },
        };
      } satisfies ClassAccessorDecorator;
  }
}

function elapsed(start?: number): string {
  if (!start) return "";
  const ms = performance.now() - start;
  const formatted =
    ms < 1000 ? `${ms.toFixed(1)}ms` : `${(ms / 1000).toFixed(2)}s`;
  return `(${formatted})`;
}

export default Log;
