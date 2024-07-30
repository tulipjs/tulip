import { ContainerMutable, SpriteMutable } from "../../../types";
import { sprite } from "../sprite.component";
import { expect } from "@jest/globals";
import * as PIXI from "pixi.js";
import { container } from "../container.component";
import { Cursor, EventMode } from "../../../enums";

jest.mock("pixi.js", () => {
  const originalModule = jest.requireActual("pixi.js");

  //Mock the default export and named export 'foo'
  return {
    ...originalModule,
    Assets: {
      load: (args) =>
        args.includes(".json")
          ? mockSpriteSheetAssetsLoad(args)
          : mockSpriteAssetsLoad(args),
    },
  };
});

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
    },
  };
});

const mockSpriteAssetsLoad = jest.fn((args) => new PIXI.Texture());
const mockSpriteSheetAssetsLoad = jest.fn((args) => ({
  id: args,
  textures: {
    "texture-name": PIXI.Texture.WHITE,
    "texture-name-2": PIXI.Texture.EMPTY,
  },
  textureSource: jest.fn(() => ({
    scaleMode: jest.fn(),
  })),
}));
const mockConsoleError = jest.fn();

console.error = mockConsoleError;

describe("components", () => {
  describe("core", () => {
    describe("sprite", () => {
      let $container: ContainerMutable;
      let $sprite: SpriteMutable;
      describe("texture with sprite sheet", () => {
        beforeEach(() => {
          mockSpriteSheetAssetsLoad.mockClear();
          mockConsoleError.mockClear();
        });

        //TODO with new LOAD event
        test.skip("Check if spriteSheet texture is being load with an error", () => {
          $container = container();
          $sprite = sprite({
            label: "sprite-label",
            spriteSheet: "spriteSheet.json",
            texture: "picture.png",
          });
          $container.add($sprite);
          expect(mockSpriteSheetAssetsLoad).toHaveBeenCalled();

          expect(mockConsoleError).toHaveBeenCalled();
        });

        test("Check if spriteSheet texture is being load", () => {
          $container = container();
          $sprite = sprite({
            label: "sprite-label",
            spriteSheet: "spriteSheet.json",
            texture: "texture-name",
          });
          $container.add($sprite);
          expect(mockSpriteSheetAssetsLoad).toHaveBeenCalled();

          expect(mockConsoleError).not.toHaveBeenCalled();
        });
      });
      describe("single texture", () => {
        beforeEach(() => {
          mockSpriteAssetsLoad.mockClear();
        });

        test("Check if texture is being load", () => {
          $container = container();
          $sprite = sprite({
            label: "sprite-label",
            texture: "picture.png",
          });
          $container.add($sprite);
          expect(mockSpriteAssetsLoad).toHaveBeenCalled();
        });
        test("getId() check that empty is being called", () => {
          expect($sprite.getId()).toMatch(/sprite-label_([0-9]{0,5})/);
        });
        test("getLabel() check that initDisplayObjectMutable is being called", () => {
          expect($sprite.getLabel()).toMatch("sprite-label");
        });
        test("setTexture(...) Check if texture is being load again", () => {
          $sprite.setTexture("texture.png");
          expect(mockSpriteAssetsLoad).toHaveBeenCalled();
        });
        test("$getRaw(...) To return the basic properties", () => {
          expect($sprite.$getRaw()).toStrictEqual({
            alpha: 1,
            angle: 0,
            eventMode: EventMode.PASSIVE,
            id: $sprite.getId(),
            initialData: {},
            label: "sprite-label",
            pivot: { x: 0, y: 0 },
            position: { x: 0, y: 0 },
            texture: "texture.png",
            visible: true,
            zIndex: 0,
            focused: true,
            hitArea: [],
            withContext: false,
            cursor: Cursor.AUTO,
            sortableChildren: false,
            tint: 0xffffff,
          });
        });
        test("getProps(...) To return the original properties", () => {
          expect($sprite.getProps()).toEqual({
            label: "sprite-label",
            texture: "picture.png",
          });
        });
        test("$destroy() destroys everything", () => {
          expect(
            $sprite.getDisplayObject({ __preventWarning: true }).parent,
          ).not.toBe(null);
          expect($sprite.getFather()).toBe($container);
          $sprite.$destroy();
          expect(
            $sprite.getDisplayObject({ __preventWarning: true }).destroyed,
          ).toBe(true);
          expect(
            $sprite.getDisplayObject({ __preventWarning: true }).parent,
          ).toBe(null);
          expect($sprite.getFather()).toBe(null);
        });
      });
    });
  });
});
