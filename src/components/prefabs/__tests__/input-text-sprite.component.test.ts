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
            "texture-name": mockEmptyTexture,
          },
          animations: {
            "animation-name": [mockEmptyTexture],
          },
        }),
      },
    },
  };
});

describe("components", () => {
  describe("core", () => {
    describe("input-text-sprite", () => {
      beforeEach(() => {});

      // let $input: InputTextSpriteMutable;
      beforeAll(async () => {
        // $input = await inputTextSprite({
        //   color: 0xff00ff,
        //   spriteSheet: "font.json",
        //   editable: true,
        // });
      });

      test.todo("getProps() returns initial custom and core props");
      test.todo("should handle key down and key up events");
      test.todo("should handle cursor visibility correctly");
    });
  });
});
