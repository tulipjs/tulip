import { getValueMutableFunction } from "./mutables.utils";

describe("utils", () => {
  describe("getValueMutableFunction", () => {
    test("Return text without changes", async () => {
      expect(await getValueMutableFunction("Hello there")).toBe("Hello there");
    });
    test("Return number without changes", async () => {
      expect(await getValueMutableFunction(132)).toBe(132);
    });
    test("Return object without changes", async () => {
      expect(await getValueMutableFunction({ abc: 123 })).toStrictEqual({
        abc: 123,
      });
    });
    //
    test("Return text with function changes", async () => {
      expect(
        await getValueMutableFunction((value) => value + "!", "Hello there"),
      ).toBe("Hello there!");
    });
    test("Return number with function changes", async () => {
      expect(await getValueMutableFunction((value) => value + 1, 122)).toBe(
        123,
      );
    });
    test("Return object with function changes", async () => {
      expect(
        await getValueMutableFunction((value) => ({ ...value, abc: 999 }), {
          abc: 123,
          hello: "there",
        }),
      ).toStrictEqual({ abc: 999, hello: "there" });
    });
  });
});
