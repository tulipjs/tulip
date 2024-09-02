import { ContainerMutable, SpriteMutable } from "../../../types";
import { sprite } from "../sprite.component";
import { expect } from "@jest/globals";
import { container } from "../container.component";
import { Cursor, EventMode } from "../../../enums";
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
        }),
      },
    },
  };
});

describe("components", () => {
  describe("core", () => {
    describe("sprite", () => {
      let $container: ContainerMutable;
      let $sprite: SpriteMutable;
      describe("texture with sprite sheet", () => {
        test("Check if spriteSheet texture is being load", () => {
          $container = container();
          $sprite = sprite({
            label: "sprite-label",
            spriteSheet: "spriteSheet.json",
            texture: "texture-name",
          });
          $container.add($sprite);
        });
      });
      describe("single texture", () => {
        test("Check if texture is being load", () => {
          $container = container();
          $sprite = sprite({
            label: "sprite-label",
            texture: "texture.png",
          });
          $container.add($sprite);
        });
        test("getId() check that empty is being called", () => {
          expect($sprite.getId()).toMatch(/sprite-label@@([0-9]{0,5})/);
        });
        test("getLabel() check that initDisplayObjectMutable is being called", () => {
          expect($sprite.getLabel()).toMatch("sprite-label");
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
            hitArea: [],
            withContext: false,
            cursor: Cursor.AUTO,
            sortableChildren: false,
            tint: 0xffffff,
            metadata: undefined,
            spriteSheet: undefined,

            scale: { x: 1, y: 1 },
          });
        });
        test("getProps(...) To return the original properties", () => {
          expect($sprite.getProps()).toEqual({
            label: "sprite-label",
            texture: "texture.png",
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
