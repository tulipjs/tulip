import { TextSpriteMutable } from "../../../types";
import { textSprite } from "../text-sprite.component";
import * as PIXI from "pixi.js";

const mockEmptyTexture = PIXI.Texture.EMPTY;

jest.mock("../../../global/global.ts", () => {
  const { global: originalGlobal } = jest.requireActual(
    "../../../global/global.ts",
  );

  return {
    global: {
      ...originalGlobal,
      getApplication: jest.fn(() => ({
        ...originalGlobal.getApplication(),
        getScaleMode: jest.fn().mockReturnValue("nearest"),
      })),
      textures: {
        get: (args) => mockEmptyTexture,
      },
      spriteSheets: {
        get: () => ({
          textureSource: mockEmptyTexture,
          textures: {
            a: mockEmptyTexture,
            b: mockEmptyTexture,
            c: mockEmptyTexture,
          },
          animations: {},
        }),
      },
    },
  };
});

describe("components", () => {
  describe("core", () => {
    describe("text-sprite", () => {
      beforeEach(() => {});

      let $textSprite: TextSpriteMutable;

      beforeAll(() => {
        $textSprite = textSprite({
          text: "abc",
          color: 0xff00ff,
          spriteSheet: "font.json",
          alpha: 0.3,
          label: "something",
        });
      });

      test("getProps() returns initial custom and core props", () => {
        expect($textSprite.getProps()).toEqual({
          color: 0xff00ff,
          spriteSheet: "font.json",
          text: "abc",
          alpha: 0.3,
          label: "something",
        });
      });

      test("setColor() sets color to displayObject", () => {
        expect($textSprite.getColor()).toEqual(0xff00ff);
        expect(
          $textSprite.getDisplayObject({ __preventWarning: true }).children[1]
            .tint,
        ).toEqual(0xff00ff);

        $textSprite.setColor(0x00ff00);
        expect($textSprite.getColor()).toEqual(0x00ff00);
        expect(
          $textSprite.getDisplayObject({ __preventWarning: true }).children[1]
            .tint,
        ).toEqual(0x00ff00);
      });

      test("setBackgroundColor() sets color to displayObject", () => {
        expect($textSprite.getBackgroundColor()).toEqual(0xffffff);
        expect(
          $textSprite.getDisplayObject({ __preventWarning: true }).children[0]
            .tint,
        ).toEqual(0xffffff);

        $textSprite.setBackgroundColor(0x00ff00);
        expect($textSprite.getBackgroundColor()).toEqual(0x00ff00);
        expect(
          $textSprite.getDisplayObject({ __preventWarning: true }).children[0]
            .tint,
        ).toEqual(0x00ff00);
      });

      test("setBackgroundAlpha() sets alpha to displayObject", () => {
        expect($textSprite.getBackgroundAlpha()).toEqual(0);
        expect(
          $textSprite.getDisplayObject({ __preventWarning: true }).children[0]
            .alpha,
        ).toEqual(0);

        $textSprite.setBackgroundAlpha(0.5);
        expect($textSprite.getBackgroundAlpha()).toEqual(0.5);
        expect(
          $textSprite.getDisplayObject({ __preventWarning: true }).children[0]
            .alpha,
        ).toEqual(0.5);
      });

      test("setBackgroundPadding() sets padding", () => {
        expect($textSprite.getBackgroundPadding()).toEqual({
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        });

        $textSprite.setBackgroundPadding({
          bottom: 1,
          left: 2,
          right: 3,
          top: 4,
        });
        expect($textSprite.getBackgroundPadding()).toEqual({
          bottom: 1,
          left: 2,
          right: 3,
          top: 4,
        });
      });

      test("to contain same children length on text", () => {
        expect(
          $textSprite.getDisplayObject({ __preventWarning: true }).children[1]
            .children.length,
        ).toEqual(3);

        $textSprite.setText("123 aabcfgbh");
        expect(
          $textSprite.getDisplayObject({ __preventWarning: true }).children[1]
            .children.length,
        ).toEqual(5);

        $textSprite.setText("abcabc");
        expect(
          $textSprite.getDisplayObject({ __preventWarning: true }).children[1]
            .children.length,
        ).toEqual(6);
      });

      test("default white background color and black case", () => {
        $textSprite = textSprite({
          text: "abc",
          color: 0xff00ff,
          spriteSheet: "font.json",
          alpha: 0.3,
          label: "something",
        });

        expect($textSprite.getBackgroundColor()).toEqual(0xffffff);

        $textSprite = textSprite({
          text: "abc",
          color: 0xff00ff,
          spriteSheet: "font.json",
          alpha: 0.3,
          label: "something",
          backgroundColor: 0x000000,
        });

        expect($textSprite.getBackgroundColor()).toEqual(0x000000);
      });
    });
  });
});
