import { SpineError } from "./error";

function defined(value: boolean, error?: SpineError): asserts value;
function defined<T>(
  value: T | null | undefined,
  error?: SpineError,
): asserts value is T;
function defined(value: any, error?: SpineError) {
  if (value === false || value === null || typeof value === "undefined") {
    throw error ?? new Error("Unspecified undefined error");
  }
}

export { defined };
