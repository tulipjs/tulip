import { getRandomNumber } from "../random.utils";

describe("utils", () => {
  describe("getRandomNumber", () => {
    test("Return a random number between two numbers", () => {
      for (let i = 0; i < 50; i++) {
        const randomNumber = getRandomNumber(2, 13);
        expect(randomNumber).toBeLessThanOrEqual(13);
        expect(randomNumber).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
