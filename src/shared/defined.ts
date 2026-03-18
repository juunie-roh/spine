import { SymbexError } from "./error";

function defined(value: boolean, error?: SymbexError): asserts value;
function defined<T>(
  value: T | null | undefined,
  error?: SymbexError,
): asserts value is T;
function defined(value: any, error?: SymbexError) {
  if (value === false || value === null || typeof value === "undefined") {
    throw error ?? new Error("Unspecified undefined error");
  }
}

export { defined };
