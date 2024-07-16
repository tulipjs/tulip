import { ContainerMutable, SliceSpriteMutable } from "../../../types";
import { expect } from "@jest/globals";
import * as PIXI from "pixi.js";
import { container } from "../container.component";
import { Cursor, EventMode } from "../../../enums";
import { sliceSprite } from "../slice-sprite.component";

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

const mockSpriteAssetsLoad = jest.fn(async (args) => new PIXI.Texture());
const mockSpriteSheetAssetsLoad = jest.fn(async (args) => ({
  id: args,
  textures: {
    "texture-name": PIXI.Texture.WHITE,
    "texture-name-2": PIXI.Texture.EMPTY,
  },
  textureSource: jest.fn(() => ({
    //TODO Test this with #151
    scaleMode: jest.fn(),
  })),
}));
const mockConsoleError = jest.fn();

console.error = mockConsoleError;

describe("components", () => {
  describe("core", () => {
    describe("slice-sprite", () => {
      let $container: ContainerMutable;
      let $sprite: SliceSpriteMutable;
      describe("single texture", () => {
        beforeEach(() => {
          mockSpriteAssetsLoad.mockClear();
        });

        test("Check if texture is being load", async () => {
          $container = await container();
          $sprite = await sliceSprite({
            label: "slice-sprite-label",
            texture: "picture.png",
            leftWidth: 4,
            topHeight: 4,
            rightWidth: 4,
            bottomHeight: 4,
            width: 20,
            height: 10,
          });
          $container.add($sprite);
          expect(mockSpriteAssetsLoad).toHaveBeenCalled();
        });
        test("getId() check that empty is being called", () => {
          expect($sprite.getId()).toMatch(/slice-sprite-label_([0-9]{0,5})/);
        });
        test("getLabel() check that initDisplayObjectMutable is being called", () => {
          expect($sprite.getLabel()).toMatch("slice-sprite-label");
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
            label: "slice-sprite-label",
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
            leftWidth: 4,
            topHeight: 4,
            rightWidth: 4,
            bottomHeight: 4,
            width: 20,
            height: 10,
          });
        });
        test("getProps(...) To return the original properties", () => {
          expect($sprite.getProps()).toEqual({
            label: "slice-sprite-label",
            texture: "picture.png",
            leftWidth: 4,
            topHeight: 4,
            rightWidth: 4,
            bottomHeight: 4,
            width: 20,
            height: 10,
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
