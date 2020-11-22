export type nothing = null | undefined
export type PromiseType<T> = T extends PromiseLike<infer U> ? U : T
