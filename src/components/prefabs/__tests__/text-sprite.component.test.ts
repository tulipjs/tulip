import { TextSpriteMutable } from "../../../types";
import { textSprite } from "../text-sprite.component";

jest.mock("pixi.js", () => {
  const originalModule = jest.requireActual("pixi.js");

  return {
    ...originalModule,
    Assets: {
      load: (args) => mockAssetsLoad(args),
    },
  };
});

const mockAssetsLoad = jest.fn(async (args) => ({
  id: args,
  textures: {
    a: {},
    b: {},
    c: {},
  },
}));

describe("components", () => {
  describe("core", () => {
    describe("text-sprite", () => {
      beforeEach(() => {
        mockAssetsLoad.mockClear();
      });

      let $textSprite: TextSpriteMutable;
      beforeAll(async () => {
        $textSprite = await textSprite({
          text: "abc",
          color: 0xff00ff,
          spriteSheet: "font.json",
          alpha: 0.3,
          label: "something",
        });
      });

      test("getProps() returns initial custom and core props", async () => {
        expect($textSprite.getProps()).toEqual({
          color: 0xff00ff,
          spriteSheet: "font.json",
          text: "abc",
          alpha: 0.3,
          label: "something",
        });
      });

      test("setColor() sets color to displayObject", async () => {
        expect($textSprite.getColor()).toEqual(0xff00ff);
        expect(
          $textSprite.getDisplayObject({ __preventWarning: true }).tint,
        ).toEqual(0xff00ff);

        $textSprite.setColor(0x00ff00);
        expect($textSprite.getColor()).toEqual(0x00ff00);
        expect(
          $textSprite.getDisplayObject({ __preventWarning: true }).tint,
        ).toEqual(0x00ff00);
      });

      test("to contain same children length on text", async () => {
        expect(
          $textSprite.getDisplayObject({ __preventWarning: true }).children
            .length,
        ).toEqual(3);

        $textSprite.setText("123 fgbh");
        expect(
          $textSprite.getDisplayObject({ __preventWarning: true }).children
            .length,
        ).toEqual(8);
      });
    });
  });
});
