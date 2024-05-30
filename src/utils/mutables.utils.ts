import { MutableFunction } from "types";

export const getValueMutableFunction = async <Type>(
  data: MutableFunction<Type>,
  currentValue: Type,
) => {
  return typeof data === "function"
    // @ts-ignore
    ? await data(currentValue)
    : data;
};
