export type Assert<T extends true> = T
export type AssertFalse<T extends false> = T
export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false

export type IsAny<T> = 0 extends 1 & T ? true : false
export type IsUnknown<T> = IsAny<T> extends true ? false : unknown extends T ? true : false
export type IsNever<T> = [T] extends [never] ? true : false

export type Expect<T extends true> = T
export type ExpectFalse<T extends false> = T

export type NotEqual<X, Y> = Equals<X, Y> extends true ? false : true

export type IsExact<T, U> = Equals<T, U>
export type IsSubset<T, U> = T extends U ? true : false

export type HasProperty<T, K extends string> = K extends keyof T ? true : false

export type IsOptional<T, K extends keyof T> = {} extends Pick<T, K> ? true : false
export type IsRequired<T, K extends keyof T> = IsOptional<T, K> extends true ? false : true

export type IsReadonly<T, K extends keyof T> = Equals<
  { [P in K]: T[P] },
  { -readonly [P in K]: T[P] }
> extends true
  ? false
  : true

export type IsMutable<T, K extends keyof T> = IsReadonly<T, K> extends true ? false : true

export type IsNullable<T> = null extends T ? true : false
export type IsUndefinable<T> = undefined extends T ? true : false

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]

export type FunctionKeys<T> = KeysOfType<T, (...args: any[]) => any>
export type NonFunctionKeys<T> = Exclude<keyof T, FunctionKeys<T>>

export type PromiseType<T> = T extends Promise<infer U> ? U : never
export type ArrayElement<T> = T extends (infer U)[] ? U : never

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type DeepRequired<T> = T extends object
  ? {
      [P in keyof T]-?: DeepRequired<T[P]>
    }
  : T

export type DeepReadonly<T> = T extends object
  ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>
    }
  : T

export function expectType<T>(value: T): T {
  return value
}

export function expectNotType<T>(_value: any): void {}

export function expectError<T>(_value: T): void {}

export function expectAssignable<T>(_value: T): void {}

export function expectNotAssignable<T, U>(_value: T extends U ? never : T): void {}
