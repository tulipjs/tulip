export type MutableFunction<Type> =
  | Type
  | ((data: Type) => Type | Promise<Type>);
