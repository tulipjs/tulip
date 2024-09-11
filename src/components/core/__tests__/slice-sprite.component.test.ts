import { ContainerMutable, NineSliceSpriteMutable } from "../../../types";
import { expect } from "@jest/globals";
import * as PIXI from "pixi.js";
import { container } from "../container.component";
import { Cursor, EventMode } from "../../../enums";
import { nineSliceSprite } from "../nine-slice-sprite.component";

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
    describe("nine-slice-sprite", () => {
      let $stage = container();
      let $container: ContainerMutable;
      let $sprite: NineSliceSpriteMutable;
      describe("single texture", () => {
        test("Check if texture is being load", () => {
          $container = container();
          $stage.add($container);
          $sprite = nineSliceSprite({
            label: "nine-slice-sprite-label",
            texture: "picture.png",
            leftWidth: 4,
            topHeight: 4,
            rightWidth: 4,
            bottomHeight: 4,
            width: 20,
            height: 10,
          });
          $container.add($sprite);
        });
        test("getId() check that empty is being called", () => {
          expect($sprite.getId()).toMatch(
            /nine-slice-sprite-label@@([0-9]{0,5})/,
          );
        });
        test("getLabel() check that initDisplayObjectMutable is being called", () => {
          expect($sprite.getLabel()).toMatch("nine-slice-sprite-label");
        });
        test("$getRaw(...) To return the basic properties", () => {
          expect($sprite.$getRaw()).toStrictEqual({
            alpha: 1,
            angle: 0,
            eventMode: EventMode.PASSIVE,
            id: $sprite.getId(),
            initialData: {},
            label: "nine-slice-sprite-label",
            pivot: { x: 0, y: 0 },
            position: { x: 0, y: 0 },
            texture: "picture.png",
            visible: true,
            zIndex: 0,
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
            spriteSheet: undefined,
            metadata: undefined,
            tooltip: undefined,

            scale: { x: 1, y: 1 },
          });
        });
        test("getProps(...) To return the original properties", () => {
          expect($sprite.getProps()).toEqual({
            label: "nine-slice-sprite-label",
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
