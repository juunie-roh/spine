import { SymbexError, SymbexErrorCode } from "@/shared/error";

type BinaryErrorCode = Extract<SymbexErrorCode, `BIN_${string}`>;

class BinaryError extends SymbexError {
  constructor(code: BinaryErrorCode, message: string, options?: ErrorOptions) {
    super(code, message, options);
  }
}

export default BinaryError;
