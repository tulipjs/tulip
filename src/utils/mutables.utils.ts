import { MutableFunction } from "../types";

export const getValueMutableFunction = <Type>(
  data: MutableFunction<Type>,
  currentValue?: Type,
): Promise<Type> | Type => {
  return typeof data === "function"
    ? // @ts-ignore
      data(currentValue)
    : data;
};
