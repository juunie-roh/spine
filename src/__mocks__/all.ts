/* eslint-disable unused-imports/no-unused-vars */

/* =========================
   Primitive Types
========================= */
let a: number = 1;
let b: string = "s";
let c: boolean = true;
let d: null = null;
let e: undefined = undefined;
let f: symbol = Symbol("f");
let g: bigint = 1n;

/* =========================
   Arrays & Tuples
========================= */
let h: number[] = [1, 2];
let i: Array<string> = ["a", "b"];
let j: [number, string?, boolean?] = [1, "x", true];

/* =========================
   Enums
========================= */
enum k {
  A,
  B = 5,
  C,
}
const l: k = k.C;

/* =========================
   Any / Unknown / Never / Void
========================= */
let m: any = 1;
let n: unknown = "x";
function o(): void {}
function p(): never {
  throw new Error("x");
}

/* =========================
   Type Aliases
========================= */
type q = number | string;
type r = { a: number; b?: string };
type s<T> = T[];

/* =========================
   Interfaces
========================= */
interface t {
  a: number;
  b?: string;
  c(): void;
}

/* =========================
   Intersection & Union
========================= */
type u = { a: number } & { b: string };
type v = number | string | boolean;

/* =========================
   Literal Types
========================= */
let w: "a" | "b" = "a";

/* =========================
   Functions
========================= */
function x(a: number, b = 1, ...c: number[]): number {
  return a + b + c.length;
}

const y = (a: number): number => a * 2;

/* =========================
   Generics
========================= */
function z<T>(a: T): T {
  return a;
}

interface A<T = number> {
  a: T;
}

type B<T extends number> = T;

/* =========================
   Classes
========================= */
class C {
  static a = 1;
  readonly b: number;
  private c: string;
  protected d: boolean;

  constructor(b: number, c: string, d: boolean) {
    this.b = b;
    this.c = c;
    this.d = d;
  }

  e(): string {
    return this.c;
  }
}

class D extends C implements A {
  a = 1;
}

/* =========================
   Abstract Class
========================= */
abstract class E {
  abstract a(): void;
}

/* =========================
   Accessors
========================= */
class F {
  private a = 0;
  get b() {
    return this.a;
  }
  set b(v: number) {
    this.a = v;
  }
}

/* =========================
   Index Signatures
========================= */
interface G {
  [a: string]: number;
}

/* =========================
   Readonly / Utility Types
========================= */
type H = Readonly<r>;
type I = Partial<r>;
type J = Required<r>;
type K = Pick<r, "a">;
type L = Omit<r, "b">;
type M = Record<string, number>;

/* =========================
   Conditional Types
========================= */
type N<T> = T extends string ? number : boolean;

/* =========================
   Infer
========================= */
type O<T> = T extends Array<infer U> ? U : never;

/* =========================
   Mapped Types
========================= */
type P<T> = {
  [K in keyof T]: T[K];
};

/* =========================
   Keyof / typeof
========================= */
const Q = { a: 1, b: "x" };
type R = keyof typeof Q;

/* =========================
   Assertions
========================= */
let S = "x" as string;
let T = <number>(<unknown>"1");

/* =========================
   Non-null Assertion
========================= */
let U!: number;
U = 1;

/* =========================
   Optional Chaining & Nullish Coalescing
========================= */
let V: r | null = null;
// @ts-expect-error
let W = V?.a ?? 0;

/* =========================
   Discriminated Union
========================= */
type X = { a: "x"; b: number } | { a: "y"; c: string };

/* =========================
   Type Guards
========================= */
function Y(a: v): a is number {
  return typeof a === "number";
}

/* =========================
   Namespace
========================= */
namespace Z {
  export const a = 1;
}

/* =========================
   Modules / Imports / Exports
========================= */
export { a, b, x };
export default C;
