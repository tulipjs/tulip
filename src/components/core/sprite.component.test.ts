import { ContainerMutable, SpriteMutable } from "../../types";
import { sprite } from "./sprite.component";
import { expect } from "@jest/globals";
import * as PIXI from "pixi.js";
import { container } from "./container.component";

jest.mock("pixi.js", () => {
  const originalModule = jest.requireActual("pixi.js");

  //Mock the default export and named export 'foo'
  return {
    ...originalModule,
    Assets: {
      load: (args) => mockAssetsLoad(args),
    },
  };
});

const mockAssetsLoad = jest.fn(async (args) => new PIXI.Texture());

describe("components", () => {
  describe("core", () => {
    describe("sprite", () => {
      let $container: ContainerMutable;
      let $sprite: SpriteMutable;

      beforeEach(() => {
        mockAssetsLoad.mockClear();
      });

      test("Check if texture is being load", async () => {
        $container = await container();
        $sprite = await sprite({
          label: "sprite-label",
          texture: "picture.png",
        });
        $container.add($sprite);
        expect(mockAssetsLoad).toHaveBeenCalled();
      });
      test("getId() check that empty is being called", () => {
        expect($sprite.getId()).toMatch(/sprite-label_([0-9]{0,5})/);
      });
      test("getLabel() check that initDisplayObjectMutable is being called", () => {
        expect($sprite.getLabel()).toMatch("sprite-label");
      });
      test("setTexture(...) Check if texture is being load again", () => {
        $sprite.setTexture("texture.png");
        expect(mockAssetsLoad).toHaveBeenCalled();
      });
      test("$getRaw(...) To return the basic properties", () => {
        expect($sprite.$getRaw()).toStrictEqual({
          alpha: 1,
          angle: 0,
          eventMode: undefined,
          id: $sprite.getId(),
          initialData: {},
          label: "sprite-label",
          pivot: { x: 0, y: 0 },
          position: { x: 0, y: 0 },
          texture: "texture.png",
          visible: true,
          zIndex: 0,
        });
      });
      test("getProps(...) To return the original properties", () => {
        expect($sprite.getProps()).toEqual({
          label: "sprite-label",
          texture: "picture.png",
        });
      });
      test("$destroy() destroys everything", () => {
        expect($sprite.getDisplayObject().parent).not.toBe(null);
        expect($sprite.getFather()).toBe($container);
        $sprite.$destroy();
        expect($sprite.getDisplayObject().destroyed).toBe(true);
        expect($sprite.getDisplayObject().parent).toBe(null);
        expect($sprite.getFather).toBe(null);
      });
    });
  });
});
