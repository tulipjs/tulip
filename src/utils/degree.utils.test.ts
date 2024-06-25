import { degreesToRadians, radiansToDegrees } from "./degree.utils";

describe("utils", () => {
  describe("degreesToRadians", () => {
    test("Convert degrees to radians", () => {
      expect(degreesToRadians(13)).toBe(0.22689280275926285);
      expect(degreesToRadians(180)).toBe(Math.PI);
      expect(degreesToRadians(278)).toBe(4.852015320544236);
    });

    test("Convert radians to degrees", () => {
      expect(radiansToDegrees(0.22)).toBe(12.605071492878112);
      expect(radiansToDegrees(Math.PI)).toBe(180);
      expect(radiansToDegrees(4.852015320544236)).toBe(278);
    });
  });
});
